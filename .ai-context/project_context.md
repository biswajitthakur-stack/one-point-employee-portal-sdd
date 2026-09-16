# Project Context — One-Point Employee Portal

## 1. Overview

The **One-Point Employee Portal** is an enterprise frontend application demonstrating employee self-service and administrative workplace workflows. 

The project was executed across two distinct phases:
- **Phase 1 (Day 1 – Day 10):** The SDD-guided implementation of the **Employee Internal Transfer Digital Journey**.
- **Phase 2 (P2-T01 – P2-T07):** A post-assessment frontend enhancement introducing the Navigation Shell, Demo Authentication, Employee Dashboard, Admin Dashboard/Pipeline, and Global Accessibility Refinements.

---

## 2. Technology Stack

- **Framework:** React (v18+)
- **Build Tool:** Vite (v8+)
- **Language:** JavaScript (ES6+)
- **Styling:** Tailwind CSS (v4+)
- **Testing:** Vitest (v4.1+) & React Testing Library (v16.3+)

---

## 3. Data Boundaries & Architecture

The application is **frontend-only** and operates against controlled static JSON data boundaries:
- `src/data/internal-transfer.json` — Internal transfer options & request store.
- `src/data/employee-dashboard.json` — Employee dashboard profile & statistics.
- `src/data/admin-dashboard.json` — Admin dashboard metrics & transfer request pipeline.

Services (`internalTransferService.js` and `authService.js`) encapsulate all data access, insulating UI components from direct JSON dependency and maintaining readiness for future REST API endpoints.

---

## 4. Current Status

- **Phase 1 Status:** Complete & Verified (Day 1 – Day 10).
- **Phase 2 Status:** Complete & Verified (P2-T01 – P2-T07).
- **Automated Tests:** 125 / 125 tests passing across 9 test files.
- **Production Build:** Clean Vite build (`npm run build`).
