# OASIS 2021 edition refinement

## Changes

Removed every added visible portfolio/archive/demo label and the simulated registration form, fixture identities, preview validation and confirmation. Direct `registration.html` visits show the exact notice “Registration is closed for this edition” in a small native dialog over the original registration wall. The dialog has a labelled message, close control, native Escape dismissal, focus restoration, an entrance link and a no-JavaScript fallback. The entrance registration link is still commented out as in the original edition.

The original desktop and mobile museum walls, paintings, labels, star/shake animations, room layouts, historical copy, team and sponsor material remain. Responsive `<picture>` sources display the original corresponding mobile paintings without fetching the desktop paintings as hidden extra images. Below-fold sponsor and developer portraits load lazily. Original decorative loading overlays and their unused CSS were removed; no loading delay was introduced. Navigation intent prefetches the destination HTML, CSS/script and shared room art/type. YouTube remains click-to-play; this edition has no audio payload.

## Preservation and optimization evidence

The first-pass build at `220d916` contained **150 files / 7,619,545 bytes**. The final build contains **124 files / 5,821,754 bytes**, a **23.59% reduction**. This measures deployable artifact bytes, not real-device load time or Core Web Vitals.

Eight SVG-embedded PNG payloads changed from **1,329,056 bytes** to **681,610 bytes** of lossless WebP. All decoded RGBA pixels, dimensions and surrounding SVG vector markup were compared to the first-pass artwork and are identical; see `docs/artwork-lossless-verification.json`. Existing standalone WebP images were retained without further lossy recompression.

The original BlackChancery font was repackaged from 56,732 to 26,176 bytes; Gilroy Medium from 64,548 to 45,516 bytes; Gilroy Regular from 62,876 to 44,260 bytes. Font Awesome's two used original social glyphs require 724 bytes instead of the 105,204-byte full font. All 217 BlackChancery glyphs, 556 glyphs per Gilroy face and both social glyphs were checked for identical outlines and horizontal metrics; see `docs/font-outline-verification.json`. Original source fonts remain available for provenance. Fonts use swap and keep the original families and weight choices.

The static build now follows referenced resources, rewrites all deployed asset URLs to SHA-256 content fingerprints, and verifies every local HTML/CSS/responsive-image reference. All 114 output asset hashes were independently checked. Hashed assets cache for one year with `immutable`; HTML and clean page routes use `max-age=0, must-revalidate`. Cache rules do not overlap with the immutable asset rule. Original disabled navigation remains in source comments, which are omitted from the published artifact.

## Verification

- `npm ci` passed using the committed lockfile.
- `npm run check` passed: five meaningful checks cover safe room initialization, menu/Escape behavior, direct registration modal/focus behavior, readable closed-registration fallback, absent signup fields/added labels/loaders, and the commented entrance registration link. The build verified all local references.
- `npm audit --json` reported zero vulnerabilities at every severity.
- `node --check` passed for all runtime scripts and the build script.
- `git diff --check` passed.
- Artwork pixels/vector markup, font outlines/metrics, content hashes and deployment cache rules passed independent verification.

Parent performs desktop/mobile browser inspection, cold and warm navigation checks and remote publication. This pass does not claim browser-performance measurements, cross-browser results or a physical-device test. No push or deployment was performed by this refinement agent.
