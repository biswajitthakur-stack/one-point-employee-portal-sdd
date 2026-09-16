# One-Point Employee Portal

An enterprise-style frontend employee portal featuring the **Employee Internal Transfer Digital Journey** (Phase 1 SDD assessment) and extended **Employee & Admin Portal Experiences** (Phase 2 enhancements).

---

## 1. Project Scope & Architecture Overview

The application is a **frontend-only demonstration portal** built with React, Vite, JavaScript, and Tailwind CSS. It uses session-based mock authentication and static JSON data boundaries. No production backend API server, database, JWT/OAuth infrastructure, or real enterprise integrations are included.

### Phase 1 — SDD Assessment (Day 1 – Day 10)
- **Feature:** Employee Internal Transfer Digital Journey.
- **Capabilities:** Form initiation, lookup options (Department, Location, Role), mandatory field validation, optional transfer reason, form submission, duplicate handling (409 conflict representation), post-submission status view, pending stakeholder actions, progress tracking, safe failure/error state representation (401, 403, 404, 500), and accessibility validation.
- **Verification:** 68/68 automated tests passing across 2 test files.

### Phase 2 — Post-Assessment Frontend Portal Enhancements (P2-T01 – P2-T07)
- **P2-T01:** Navigation Shell & Layout Foundation (sticky top Navbar, role-aware Sidebar, responsive mobile menu).
- **P2-T02:** Login Page & Demo Authentication (Employee & Admin role selection tabs, static demo credential validation, quick fill helpers).
- **P2-T03:** Session Handling, Role Protection & Logout Refinements (`sessionStorage` persistence under `onepoint_portal_session`, role guards preventing unauthorized route navigation).
- **P2-T04:** Employee Dashboard (Welcome banner, employee profile summary card, KPI stats cards, quick action navigation to internal transfer, recent activity stream).
- **P2-T05:** Admin Dashboard & Pipeline Overview (Admin KPI metrics, 8 static transfer requests pipeline table, color-coded status badges, live text search, status filtering, empty state with filter reset, interactive request details modal).
- **P2-T06:** Global UI/UX Polish, Accessibility & Responsive Audit (keyboard `Escape` modal closure, `aria-modal="true"`, visible focus rings `focus:ring-2 focus:ring-indigo-500`, dual-encoded status badges, horizontal scroll prevention).
- **P2-T07:** Final E2E Feature Validation & Traceability Check (125/125 tests passing, Vite production build clean).

---

## 2. Technology Stack

- **Framework:** React (v18+)
- **Build Tool / Dev Server:** Vite (v8+)
- **Styling:** Tailwind CSS (v4+)
- **Testing Tooling:** Vitest (v4.1+) & React Testing Library (v16.3+)
- **Language:** JavaScript (ES6+)

---

## 3. Data Boundaries & Demo Authentication

### Data Boundaries
- Internal Transfer lookup & requests: `src/data/internal-transfer.json`
- Employee Dashboard statistics & profile: `src/data/employee-dashboard.json`
- Admin Dashboard metrics & request pipeline: `src/data/admin-dashboard.json`

### Demo Login Credentials
- **Employee Portal:** `employee@onepoint.demo` / `Employee@123` (or alias `employee@onepoint.com`)
- **Admin Portal:** `admin@onepoint.demo` / `Admin@123` (or alias `admin@onepoint.com`)

---

## 4. Current Status & Verification Metrics

- **Automated Tests:** **125 / 125 passing** across 9 test files (`npm test`)
- **Production Build:** **Clean build** (`npm run build`) in <500ms
- **Accessibility:** Keyboard navigable, focus indicators, modal semantics, screen-reader labels, non-color-only status badges

---

## 5. Local Development Setup

### Install Dependencies
```bash
npm install
```

### Run Automated Test Suite
```bash
npm test
```

### Build for Production
```bash
npm run build
```

### Start Local Development Server
```bash
npx vite
```
Open the printed local URL (e.g. `http://localhost:5173/` or `http://localhost:5174/`) in your browser.

---

## 6. Deferred Production Work

The following backend and infrastructure items are intentionally deferred:
- Production REST / GraphQL API server implementation.
- Database persistence (SQL / NoSQL).
- Production enterprise authentication (OAuth2 / OIDC / SAML / JWT).
- Real HR, Organization, Payroll, IT, and Facilities system integrations.
- Production event orchestration and email/SMS notification services.
