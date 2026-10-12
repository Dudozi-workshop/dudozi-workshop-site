# DDZ Website Reuse-First Policy

## Purpose
두도지공방 웹 개발은 바닥부터 새로 만드는 것보다 검증된 공개 자산·패턴·기존 프로젝트 자산을 우선 재사용한다.

## Priority
1. 이미 저장소에 있는 DDZ 공통 컴포넌트와 토큰
2. 라이선스가 명확한 오픈소스 CSS·아이콘·컴포넌트
3. 승인된 DDZ 이미지 목업에서 분리한 브랜드용 장식 에셋
4. 프로젝트 고유 기능과 브랜드 표현만 직접 제작

## Current foundation
- Browser normalization: modern-normalize (vendored, MIT)
- General icons: Lucide selected SVG sprite (vendored, license included)
- Design tokens: public/styles/tokens.css
- Shared base: public/styles/base.css
- Shared components: public/styles/components.css
- Page-specific styling: public/home-r2.css

## Rules
- 공통 버튼, 아이콘, spacing, radius, shadow, 반응형 패턴을 페이지마다 다시 작성하지 않는다.
- 새 외부 자산은 라이선스를 확인하고 필요한 부분만 로컬 vendoring 한다.
- 외부 사이트의 브랜드 이미지·유료 템플릿을 그대로 복제하지 않는다.
- DDZ 로고, 앱 공식 화면, 브랜드 카피처럼 고유 자산은 원본을 우선 사용한다.
- 이미지 목업은 전체 페이지 배경으로 박제하지 않고, 질감·소품·기기 프레임 등 장식 요소에 한해 재사용한다.
- PC 시각 기준을 먼저 승인한 뒤 모바일을 최적화한다.
