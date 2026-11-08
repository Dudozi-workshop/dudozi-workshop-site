# 두도지공방 홈페이지 작업 기준

## R5.4 이후 디자인 시스템 필수 규칙 (2026-11-08)

> **두도지공방 홈페이지 또는 앱 카드 작업 시작 전 반드시 아래 3개 규격서와 현재 HEAD를 확인한다.** 구버전 PC Hero v4 수치는 운영 R5.3 이력이다. 최신 R5.4 합의/작업 기준을 우선한다.

1. [DOZ UI System v1.0](docs/design-system/DOZ_UI_SYSTEM_V1_0.md): 색상, 서체, 버튼, 간격, 토큰, 반응형, 정렬, 접근성.
2. [DOZ Card Art Standard v1.0](docs/design-system/DOZ_CARD_ART_STANDARD_V1_0.md): 카드 이미지의 통일된 광원·질감·타이포·안전영역과 공식 원본 합성/단독 검수.
3. [R5.4 Hero Revision Spec](docs/design-system/HOMEPAGE_R54_HERO_REVISION_SPEC.md): DZlog 확대, 오른쪽 2장 동일 외곽 높이, MY LOCK 비율 보존, 통일된 정렬축, 첫 화면 높이와 반응형.

- 매 작업 순서: 규격서 확인 → 공식 자산/승인 이력 확인 → 비운영 브랜치 최소 변경 → npm run check + npm run build + 브라우저 회귀 → 개별 카드 검수 → 기록 → 별도 운영 승인.
- 공식 아이콘과 실제 앱 화면은 ImageGen으로 다시 그리지 않는다. 기존 승인본 덮어쓰기, 승인 없는 3카드 합본 시안, 왜곡/크롭, 운영 main/Cloudflare 변경도 금지한다.
- 650×382px/1200·768px 등은 실화면 프리뷰에서 최종 확정할 제안값이다.
- 스킬 설치와 관계없이 GitHub AGENTS.md와 docs/design-system 문서를 항상 먼저 읽는다. Issue #6 / Draft PR #7 이력 유지.

---


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
- 과거 승인된 PC Hero v4의 고정 치수(548×400px 등)는 **운영 R5.3 이력**이다. R5.4 비운영 개발은 위 3종 규격서 및 최신 사용자 승인 기준을 우선한다.
- 공식 이미지 및 `public/assets/ddz-hero-v4-approved.webp`, `public/assets/mylock-candy-soft-trio.webp`를 임의 이미지로 대체하지 않는다. 실제 앱 스크린샷이 아닌 구성 예시는 오인 없도록 구별한다.
- 현재 그리글 기능은 **방향 제스처 한글 키보드**다. 미확정 V2 자모 방향 매핑을 확정 기능처럼 만들지 않는다. DZlog는 AI 사진 자동분류/일기 앱이 아니라 카메라 기반 촬영·표·파일명/경로 설정 앱이다.
- 변경 후 `npm run check`, `npm run build`, PC(1440/1280/1100px) 시각 QA와 모바일 회귀를 구분하여 검증한다. GitHub Actions runner가 실행되지 않았으면 통과라고 주장하지 않는다.
- GitHub PR 템플릿에 변경 전후 캡처, QA 로그, 승인 상태를 기록한다. Notion·Stitch↔Antigravity MCP 동기화는 계정 연결 및 실제 테스트 전까지 **미구현**으로 표시한다.
