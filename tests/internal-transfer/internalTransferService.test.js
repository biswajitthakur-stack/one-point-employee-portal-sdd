import { describe, expect, it, beforeEach } from 'vitest';
import {
  createTransferRequest,
  getTransferRequest,
  getTransferProgress,
  getTransferOptions,
  getDepartments,
  getLocations,
  getRoles,
  resetTransferStore,
  ServiceError,
  DEFAULT_SESSION
} from '../../src/services/internalTransferService';

describe('internalTransferService — Spec Contracts (API01, API02, API03, UT13–UT24)', () => {
  beforeEach(() => {
    resetTransferStore();
  });

  describe('Lookup Options', () => {
    it('returns departments, locations, and roles from mock data', async () => {
      const options = await getTransferOptions();
      expect(options).toHaveProperty('departments');
      expect(options).toHaveProperty('locations');
      expect(options).toHaveProperty('roles');
      expect(options.departments.length).toBeGreaterThan(0);
      expect(options.locations.length).toBeGreaterThan(0);
      expect(options.roles.length).toBeGreaterThan(0);
    });

    it('returns individual lookup collections', async () => {
      const depts = await getDepartments();
      const locs = await getLocations();
      const roles = await getRoles();
      expect(Array.isArray(depts)).toBe(true);
      expect(Array.isArray(locs)).toBe(true);
      expect(Array.isArray(roles)).toBe(true);
    });
  });

  describe('API01: POST /api/internal-transfers', () => {
    const validPayload = {
      departmentId: 'dept-hr',
      locationId: 'loc-lon',
      roleId: 'role-hrbp',
      effectiveDate: '2026-11-15',
      reason: 'Relocating to London HR team'
    };

    it('UT13: Missing departmentId returns validation failure (400)', async () => {
      const payload = { ...validPayload, departmentId: '' };
      await expect(createTransferRequest(payload)).rejects.toMatchObject({
        status: 400
      });
    });

    it('UT14: Missing locationId returns validation failure (400)', async () => {
      const payload = { ...validPayload, locationId: '' };
      await expect(createTransferRequest(payload)).rejects.toMatchObject({
        status: 400
      });
    });

    it('UT15: Missing roleId returns validation failure (400)', async () => {
      const payload = { ...validPayload, roleId: '' };
      await expect(createTransferRequest(payload)).rejects.toMatchObject({
        status: 400
      });
    });

    it('UT16: Missing effectiveDate returns validation failure (400)', async () => {
      const payload = { ...validPayload, effectiveDate: '' };
      await expect(createTransferRequest(payload)).rejects.toMatchObject({
        status: 400
      });
    });

    it('UT17: Missing reason does not fail validation (201 Created)', async () => {
      const payload = {
        departmentId: 'dept-fin',
        locationId: 'loc-ny',
        roleId: 'role-fa',
        effectiveDate: '2026-12-01'
        // reason omitted
      };
      const response = await createTransferRequest(payload);
      expect(response).toHaveProperty('requestId');
      expect(response).toHaveProperty('status');
      expect(response.status).toBe('Submitted');
    });

    it('UT18: Unauthenticated request is rejected (401)', async () => {
      const unauthenticatedSession = { isAuthenticated: false };
      await expect(
        createTransferRequest(validPayload, unauthenticatedSession)
      ).rejects.toMatchObject({
        status: 401
      });
    });

    it('UT19: Duplicate logical submission follows approved idempotency behaviour (409)', async () => {
      // REQ-001 already has these exact details for EMP-001:
      const duplicatePayload = {
        departmentId: 'dept-eng',
        locationId: 'loc-ny',
        roleId: 'role-se',
        effectiveDate: '2026-10-01'
      };

      await expect(
        createTransferRequest(duplicatePayload)
      ).rejects.toMatchObject({
        status: 409
      });
    });

    it('SEC01: Derives employeeId from session and ignores client-supplied employeeId', async () => {
      const payloadWithSpoofedId = {
        ...validPayload,
        employeeId: 'EMP-SPOOFED'
      };
      const created = await createTransferRequest(payloadWithSpoofedId);
      const fetched = await getTransferRequest(created.requestId);
      expect(fetched.employeeId).toBe(DEFAULT_SESSION.user.employeeId);
      expect(fetched.employeeId).not.toBe('EMP-SPOOFED');
    });
  });

  describe('API02: GET /api/internal-transfers/{requestId}', () => {
    it('UT20: Unauthorised request access is denied (403)', async () => {
      // REQ-004 belongs to EMP-002
      // Default session is EMP-001
      await expect(
        getTransferRequest('REQ-004')
      ).rejects.toMatchObject({
        status: 403
      });
    });

    it('UT21: Existing request returns current status (200)', async () => {
      const res = await getTransferRequest('REQ-001');
      expect(res.requestId).toBe('REQ-001');
      expect(res.employeeId).toBe('EMP-001');
      expect(res.status).toBe('Submitted');
      expect(res.departmentId).toBe('dept-eng');
      expect(res.locationId).toBe('loc-ny');
      expect(res.roleId).toBe('role-se');
      expect(res.effectiveDate).toBe('2026-10-01');
      expect(Array.isArray(res.pendingActions)).toBe(true);
      expect(res.pendingActions.length).toBeGreaterThan(0);
    });

    it('UT22: Non-existent request returns not-found (404)', async () => {
      await expect(
        getTransferRequest('REQ-NON-EXISTENT')
      ).rejects.toMatchObject({
        status: 404
      });
    });

    it('UT10 / AC10: Request with failed downstream activity is not represented as successfully completed', async () => {
      // REQ-003 has Downstream Processing Failed with failed Payroll action
      const res = await getTransferRequest('REQ-003');
      expect(res.status).not.toBe('Completed');
      expect(res.status).not.toBe('Successfully Completed');
      expect(res.status).toBe('Downstream Processing Failed');
      expect(res.pendingActions.some((a) => a.status === 'Failed')).toBe(true);
    });
  });

  describe('API03: GET /api/internal-transfers/{requestId}/progress', () => {
    it('UT23: Existing request returns progress (200)', async () => {
      const res = await getTransferProgress('REQ-001');
      expect(res.requestId).toBe('REQ-001');
      expect(res.status).toBe('Submitted');
      expect(Array.isArray(res.pendingActions)).toBe(true);
      expect(res.pendingActions[0]).toMatchObject({
        stakeholder: 'Manager',
        action: 'Transfer confirmation',
        status: 'Pending'
      });
    });

    it('UT24: Non-existent request returns not-found (404)', async () => {
      await expect(
        getTransferProgress('REQ-NON-EXISTENT')
      ).rejects.toMatchObject({
        status: 404
      });
    });

    it('denies progress access if request belongs to another employee (403)', async () => {
      await expect(
        getTransferProgress('REQ-004')
      ).rejects.toMatchObject({
        status: 403
      });
    });
  });
});
