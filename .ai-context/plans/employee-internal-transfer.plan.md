# Technical Plan — Employee Internal Transfer Digital Journey

**Plan ID:** `employee-internal-transfer`  
**Status:** Draft — Day 5  
**Spec:** `employee-internal-transfer`  
**Gate 1:** Approved by PM  
**Implementation scope:** Frontend only  
**Technology:** React, Vite, JavaScript, Tailwind CSS  
**Testing:** React Testing Library with a Vite-compatible test runner

## 1. Objective

Define the technical approach for implementing the approved Employee Internal Transfer Digital Journey without changing approved business behaviour.

The assessment implementation is frontend-only. Real HR, Organisation, Payroll, IT and Facilities systems are deferred. Controlled JSON/mock data will represent future API responses.

## 2. Approved Feature Boundary

The implementation supports:
- Initiating an Internal Transfer Request.
- Selecting department/business unit, location and role/job position.
- Providing effective date and optional reason.
- Submitting the request.
- Viewing request status.
- Viewing pending stakeholder actions.
- Viewing overall progress.

Unresolved business behaviour such as exact approval flow, HR eligibility rules, cancellation, notifications and stakeholder dashboards must not be invented.

## 3. Technical Approach

### Frontend
Use React + Vite + JavaScript + Tailwind CSS.

### Feature structure
```text
src/
├── components/
│   └── internal-transfer/
├── pages/
│   └── InternalTransfer/
├── data/
│   └── internal-transfer.json
├── services/
│   └── internalTransferService.js
└── ...
```

The exact component/task breakdown will be generated after this Plan is reviewed.

### Data boundary

```text
UI
 ↓
internalTransferService
 ↓
Mock JSON
```

Future:

```text
UI
 ↓
internalTransferService
 ↓
REST API
```

The service boundary keeps the UI independent from the temporary mock implementation.

## 4. API Alignment

The approved Spec contains these proposed contracts:

```text
POST /api/internal-transfers
GET  /api/internal-transfers/{requestId}
GET  /api/internal-transfers/{requestId}/progress
```

These endpoint details are proposed contract decisions, not business requirements. A backend must follow the approved contract or obtain a new SDD decision before changing it.

## 5. Mock JSON

Planned file:

```text
src/data/internal-transfer.json
```

It will represent only data required by the approved frontend journey, such as transfer options, example request status, pending actions and progress.

It will not become a source of authoritative business rules.

## 6. UI Flow

```text
Internal Transfer
       ↓
Request Form
       ↓
Validate required fields
       ↓
Submit
       ↓
Request Status
       ↓
Progress
       ↓
Pending Stakeholder Actions
```

## 7. State Management

Use React-local state for feature interaction unless an approved project rule later requires another approach.

Feature state includes form values, validation, submission state, request result and progress/status display state.

No unnecessary state-management library is introduced.

## 8. Validation

Client-side validation covers the mandatory fields defined by the Spec:
- Department/business unit.
- Location.
- Role/job position.
- Effective date.

Reason remains optional.

Undefined rules such as notice periods or selection dependencies must not be invented.

## 9. Error Handling

Provide safe UI states for:
- Missing/invalid input.
- Submission failure.
- Request not found.
- Access denied.
- Progress unavailable.
- Downstream processing failure represented by mock data.

The UI must never show successful completion when data indicates failure.

## 10. Security

Frontend:
- Do not trust client-supplied employee ownership identifiers.
- Do not expose another employee's protected request.
- Do not store secrets in source code.
- Do not log sensitive employee information.

Backend authentication, authorization and secure enterprise integrations are deferred.

## 11. Accessibility

Use semantic HTML and accessible form/status patterns:
- Associated labels.
- Understandable validation errors.
- Appropriate focus handling.
- Status/progress available to assistive technology.
- Meaningful accessible names.
- Do not communicate status by colour alone.

## 12. Testing Strategy

Use a test-first approach. Tests are created before the corresponding implementation task is completed.

Initial frontend coverage:
- Form rendering.
- Required-field validation.
- Optional reason.
- Successful submission.
- Status display.
- Pending actions.
- Progress display.
- Submission failure.
- Not-found/access-denied state.
- Downstream failure representation.
- Accessibility/keyboard behaviour where applicable.

