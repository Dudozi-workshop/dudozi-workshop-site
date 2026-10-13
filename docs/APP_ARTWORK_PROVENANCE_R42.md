# App artwork provenance — R4.2

## MY LOCK (Candy Soft R2)
- **Owner:** Dudozi-workshop/my-lock
- **Source:** `assets/raster_shapes/candy_soft_r2/{circle,triangle,square}_authored_256.b64` on the repository's `main` branch.
- **Source manifest:** `assets/raster_shapes/candy_soft_r2/manifest.json`, `status: final_locked_active`, `production_approved: true`, approval date 2026-10-04.
- **Local site asset:** `public/assets/mylock-candy-soft-trio.webp` (420×420, transparent WebP).
- **Processing:** Decode the three 256px authored PNGs; resize and arrange them into a transparent composite. Their outlines, colors and textures are preserved; no new shapes or elements are drawn over them.
- **Usage:** MY LOCK homepage product art, secondary product card, and MY LOCK detail/concept-moment scene. These are composed illustrations **not claimed as actual device screenshots**.

## Other app icon usage
- The website already bundles DZlog and 그리글 launcher icons and the MY LOCK final launcher artwork. Avoid replacing these with default Android template vectors.
- DZlog is a photo/data overlay record camera; 그리글 is a gesture-input Korean keyboard; MY LOCK is a customizable lock screen app. Each visual must retain these product meanings.

## Release/QA guardrails
- Preserve the locked R4/R4.1 desktop hero structure and direct links to app detail pages.
- Do not promote the design branch to production or `main` without explicit approval.
- Verify visual backgrounds, cards, and actual icons at 1440/1280/1100px, and check mobile separately when authorized.
