# Specification

## Summary
**Goal:** Make the existing AASRA cab web app installable and usable like an Android-friendly PWA (Add to Home Screen) with a proper manifest, icons, and mobile-ready UI.

**Planned changes:**
- Add and link a valid web app manifest that includes required fields (name, short_name, start_url, display: standalone, theme_color, background_color, icons).
- Add appropriate PWA-related HTML meta tags needed for installability and correct Android launch behavior.
- Add PWA icon assets as static files under `frontend/public/assets/generated` and reference them from the manifest (including at least 192x192 and 512x512).
- Verify and adjust key screens for Android responsiveness and touch usability (header navigation, booking flow, contact options, tracking screens) to avoid clipping and horizontal scrolling on small viewports.

**User-visible outcome:** Users on Android (e.g., Chrome) can install the web app from the browser and launch it in standalone mode, with core screens remaining touch-friendly and usable on common phone sizes.
