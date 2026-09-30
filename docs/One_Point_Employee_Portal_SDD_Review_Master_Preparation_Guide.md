# One-Point Employee Portal

### SDD Review – Master Preparation Guide & Complete Test Case Documentation

**Methodology: ** Specification-Driven Development / Delivery (SDD)

**Coverage: ** Project + SDD Process + Technical + Quality & Testing + Reviewer Q&As

**CRITICAL TERMINOLOGY RULE: ** For this project, SDD means Specification-Driven Development / Delivery, as stated by HR. Do not describe it as Software Design Document during the review.


## 1. 60-Second Project Explanation

The One-Point Employee Portal is a frontend Employee Portal focused on the Internal Transfer journey. I followed a Specification-Driven Development / Delivery (SDD) approach. I started by understanding and documenting the business requirement, then prepared the Specification, Acceptance Criteria, Technical Plan, Architecture, Task Breakdown, and Test Cases. Phase 1 implemented and validated the Employee Internal Transfer journey. Phase 2 expanded it into a full Employee and Admin portal featuring demo authentication, session handling, Employee Dashboard, Admin Dashboard with KPI metrics and search/filtering, request details modal, responsive layout, and global accessibility polish. The current implementation is strictly frontend-only with static JSON data and session-based demo authentication. The final reported test result was 125/125 automated tests passing across 9 test files with a successful production build.


## 2. Complete SDD Lifecycle Steps

- **Step 1: ** Understand the business problem and user journey.
- **Step 2: ** Create the Business Requirements Document (BRD) and document the business need.
- **Step 3: ** Create the Feature Specification and define functional behavior.
- **Step 4: ** Define Functional Requirements (FR), Business Rules (BR), Acceptance Criteria (AC), scope, assumptions, and failure scenarios.
- **Step 5: ** Define API/service boundary proposals and data expectations.
- **Step 6: ** Create the Technical Plan and Architecture document.
- **Step 7: ** Break approved work into tasks with dependencies and traceability.
- **Step 8: ** Use test-first execution for planned tasks.
- **Step 9: ** Implement the frontend UI components and service boundaries.
- **Step 10: ** Validate normal flows, form validation, error handling, accessibility, and responsive behavior.
- **Step 11: ** Run automated test suites (Vitest + RTL) and production build checks.
- **Step 12: ** Perform final E2E/traceability review and maintain documentation/prompt logs.

## 3. Document Understanding

- **What is a BRD? ** Business Requirements Document. It explains what the business needs, the business problem, target users, and expected outcome. Easy memory: BRD = what the business needs and why.
- **What is a Feature Specification? ** It turns the business need into detailed feature behavior, requirements, assumptions, scope, acceptance criteria, failure scenarios, and traceability.
- **What are Functional Requirements? ** They describe specific capabilities and actions the system must perform (e.g. submit request, filter table).
- **What are Business Rules? ** They describe rules, constraints, or policies the feature must follow (e.g. required fields, valid effective date).
- **What are Acceptance Criteria? ** Clear, testable conditions that must be satisfied for a requirement or feature to be accepted.
- **What is a Technical Plan? ** It explains the technical approach, frontend strategy, validation rules, security considerations, accessibility, testing, AI usage, and deferred scope.
- **What is Architecture? ** It describes the main application structure and how UI, services, session/authentication, and static data boundaries relate.
- **What is a Task Breakdown? ** It divides approved work into smaller implementation tasks with explicit dependencies, tests, and completion criteria.
- **What are Test Cases? ** They define how expected behavior and requirements will be verified through automated or manual verification steps.
- **What is Traceability? ** It connects requirements to rules, acceptance criteria, tasks, implementation, and tests (BRD -> Spec -> AC -> Task -> Code -> Test).

## 4. Phase 1 Implementation Summary

Phase 1 focused on the core Employee Internal Transfer digital journey and establishing the SDD lifecycle from requirements through test-first implementation and verification.

- Employee opens the Internal Transfer request form.
- Department, Location, Role, and Effective Date are required fields; Reason is optional.
- Client-side form validation prevents incomplete or invalid submissions.
- Request submission routes through internalTransferService.js service boundary.
- Request status, overall progress, and pending stakeholder actions are displayed.
- Failure, error masking, access control (401/403/404/409/500), and recovery scenarios were verified.
- Accessibility (labels, aria-invalid, aria-describedby, focus), responsive behavior, and 68 initial automated unit tests were established.

