# Business Requirements Document (BRD)

## Document Information

| Field | Value |
|---|---|
| Project | One-Point Employee Portal |
| Primary Feature (Phase 1) | Employee Internal Transfer Digital Journey |
| Scope Expansion (Phase 2) | Employee & Admin Portal Enhancements |
| Status | Approved & Implemented |
| Version | v2.0 |

---

## 1. Business Objective (Phase 1 — Original SDD Assessment)

Provide a streamlined digital employee self-service journey for initiating and tracking internal transfer requests across departments, locations, and roles within the organization.

Prior to this digital journey, internal transfer requests were handled through informal emails and manual paper forms, leading to lost requests, delayed manager reviews, and poor employee visibility into request progress.

---

## 2. Primary User & Stakeholders (Phase 1)

- **Primary User:** Current Employee seeking a role, location, or department transfer.
- **Secondary Stakeholders:** Line Manager, Receiving Manager, HR Administrator, Facilities / IT Coordinators.

---

## 3. Approved Business Requirements (Phase 1 — Employee Internal Transfer)

1. **Initiate Transfer Request:** Employees can initiate an internal transfer request selecting target Department, target Location, and target Role.
2. **Mandatory Fields:** Department, Location, Role, and proposed Effective Date are required.
3. **Optional Reason:** Employees may provide an optional text explanation for the transfer request.
4. **Validation:** Client-side validation prevents submitting incomplete or invalid requests.
5. **Duplicate Prevention:** The system prevents logical duplicate submissions (409 Conflict) for the same employee, department, location, role, and effective date.
6. **Post-Submission Status & Progress:** Upon submission, the employee can view request status, assigned request ID, and pending stakeholder actions.
7. **Failure & Error Representation:** Downstream processing failures, access denial (403), or unauthenticated access (401) are safely communicated without exposing sensitive system traces.

---

## 4. Phase 2 Product Scope Addendum (Frontend Portal Enhancements)

> **Note:** Phase 2 expanded the project into a comprehensive frontend Employee Portal shell around the original Internal Transfer journey. Phase 2 remains strictly frontend-only using static JSON data boundaries.

### Phase 2 Key Deliverables
1. **Application Navigation Shell:** Shared top Navbar, role-aware Sidebar, and responsive mobile overlay menu (`P2-T01`).
2. **Demo Authentication & Role Selection:** Portal login page (`LoginPage.jsx`) supporting static Employee (`employee@onepoint.demo`) and Admin (`admin@onepoint.demo`) demo accounts with role tabs and quick fill helpers (`P2-T02`).
3. **Session Handling & Role Guards:** Client-side session management via `sessionStorage` (`onepoint_portal_session`), role protection preventing employees from accessing admin views, and safe logout handling (`P2-T03`).
4. **Employee Dashboard:** Personalized employee landing page featuring welcome header, profile summary card (`EMP-001`, Software Engineer), quick KPI statistics cards, quick action navigation to the Internal Transfer journey, and recent activity stream (`P2-T04`).
5. **Admin Dashboard & Pipeline Overview:** Enterprise admin pipeline view featuring high-level metrics (Total, Pending, Approved, Rejected), a responsive request table of 8 static records, live search, status dropdown filter, color-coded badges, empty filter state with reset action, and an interactive request details modal (`P2-T05`).
6. **Global UI/UX & Accessibility Polish:** Visible focus rings (`focus:ring-2 focus:ring-indigo-500`), keyboard `Escape` modal closure, `aria-modal="true"` dialog semantics, non-color-only status badges, and mobile horizontal scroll prevention (`P2-T06`).
7. **E2E Feature Validation & Traceability:** Full test suite verification (`125/125 passing`) and Vite production build check (`P2-T07`).

---

## 5. Explicitly Deferred / Out of Scope

The following items remain explicitly out of scope and deferred to future backend phases:
- Real backend API servers or database infrastructure.
- Production authentication, OAuth2, OIDC, SAML, or JWT security frameworks.
- Real-time integrations with enterprise HRIS, Payroll, Active Directory, or Facilities systems.
- Production email/SMS notification dispatch systems.
