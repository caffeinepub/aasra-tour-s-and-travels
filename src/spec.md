# Specification

## Summary
**Goal:** Add driver/cab attachment profiles and a referral bonus program for customers and drivers, with a new authenticated Profile area.

**Planned changes:**
- Extend the backend user profile model to support customer vs driver profile data and attachment metadata while preserving existing name-only profile behavior.
- Add backend storage and APIs to upload/replace and retrieve/download two user-tied attachments: cab attachment and driver attachment, with strict owner/admin access control and size/type validation errors.
- Implement a backend referral system: stable referral codes per user, one-time application of a referrer code, and separate customer vs driver bonus balances with validation (no self-referral, invalid code errors).
- Add admin-only backend APIs to mark bookings completed and award referral bonuses to referrer and referred users using a single defined ruleset, with idempotent payout behavior.
- Create a new authenticated-only frontend Profile route to view/edit profile basics, view referral code/status and bonus balances, apply a referral code once, and upload/manage/download cab/driver attachments.
- Update frontend navigation to show a "Profile" link only for authenticated users on desktop and mobile, while keeping admin-only navigation unchanged.
- Add React Query hooks and frontend/backend type alignment for all new profile, attachment, referral, and booking-status APIs, including cache invalidation and UI error surfacing.

**User-visible outcome:** Authenticated users can open a Profile page to manage their profile, upload cab/driver attachments, see and share their referral code, view customer/driver bonus balances, and apply a referral code once; admins can mark bookings completed to trigger referral bonus payouts.