## 5. Phase 2 Implementation Summary

- **P2-T01: ** Architecture & Navigation Shell — Shared portal shell, Navbar, Header, Footer, and role-aware view structure.
- **P2-T02: ** Login Page & Demo Authentication — Employee/Admin login tabs, demo credential quick-fill helpers, validation, and role-based redirection.
- **P2-T03: ** Session Handling & Logout — authService.js for sessionStorage state management, logout handling, and protected route guards.
- **P2-T04: ** Employee Dashboard — EmployeeDashboard.jsx featuring profile card, statistics overview, quick actions, and Internal Transfer launch point.
- **P2-T05 (Consolidated): ** Admin Dashboard — AdminDashboard.jsx and adminService.js providing KPI metrics cards, request table, text search, status filters, badges, and request details modal.
- **P2-T06: ** Global UI/UX Polish & Accessibility Audit — Focus indicators, keyboard navigation, modal Escape key dismiss, screen-reader headings, and mobile responsiveness.
- **P2-T07: ** Final E2E Validation & Traceability Check — Regression suite validation (125/125 passing tests), Vite production build verification (<500ms), and final SDD traceability audit.

## 6. Technical Architecture & Stack Questions

- **What technology did you use? ** React 18, Vite, JavaScript (ES6+), and Tailwind CSS for the frontend, with static JSON data files, frontend service boundaries, and Vitest + React Testing Library.
- **Why React? ** It supports component-based UI development, state isolation, fast rendering, and reusable portal components.
- **Why Vite? ** It provides an extremely fast development server and optimized production bundler (<650ms build time).
- **Why Tailwind CSS? ** It provides utility-first CSS classes for rapid, consistent, and responsive UI implementation without custom CSS overhead.
- **What is the service layer? ** An abstraction boundary between UI components and data providers. UI components call service methods (e.g. createTransferRequest) rather than directly reading raw JSON data files.
- **How is data handled? ** The current build uses controlled static JSON data (internal-transfer.json, employee-dashboard.json, admin-dashboard.json) exposed through service boundaries. It does not connect to a live backend database.
- **Is authentication real? ** No. It is demo authentication using pre-configured demo credentials (employee@onepoint.demo, admin@onepoint.demo) stored in sessionStorage.

## 7. Authentication, Validation & Security Questions

- **How are roles handled? ** The active session stores the user's role ('employee' or 'admin'). Application routes and components use role guards to render the appropriate dashboard and restrict unauthorized view access.
- **What happens on logout? ** authService.logout() clears sessionStorage, resets session state, and redirects the user immediately to the Login view.
- **What fields are required? ** Department, Location, Role, and Effective Date. Reason remains strictly optional.
- **Why validation? ** To prevent invalid or incomplete requests from submitting, give immediate user feedback, and maintain data consistency.
- **What failure scenarios were considered? ** Form validation failures, duplicate submission attempts (409), unauthenticated sessions (401), unauthorized access (403), request not found (404), and simulated downstream failures (500).
- **What do 401/403/404/409/500 mean? ** 401 = Unauthorized (no active session), 403 = Forbidden (wrong role or wrong owner), 404 = Not Found (invalid request ID), 409 = Conflict (duplicate request), 500 = Internal Service Error.
- **How are errors handled? ** Show safe, user-friendly UI messages and recovery/retry paths. Internal error stack traces, raw exception strings, and sensitive system details are strictly masked.
- **Is this production-ready? ** The frontend implementation is complete and fully verified, but production readiness requires real REST/GraphQL APIs, database persistence, OAuth2/SAML single sign-on, server-side authorization, and HTTPS transport security.

## 8. Accessibility & Responsive Design Questions

- **Why accessibility? ** To ensure the portal is usable for all users, including non-mouse users and screen-reader users, adhering to WCAG 2.1 AA design patterns.
- **What accessibility improvements were made? ** Associated <label> elements, explicit aria-invalid and aria-describedby attributes, focus trapping and Escape key closing on modals, aria-live region status announcements, and high-contrast visible focus rings.
- **Is it responsive? ** Yes. Desktop (1280px+), Tablet (768px-1024px), and Mobile (<768px) viewports were tested. Navbar collapses to mobile menu, grid cards stack vertically, and tables support horizontal scrolling.
- **Did you claim full WCAG compliance? ** No. State that accessibility best practices and verification checks were implemented. Do not claim formal WCAG 2.1 AA certification without an official third-party audit.

