# Employee Internal Transfer — Day 6 Structured AI Prompts

**Feature:** Employee Internal Transfer Digital Journey  
**Status:** Draft — Day 6  
**Purpose:** Task-scoped AI prompt templates for Day-7 implementation.

> These are planned templates, not evidence of prompts already used. Record actual prompts/outcomes in `.ai-context/prompt_history.md` only after they are genuinely used.

## Prompt Rules

Every implementation prompt must:
- Name the Task ID.
- Reference the relevant Specification/AC.
- Stay within task scope.
- Avoid inventing unresolved business rules.
- Require tests before or alongside implementation.
- Respect the frontend-only boundary.
- Use the service boundary rather than coupling UI directly to mock JSON.
- Report assumptions, deviations, and files changed.

## P01 — T01 Frontend Environment

> Work only on `employee-internal-transfer.T01`. Prepare the React/Vite/JavaScript/Tailwind frontend and selected Vite-compatible testing environment described in the approved Day-5 Technical Plan. Do not implement Employee Internal Transfer business functionality, business tests, API integrations, backend logic, or mock transfer data. Verify the application runs and test tooling is available. Report files changed and setup issues without inventing requirements.

## P02 — T02 Feature Page and Flow Shell

> Work only on `employee-internal-transfer.T02`. Create the Internal Transfer page and component structure described in the approved Technical Plan. Use the approved Specification for the journey: initiation, request form, submission, status, progress, and pending actions. Do not invent fields, workflow rules, backend behaviour, or enterprise integrations. Identify relevant ACs and tests before implementation. Keep data access outside presentation components.

## P03 — T03 Transfer Request Form

> Work only on `employee-internal-transfer.T03`. Build the transfer request form using only the approved fields: department, location, role, effective date, and optional reason. Implement accessible labels and controls. Do not add fields or business rules. Identify tests for AC02–AC05 first, then implement the smallest UI needed. Report ambiguity instead of guessing.

## P04 — T04 Form Validation

> Work only on `employee-internal-transfer.T04`. Implement only validation rules explicitly supported by the approved Specification. Cover relevant ACs with tests before implementation. Required data must be validated; the reason remains optional unless the approved Specification says otherwise. Do not invent date, eligibility, or server-side rules. Report unresolved requirements instead of guessing.

## P05 — T05 Mock Data and Service Boundary

> Work only on `employee-internal-transfer.T05`. Create the controlled mock JSON data and `internalTransferService.js` service boundary described in the approved Technical Plan. Align the service with the proposed API contracts in the approved Specification. Keep UI components independent from direct JSON access. Do not build a real REST API, database, authentication, or enterprise integration. Add tests for service behaviour required by AC06–AC12. Distinguish contract details from implementation assumptions.

## P06 — T06 Submission and Request State

> Work only on `employee-internal-transfer.T06`. Connect the validated transfer form to `internalTransferService` and implement the approved submission state. Start with tests for AC06 and AC07. Use only the service boundary. Handle the success response and request identifier/data needed for status. Do not add backend persistence, notifications, enterprise orchestration, or undocumented rules.

## P07 — T07 Status, Progress, and Pending Actions

> Work only on `employee-internal-transfer.T07`. Implement approved request status, progress, and pending-action presentation using data returned by the service boundary. Write/update tests for relevant ACs before implementation. Do not invent workflow transitions or determine enterprise status inside the UI. Preserve and report undefined behaviour.

## P08 — T08 Failure and Error States

> Work only on `employee-internal-transfer.T08`. Implement failure/error states documented in the approved Specification and Technical Plan. Cover validation failure, service/mock failure, and unsuccessful submission with tests. Do not expose internal implementation details or sensitive information. Do not invent retry/recovery behaviour.

## P09 — T09 Accessibility Validation

> Work only on `employee-internal-transfer.T09`. Validate the Internal Transfer journey against accessibility expectations in the Technical Plan and applicable Specification requirements. Check labels, keyboard operation, focus/error behaviour, semantic structure, and accessible status/progress/error communication. Add automated tests where appropriate and identify manual checks. Do not redesign unrelated components.

## P10 — T10 End-to-End Validation

> Work only on `employee-internal-transfer.T10`. Validate the complete approved frontend journey against AC01–AC12 and the Day-5 Technical Plan. Execute happy-path, validation, and key failure scenarios. Confirm service-boundary usage, accessibility/security expectations, and test coverage. Produce Spec → AC → Task → Test traceability. Do not expand scope. Report failures, deviations, assumptions, and unresolved issues for Gate 2 preparation.

## Prompt Output Contract

When using a task prompt, require the AI/developer to return:
1. Task ID
2. Acceptance Criteria covered
3. Tests added/updated
4. Files changed
5. Implementation summary
6. Assumptions
7. Deviations from Spec/Plan
8. Test result
9. Unresolved issues
10. Traceability reference
