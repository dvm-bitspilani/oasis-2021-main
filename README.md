# OASIS 2021

The original museum rooms, artwork, navigation and typography from the BITS Pilani cultural festival website are preserved. Direct registration visits show “Registration is closed for this edition”; the original entrance registration link remains commented out. Historical videos load from YouTube when played.

Use Node.js 22 or newer:

```sh
npm ci
npm run check
npm run preview
npm run deploy
```

The production artifact is `dist/`, deployed to Cloudflare Pages project `dvm-portfolio-oasis-2021` using pinned Wrangler. Assets have content hashes and immutable cache headers; HTML revalidates. Deployment uses the existing account environment variable and Wrangler login. The canonical domain is `oasis2021.bits-oasis.org`; domain setup is handled separately. See `EDITION_REFINEMENT.md` for preservation evidence, artifact measurements and verification.
