# R5.4 non-production implementation — 2026-11-04

## Scope
- GitHub Issue #6 and Library `20261104_웹적용_준비_개별자산/` provide the three immutable image sources.
- The existing R5.3 desktop hero image, headline, CTA, one-row values bar, app detail pages, and existing mobile fallback are not changed.
- Replace only the R5.3 desktop Hero app-card markup with three accessible, clickable **single-image** anchors using `home-r54-{dzlog,grigle,mylock}.webp`.
- Use aspect-preserving `object-fit:contain`. No regenerated icons, custom gestures, extra overlay title, or inter-card composite raster.
- Preserve the existing app detail URL destinations and keyboard/focus navigation.

## Asset provenance (Library source / SHA-256)
| Card | dimensions | WebP SHA-256 |
| --- | --- | --- |
| DZlog A | 710 × 866 | `3c5441fe916b5c600167c33c062ebd01ada00df2b2acbb49013d0230dd8943a2` |
| Grigle C v3 | 1672 × 941 | `39858788743a340060d47ab7faeb9ffcac11e2151354e7654a23d9c7b9e51280` |
| MY LOCK E | 839 × 390 | `8b0c50be2adc7801ea418c392da5740c60e416ec92e9ca5b60627277b0f83b94` |

## R5.4 geometry
- Desktop ≥1280px: 612×341 overall, left 280px, right 316px, gap 16px; right rows 1.2fr : 1fr.
- Desktop 1051–1279px: 540×301 overall, left 247px, right 277px, gap 16px; right rows 1.2fr : 1fr.
- Images are intrinsic-ratio artwork, hence R5.3 448/408px card height cannot be retained without significant letterboxing or clipping.
- Mobile ≤1050px retains R5.3 legacy hero until the user's preview review; existing visual QA covers mobile regression.

## Verification gates
- Run `npm run check`, `npm run build`, and browser visual QA (desktop 1440/1280/1100; mobile 1050/768/390; app detail roundtrips). CI / screenshots are evidence only when GitHub Actions actually completes.
- Confirm real card pixel appearance, alignment, links, mobile legacy visibility, external image/font requests.
- This implementation branch / draft PR **must not be merged or deployed** until the user separately approves final web preview.
- Homepage operational version remains **R5.3**. Production deployment is out of scope.

## 2026-11-08 · DOZ UI System v1.0 non-production design normalization

- Required references: `AGENTS.md` plus `docs/design-system/{DOZ_UI_SYSTEM_V1_0,DOZ_CARD_ART_STANDARD_V1_0,HOMEPAGE_R54_HERO_REVISION_SPEC}.md`; future agents must read before site or card-generation work.
- Shared CSS tokens (24px radius, 48px button, 1400px max content and spacing scale) drive R5.4 hero/header/cards; the three artwork image files and links are unchanged.
- Layout for non-production review: >=1200px copy left + 650×382 image group right, two right tiles equal-height. 768–1199px same image group beneath copy. <=767px independent cards stacked. R5.3 photo/background and user-approved copy maintained.
- Hero + value strip designed to fill a typical 900px desktop viewport, while shorter/mobile screens naturally scroll. App detail sections are outside this first migration step.
- Status: **Draft PR #7; user visual QA pending**. Production `main`, Cloudflare R5.3, and previous approved image assets preserved. Any later deploy needs separate approval.
