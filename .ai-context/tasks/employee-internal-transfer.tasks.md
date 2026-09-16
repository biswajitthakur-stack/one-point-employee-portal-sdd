# Employee Internal Transfer — Day 6 Tasks

**Task Set ID:** `employee-internal-transfer`  
**Feature:** Employee Internal Transfer Digital Journey  
**Status:** Draft — Day 6  
**Gate 1:** Approved by PM  
**Plan:** `employee-internal-transfer.plan.md` — Day 5 approved  
**Lifecycle:** Plan → Tasks → Test First → Implementation

## 1. Tasking Rules

These tasks are derived from the Gate 1 approved Specification and Day 5 Technical Plan.

- Each task has an independently verifiable outcome.
- Feature tasks map to approved Acceptance Criteria.
- Day 7 follows a test-first sequence: write/update tests before implementation.
- The mock JSON/service boundary must remain replaceable by a future REST API.
- No backend, database, enterprise integration, production authentication, or notification implementation.
- Do not invent unresolved business behaviour.

## 2. Dependency Flow

```text
T01 Frontend Environment
        |
        v
T02 Feature Page & Flow Shell
        |
        +------> T03 Transfer Request Form
        |              |
        |              v
        |        T04 Form Validation
        +--------------+
                       v
              T05 Mock Data & Service
                       |
                       v
              T06 Submit Request State
                       |
                       v
              T07 Status & Progress
                       |
                       v
              T08 Failure / Error States
                       |
                       v
              T09 Accessibility Validation
                       |
                       v
              T10 End-to-End Validation
```

# 3. Task Definitions

## T01 — Initialize Frontend Development Environment

**Task ID:** `employee-internal-transfer.T01`

**Objective:** Prepare the React/Vite/JavaScript/Tailwind frontend and testing environment required for the feature, without implementing business functionality.

**Scope**
- Confirm React + Vite + JavaScript project structure.
- Configure Tailwind CSS.
- Configure the selected Vite-compatible testing framework and React Testing Library.
- Confirm the basic application entry point runs.

**Out of Scope**
- Transfer UI, business logic, mock transfer records, feature-specific tests.

**Dependencies:** Project initialization repository.

**Traceability:** Day-5 Plan — Technology Stack / Project Structure / Testing Strategy. No business AC; infrastructure prerequisite.

**Verification**
- Development server starts.
- Test tooling is available.
- No feature behaviour is introduced.

**Definition of Done**
- Frontend environment is runnable.
- Tailwind and test tooling are available.
- No business feature is implemented.

---

## T02 — Create Internal Transfer Feature Page and Flow Shell

**Task ID:** `employee-internal-transfer.T02`

**Objective:** Create the page/component structure for the approved Employee Internal Transfer journey.

**Scope**
- Add the Internal Transfer page.
- Create the feature component area under `src/components/internal-transfer/`.
- Establish placeholders/state boundaries for initiation, request form, status, progress, and pending actions.
- Keep presentation separate from service/data access.

**Out of Scope:** Final business validation rules, backend/API implementation, enterprise integration.

**Dependencies:** T01.

**Traceability:** Spec FR01–FR08; AC01–AC12 as applicable; Plan UI Flow / Technical Structure.

**Verification**
- Page renders without runtime errors.
- Main feature sections can be reached through the intended flow.
- Presentation does not directly access JSON data.

**Definition of Done**
- Page and component boundaries exist.
- Flow structure is ready for test-first implementation.

---

## T03 — Implement Transfer Request Form Structure

**Task ID:** `employee-internal-transfer.T03`

**Objective:** Build the form structure using only approved transfer information.

**Scope**
- Department.
- Location.
- Role.
- Effective date.
- Optional reason.
- Submission action.
- React-local form state where appropriate.
- Accessible labels and controls.

**Out of Scope:** Additional fields, backend persistence, undocumented enterprise validation.

**Dependencies:** T02.

**Traceability:** Spec FR02–FR05; AC02–AC05; Plan UI Flow / State / Accessibility.

**Test Expectations**
- Approved fields render.
- Optional reason remains optional.
- Submission action is accessible.

**Definition of Done**
- Form is independently renderable/testable.
- Relevant Day-7 tests are identified.

---

## T04 — Implement Approved Form Validation

**Task ID:** `employee-internal-transfer.T04`

**Objective:** Implement only validation rules supported by the approved Specification.

