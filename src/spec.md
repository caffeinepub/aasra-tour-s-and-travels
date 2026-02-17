# Specification

## Summary
**Goal:** Allow users to save a preferred payment method in their profile and have it preselected when booking a cab.

**Planned changes:**
- Extend the backend user profile model to store an optional preferred payment method and return/save it via existing profile get/save APIs (including any needed safe migration defaulting to null/empty).
- Add a “Payment Method” section to the Profile page to view, select, and save the preferred payment method (English UI text) using the existing profile save + refetch patterns.
- Update the booking form to initialize the payment method selection from the saved preferred payment method when available, while still allowing changes before submit and preserving existing validation when not set.

**User-visible outcome:** Signed-in users can set a preferred payment method in their profile, and the booking form will auto-select it (if saved) while still letting them choose a different method before submitting.
