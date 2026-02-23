# Specification

## Summary
**Goal:** Enable drivers to view and act on their assigned bookings via a dedicated dispatch inbox, backed by new driver-authorized APIs.

**Planned changes:**
- Add backend endpoints for authenticated drivers to fetch their assigned bookings (newest first) and to update the status of their own assigned bookings (accepted, refused, completed, cancelled) with optional refusal/cancellation reason persisted on the booking.
- Enforce authorization so only the assigned driver (and admin where appropriate) can access/modify bookings via these new driver dispatch APIs; keep existing admin-only booking methods unchanged.
- Create a driver dispatch screen showing an “Assigned Bookings” list, a booking detail panel, and actions: Accept, Refuse (reason required), Mark Completed, Cancel (reason required), plus a link to the existing location update page for that booking.
- Add route/navigation for the dispatch inbox (e.g., `/driver/dispatch`) and add an entry point from the driver Profile page to open the dispatch inbox; allow navigation to `/driver/track/$bookingId` from dispatch details.
- Add React Query hooks for fetching assigned bookings and mutating driver booking status updates, with consistent query keys and invalidation to refresh list/details after changes.
- Apply a mobile-first dispatch UI theme consistent with existing warm/amber styling, including clear high-contrast status badges and prominent primary actions.

**User-visible outcome:** A driver can open a Dispatch inbox to see only their assigned bookings, view details, update booking statuses (with required reasons for refuse/cancel), and jump to the existing location update screen for a selected booking.
