# University layout POC visual QA

- Desktop: 8 route states across every university page template at `1440x1000`
- Mobile regression: 5 route states across every university page template at `390x844`
- Covered: university selection, Inha/Kyunghee lists, generic/scoped search, and Inha/Kyunghee details
- Result: no horizontal overflow, broken images, or browser console errors
- Mobile result: desktop navigation hidden and existing bottom navigation preserved on every captured state
- Virtualized university lists use viewport screenshots to avoid full-page stitching artifacts

`contact-sheet.png` contains the desktop states and `mobile-contact-sheet.png` contains the mobile regression states.
