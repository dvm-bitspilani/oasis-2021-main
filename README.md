# OASIS 2021 portfolio archive

The original museum rooms, artwork, navigation and typography from the BITS Pilani cultural festival website are preserved as a static frontend archive. Registration is a labelled local demo with fictional sample details; it sends and stores nothing. Historical videos load from YouTube only when played.

Use Node.js 22 or newer:

```sh
npm ci
npm run check
npm run preview
npm run deploy
```

The production artifact is `dist/`, deployed to Cloudflare Pages project `dvm-portfolio-oasis-2021` using pinned Wrangler. Deployment uses the account environment variable in the script and your existing Wrangler login. The planned canonical domain is `oasis2021.bits-oasis.org`; custom-domain setup is handled separately. See `PORTFOLIO_RESTORATION.md` for verification and archive limitations.
