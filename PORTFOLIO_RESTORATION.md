This document records the first restoration pass. Current registration, visible wording, caching and measurements are documented in [EDITION_REFINEMENT.md](EDITION_REFINEMENT.md).

# OASIS 2021 portfolio restoration

## Baseline and preserved design

Original main commit: `9c9151f37a6ffa4a70396d9f380acd2ee346ede9`.
The original tracked HTML, CSS, JS, artwork and font payload was **23,888,203 bytes across 138 files**, measured from `git ls-tree -r --long` at that commit. The museum room layouts, painting navigation, wall decorations, historical festival content, sponsor/team portraits, original BlackChancery headings, Gilroy registration typography and Montserrat body text are retained.

87 original PNG/JPEG images (20,906,975 bytes) became WebP at quality 90 and **unchanged pixel dimensions**, totalling 4,378,162 bytes. SVG vector artwork remains vector artwork. All HTML/CSS image links were updated together. The BlackChancery TTF is byte-for-byte unchanged. Original Gilroy Medium/Regular and Font Awesome Brands binaries now load locally; Montserrat 500 normal is copied from pinned `@fontsource/montserrat` 5.3.0. Font family aliases and original weight selection remain intact. Font origins are recorded in `fonts/SOURCES.txt`.

## Working frontend behavior

- The shared room script safely handles pages without a menu/loader. Loading no longer waits for the full window load event; the original blocking loader is hidden by local CSS as well as guarded JS.
- Room navigation retains its existing panel widths and original art. The hamburger is now a native labelled button; Escape closes it and restores room visibility.
- Registration is clearly labelled a portfolio demo with fictional sample details. Fields have matching labels, unique IDs, native constraints and local validation. Head-of-society and mentor radio choices are independent. A valid preview displays a local confirmation; the app makes no submission, service request, storage write or authentication request.
- The historical horizontal video room remains navigable by desktop wheel scrolling. All five YouTube embeds are created only after a play-button click, using fixed validated video IDs and the privacy-enhanced embed origin. The broken automatic scrolling timer and inline video script were removed.
- A small archive label links back to the original entrance room. Reduced-motion visitors can view the original art without decorative animations.

## Cloudflare Pages and security

The site needs no backend, SSR, Pages Functions or Worker. Pinned Wrangler **4.145.0** builds/previews/deploys `dist/` to `dvm-portfolio-oasis-2021`. The Pages config has no unsupported `account_id`; the deployment command sets `CLOUDFLARE_ACCOUNT_ID=e6ad8a6f22a88b57a02e176325692373`. Compatibility date is `2026-09-30`. Planned canonical origin: `https://oasis2021.bits-oasis.org`; domain/DNS activation is handled separately.

The build copies only static pages, CSS, deployable artwork/fonts and the four runtime JS files. It excludes source tooling, tests, dependencies, `.git`, `.vscode`, `.DS_Store` and restoration documentation. It fails for any missing local HTML/CSS page or asset reference. Images and fonts get cache headers. Security headers restrict scripts/fonts/connection to self, forbid form submissions and objects, and permit frames only from the explicit YouTube embed origin. Original static inline style attributes require `style-src 'unsafe-inline'`; scripts have no inline/eval allowance. Additional headers apply nosniff, a restrictive referrer policy and disabled camera/microphone/location/payment capabilities.

Source review found no remaining API/OAuth submissions, credential handling, local/session-storage writes, dynamic HTML injection or inline event handlers in runtime code. A validation-only GitHub workflow performs install, checks and dependency audit; it does not deploy.

## Verification completed

- `npm ci`: passed with the pinned package-lock.
- `npm exec wrangler -- --version`: **4.145.0**.
- `npm run check`: passed; five tests cover valid/invalid fictional registration, independent radio choices, menu-free room initialization, and menu/Escape restoration. Static build local page/asset reference checks passed.
- `node --check` for all runtime scripts: passed.
- `npm audit --json`: **0 vulnerabilities** at every reported severity, including development dependencies.
- Font file signatures verified; original BlackChancery bytes compared directly to baseline and unchanged.
- Final build: **150 files / 7,619,545 bytes**, approximately **68.1% smaller** than the original deployable payload. This is an artifact size comparison, not a browser performance benchmark.

Desktop visual/font/main-interaction verification and remote publication belong to the parent deployment pass. Mobile UX and extensive performance checks were intentionally skipped at the user's request. No push or remote deployment was performed by this restoration agent.

## Archive limits

Original real registration/backends remain retired; this is a frontend portfolio. External social pages and historical videos remain subject to their owners' availability. Browser font rendering can vary by platform; original families and source art have been retained. Dependency audit results describe known advisories at verification time, not a guarantee against every possible vulnerability.