## 9. Testing & Quality Assurance Questions

- **How did you test? ** Automated unit/integration testing with Vitest and React Testing Library, combined with manual end-to-end browser walkthroughs of Employee and Admin journeys.
- **What is the final test result? ** 125/125 automated tests passing across 9 test files, with 0 failing or skipped tests.
- **Was the production build verified? ** Yes. npm run build executed successfully in 645ms with 0 bundle or code warnings.
- **What did you manually verify? ** Employee login, Admin login, logout, Employee Dashboard cards, Internal Transfer form submission & validation, Admin Dashboard metrics, text search, status filters, request details modal, responsive layout, and keyboard navigation.
- **What is test-first development? ** Writing the test specification and failing assertion first to define expected behavior, then implementing the code to make the test pass.

## 10. AI & Antigravity Usage Questions

- **Did you use AI? ** Yes. Google Antigravity AI assistant was used for code generation, test creation, architectural planning, and documentation updates within the SDD workflow.
- **Did AI do everything? ** No. I authored prompts, reviewed code changes, checked requirements, ran automated tests, performed manual QA, and verified traceability.
- **Why keep prompt logs? ** To maintain transparent, verifiable audit trails of all AI interactions, instructions, and task evolutions across the project lifecycle.
- **Who is responsible for the final output? ** I am fully responsible for validating that the code and documentation satisfy the approved specifications and quality baselines.

## 11. Git, Version Control & Delivery Questions

- **Where is the repository? ** Committed locally on feature/employee-internal-transfer branch and prepared for remote push to https://github.com/biswajitthakur-stack/one-point-employee-portal-sdd.git.
- **Why use Git? ** To track changes, maintain incremental history, support branch safety, and enable team collaboration.
- **Current project status? ** Phase 1 and Phase 2 are 100% complete within the approved frontend scope.
- **What remains for future scope? ** Real backend REST API development, SQL database, OAuth2 enterprise authentication, HRIS integration, and cloud deployment.

## 12. Difficult Reviewer Questions & Tactical Answers

- **Why didn't you implement a real backend? ** The approved project scope was frontend-only. I architected decoupled service boundaries (internalTransferService.js, adminService.js, authService.js) so real API calls can replace mock data in the future without changing UI components.
- **How do you know all requirements were satisfied? ** I established end-to-end traceability linking BRD requirements to Feature Spec FRs, Acceptance Criteria, implementation tasks, code files, and automated unit tests.
- **What would you change for production? ** Replace demo auth with OAuth2/JWT tokens, implement secure HTTPS REST/GraphQL APIs, add SQL/NoSQL database persistence, enforce server-side validation and role-based access control (RBAC), and configure CI/CD deployment pipelines.
- **What if a requirement changes mid-project? ** Update the BRD and Feature Specification first, update Acceptance Criteria, revise the Technical Plan and Task Breakdown, write/update tests, and implement code changes.
- **What was the main benefit of SDD? ** SDD provided clear alignment from business goals to code, eliminated ambiguity before writing code, enforced test coverage, and prevented scope creep.

## 13. Full Traceability Pipeline Example

