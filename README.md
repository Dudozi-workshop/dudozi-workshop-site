# 두도지공방 홈페이지

홈페이지: https://dudozi-workshop-site.pages.dev/

저장소: `Dudozi-workshop/dudozi-workshop-site`

## 배포 구성

Cloudflare Pages의 Direct Upload 프로젝트에 GitHub Actions로 배포합니다. Cloudflare 대시보드의 GitHub 연결은 필요하지 않습니다.

| 설정 | 값 |
|---|---|
| Pages 프로젝트 | dudozi-workshop-site |
| 프로덕션 브랜치 | main |
| 빌드 명령 | npm run build |
| 빌드 출력 | dist |
| 워크플로 | .github/workflows/deploy.yml |

GitHub 저장소 Settings > Secrets and variables > Actions에 `CLOUDFLARE_ACCOUNT_ID`와 `CLOUDFLARE_API_TOKEN`을 등록합니다. 토큰은 해당 계정의 Cloudflare Pages Edit 권한을 사용합니다. 비밀값을 코드나 문서에 기록하지 않습니다.

## 수정 및 반영

ChatGPT의 GitHub 연결을 통해 최신 소스를 읽고 수정합니다. 변경 후 `npm run build`로 검증합니다. `main`의 public, scripts, package.json 또는 배포 워크플로 변경 시 자동 배포하며, Actions에서 수동 실행할 수도 있습니다.

워크플로는 빌드, 인증값 확인, 프로덕션 브랜치 설정, 배포를 수행합니다. 공개된 `deployment.json`의 커밋과 홈페이지 응답을 검증한 뒤 완료합니다. 배포 성공과 실제 주소의 반영을 확인한 후에만 반영 완료로 보고합니다.

GitHub 연결만으로 Cloudflare 계정 설정과 도메인을 직접 관리할 수 있는 것은 아닙니다.

## 현재 기능

- 공방 소개, MY LOCK·DZlog 소개, 모바일 화면 대응.
- 문의와 다운로드는 준비 중입니다. 접수 폼, 이메일 발송, 관리대장, 개인정보 처리 안내는 아직 연결되지 않았습니다.
- 외부 폰트·추적 코드·외부 이미지·유료 서비스 없이 정적 페이지로 구성했습니다.

## 다음 연결

공식 다운로드 주소와 접수처를 확인한 후 연결합니다. 문의 데이터는 Git에 기록하지 않습니다. 자동 접수·알림 기능은 별도 구현·검증 후 활성화합니다.

## PC 디자인 로컬 프리뷰 (배포 없이 확인)

현재 작업 브랜치(`feat/homepage-visual-r3-hifi`)의 ZIP을 GitHub에서 내려받아 압축을 푼 후 사용합니다. Node.js LTS가 필요합니다.

- **Windows:** `OPEN-PC-PREVIEW.bat`를 더블 클릭하면 정적 검증 및 빌드 후 `http://127.0.0.1:4173/`을 엽니다.
- **macOS/Linux:** `npm run build` 다음 `npm run preview:local`을 실행하고 위 주소를 엽니다.
- 확인 권장 너비: 홈 1440/1280/1100px, 상세 `apps/dzlog/`, `apps/grigle/`, `apps/mylock/`는 1440px.
- 로컬 서버는 `127.0.0.1`에만 바인딩되며 `main`이나 실제 웹사이트에 배포하지 않습니다. 종료하려면 터미널 창에서 `Ctrl+C`를 누릅니다.
- 개발자도구(F12)의 콘솔과 네트워크 탭에서 오류 및 외부 이미지 로딩을 함께 확인하세요.



## AI 디자인·개발 업무 프로세스

두도지공방 홈페이지는 **ChatGPT(기획·검수) → Stitch(A/B 시안) → 디자인 승인 → Antigravity(코드 반영) → 자동 QA → 요청 시 Vercel Preview → 별도 운영 승인** 순서로 관리합니다.

- [업무 자동화 운영 기준](docs/AI_WEBSITE_PIPELINE.md)
- [그리글 카드 Stitch 시범 디자인 지시서](docs/GRIGLE_STITCH_PILOT.md)
- [Antigravity/코드 에이전트 공통 규칙](AGENTS.md)
- GitHub Issues에서 `홈페이지 UI 개선 작업` 템플릿을 선택해 작업을 등록합니다.
- Pull Request는 [PR 검수 양식](.github/pull_request_template.md)으로 코드·시각 QA·사용자 승인 상태를 기록합니다.

현재 GitHub 기반 운영 문서/양식/검수는 준비되었지만 **Stitch 및 Antigravity 앱 자체와 MCP 인증은 별도 연결 단계**입니다. 동의 없는 자동 운영 배포는 하지 않습니다.
