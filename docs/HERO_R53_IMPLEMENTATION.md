# 두도지공방 홈페이지 PC Hero R5.3 — 승인 배경 적용

## 기준 및 범위
- 사용자 승인: 2026-10-22 배경 전용 시안 A(첫 번째 사진). 2026-10-23 구현 요청.
- PC 첫 화면(1051px 이상)의 배경을 완성된 사진 한 장으로 교체. 모바일, 앱 상세, 공식 로고 원본, 앱 사진과 링크는 보존.
- 작업 브랜치: feat/homepage-pc-hero-a-r5-20261021; 운영 main 및 Cloudflare 배포 금지.

## 자산
- 생성 원본: a_warm_sunlit_minimalist_cozy_workspace_desktop.png (1672×941).
- 최적화 웹 자산: public/assets/dudozi-hero-r53-workspace.webp (1600×900, WebP q76, 67,624 bytes).
- 이미지에는 홈페이지 문구, 메뉴, 앱 카드, 가치 바를 넣지 않음. 이들은 기존 HTML/CSS가 별도로 렌더하며 클릭과 확대/축소가 가능함.
- 기존 노트/펜/화분/액자 CSS 가짜 소품 5종을 HTML 및 스타일에서 삭제.
- 기존 ddz-hero-v4-approved.webp는 원복 참고용으로 유지하지만 R5.3 PC 배경으로 사용하지 않음.

## 레이아웃
- 로고 기존 심벌 표현폭 57px / 한글명 18px. 공식 DOZ 원본 대조 후 별도 교체 필요.
- 카드군 기존 R5.1 배치 유지: DZlog 294×448px, 그리글·MY LOCK 각 302×216px, 간격 16px(큰 PC).
- 카드 상·하단 정렬, 공식 앱 아이콘 및 MY LOCK 승인 이미지는 원본 보존.
- 3요소 가치 바는 3개 카드가 아닌 960px 이하 중앙정렬 반투명 패널 한 개.
- 배경 이미지는 cover / center 사용, 좌측 제목 가독성을 위한 약한 그라디언트만 적용.

## 검증 및 인계
- npm run check, npm run build, Vercel 비운영 배포 SHA 일치 확인.
- 별도 PC Chromium 1440·1280·1100px, 모바일 1050px 이하 실브라우저 QA 필요.
- 본 배경과 앱 안의 개념 예시는 실제 앱 화면 캡처가 아니므로 제품 이미지 자산은 유지.
- 사용자 실화면 확인 전 Draft PR 병합/운영 배포 금지.