**Scope**
- Required transfer information.
- Effective-date requirements defined in the Specification.
- Clear validation feedback.
- Prevent invalid submission.

**Out of Scope:** New business rules, hidden assumptions, server-side validation.

**Dependencies:** T03.

**Traceability:** Spec FR03–FR05; AC03–AC05; Plan Validation / Error Handling.

**Test Expectations**
- Missing required data produces the expected validation state.
- Valid input can proceed.
- Optional reason does not block submission.

**Definition of Done**
- Validation is deterministic and testable.
- No undocumented business rule is added.

---

## T05 — Create Mock Data and Service Boundary

**Task ID:** `employee-internal-transfer.T05`

**Objective:** Create the controlled frontend mock-data and service boundary representing the future API integration.

**Scope**
- `src/data/internal-transfer.json`
- `src/services/internalTransferService.js`
- Keep UI independent from direct JSON access.
- Represent the approved/proposed API contract at the service boundary.
- Support request/status/progress data required by the approved journey.

**Out of Scope:** Real REST API, database, HR/Organisation/Payroll/IT/Facilities integration, authentication.

**Dependencies:** T01.

**Traceability:** Spec API01–API03; FR06–FR08; AC06–AC12 as applicable; Plan API/Data Boundary / Mock JSON Strategy.

**Important:** API endpoints/status codes are proposed technical contract decisions recorded in the Specification, not independently invented business requirements.

**Test Expectations**
- Service can be called independently from presentation.
- Mock data supports expected operations.
- Failure states can be represented without a backend.

**Definition of Done**
- Mock data exists in the planned location.
- Service boundary exists.
- UI does not directly read JSON.

---

## T06 — Implement Submission and Request State

**Task ID:** `employee-internal-transfer.T06`

**Objective:** Connect the validated form to the service boundary and represent the approved submission lifecycle.

**Scope**
- Submit validated form data through `internalTransferService`.
- Represent successful submission.
- Retain request identifier/data needed for status.
- Provide loading/submission state.

**Out of Scope:** Real persistence, backend processing, notifications, enterprise orchestration.

**Dependencies:** T04, T05.

**Traceability:** Spec FR06–FR07; AC06–AC07; Plan UI Flow / Service Boundary / State Management.

**Test Expectations**
- Valid request calls the service.
- Successful response moves UI to the appropriate status state.
- Submission state is handled predictably.

**Definition of Done**
- Submission uses only the service boundary.
- Success state is testable.

---

## T07 — Implement Request Status, Progress, and Pending Actions

**Task ID:** `employee-internal-transfer.T07`

**Objective:** Display approved post-submission status and progress information.

**Scope**
- Request status.
- Progress.
- Pending actions where applicable.
- Use service-provided data.
- Keep presentation ready for future REST responses.

**Out of Scope:** New workflow transitions, enterprise orchestration, notifications.

**Dependencies:** T06.

**Traceability:** Spec FR07–FR08; AC07–AC11; Plan UI Flow / Data Boundary.

**Test Expectations**
- Status renders from returned data.
- Progress renders from returned data.
- Pending actions appear only when represented by service data.

**Definition of Done**
- Views are independently testable.
- No new workflow rule is introduced.

---

## T08 — Implement Failure and Error States

**Task ID:** `employee-internal-transfer.T08`

**Objective:** Handle documented failure scenarios safely.

**Scope**
- Validation failure.
- Service/mock failure.
- Unsuccessful submission.
- Clear recovery path where supported by the Specification.
- Do not expose sensitive/internal error information.

**Out of Scope:** Backend retry infrastructure, monitoring, undocumented recovery rules.

**Dependencies:** T05, T06, T07.

**Traceability:** Spec Failure Handling / SEC01–SEC06; relevant ACs; Plan Error Handling / Security.

**Test Expectations**
- Failure states render predictably.
- Internal error details are not exposed.
- Approved recovery actions work.

**Definition of Done**
- Failure paths are tested.
- Error presentation is consistent and safe.

---

## T09 — Accessibility Validation for the Feature Journey

**Task ID:** `employee-internal-transfer.T09`

**Objective:** Validate accessibility across the feature journey.

**Scope**
- Form labels/control associations.
- Keyboard operation.
- Focus handling for validation/errors where needed.
- Accessible status/progress communication.
- Accessible error messaging.
- Semantic structure.

**Out of Scope:** Unrelated portal redesign or unsupported accessibility claims.

**Dependencies:** T03, T04, T07, T08.

