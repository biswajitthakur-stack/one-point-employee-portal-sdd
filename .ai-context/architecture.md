# Application Architecture — One-Point Employee Portal

**Status:** Approved & Implemented  
**Scope:** Frontend-Only Demonstration Application  

---

## 1. High-Level Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        One-Point Employee Portal                       │
│                               React UI                                 │
├───────────────────┬──────────────────────┬─────────────────────────────┤
│  Login Page       │ Employee Dashboard   │ Admin Dashboard & Pipeline  │
│  (Demo Auth)      │ Profile & Stats      │ Metrics, Table, Search/Modal│
├───────────────────┴──────────────────────┴─────────────────────────────┤
│ Internal Transfer Feature Journey                                      │
│ Request Form | Validation | Status / Progress | Error Representation  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
                   ┌───────────────────────────────┐
                   │       Service Boundary        │
                   │  authService                  │
                   │  internalTransferService      │
                   └───────────────┬───────────────┘
                                   │
                           ┌───────┴───────┐
                           ▼               ▼
                       Mock JSON      Future REST API
```

---

## 2. Frontend Layering

1. **Presentation Layer (`src/pages/`, `src/components/`):**
   - View Routing State Machine (`App.jsx`).
   - Shared Navigation Shell (`Navbar.jsx`, `Sidebar.jsx`).
   - Specialized Views: `LoginPage`, `EmployeeDashboard`, `AdminDashboard`, `InternalTransferPage`.
2. **Service Layer (`src/services/`):**
   - `authService.js`: Demo session state management, role checking (`employee` / `admin`), credentials validation, and `sessionStorage` persistence (`onepoint_portal_session`).
   - `internalTransferService.js`: Encapsulates transfer options, request creation, status retrieval, progress tracking, duplicate checking (409), and safe error formatting.
3. **Static Data Boundary (`src/data/`):**
   - `internal-transfer.json`, `employee-dashboard.json`, `admin-dashboard.json`.

---

## 3. Security & Access Boundaries

- **Session Isolation:** Authenticated state is maintained per browser session in `sessionStorage`.
- **Role Protection:** Route guards in `App.jsx` prevent unauthorized navigation (e.g. employee sessions attempting to access `admin_dashboard` are redirected to `employee_dashboard`).
- **Error Masking:** Internal errors (500+) and sensitive patterns (stack traces, tokens, secrets) are masked by `formatSafeErrorMessage`.

---

## 4. Deferred Production Architecture

- Real REST / GraphQL backend services.
- Database persistence layer.
- Enterprise authentication (OAuth2, OIDC, SAML, JWT).
- Real HRIS, Payroll, Directory, or Facilities system integrations.
