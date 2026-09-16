# Day 04 Prompt Log

**Task ID / Focus:** T04 (Approved Form Validation)
**Acceptance Criteria Covered:** AC03-AC05
**Status:** Completed
**Recovered Verbatim:** Yes (extracted verbatim from transcript log)

---

## Original User Prompt (Verbatim)

`
DAY 4 — IMPLEMENT T04: APPROVED FORM VALIDATION

We are continuing the One-Point Employee Portal project strictly from the existing SDD, project documents, current repository state, and the completed Day 1, Day 2, and Day 3 work.

IMPORTANT:
- Do NOT implement T06 or any submission/service mutation logic today.
- Do NOT implement API submission yet.
- Do NOT make unrelated refactoring or architectural changes.
- Preserve all existing functionality and tests.
- Follow the existing SDD and current architecture.
- Continue using test-first development.
- Do not modify the mock data/service boundary unless it is absolutely required for T04.
- Do not fix unrelated Vite warnings today.

TODAY'S ONLY SCOPE: T04 — Implement Approved Form Validation.

Requirements:

1. Add client-side validation to InternalTransferPage.jsx.

The following fields are mandatory:
- departmentId
- locationId
- roleId
- effectiveDate

The reason field is optional.

2. Prevent form submission when any mandatory field is missing.

3. Display clear, accessible inline validation messages for the missing fields.

4. Validation must happen before any call to createTransferRequest().
Since T06 is NOT part of today's work, do not connect submission to createTransferRequest() yet.

5. Keep the existing dynamic dropdown population through:
getTransferOptions()

Do NOT hardcode the department, location, or role data.

6. Preserve the existing initial/default dropdown options such as:
- Select department
- Select location
- Select role

7. Ensure the user can correct validation errors by selecting/filling the missing fields.

8. The reason field must remain optional and must never cause validation failure when empty.

9. Use accessible validation semantics where appropriate:
- associate error messages with their corresponding fields
- use suitable aria attributes if needed
- ensure validation errors are understandable to screen readers

10. Add/update tests for T04.

At minimum, cover:
- UT05: missing required field prevents submission and displays validation error
- missing departmentId
- missing locationId
- missing roleId
- missing effectiveDate
- reason omitted still remains valid from a validation perspective
- all required fields present means validation passes

IMPORTANT TEST RULE:
- Preserve all existing Day 1, Day 2, and Day 3 tests.
- Do not weaken, delete, or bypass existing tests.
- If a new test conflicts with an existing test, investigate the implementation rather than removing the old test.

11. Follow the existing project coding style.

12. After implementation:
- run npm test
- report the exact test result
- report which files were created/modified
- explain exactly what T04 implemented
- list any warnings separately
- do NOT proceed to T06.

STOP after completing T04 and the tests.

Wait for my review before implementing the next task.
`
