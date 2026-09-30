# Security Specification: Media Prima Berhad OT Portal

## 1. Data Invariants
1. **User Identity & Isolation**: A user can only create and manage their own user profile (`/users/{userId}`) where `userId == request.auth.uid`. A regular user cannot escalate their role to `admin` or modify another user's department or role.
2. **Admin Privilege Guard**: Admin operations (e.g. batch approvals, viewing all submissions, modifying admin list) require either being registered in `/admins/{adminId}` or being the designated bootstrapped admin (`croniez78@gmail.com`).
3. **Overtime Entry Integrity**:
   - Every `OvertimeEntry` must have `userId == request.auth.uid` upon creation.
   - Non-admin staff cannot tamper with another employee's overtime entries.
   - Hours, durations, dates, and project codes must adhere strictly to length, format, and type constraints.
   - Unauthenticated or anonymous users cannot view or mutate any entries.
4. **Monthly Submission Compliance**:
   - Staff can transition their monthly submission from `Pending` to `Submitted` when filing their monthly 7th-cutoff claim.
   - Only Admins can set status to `Approved` or `Rejected`.
   - Once `Approved`, entries cannot be modified or deleted by staff.

---

## 2. The "Dirty Dozen" Threat Payloads

1. **Payload 1: Unauthenticated Create Overtime Entry**
   - Attempt: Anonymous/Unauthenticated user creates an overtime entry.
   - Expected: `PERMISSION_DENIED`
2. **Payload 2: Identity Spoofing in Entry Creation**
   - Attempt: Authenticated user `user_A` writes an overtime entry with `userId: "user_B"`.
   - Expected: `PERMISSION_DENIED`
3. **Payload 3: Privilege Escalation via User Profile**
   - Attempt: Regular employee creates or updates profile with `role: "admin"`.
   - Expected: `PERMISSION_DENIED`
4. **Payload 4: Tampering With Other Staff's Overtime Record**
   - Attempt: `user_A` updates or deletes an overtime entry belonging to `user_B`.
   - Expected: `PERMISSION_DENIED`
5. **Payload 5: ID Poisoning Attack**
   - Attempt: Creating a document with a 2000-character malicious string or invalid regex document ID.
   - Expected: `PERMISSION_DENIED`
6. **Payload 6: Denial of Wallet (Giant Payload)**
   - Attempt: Writing a note exceeding 500 characters or notes of invalid type.
   - Expected: `PERMISSION_DENIED`
7. **Payload 7: Unauthorized Admin Creation**
   - Attempt: Non-admin adds themselves to `/admins/{uid}`.
   - Expected: `PERMISSION_DENIED`
8. **Payload 8: Blanket Query Scraping**
   - Attempt: Non-admin performs an unconstrained `collection('overtimeEntries')` query without filtering by `userId`.
   - Expected: `PERMISSION_DENIED`
9. **Payload 9: Ghost Field Injection (Shadow Update)**
   - Attempt: Updating an overtime entry with a ghost field `approved: true` or `hourlyRate: 9999`.
   - Expected: `PERMISSION_DENIED`
10. **Payload 10: State Shortcutting (Illegal Self-Approval)**
    - Attempt: Staff member directly sets `status: "Approved"` on their own `MonthlySubmission`.
    - Expected: `PERMISSION_DENIED`
11. **Payload 11: Invalid Date Format Injection**
    - Attempt: Saving overtime with date `"yesterday"` or `"2024/10/02"` instead of ISO `YYYY-MM-DD`.
    - Expected: `PERMISSION_DENIED`
12. **Payload 12: Negative or Non-numeric Duration Attack**
    - Attempt: Submitting negative hours (`duration: -10`) or string duration (`duration: "five"`).
    - Expected: `PERMISSION_DENIED`

---

## 3. Test Runner Specification (`firestore.rules.test.ts`)
The unit test suite verifies each of the dirty dozen attack vectors against the security rules, guaranteeing default-deny behavior for unauthenticated and cross-tenant access.
