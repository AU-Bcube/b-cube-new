# b-cube.kr

b-cube.kr은 아주대학교 경영대학 경영인텔리전스학과 소학회 B-CUBE에서 관리하는 오픈소스 소학회 홍보 플랫폼입니다.

b-cube.kr is an open-source club promotion platform managed by B-CUBE, a club within the Department of MIS at Ajou University's College of Business.

<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/assets/badges/netlify-badge-dark.svg" alt="Deploys by Netlify" />
</a>

## 로컬에서 실행하기

### 요구 사항

- Node.js 20 이상
- [pnpm](https://pnpm.io)

### 실행 순서

1. 저장소를 클론하고 의존성을 설치합니다.

   ```bash
   git clone https://github.com/AU-Bcube/b-cube-new.git
   cd b-cube-new
   pnpm install
   ```

2. 프로젝트 루트에 `.env.local` 파일을 만들고 환경 변수를 설정합니다.

3. 개발 서버를 실행합니다.

   ```bash
   pnpm dev
   ```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000)에 접속합니다.

### 기타 명령어

| 명령어 | 설명 |
| --- | --- |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 (빌드 후) |
| `pnpm lint` | ESLint 실행 |

## CODE OF CONDUCT

[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)<br>
All members of B-CUBE must comply with the following *CODE OF CONDUCT*.

## LICENSE

[LICENSE.md](LICENSE.md)<br>
Repositories managed by the [B-CUBE](https://www.b-cube.kr) and under [AU-Bcube](https://github.com/AU-Bcube) organization are under the MIT License.
