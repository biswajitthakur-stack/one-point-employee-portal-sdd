# Day 02 Prompt Log

**Task ID / Focus:** T05 (Mock Data & Service Boundary)
**Acceptance Criteria Covered:** AC06-AC12 (Service boundary)
**Status:** Completed
**Recovered Verbatim:** Yes (extracted verbatim from transcript log)

---

## Original User Prompt (Verbatim)

`
DAY 2 — IMPLEMENT T05: MOCK DATA + SERVICE BOUNDARY

We are continuing the One-Point Employee Portal project strictly from the existing SDD and the current repository state.

Day 1 review is complete. The existing environment is working and the current test suite is passing.

For Day 2, implement ONLY Task T05: Mock Data & Service Boundary.

IMPORTANT:
- Do NOT build the entire application.
- Do NOT implement the form validation UI.
- Do NOT implement submission UI/state.
- Do NOT implement status/progress UI.
- Do NOT implement error-state UI.
- Do NOT implement accessibility work beyond what is necessary for the service tests.
- Do NOT invent business requirements, statuses, approval rules, dependencies, or workflows.
- Follow the existing SDD documents as the source of truth.
- Preserve the existing project architecture and current working tests.
- Do not remove or weaken existing tests just to make the suite pass.

STEP 1 — REVIEW BEFORE CODING

Review the relevant existing SDD files and current implementation, especially:

- architecture.md
- employee-internal-transfer.spec.md
- employee-internal-transfer.spec.day3.md
- employee-internal-transfer.plan.md
- employee-internal-transfer.test_cases.md
- employee-internal-transfer.tasks.md
- employee-internal-transfer.ai-prompts.md
- current InternalTransferPage.jsx
- existing tests
- package.json

Confirm the API/service expectations for API01, API02 and API03 and the service-level tests UT13–UT24 before implementing.

STEP 2 — CREATE MOCK DATA

Create:

src/data/internal-transfer.json

The mock data must support the requirements and service contracts defined in the SDD.

Include controlled mock data for:
- departments/business units
- locations
- roles/job positions
- sample internal transfer requests needed to exercise the service contracts
- request status/progress/pending-action/failure scenarios only where explicitly required by the SDD/test cases

Do not invent additional business behavior.

STEP 3 — CREATE SERVICE BOUNDARY

Create:

src/services/internalTransferService.js

All access to internal-transfer.json must go through this service.

The presentation/UI layer must NOT directly import or query the JSON file.

Implement the service behavior required by API01, API02 and API03 and the corresponding UT13–UT24 test expectations.

Pay particular attention to:
- required payload validation
- optional reason handling
- employee ownership/session-derived identity expectations
- duplicate/idempotency behavior
- status retrieval
- authorization/access-denied behavior
- not-found behavior
- downstream failure representation

Use the exact terminology and behavior specified by the SDD.

Because this is frontend-only, use controlled mock behavior rather than pretending that a real backend exists.

STEP 4 — WRITE SERVICE TESTS FIRST

Before or alongside implementation, add/update tests covering UT13–UT24 according to the existing test-case definitions.

The tests should verify the service contract, not implementation details.

Do not modify existing passing tests unless there is a genuine conflict with the SDD.

STEP 5 — RUN TESTS

Run:

npm test

The final result should show all existing tests plus the new service tests passing.

If something fails:
- investigate the actual cause
- fix the implementation/test appropriately
- do not bypass the test
- do not delete the test
- do not weaken the assertion simply to obtain a passing result

STEP 6 — CHECK ARCHITECTURE

Verify that:

UI
  ↓
internalTransferService
  ↓
internal-transfer.json

is maintained.

The UI must not directly depend on mock JSON.

STEP 7 — REPORT

When finished, provide a concise Day 2 report containing:

1. Files created/modified
2. What was implemented
3. Which SDD requirements/API contracts were covered
4. Which tests were added
5. Final npm test result
6. Any warnings or unresolved issues
7. Anything that requires a decision before Day 3

Do NOT start Day 3 work automatically.

Stop after completing Day 2.
`