- **1. BRD Requirement: ** Employee needs to submit an internal department transfer request.
- **2. Feature Spec: ** FR02-FR05: Request form must capture Department, Location, Role, Effective Date, and optional Reason.
- **3. Business Rule: ** Required transfer fields must be validated prior to submission.
- **4. Acceptance Criteria: ** AC03 / AC04: Omission of required fields blocks submission and displays accessible inline errors.
- **5. Implementation Task: ** T04: Implement approved form validation & error messaging.
- **6. Code Implementation: ** InternalTransferPage.jsx + internalTransferService.js validation logic.
- **7. Automated Test: ** displays validation error when departmentId is missing (Test #12 in InternalTransferPage.test.jsx).
- **8. Verification Result: ** PASSED (125/125 test suite pass).

## 14. 15 Core Review Questions to Memorize

- 1. What is the One-Point Employee Portal project?
- 2. What does SDD mean in this project? (Specification-Driven Development / Delivery)
- 3. What is the business problem solved by this project?
- 4. What is a BRD vs a Feature Specification?
- 5. What are Acceptance Criteria and how are they used?
- 6. What is traceability and why is it important?
- 7. What was delivered in Phase 1?
- 8. What was delivered in Phase 2?
- 9. Why is the current project frontend-only?
- 10. How does demo authentication and session handling work?
- 11. What form fields are required vs optional in Internal Transfer?
- 12. How did you test accessibility and responsive design?
- 13. What does 125/125 tests passing mean?
- 14. Did you test a real backend or real database?
- 15. What steps would be required to make this production-ready?

## 15. Final 30-Second Elevator Answer

I delivered the One-Point Employee Portal using a Specification-Driven Development / Delivery approach. I started by documenting business requirements in the BRD, then created detailed specifications, acceptance criteria, technical plans, architecture, tasks, and test cases. Phase 1 delivered the Employee Internal Transfer journey. Phase 2 expanded the solution into an Employee and Admin portal featuring demo authentication, session management, dashboards, request search/filtering, request details, responsive layouts, and accessibility polish. The frontend prototype uses static JSON boundaries, and the quality was proven with 125/125 passing automated tests and a clean production build.


## 16. Strategic Reviewer Tips

- **Tip 1 (Terminology): ** Always state: Specification-Driven Development / Delivery. Never say Software Design Document.
- **Tip 2 (Answer Structure): ** Give a direct 1-2 sentence answer first, then offer technical details if prompted.
- **Tip 3 (Honesty): ** Be transparent that backend APIs, database persistence, and OAuth are future scope.
- **Tip 4 (Accessibility): ** Emphasize that accessibility checks were performed, but do not claim official WCAG certification.
- **Tip 5 (Document Explanation): ** Explain its purpose first, then describe its key contents.

## 17. Complete Test Case Documentation & Module Matrix


### 17.1 Explanation of the 125/125 Automated Test Suite Result

The final release-readiness verification confirmed 125/125 automated tests passing across 9 test files executed via Vitest and React Testing Library (npm test).

**Scope & Significance: ** What 125/125 Tests Passing Means in This Project:

- It validates that all frontend component rendering, user interactions, form validation logic, local state updates, session authentication flows, role-based route protection, modal interactions, keyboard focus management, ARIA attributes, and service layer boundary contracts work exactly as specified.
- It proves 100% regression stability: all 68 original Phase 1 tests continue passing alongside 57 new Phase 2 portal tests.
- It verifies that service boundaries (internalTransferService.js, authService.js, adminService.js) handle success, validation errors, and failure responses predictably.
**Explicit Boundary Disclaimer: ** What 125/125 Tests Passing Does NOT Mean:

- It does NOT represent backend REST API server testing, SQL database persistence testing, network latency testing, or production OAuth2/SAML authentication server integration testing.
- The project is strictly frontend-only with static JSON datasets. All tests operate within the client-side JavaScript execution environment.

### 17.2 Overview of the 9 Test Files


| Test File | Module Focus | Tests | Phase / Task | Key Verification Scope |
| --- | --- | --- | --- | --- |
| tests/environment.test.jsx | Environment Setup | 1 | Phase 1 / T01 | Verifies React, DOM environment, and testing framework baseline. |
| tests/internal-transfer/internalTransferService.test.js | Transfer Service Boundary | 17 | Phase 1 / T05 | Validates mock lookup retrieval, form payload validation, idempotency (409), session derivation (SEC01), access denial (403), and progress status (UT13-UT24). |
| tests/internal-transfer/InternalTransferPage.test.jsx | Transfer UI & Flow | 50 | Phase 1 / T02-T10 | Validates form fields, required validation, optional reason, submission loading, status/progress display, pending actions, error masking (SEC04), accessibility (ARIA/focus), and E2E happy/failure paths (UT01-UT12). |
| tests/components/NavigationShell.test.jsx | Portal Navigation Shell | 8 | Phase 2 / P2-T01 | Validates App header, Navbar, Sidebar, role badges, active link highlight, and responsive mobile navigation drawer. |
| tests/auth/authService.test.js | Authentication Service | 8 | Phase 2 / P2-T02, P2-T03 | Validates login credential matching, demo session creation, sessionStorage persistence, logout cleanup, role checking, and protected route access. |
| tests/pages/LoginPage.test.jsx | Login Page Component | 9 | Phase 2 / P2-T02 | Validates Login form layout, role tab toggles (Employee/Admin), required field validation, password show/hide toggle, demo quick-fill helpers, invalid credential errors, and successful login callbacks. |
| tests/pages/EmployeeDashboard.test.jsx | Employee Dashboard Page | 15 | Phase 2 / P2-T04 | Validates profile summary card, quick stats, quick action navigation to Internal Transfer, recent activity section, accessible headings, and role-based access redirection. |
| tests/pages/AdminDashboard.test.jsx | Admin Dashboard Page | 12 | Phase 2 / P2-T05 | Validates KPI summary stat cards, request table, status badges, view details modal open/close, text search filtering, status dropdown filtering, empty state, and unauthorized employee redirection. |
| tests/components/UIPolishAccessibility.test.jsx | Global UX & Accessibility | 5 | Phase 2 / P2-T06 | Validates focus ring indicators, keyboard tab order, ARIA dialog roles, modal Escape key closing, screen-reader headings, and mobile table horizontal scrolling. |



### 17.3 Module A: Internal Transfer Test Cases (Service & UI - 67 Tests Total)

Covers transfer request entry, field validation, submission lifecycle, status display, pending stakeholder actions, progress tracking, failure handling, and security boundaries.


| Test ID | Module | Req / AC | Scenario | Preconditions | Input | Expected Result | Status | Phase/Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-IT-01 | Lookup Data | AC02 / FR02-04 | Fetch lookup options | Service initialised | getTransferOptions() | Returns arrays for departments, locations, roles | Passed | Phase 1 / T05 |
| TC-IT-02 | Form Render | AC01 / FR01 | Render request form | Form loaded | Render page | Form renders with Department, Location, Role, Date, Reason | Passed | Phase 1 / T03 |
| TC-IT-03 | Validation | AC03 / UT13 | Missing Department | Form loaded | Submit with empty Dept | Validation error shown; submit blocked; aria-invalid=true | Passed | Phase 1 / T04 |
| TC-IT-04 | Validation | AC03 / UT14 | Missing Location | Form loaded | Submit with empty Location | Validation error shown; submit blocked; focus moved to field | Passed | Phase 1 / T04 |
| TC-IT-05 | Validation | AC03 / UT15 | Missing Role | Form loaded | Submit with empty Role | Validation error shown; submit blocked | Passed | Phase 1 / T04 |
| TC-IT-06 | Validation | AC03 / UT16 | Missing Date | Form loaded | Submit with empty Date | Validation error shown; submit blocked | Passed | Phase 1 / T04 |
| TC-IT-07 | Validation | AC03 / UT17 | Optional Reason | Form loaded | Submit without Reason | Validation passes; submission proceeds successfully | Passed | Phase 1 / T04 |
| TC-IT-08 | Submission | AC04 / UT04 | Valid Submission | Valid inputs filled | Click Submit Request | Service returns requestId; UI displays status view | Passed | Phase 1 / T06 |
| TC-IT-09 | Status View | AC06 / UT06 | Status Display | Request submitted | Render status view | Displays status (Submitted/Under Review) & request ID | Passed | Phase 1 / T07 |
| TC-IT-10 | Pending Actions | AC07 / UT07 | Stakeholder Actions | Request submitted | Render status view | Displays Manager Approval & HR Review pending items | Passed | Phase 1 / T07 |
| TC-IT-11 | Progress | AC08 / UT08 | Combined Progress | Request submitted | Render status view | Single progress view combining status timeline & pending actions | Passed | Phase 1 / T07 |
| TC-IT-12 | Downstream Failure | AC10 / UT10 | Downstream Error | Mock downstream fail | Render status view | Status correctly reflects failure; NOT shown as success | Passed | Phase 1 / T07 |
| TC-IT-13 | Idempotency | AC11 / UT19 | Duplicate Request | Request exists | Submit identical payload | Returns 409 Conflict error; prevents duplicate record | Passed | Phase 1 / T08 |
| TC-IT-14 | Security | SEC01 / AC09 | Session Isolation | Active session | Submit form with spoof ID | Service ignores client employeeId; derives from session | Passed | Phase 1 / T08 |
| TC-IT-15 | Error Masking | SEC04 / UT37 | Internal Server Error | Service throws 500 | Submit request | Displays friendly error; masks stack trace and internal details | Passed | Phase 1 / T08 |



### 17.4 Module B: Authentication & Session Test Cases (17 Tests Total)

Covers Login rendering, credential validation, demo quick-fill helpers, session creation, sessionStorage sync, logout, and protected route access.


| Test ID | Module | Req / AC | Scenario | Preconditions | Input | Expected Result | Status | Phase/Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-AUTH-01 | Login Form | P2-T02 | Render Login Page | Unauthenticated | Navigate to /login | Renders title, role tabs, inputs, and demo helpers | Passed | Phase 2 / P2-T02 |
| TC-AUTH-02 | Role Tabs | P2-T02 | Switch Role Tabs | Login page open | Click Admin tab | Role switches to Admin; updates quick-fill target | Passed | Phase 2 / P2-T02 |
| TC-AUTH-03 | Validation | P2-T02 | Empty Submit | Login page open | Click Sign In empty | Displays validation error for required email/password | Passed | Phase 2 / P2-T02 |
| TC-AUTH-04 | Demo Helper | P2-T02 | Employee Quick-Fill | Login page open | Click Employee Helper | Fills employee@onepoint.demo & demo password | Passed | Phase 2 / P2-T02 |
| TC-AUTH-05 | Demo Helper | P2-T02 | Admin Quick-Fill | Login page open | Click Admin Helper | Fills admin@onepoint.demo & demo password | Passed | Phase 2 / P2-T02 |
| TC-AUTH-06 | Login Auth | P2-T02 | Invalid Credentials | Login page open | Submit wrong password | Displays 'Invalid email or password' alert message | Passed | Phase 2 / P2-T02 |
| TC-AUTH-07 | Employee Login | P2-T02/T03 | Valid Employee Login | Login page open | Submit employee creds | Creates employee session; redirects to Employee Dashboard | Passed | Phase 2 / P2-T02 |
| TC-AUTH-08 | Admin Login | P2-T02/T03 | Valid Admin Login | Login page open | Submit admin creds | Creates admin session; redirects to Admin Dashboard | Passed | Phase 2 / P2-T03 |
| TC-AUTH-09 | Session Handling | P2-T03 | Session Storage Sync | User logged in | Reload page | Restores user identity & role from sessionStorage | Passed | Phase 2 / P2-T03 |
| TC-AUTH-10 | Logout | P2-T03 | User Logout | Active session | Click Logout button | Clears sessionStorage; redirects user immediately to Login | Passed | Phase 2 / P2-T03 |
| TC-AUTH-11 | Route Guard | P2-T03 | Unauthenticated Guard | No active session | Access /dashboard | Redirects to Login view; prevents unauthorized view | Passed | Phase 2 / P2-T03 |
| TC-AUTH-12 | Role Guard | P2-T03 | Employee Admin Guard | Employee session | Access /admin | Redirects to Employee Dashboard; prevents admin access | Passed | Phase 2 / P2-T03 |



### 17.5 Module C: Employee Dashboard Test Cases (15 Tests Total)

Covers profile summary card, quick statistics, quick action navigation, recent activity section, accessible headings, and route guards.


| Test ID | Module | Req / AC | Scenario | Preconditions | Input | Expected Result | Status | Phase/Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-EMP-01 | Profile Card | P2-T04 | Employee Overview | Employee logged in | View Dashboard | Displays employee name, department, role, location | Passed | Phase 2 / P2-T04 |
| TC-EMP-02 | Stats Cards | P2-T04 | Quick Metrics | Employee logged in | View Dashboard | Displays Active Requests, Total Submitted, Pending Actions | Passed | Phase 2 / P2-T04 |
| TC-EMP-03 | Quick Action | P2-T04 | Launch Transfer | Employee logged in | Click 'New Transfer Request' | Navigates directly to Internal Transfer form view | Passed | Phase 2 / P2-T04 |
| TC-EMP-04 | Recent Activity | P2-T04 | Request Activity | Employee logged in | View Dashboard | Renders recent request history & current status summary | Passed | Phase 2 / P2-T04 |
| TC-EMP-05 | Isolation | P2-T04 | No Admin Data | Employee logged in | View Dashboard | Admin metrics & global request list are strictly hidden | Passed | Phase 2 / P2-T04 |



### 17.6 Module D: Admin Dashboard Test Cases (12 Tests Total)

Covers KPI metrics cards, transfer request table, status badges, text search, status dropdown filtering, request details modal, and admin route protection.


| Test ID | Module | Req / AC | Scenario | Preconditions | Input | Expected Result | Status | Phase/Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-ADM-01 | KPI Metrics | P2-T05 | Admin Statistics | Admin logged in | View Admin Dashboard | Displays Total Requests, Pending, Approved, Rejected cards | Passed | Phase 2 / P2-T05 |
| TC-ADM-02 | Data Table | P2-T05 | Request Listing | Admin logged in | View Admin Dashboard | Renders table with Employee Name, Dept, Status, Date | Passed | Phase 2 / P2-T05 |
| TC-ADM-03 | Status Badges | P2-T05 | Color Badges | Admin logged in | View Admin Dashboard | Renders Pending (Yellow), Approved (Green), Rejected (Red) | Passed | Phase 2 / P2-T05 |
| TC-ADM-04 | Text Search | P2-T05 | Search Requests | Admin logged in | Type 'Sarah' in search | Filters table to show only matching employee requests | Passed | Phase 2 / P2-T05 |
| TC-ADM-05 | Status Filter | P2-T05 | Filter by Status | Admin logged in | Select 'Pending' filter | Filters table to show only Pending requests | Passed | Phase 2 / P2-T05 |
| TC-ADM-06 | Empty State | P2-T05 | Search No Match | Admin logged in | Type 'NonExistent' | Renders 'No requests found' clean empty state message | Passed | Phase 2 / P2-T05 |
| TC-ADM-07 | Details Modal | P2-T05 | Open Request Details | Admin logged in | Click 'View Details' | Opens modal displaying full request data & progress steps | Passed | Phase 2 / P2-T05 |
| TC-ADM-08 | Details Modal | P2-T05 | Close Request Details | Modal open | Click Close / press Esc | Closes modal dialog and returns focus to trigger button | Passed | Phase 2 / P2-T05 |



### 17.7 Module E: Accessibility & Responsive Test Cases (13 Tests Total)

Covers associated form labels, aria attributes, keyboard focus management, modal accessibility, aria-live region announcements, and responsive viewports.


| Test ID | Module | Req / AC | Scenario | Preconditions | Input | Expected Result | Status | Phase/Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-ACC-01 | Form Labels | P2-T06 | Control Association | Form rendered | Inspect form inputs | All controls have explicit <label> and unique accessible names | Passed | Phase 2 / P2-T06 |
| TC-ACC-02 | Error Focus | P2-T06 | Validation Focus | Invalid form | Click Submit Request | Focus moves automatically to first invalid input control | Passed | Phase 2 / P2-T06 |
| TC-ACC-03 | Modal Escape | P2-T06 | Keyboard Dismiss | Modal dialog open | Press Escape key | Dismisses modal dialog and restores focus to opener | Passed | Phase 2 / P2-T06 |
| TC-ACC-04 | Live Regions | P2-T06 | Status Announcement | State change | Submit form / filter | Uses aria-live=polite/assertive to announce status update | Passed | Phase 2 / P2-T06 |
| TC-ACC-05 | Focus Rings | P2-T06 | Visible Focus | Keyboard Tab navigation | Tab through controls | Renders high-contrast focus rings on focused interactive elements | Passed | Phase 2 / P2-T06 |
| TC-ACC-06 | Responsive Table | P2-T06 | Mobile Overflow | Mobile viewport (<768px) | Render Admin Table | Table container enables horizontal scrolling without breaking layout | Passed | Phase 2 / P2-T06 |



## 18. Test Cases – Reviewer Questions & Answers

This section provides concise, repository-backed answers for expected reviewer questions during the SDD Review.

Q: How did you define your test cases?

A: Test cases were derived directly from the Gate 1 approved Specification and Acceptance Criteria (AC01–AC12) during Phase 1, and from task completion criteria (P2-T01 to P2-T07) during Phase 2. Each test case targets a specific functional requirement, validation rule, error recovery state, accessibility attribute, or role permission.

Q: How are test cases related to Acceptance Criteria?

A: Every Acceptance Criterion maps 1-to-1 with one or more automated test cases. For example, AC03 (required field validation) maps directly to tests verifying that missing Department, Location, Role, or Date fields block submission, set aria-invalid=true, and display inline error messages.

Q: Can you explain one test case from the Internal Transfer feature?

A: In InternalTransferPage.test.jsx, Test #20 ('UT04: valid request submission calls createTransferRequest() and displays returned requestId and status') validates that when valid required inputs (Department, Location, Role, Effective Date) are provided, clicking Submit invokes the internalTransferService.js service boundary, displays a loading state, and transitions the UI to show the returned requestId and initial request status.

Q: What validation scenarios did you test?

A: I tested missing required fields (Department, Location, Role, Effective Date), clearing errors when inputs are corrected, optional reason submission (which must not block submission), duplicate request submission (409 Conflict), unauthenticated session submission (401), and invalid login credential validation.

Q: How did you test error handling?

A: I tested both client validation errors and service-level failure responses (401, 403, 404, 409, 500). Tests verify that error states present safe, user-friendly messages with recovery actions (e.g. Retry button), while masking raw exception strings, database details, and internal stack traces per SEC04.

Q: How did you test authentication?

A: In LoginPage.test.jsx and authService.test.js, tests verify Login form rendering, role tab switching between Employee and Admin, password visibility toggles, demo credential quick-fill helpers (employee@onepoint.demo / admin@onepoint.demo), invalid password error alerts, and successful session creation.

Q: How did you test role-based access?

A: Tests verify that an authenticated Employee session renders the Employee Dashboard and is blocked/redirected if attempting to access /admin. Conversely, an Admin session renders the Admin Dashboard. Unauthenticated users attempting to access protected routes are redirected immediately to the Login view.

Q: How did you test logout and session handling?

A: Tests verify that authService.logout() clears sessionStorage, resets application state, and redirects the user to the Login view. Tests also verify that reloading the page preserves active user identity and role from sessionStorage.

Q: How did you test the Admin Dashboard?

A: In AdminDashboard.test.jsx (12 tests), tests verify KPI summary cards, request table data rendering, status badges (Pending/Approved/Rejected), real-time text search filtering by employee name/dept, status dropdown filtering, clean empty search state, and modal open/close interactions.

Q: How did you test accessibility?

A: In UIPolishAccessibility.test.jsx and InternalTransferPage.test.jsx, tests verify associated <label> elements, aria-invalid and aria-describedby associations on error fields, automatic focus placement on the first invalid field upon submit, keyboard focus rings, modal Escape key dismiss, and aria-live status announcements.

Q: How did you test responsive behavior?

A: Tests and manual QA verified layout adaptation across Desktop (1280px+), Tablet (768px-1024px), and Mobile (<768px) viewports, verifying mobile menu navigation toggles and horizontal scrolling containers for data tables.

Q: What does 125/125 tests passing mean?

A: It means 100% of the automated test suite across 9 test files passed cleanly. It proves that all implemented frontend components, form validation rules, session state management, role navigation guards, accessibility attributes, and mock service boundaries function exactly as specified.

Q: Did you test a real backend?

A: No. The approved Phase 2 scope was strictly frontend-only. Automated tests run against controlled static JSON boundaries (internal-transfer.json, employee-dashboard.json, admin-dashboard.json) exposed through service files.

Q: Did you test production authentication?

A: No. Authentication is demo session simulation using pre-configured static accounts in authService.js. Production authentication (OAuth2, SAML, JWT) is deferred scope.

Q: How did you maintain traceability between requirements and tests?

A: Through a formal traceability chain: BRD -> Feature Spec (FR/BR) -> Acceptance Criteria (AC) -> Task Breakdown -> Code Implementation -> Automated Test Case -> Test Verification Result. Every test name explicitly references its AC or Task ID where applicable.

Q: What would you test additionally if the backend were implemented?

A: I would add real REST API endpoint integration tests, HTTP network failure handling, OAuth2 token refresh/expiry flows, database constraint & transaction testing, backend role-based authorization (RBAC) middleware, and server-side input sanitization/security audits.
