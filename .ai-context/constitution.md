# Project Constitution

## Testing Discipline

1. **Test-First Development:** All feature capabilities must have corresponding automated unit/integration tests before task completion.
2. **Regression Zero Tolerance:** All existing automated tests (125 tests across 9 test files) must pass 100% on every commit/change.
3. **Execution Tooling:** Tests are executed via Vitest and React Testing Library (`npm test`).
4. **Coverage Scope:** Tests must cover form inputs, validation rules, mock service data, state transitions, accessibility roles, and failure handling.

## Security Posture

1. **Frontend Demo Boundary:** Authentication is client-side session simulation (`authService.js`) using `sessionStorage`.
2. **Data Privacy & Secrets:** No real employee credentials, secret tokens, or private PII are stored or exposed in source code or repositories.
3. **Role Guards:** Application navigation strictly enforces user role state (`employee` vs `admin`) preventing unauthorized view renders.
4. **Production Backend Deferral:** Real authentication (OAuth, JWT, SAML), database encryption, and secure API transport are explicitly deferred to future backend implementation phases.

## Architectural Constraints

1. **Technology Stack:** Built exclusively with React 18, Vite, JavaScript (ES6+), and Tailwind CSS.
2. **Frontend-Only Architecture:** Static JSON mock files (`src/data/`) serve as data sources accessed via service boundaries (`internalTransferService.js`, `adminService.js`, `authService.js`).
3. **State Management:** Uses React built-in state (`useState`, `useEffect`) and custom hooks. No external state management libraries (Redux, Zustand) without explicit ADR approval.
4. **No Unapproved Dependencies:** New third-party packages must not be introduced without documented evaluation.

## Non-Functional Baselines

1. **Build Performance:** Production build (`npm run build`) must complete cleanly without syntax warnings or bundling errors in under 2 seconds.
2. **Responsive Design:** UI must adapt seamlessly across Desktop (1280px+), Tablet (768px - 1024px), and Mobile (<768px) viewports.
3. **Accessibility (WCAG 2.1 AA):**
   - High contrast color ratios for text readability.
   - Semantic HTML elements (`<main>`, `<nav>`, `<header>`, `<footer>`, `<dialog>`).
   - Accessible form controls with explicit `<label>` associations and `aria-*` attributes.
   - Full keyboard navigability (Tab focus rings, Escape key modal dismiss).
4. **Runtime Integrity:** Zero uncaught console errors or warnings during user interaction.

## Versioning Rules

1. **Phase 1 Immutability:** Historical SDD assessment documents (Day 1 through Day 10) represent immutable project history.
2. **Phase 2 Addenda Pattern:** Functional enhancements, architectural evolutions, and task updates for Phase 2 are documented via clearly marked addenda in `.ai-context/`.
3. **Traceability:** Every user-facing capability must trace back to approved specifications, technical plans, tasks, and automated tests.
