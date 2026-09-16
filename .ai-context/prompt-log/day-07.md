# Day 07 Prompt Log

**Task ID / Focus:** T08 (Failure and Error States)
**Acceptance Criteria Covered:** SEC01-SEC06, AC05, AC09, AC11, AC12
**Status:** Completed
**Recovered Verbatim:** Yes (extracted verbatim from transcript log)

---

## Original User Prompt (Verbatim)

`
DAY 7 — IMPLEMENT THE NEXT SDD-DEFINED TASK ONLY

We are continuing the One-Point Employee Portal project strictly from the existing SDD, project documents, current repository state, and the completed work from Day 1 through Day 6.

Day 1–Day 6 are already completed and verified.

Before making any changes:

1. Read the existing SDD/task documents, especially:
   - employee-internal-transfer.tasks.md
   - relevant employee-internal-transfer.spec.* documents
   - current source code
   - current tests
2. Identify the exact next task after T07 in the SDD.
3. Do NOT assume or invent the task scope. Use the SDD as the source of truth.
4. Confirm which Task ID, requirements, acceptance criteria, and user tests belong to this next task.

IMPORTANT SCOPE RULES:

- Implement ONLY the next SDD-defined task after T07.
- Do NOT implement T09 or any later task.
- Do NOT add functionality simply because it may be useful later.
- Do NOT redesign or refactor unrelated existing code.
- Preserve all existing Day 1–Day 6 functionality.
- Preserve the existing architecture:
  
  UI → Service Boundary → Mock Data
  
- The UI must not directly access the mock JSON.
- Follow the existing test-first discipline.

IMPLEMENTATION PROCESS:

Step 1 — SDD Review
- Identify the exact next Task ID and task name.
- List the relevant FR/BR/AC/UT requirements from the SDD.
- Explain briefly how the current Day 1–Day 6 implementation connects to this task.

Step 2 — Tests First
- Write the tests required by the SDD for this task.
- Run the tests BEFORE implementing the production code.
- Confirm the new tests fail for the expected reason.
- Do not bypass or weaken the tests just to make them pass.

Step 3 — Implementation
- Implement only this task.
- Keep the implementation consistent with the existing architecture and naming conventions.
- Reuse existing service functions/components where appropriate.
- Do not modify unrelated functionality.

Step 4 — Verification
- Run the complete test suite with:
  
  npm test
  
- Verify that all previous tests and all new tests pass.
- If something fails, fix only issues related to this task.
- Do not proceed to the next task.

Step 5 — Final Review Report

At the end, provide a clear completion report containing:

1. Exact Task ID and Task Name
2. Files created
3. Files modified
4. What was implemented
5. SDD requirements / FR / BR / AC / UT covered
6. Tests added
7. Exact npm test result
8. Warnings
9. Unresolved issues
10. Confirmation that no later task was started

VERY IMPORTANT:

Stop after completing this one task and its verification.

Do NOT start the following task.

Wait for my review before proceeding to the next day.
`