Every test maps to a Spec acceptance criterion.

## 13. Git / Repository Strategy

Feature branch:

```text
feature/employee-internal-transfer
```

Implementation remains traceable to the feature slug and task IDs. Commit messages should reference task IDs where appropriate.

## 14. AI Usage

Use small, task-scoped prompts. Each prompt should reference the task ID, relevant acceptance criteria and only the required context.

Example:

```text
Implement employee-internal-transfer.TXX.

Satisfy:
- employee-internal-transfer.ACXX

Scope:
- <specific files/task>

Do not invent unresolved business rules.
Run the relevant tests and report the result.
```

Do not ask the agent to implement the whole feature in one prompt.

## 15. Explicitly Deferred

- Real backend APIs.
- Database implementation.
- Real HR/Organisation/Payroll/IT/Facilities integrations.
- Production authentication/authorization implementation.
- Actual downstream orchestration.
- Production notification infrastructure.

## 16. ADRs

No significant ADR is required yet for the basic React/Vite frontend setup.

Create an ADR only when a significant architectural decision is made whose reversal would cause substantial rework.

## 17. Traceability

| Spec | Technical Plan |
|---|---|
| FR01 / AC01 | Transfer entry/request form |
| FR02 / AC02 | Department/business-unit field |
| FR03 / AC02 | Location field |
| FR04 / AC02 | Role/job-position field |
| FR05 / AC02 | Effective-date field |
| FR06 / AC03 | Optional reason |
| FR07 / AC04, AC05, AC11 | Submission + validation + duplicate handling |
| FR08 / AC06 | Status view |
| FR09 / AC07 | Pending actions |
| FR10 / AC08, AC10 | Progress + failure representation |
| AC09 / SEC02 | Ownership/access handling |
| AC12 | Not-found/access-denied handling |

## 18. Plan Verification

- **Spec alignment:** PASS — plan is derived from the approved Spec.
- **Scope:** PASS — frontend-only implementation is explicit.
- **Integration:** Defined at frontend boundary; real integrations deferred.
- **Data:** Frontend data aligned to Spec; backend persistence deferred.
- **Testing:** Test-first planned and mapped to ACs.
- **Security:** Frontend and future backend responsibilities separated.
- **Constitution:** No project-specific thresholds are invented because the project Constitution currently contains placeholders.

## 19. Status

**Phase 1 Complete / Phase 2 Enhancement Addendum Attached — 2026-09-16**

---

## 20. Phase 2 Enhancement Plan Addendum

### 20.1 Objective & Overview
Phase 2 expanded the initial single-journey implementation into a comprehensive Employee Portal prototype, establishing application layout, demo authentication, employee and admin dashboards, global UI polish, and full regression testing.

### 20.2 Phase 2 Task Breakdown Summary
- **P2-T01 — Architecture & Navigation Shell:** Designed and implemented responsive `Navbar`, application header, footer, and navigation frame.
- **P2-T02 — Login Page & Demo Authentication:** Built accessible multi-role Login page with quick-fill demo credentials (`employee@onepoint.demo`, `admin@onepoint.demo`).
- **P2-T03 — Session Handling & Logout:** Created `authService.js` for `sessionStorage`-backed authentication, role guards, and logout handling.
- **P2-T04 — Employee Dashboard:** Built `EmployeeDashboard.jsx` featuring quick navigation cards, active request summary, and internal transfer launch point.
- **P2-T05 — Admin Dashboard & Data Boundary:** Implemented `AdminDashboard.jsx`, `adminService.js`, KPI metrics cards, searchable/filterable transfer request table, status badges, and request details modal.
- **P2-T06 — Global UI/UX Polish & Accessibility Audit:** Refined visual design system (Tailwind tokens, focus indicators, aria attributes) and verified full responsiveness.
- **P2-T07 — Final E2E Feature Validation:** Validated end-to-end user flows, regression suite (125/125 passing tests), and Vite production build.

### 20.3 Testing Strategy Baseline
Automated test suite expanded from 68 tests (Phase 1 baseline) to 125 passing tests across 9 test files, preserving 100% pass rate on all Phase 1 tests.

