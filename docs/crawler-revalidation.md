# 크롤러의 프로젝트 페이지 재검증

크롤러가 MongoDB 저장을 완료한 뒤 `POST /api/revalidate`를 호출하면 `/projects`가 재검증 대상으로 표시됩니다. 다음 페이지 방문 시 최신 데이터로 갱신됩니다. API는 요청 본문이나 경로를 받지 않습니다.

1. `openssl rand -hex 32`로 토큰을 생성합니다. 토큰은 저장소에 커밋하거나 로그에 출력하지 않습니다.
2. Netlify의 프로젝트 환경변수에 `REVALIDATE_SECRET`을 설정합니다. Functions 런타임에서 접근할 수 있는 범위와 해당 배포 컨텍스트를 선택하고 다시 배포합니다. 로컬 개발 시에는 `.env.local`에 설정합니다.
3. 크롤러 저장소의 GitHub Actions secret에도 같은 토큰을 `REVALIDATE_SECRET`으로 저장합니다. 토큰 교체 시 양쪽 값을 함께 갱신합니다.
4. 크롤링 및 DB 저장이 성공한 후 다음 요청을 실행합니다. GitHub Actions 단계에서 `REVALIDATE_SECRET` 환경변수에 `${{ secrets.REVALIDATE_SECRET }}`을 전달하고 URL은 배포 환경에 맞게 변경합니다.

   ```bash
   curl --fail-with-body --silent --show-error -X POST \
     -H "Authorization: Bearer $REVALIDATE_SECRET" \
     https://www.b-cube.kr/api/revalidate
   ```

성공 시 `200`과 `{"revalidated":true,"path":"/projects"}`를 반환합니다. 인증 실패는 `401`, 서버에 토큰이 설정되지 않은 경우 `503`을 반환합니다. 재검증은 요청 시 즉시 렌더링하는 것이 아니라 다음 방문 시 수행됩니다.
