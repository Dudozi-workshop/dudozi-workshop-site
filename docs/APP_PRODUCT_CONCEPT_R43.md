# App product visualization R4.3 — source alignment and QA

## Scope / branch
- Site branch: `feat/homepage-visual-r3-hifi`; production/main are unchanged.
- Product concept CSS: `public/product-concept-r43.css`.
- Product illustrations are **UI concepts, not screenshots captured from the Android apps**.

## GRIGLE source-of-truth
- Repository: `Dudozi-workshop/GRIGLE`, branch `GRIGLE_0225`.
- Mapper: `app/src/main/java/com/dudoziworkshop/GRIGLE/ime/mapper/DirSeqToJamoMapper.kt`.
- Verified examples: `L,U → ㄱ`, `U,R → ㅏ`; initial L/R selects consonant and U/D selects vowel mapping.
- Gesture recognizer: `ime/gesture/view/GestureSurfaceView.kt`. The app captures touch directions as sequences, not through a conventional 3×4 jamo keypad.
- Home poster, product catalog card and detail phone now show the directional-input mechanism.
- The visual arrow path and text are a curated demonstration of mapping principles, not a live or pixel-matched prototype UI.
- Palette grounded in `ime/ui/theme/DdzPalette.kt` (beige/brown/sage).

## DZlog source-of-truth
- Repository: `Dudozi-workshop/DZlog`, branch `DZlog-260325`.
- Camera overlays: `app/src/main/java/com/dudoziworkshop/dzlog/ui/camera/preview/CameraPreviewOverlays.kt`; actual UI uses a watermark preview overlay, focus/mask/grid and capture result overlays.
- On-site concept depicts photo + table recording, and filename/folder organization after capture.
- Mock filenames such as `A-01_001_20261013_01.jpg` are **fictional demonstration values**, not screenshots or confirmed current naming defaults.

## QA and publishing status
- Commit: `57c6f37837524b2f22967160c80928e35a015154`.
- Direct static review: no duplicate HTML IDs or missing in-page anchor targets; HTML references the new stylesheet and rendering targets.
- Playwright visual QA via local interception of the last ready R4.2 preview at 1440, 1280 and 1100 px plus both detail pages at 1440 px. All loads 200; horizontal overflow 0; JavaScript errors 0; missing resources 0.
- **This is not a new public deployment.** New Vercel deployment request was blocked by daily API deployment quota (HTTP 402, `api-deployments-free-per-day`). Do not claim R4.3 is online until a deployment succeeds.
- Existing public R4.2 preview remains unchanged. Never modify main/production without explicit user approval.
