/**
 * Demo authentication and session management service for Phase 2.
 * Note: This is a frontend demonstration service using sessionStorage.
 * It is NOT production-grade authentication and uses static demo credentials.
 */

export const SESSION_STORAGE_KEY = 'onepoint_portal_session';

export const DEMO_CREDENTIALS = {
  employee: {
    email: 'employee@onepoint.demo',
    aliasEmail: 'employee@onepoint.com',
    password: 'Employee@123',
    user: {
      employeeId: 'EMP-001',
      name: 'Alex Morgan',
      email: 'employee@onepoint.demo',
      role: 'employee',
      department: 'Engineering',
      location: 'London, UK',
      position: 'Software Engineer'
    }
  },
  admin: {
    email: 'admin@onepoint.demo',
    aliasEmail: 'admin@onepoint.com',
    password: 'Admin@123',
    user: {
      employeeId: 'ADM-001',
      name: 'Sarah Jenkins',
      email: 'admin@onepoint.demo',
      role: 'admin',
      department: 'HR Operations',
      location: 'London, UK',
      position: 'Portal Administrator'
    }
  }
};

export const DEFAULT_EMPLOYEE_SESSION = {
  isAuthenticated: true,
  user: DEMO_CREDENTIALS.employee.user
};

export const DEFAULT_ADMIN_SESSION = {
  isAuthenticated: true,
  user: DEMO_CREDENTIALS.admin.user
};

const ALLOWED_ROLES = ['employee', 'admin'];

/**
 * Retrieves current active session from sessionStorage.
 * Returns null if session is missing, malformed, or has an unsupported role.
 * @returns {Object|null} Session object or null if unauthenticated
 */
export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (
      session &&
      session.isAuthenticated &&
      session.user?.role &&
      ALLOWED_ROLES.includes(session.user.role)
    ) {
      return session;
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Alias for getSession() for specification compliance.
 */
export function getCurrentSession() {
  return getSession();
}

/**
 * Saves session to sessionStorage.
 * @param {Object} session - Session object to persist
 */
export function setSession(session) {
  if (!session) {
    clearSession();
    return;
  }
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

/**
 * Clears session from sessionStorage (Logout).
 */
export function clearSession() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

/**
 * Alias for clearSession() for specification compliance.
 */
export function logout() {
  clearSession();
}

/**
 * Checks if a valid authenticated session exists.
 * @returns {boolean}
 */
export function isAuthenticated() {
  const session = getSession();
  return Boolean(session && session.isAuthenticated);
}

/**
 * Retrieves the logged-in user details.
 * @returns {Object|null}
 */
export function getUser() {
  const session = getSession();
  return session?.user || null;
}

/**
 * Checks if the current session has a specific role ('employee' | 'admin').
 * @param {string} role
 * @returns {boolean}
 */
export function hasRole(role) {
  const user = getUser();
  return Boolean(user && user.role === role);
}

/**
 * Demo login helper checking static demo credentials and role selection.
 * @param {string} email
 * @param {string} password
 * @param {string} [expectedRole] - Optional expected role ('employee' | 'admin')
 * @returns {Object} Active session
 */
export function loginDemo(email, password, expectedRole) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  const isEmpMatch =
    (cleanEmail === 'employee@onepoint.demo' || cleanEmail === 'employee@onepoint.com') &&
    cleanPassword === DEMO_CREDENTIALS.employee.password;

  const isAdminMatch =
    (cleanEmail === 'admin@onepoint.demo' || cleanEmail === 'admin@onepoint.com') &&
    cleanPassword === DEMO_CREDENTIALS.admin.password;

  if (isEmpMatch) {
    if (expectedRole && expectedRole !== 'employee') {
      throw new Error('Invalid credentials or role selection. Selected role does not match account permissions.');
    }
    const session = {
      isAuthenticated: true,
      user: {
        ...DEMO_CREDENTIALS.employee.user,
        email: cleanEmail
      }
    };
    setSession(session);
    return session;
  }

  if (isAdminMatch) {
    if (expectedRole && expectedRole !== 'admin') {
      throw new Error('Invalid credentials or role selection. Selected role does not match account permissions.');
    }
    const session = {
      isAuthenticated: true,
      user: {
        ...DEMO_CREDENTIALS.admin.user,
        email: cleanEmail
      }
    };
    setSession(session);
    return session;
  }

  throw new Error('Invalid credentials or role selection. Please check your username and password.');
}
