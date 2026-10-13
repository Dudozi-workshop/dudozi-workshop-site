# R4.3 — DZlog · GRIGLE 제품 콘셉트 표현

## 작업 목적
R4.1/R4.2 홈페이지 비주얼은 보존하면서 GRIGLE 방향 입력을 실제 소스 로직과 일치시키고 DZlog의 촬영·표 기록·파일 정리 가치가 사진 목업에 드러나게 한다. 이 페이지의 기기 화면은 사용 장면을 설명하는 **기능 기반 콘셉트이며 실제 앱 스크린샷이 아니다.**

## 앱 소스와 근거
- GRIGLE: `Dudozi-workshop/GRIGLE` (`GRIGLE_0225`) `app/src/main/java/com/dudoziworkshop/GRIGLE/ime/mapper/DirSeqToJamoMapper.kt`; 첫 제스처가 L/R이면 자음, U/D면 모음. `L,U → ㄱ`, `U,R → ㅏ`를 구현 코드에서 직접 확인. `GestureSurfaceView.kt`는 화면 전체 터치·최대 3토큰 방향 시퀀스 확정 구조.
- DZlog: `Dudozi-workshop/DZlog` (`DZlog-260325`), `ui/camera/preview/CameraPreviewOverlays.kt`의 워터마크 프리뷰/오버레이. 사이트의 사진+표 기록 및 파일·폴더 정리 사용 흐름은 앱 기능을 설명하기 위한 시각 예시.
- 기존 런처 아이콘 3종과 MY LOCK Candy Soft R2 원본 이미지 유지.

## 반영 파일
- `public/index.html`: GRIGLE 히어로 3×4 가짜 자판 → 방향 제스처 포스터. GRIGLE 앱 소개 카드를 `← ↑ → ㄱ` 개념 중심으로 전환. DZlog 대표 카드에 사진·표 표시를 보강.
- `public/apps/grigle/index.html`: 상세 스마트폰에 그리글 입력창·제스처 영역·예시 매핑을 표현. 주요 설명도 실제 매핑 기준으로 수정.
- `public/apps/dzlog/index.html`: 촬영 이미지 위 현장 기록 표 + 파일·폴더 구조 예시를 강화.
- `public/product-concept-r43.css`: 신규 제품 콘셉트 스타일, 기존 `home-r2.css`의 자판 3열 그리드와 충돌 제거.
- `scripts/check.mjs`: 신규 자산과 각 화면 컨셉 HTML 포함 여부 확인.

## 검증
- 변경 코드를 이전에 검증된 Vercel R4.2 사이트의 스타일·에셋과 합쳐 Playwright의 **네트워크 라우팅**으로 새 HTML/CSS를 1회 로드하여 검사.
- 홈 PC 1440px·1100px, GRIGLE·DZlog 상세 1440px: HTTP 200, 수평 넘침 없음, 브라우저 JS 오류 없음, 리소스 오류 없음.
- 별도 실캡처에서 그리글 제품 카드가 기존 3열 grid를 상속해 겹치는 문제 발견 후 `display:flex`로 수정. 수정 후 시각 검수 완료.
- 주의: 이 검증은 실제 새 배포가 아닌 **최신 코드 로컬 렌더링**이며 새 배포 URL 응답 검증을 대체하지 않는다.

## 배포 상태 및 다음 단계
- Vercel 신규 배포 요청: 일일 무료 배포 횟수 제한(HTTP 402, `api-deployments-free-per-day`). 유효한 R4.3 Vercel 새 주소 미생성.
- 별도 Cloudflare preview.yml에 R4.3 브랜치 push trigger를 추가했으나 GitHub Actions run 38364706223 실패, 로그가 제공되지 않아 원인 확인 필요. production workflow는 `main` 전용이므로 운영 사이트 변경 없음.
- Vercel 배포 제한 해제 또는 Cloudflare Preview 정상화 후 R4.3 프리뷰 재배포, 실제 사이트 1440/1280/1100·상세 네비게이션 검증.
- 후속: 실기기 Android 캡처를 확보하면 콘셉트 이미지와 대조한 후 공식 캡처로 교체. 원본이 없으면 실제 화면이라고 주장하지 않는다.
