import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getSession,
  setSession,
  clearSession,
  isAuthenticated,
  getUser,
  hasRole,
  loginDemo,
  DEFAULT_EMPLOYEE_SESSION,
  DEFAULT_ADMIN_SESSION
} from '../../src/services/authService';

describe('P2-T01: authService Foundation', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('starts with no authenticated session by default', () => {
    expect(getSession()).toBeNull();
    expect(isAuthenticated()).toBe(false);
    expect(getUser()).toBeNull();
    expect(hasRole('employee')).toBe(false);
  });

  it('sets and retrieves session in sessionStorage under key "onepoint_portal_session"', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);

    const savedRaw = sessionStorage.getItem('onepoint_portal_session');
    expect(savedRaw).toBeDefined();

    const session = getSession();
    expect(session).toEqual(DEFAULT_EMPLOYEE_SESSION);
    expect(isAuthenticated()).toBe(true);
    expect(getUser()).toEqual(DEFAULT_EMPLOYEE_SESSION.user);
    expect(hasRole('employee')).toBe(true);
    expect(hasRole('admin')).toBe(false);
  });

  it('clears session upon calling clearSession()', () => {
    setSession(DEFAULT_ADMIN_SESSION);
    expect(isAuthenticated()).toBe(true);
    expect(hasRole('admin')).toBe(true);

    clearSession();

    expect(getSession()).toBeNull();
    expect(isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem('onepoint_portal_session')).toBeNull();
  });

  it('supports loginDemo helper for demo credentials', () => {
    const empSession = loginDemo('employee@onepoint.com', 'Employee@123');
    expect(empSession.user.role).toBe('employee');
    expect(empSession.user.email).toBe('employee@onepoint.com');

    const adminSession = loginDemo('admin@onepoint.com', 'Admin@123');
    expect(adminSession.user.role).toBe('admin');
    expect(adminSession.user.email).toBe('admin@onepoint.com');

    expect(() => loginDemo('invalid@onepoint.com', 'wrong')).toThrow(/invalid credentials/i);
  });

  describe('P2-T03: Session Hardening & Edge Cases', () => {
    it('handles malformed/invalid JSON in sessionStorage safely', () => {
      sessionStorage.setItem('onepoint_portal_session', '{malformed-json');

      expect(getSession()).toBeNull();
      expect(isAuthenticated()).toBe(false);
      expect(getUser()).toBeNull();
      expect(hasRole('employee')).toBe(false);
    });

    it('handles session objects with missing user or unsupported roles safely', () => {
      sessionStorage.setItem(
        'onepoint_portal_session',
        JSON.stringify({ isAuthenticated: true, user: { role: 'unknown_role' } })
      );

      expect(getSession()).toBeNull();
      expect(isAuthenticated()).toBe(false);
      expect(hasRole('unknown_role')).toBe(false);
    });

    it('safely handles logout() when no session exists in sessionStorage', () => {
      expect(() => clearSession()).not.toThrow();
      expect(getSession()).toBeNull();
    });
  });
});
