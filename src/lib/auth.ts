import { createRemoteJWKSet, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE = "CF_Authorization";

// jose가 키를 캐시하고, 토큰의 kid를 찾지 못하면 JWKS를 다시 가져온다(키 교체 대응).
let jwks: { issuer: string; getKey: ReturnType<typeof createRemoteJWKSet> } | null = null;

function getJwks(issuer: string) {
  if (jwks?.issuer !== issuer) {
    jwks = {
      issuer,
      getKey: createRemoteJWKSet(new URL("/cdn-cgi/access/certs", issuer)),
    };
  }
  return jwks.getKey;
}

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const issuer = process.env.CF_ACCESS_ISSUER;
  const audience = process.env.CF_ACCESS_AUD;
  if (!issuer || !audience) {
    console.error("CF_ACCESS_ISSUER 또는 CF_ACCESS_AUD가 설정되지 않아 요청을 차단합니다.");
    return false;
  }

  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, getJwks(issuer), {
      algorithms: ["RS256"],
      issuer,
      audience,
      // jose는 exp가 없는 토큰도 통과시키므로 필수로 지정한다. nbf는 있으면 검증된다.
      requiredClaims: ["exp"],
    });
    return true;
  } catch (err) {
    console.warn("Cloudflare Access 토큰 검증 실패:", err instanceof Error ? err.name : "unknown");
    return false;
  }
}

export async function requireAuth(req: NextRequest): Promise<NextResponse | null> {
  if (await isAuthenticated(req)) return null;
  return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
}
