# Architecture — Employee Internal Transfer Digital Journey

**Status:** Draft — Day 5  
**Feature:** `employee-internal-transfer`

## 1. Scope

This architecture covers the assessment implementation only. The current build is frontend-only.

## 2. High-Level Architecture

```text
┌──────────────────────────────────────┐
│       One-Point Employee Portal      │
│              React UI               │
├──────────────────────────────────────┤
│ Internal Transfer Feature            │
│  Request Form                        │
│  Validation                          │
│  Status / Progress                   │
│  Pending Actions                     │
└──────────────────┬───────────────────┘
                   │
                   ▼
        internalTransferService
                   │
             ┌─────┴─────┐
             ▼           ▼
         Mock JSON   Future REST API
```

## 3. Frontend Layers

**Presentation:** React components for the request form, validation, submission, status, progress and pending actions.

**Service boundary:** `internalTransferService.js` provides the data-access boundary.

**Data:** `src/data/internal-transfer.json` contains controlled assessment data and is not a system of record.

## 4. Future API Boundary

```text
POST /api/internal-transfers
GET  /api/internal-transfers/{requestId}
GET  /api/internal-transfers/{requestId}/progress
```

When a backend becomes available, the service implementation can be replaced with HTTP calls without requiring a UI redesign.

## 5. Data Ownership

For this phase, mock data belongs to the assessment repository and contains no real employee data.

For a future backend phase, authoritative ownership of employee, organisation, HR, Payroll, IT and Facilities data must be confirmed before integration.

## 6. State

React-local state is planned for feature interaction. No additional state library is introduced without an approved reason.

## 7. Error Boundary

Represent validation failure, submission failure, not found, access denied, progress unavailable and downstream processing failure. Never translate a failure into success.

## 8. Security Boundary

Frontend: do not trust client ownership IDs, expose protected data, store secrets, or log sensitive information.

Backend responsibilities are deferred: authentication, authorization, ownership enforcement and secure downstream integration.

## 9. Accessibility

Use semantic controls and accessible form/status patterns. Accessibility verification is part of implementation testing.

## 10. Constraints

Use the assessment stack:
- React
- Vite
- JavaScript
- Tailwind CSS

No new database, messaging system, backend framework or state library is introduced by this plan.

## 11. Deferred Architecture

- Backend service architecture.
- Database schema.
- Enterprise integration architecture.
- HR/Organisation/Payroll/IT/Facilities orchestration.
- Production authentication architecture.
- Production deployment infrastructure.

## 12. Status

**Phase 1 Complete / Phase 2 Addendum Attached — 2026-09-16**

---

## 13. Phase 2 Architectural Addendum

### 13.1 Portal Architecture Overview
Phase 2 expanded the single-journey implementation into a full multi-role Employee Portal application.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          App Shell (Navbar, Layout)                   │
├──────────────────────────────────┬─────────────────────────────────────┤
│        Employee View             │              Admin View             │
│ ┌──────────────────────────────┐ │ ┌─────────────────────────────────┐ │
│ │ - Employee Dashboard         │ │ │ - Admin Dashboard               │ │
│ │ - Internal Transfer Form     │ │ │ - Transfer Request Management    │ │
│ │ - Transfer Status & Progress │ │ │ - Metrics & Search/Filter       │ │
│ └──────────────────────────────┘ │ └─────────────────────────────────┘ │
├──────────────────────────────────┴─────────────────────────────────────┤
│                          Service & Data Layer                          │
│ ┌──────────────────────┬──────────────────────┬──────────────────────┐ │
│ │ authService.js       │ internalTransfer...  │ adminService.js      │ │
│ │ (sessionStorage)     │ (transfer logic)     │ (admin mock boundary)│ │
│ └──────────────────────┴──────────────────────┴──────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### 13.2 Key Components Added in Phase 2
- **Demo Authentication (`authService.js`):** Client-side session management using `sessionStorage`. Supports pre-configured demo users (`employee@onepoint.demo`, `admin@onepoint.demo`).
- **Role-Based Routing (`App.jsx`):** Conditional view switching based on active user role (`employee` vs `admin`). Redirects unauthenticated access to Login.
- **Admin Data Boundary (`adminService.js`):** Service layer providing read access to global transfer request mock dataset, metric calculation, and request detail retrieval.
- **Employee Dashboard (`EmployeeDashboard.jsx`):** Personal dashboard displaying active transfer progress, quick actions, and recent activity.

### 13.3 Security & Boundary Controls
- **Session Isolation:** User identity is stored in `sessionStorage` and cleared upon explicit logout.
- **Frontend Role Protection:** Views and routing guards prevent unauthorized navigation (e.g. employee attempting admin view access).
- **Static Boundary Preservation:** All authentication and admin data operations execute against frontend mock datasets without real API/backend endpoints.

