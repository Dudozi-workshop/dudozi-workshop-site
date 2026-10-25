# Google Stitch ↔ Antigravity 최초 연결 안내

작성일: 2026-10-15
대상: 두도지공방 홈페이지 `Dudozi-workshop/dudozi-workshop-site`
상태: **연결 준비 완료 / 외부 계정 로그인과 사용자 기기 설정 대기**
공식 참고: https://codelabs.developers.google.com/design-to-code-with-antigravity-stitch?hl=ko

## 1단계 — Stitch에서 그리글 시안 만들기 (지금 우선 수행)

1. 본인의 PC 브라우저에서 https://stitch.withgoogle.com 을 열고 본인 Google 계정으로 로그인한다.
2. 새 프로젝트 `DDZ-Grigle-Card-Pilot`을 만든다.
3. `docs/STITCH_GRIGLE_COPY_PROMPT.md`의 **첫 생성 — A안**을 붙여넣고 1차 시안을 만든다.
4. 기존 비운영 PC Hero v4의 그리글 카드 캡처와 공식 앱 아이콘, 가능하면 실제 키보드 캡처를 함께 첨부한다.
5. **두 번째 생성 — B안** 지시문으로 제스처 강조형을 만든다.
6. A/B를 구분할 수 있는 Stitch 프로젝트 링크나 내보낸 스크린샷을 보관한다.
7. 사용자에게 A/B 두 시안을 비교해 보여주고 **디자인 승인**을 받는다. 승인 전에 HTML/CSS 수정하지 않는다.

> Stitch 출력이 정확히 276×194px로 떨어지지 않아도 된다. 비율·콘텐츠가 기준에 맞으면 향후 기존 카드의 고정 규격으로 구현할 수 있다. 다만 시안 자체가 홈페이지 전체로 확장되면 다시 카드 단독으로 생성한다.

## 2단계 — Stitch ↔ Antigravity MCP 연결 (디자인 승인 이후)

1. 본인 컴퓨터에 Antigravity IDE가 설치되어 있지 않다면 공식 페이지에서 설치한다: https://antigravity.google/download
2. Stitch 오른쪽 위 **프로필 → Stitch settings → API key → Create key**에서 키를 만든다.
3. **API 키는 사용자 기기의 Antigravity 설정에만 입력한다. ChatGPT, GitHub Issue, PR, 스크린샷에는 절대 붙여넣지 않는다.**
4. Antigravity Agent Manager를 열고, **MCP Servers → Stitch 검색 → Install**을 선택한다.
5. Stitch 서버 설정 화면이 요청하면 개인 Stitch API 키를 입력한다.
6. Antigravity 에이전트 채팅에 `List my Stitch projects.`를 입력해 `DDZ-Grigle-Card-Pilot`이 표시되는지 확인한다.
7. 확인되지 않으면 키/계정/프로젝트 권한을 점검한다. **연결 실패를 성공으로 보고하지 않는다.**

주의: Google 공식 튜토리얼의 실습 준비 항목에는 Google Cloud 프로젝트 및 **결제 사용 설정**이 포함된다. 사용자 계정에서 그러한 설정이 실제로 필요한지 확인하고, 비용이 발생할 수 있는 설정은 사용자 승인 전까지 진행하지 않는다.

## 3단계 — 코드 연결 (승인 전 금지)

1. Antigravity에서 기존 `Dudozi-workshop/dudozi-workshop-site` 저장소를 작업 공간으로 연다.
2. 작업 브랜치 `feat/homepage-visual-r3-hifi`의 최신 소스에 기반하여 작업한다. `main`으로 시작하지 않는다.
3. 루트의 `AGENTS.md`와 `docs/AI_WEBSITE_PIPELINE.md`를 읽는다.
4. 사용자가 선택한 **A 또는 B 단일 디자인**을 Stitch MCP로 불러온다.
5. 먼저 `docs/`에 해당 카드에 한정한 색상·타이포·간격의 제안만 정리한다. `public/index.html` 또는 CSS는 사용자의 디자인 승인 후 수정한다.
6. 기존 순수 **HTML/CSS/JavaScript 정적 사이트**에 적용한다. 공식 튜토리얼이 React/Tailwind 신설 프로젝트를 예로 들더라도 **그대로 따라 새 React 프로젝트로 재생성하지 않는다.**
7. `npm run check`·`npm run build`·브라우저 QA(1440/1280/1100px) 완료 후 PR/프리뷰 검수를 요청한다.
8. Vercel Preview 및 운영 `main` 변경은 사용자의 별도 요청에만 수행한다.

## 연결 확인 기준

| 단계 | 확인 문장 | 현재 |
| --- | --- | --- |
| Stitch 계정 | `DDZ-Grigle-Card-Pilot` 프로젝트를 실제로 볼 수 있음 | 미확인 |
| 디자인 결과 | A/B 두 카드 스크린샷 또는 프로젝트 링크 확보 | 미생성 |
| MCP 연결 | Antigravity에서 `List my Stitch projects.`가 실제 프로젝트를 반환 | 미연결 |
| 디자인 승인 | A/B 사용자 선택 기록 | 대기 |
| 코드 구현 | 승인된 카드 1개만 변경 후 QA 통과 | 대기 |

### 환경 제약

이 채팅의 GitHub 연결로는 저장소 운영 문서와 브랜치 파일을 수정할 수 있지만, **Stitch·Antigravity 로그인 화면과 개인 로컬 IDE에는 접근할 수 없다**. 따라서 여기 기록된 초기 로그인·API 키 입력은 사용자가 본인 환경에서 수행해야 한다. 일반적인 ChatGPT Google Drive 연결은 Stitch MCP 연결을 대신하지 않는다.
