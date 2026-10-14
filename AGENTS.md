# 두도지공방 홈페이지 작업 기준

- 베이지·그린·브라운의 밝은 공방 톤과 동글하고 간결한 디자인을 유지합니다.
- 색·모서리·공통 서식은 CSS 테마 변수와 공통 클래스로 관리합니다.
- 공식 주소, 출시 여부, 운영 상태를 추측하지 않습니다.
- 접수 기능이 연결되지 않았다면 완료 안내나 실제 제출 버튼을 노출하지 않습니다.
- 문의·이메일·첨부파일 등 사용자 데이터와 비밀값은 Git에 저장하지 않습니다.
- 변경 전 원격 최신 소스를 읽고, 변경 후 npm run build를 실행합니다.
- Cloudflare 배포가 성공했음을 확인한 뒤 실제 사이트 반영 완료로 보고합니다.


## AI 협업 및 웹디자인 자동화 — 2026-10-15

- 상세 절차는 `docs/AI_WEBSITE_PIPELINE.md`, 첫 디자인 실험은 `docs/GRIGLE_STITCH_PILOT.md`를 따른다.
- 작업은 `GitHub Issue 접수 → Stitch A/B 시안 → 사용자 디자인 승인 → 단일 에이전트 구현 → QA → 요청 시 비운영 Preview → 별도 운영 승인` 순서로 처리한다.
- **Stitch 단계에서는 코드 수정 금지.** 사용자 승인 전에는 Antigravity나 다른 에이전트가 승인되지 않은 시안을 구현하거나 배포하지 않는다.
- 같은 파일을 Antigravity·ChatGPT 등 여러 에이전트가 동시에 수정하지 않는다. 최신 원격 HEAD를 확인하고 단일 작성자를 정한다.
- 운영 `main`·Cloudflare Pages·도메인·결제·외부 비밀값은 명시적 사용자 승인 없이 변경하지 않는다. PR을 만들거나 Preview가 READY여도 운영 배포 승인은 아니다.
- 현재 승인된 **PC Hero v4**는 기존 `docs/HERO_VISUAL_R45_PLAN.md`의 3축 폰 구상보다 우선한다. 카드군 548×400px, DZlog 260×400px, 그리글/MY LOCK 276×194px, 간격 12px, 하단 74px, 슬로건 38px, Hero 높이 646~780px 규격을 임의로 바꾸지 않는다.
- 공식 이미지 및 `public/assets/ddz-hero-v4-approved.webp`, `public/assets/mylock-candy-soft-trio.webp`를 임의 이미지로 대체하지 않는다. 실제 앱 스크린샷이 아닌 구성 예시는 오인 없도록 구별한다.
- 현재 그리글 기능은 **방향 제스처 한글 키보드**다. 미확정 V2 자모 방향 매핑을 확정 기능처럼 만들지 않는다. DZlog는 AI 사진 자동분류/일기 앱이 아니라 카메라 기반 촬영·표·파일명/경로 설정 앱이다.
- 변경 후 `npm run check`, `npm run build`, PC(1440/1280/1100px) 시각 QA와 모바일 회귀를 구분하여 검증한다. GitHub Actions runner가 실행되지 않았으면 통과라고 주장하지 않는다.
- GitHub PR 템플릿에 변경 전후 캡처, QA 로그, 승인 상태를 기록한다. Notion·Stitch↔Antigravity MCP 동기화는 계정 연결 및 실제 테스트 전까지 **미구현**으로 표시한다.
