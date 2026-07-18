# Skyscanner layout POC visual QA

- Desktop: all 36 authenticated/unauthenticated and OAuth callback route states at `1440x1000`
- Mobile regression: home, community, and application detail at `390x844`
- Result: no horizontal overflow and no broken images in every captured state
- `contact-sheet.png`: all desktop states
- `mobile-contact-sheet.png`: representative mobile regression states

The screenshots were captured from `http://localhost:3000` with the in-app Playwright browser on 2026-07-14.