**Traceability:** Plan Accessibility Strategy; applicable Specification requirements/ACs.

**Test Expectations**
- Relevant accessibility behaviour has automated and/or manual verification.
- Errors/status changes are not communicated only visually.

**Definition of Done**
- Feature accessibility checks are documented.
- Issues are fixed or recorded.

---

## T10 — End-to-End Feature Validation and Traceability Check

**Task ID:** `employee-internal-transfer.T10`

**Objective:** Validate the complete approved frontend journey and its SDD traceability.

**Scope**
- Happy path.
- Key validation/failure paths.
- Status/progress/pending actions.
- Security/accessibility expectations.
- Spec → AC → Task → Test traceability.
- Record unresolved issues/deviations.

**Out of Scope:** Real enterprise integration, production deployment, backend implementation.

**Dependencies:** T02–T09.

**Traceability:** Spec FR01–FR10 and AC01–AC12; Plan Verification / Testing Strategy / Risks; Gate 2 preparation.

**Test Expectations**
- All applicable approved ACs have tests.
- No unexplained failures remain.
- Deviations are documented.

**Definition of Done**
- Approved journey is validated.
- Traceability is complete.
- Gate 2 evidence is ready.

# 4. Task-to-AC Traceability

| Task | Primary ACs |
|---|---|
| T01 | Infrastructure prerequisite; no business AC |
| T02 | AC01–AC12 (flow shell) |
| T03 | AC02–AC05 |
| T04 | AC03–AC05 |
| T05 | AC06–AC12 |
| T06 | AC06–AC07 |
| T07 | AC07–AC11 |
| T08 | Relevant failure/validation ACs |
| T09 | Accessibility expectations across applicable ACs |
| T10 | AC01–AC12 |

# 5. Day 7 Test-First Execution Order

For each implementation task:

1. Confirm the relevant AC.
2. Write/update the test that proves the AC.
3. Run the test and observe the expected failing state where applicable.
4. Implement the smallest change required.
5. Run the test again.
6. Refactor without changing approved behaviour.
7. Record test evidence and deviations.

Do not implement first and create tests afterward merely to make the suite pass.

# 6. Task Definition of Done

A task is complete only when:
- Its scope is implemented.
- Its out-of-scope boundary is respected.
- Relevant tests exist and pass.
- Relevant ACs are traceable.
- No undocumented business rule was introduced.
- Relevant accessibility/security expectations are addressed.
- The service/data boundary remains compatible with the Plan.
- Ambiguities/deviations are documented.

---

# 7. Phase 2 Tasks & Consolidation Record

## Phase 2 Task Definitions & Status

| Task ID | Task Name | Status | Key Deliverables |
|---|---|---|---|
| P2-T01 | Architecture & Navigation Shell | Completed | Header, Navbar, Footer, App Shell, Layout structure |
| P2-T02 | Login Page & Demo Authentication | Completed | Login component, demo accounts selection, form handling |
| P2-T03 | Session Handling & Logout Refinements | Completed | `authService.js`, `sessionStorage` sync, protected routes, logout |
| P2-T04 | Employee Dashboard | Completed | `EmployeeDashboard.jsx`, quick actions, active transfer card, stats |
| P2-T05 | Admin Dashboard (Consolidated Task) | Completed | `AdminDashboard.jsx`, `adminService.js`, static JSON boundary, KPI metrics cards, request table, search, filters, status badges, details modal |
| P2-T06 | Global UI/UX Polish & Accessibility Audit | Completed | Design system audit, focus rings, ARIA roles, responsive check |
| P2-T07 | Final E2E Validation & Traceability Check | Completed | 125/125 tests passing, Vite build clean, full manual QA passed |

## P2-T05 Consolidation Note
**Task Consolidation Record:** In accordance with the Phase 2 execution scope, **P2-T05** was expanded to incorporate all sub-features of the Admin Dashboard within a single execution cycle:
1. Admin static JSON data boundary (`adminService.js`)
2. Admin KPI metrics calculation (Total Requests, Pending, Approved, Rejected)
3. Transfer request data table
4. Search functionality (by employee name, request ID, department)
5. Status filtering (All, Pending, Approved, Rejected)
6. Color-coded status badges
7. Request details interactive modal
8. Role-based route guard for Admin view
This consolidation prevented feature fragmentation and ensured consistent data flow between `adminService.js` and `AdminDashboard.jsx`.

