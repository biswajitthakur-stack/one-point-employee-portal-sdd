import initialMockData from '../data/internal-transfer.json';

/**
 * Custom error class representing service and API errors with HTTP status codes.
 */
export class ServiceError extends Error {
  constructor(status, message, details = {}) {
    super(message);
    this.name = 'ServiceError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Default session representing an authenticated employee in the portal (ASM-001).
 */
export const DEFAULT_SESSION = {
  isAuthenticated: true,
  user: {
    employeeId: 'EMP-001',
    name: 'Alex Morgan',
    role: 'employee'
  }
};

// In-memory working copy to avoid mutating imported JSON directly
let store = JSON.parse(JSON.stringify(initialMockData));

/**
 * Resets the in-memory store to initial mock data.
 * Useful for test isolation.
 */
export function resetTransferStore() {
  store = JSON.parse(JSON.stringify(initialMockData));
}

/**
 * Validates authentication session.
 */
function validateSession(session) {
  if (!session || !session.isAuthenticated || !session.user?.employeeId) {
    throw new ServiceError(401, 'User is not authenticated');
  }
}

/**
 * Retrieves all transfer lookup options (departments, locations, roles).
 */
export async function getTransferOptions() {
  return {
    departments: [...store.departments],
    locations: [...store.locations],
    roles: [...store.roles]
  };
}

/**
 * Retrieves department options.
 */
export async function getDepartments() {
  return [...store.departments];
}

/**
 * Retrieves location options.
 */
export async function getLocations() {
  return [...store.locations];
}

/**
 * Retrieves role options.
 */
export async function getRoles() {
  return [...store.roles];
}

/**
 * Implements API01: POST /api/internal-transfers
 *
 * Initiates an Internal Transfer Request.
 * Derives employeeId from the authenticated user session (SEC01).
 *
 * @param {Object} payload - Transfer request payload
 * @param {string} payload.departmentId - Proposed department (required)
 * @param {string} payload.locationId - Proposed location (required)
 * @param {string} payload.roleId - Proposed role (required)
 * @param {string} payload.effectiveDate - Proposed effective date (required)
 * @param {string|null} [payload.reason] - Optional transfer reason
 * @param {Object} [session] - User session
 * @returns {Promise<{ requestId: string, status: string }>} 201 Created response
 */
export async function createTransferRequest(payload, session = DEFAULT_SESSION) {
  validateSession(session);

  if (!payload || typeof payload !== 'object') {
    throw new ServiceError(400, 'Invalid request payload');
  }

  // Required field validations (UT13 - UT16)
  if (!payload.departmentId || typeof payload.departmentId !== 'string' || !payload.departmentId.trim()) {
    throw new ServiceError(400, 'Missing or invalid departmentId', { field: 'departmentId' });
  }

  if (!payload.locationId || typeof payload.locationId !== 'string' || !payload.locationId.trim()) {
    throw new ServiceError(400, 'Missing or invalid locationId', { field: 'locationId' });
  }

  if (!payload.roleId || typeof payload.roleId !== 'string' || !payload.roleId.trim()) {
    throw new ServiceError(400, 'Missing or invalid roleId', { field: 'roleId' });
  }

  if (!payload.effectiveDate || typeof payload.effectiveDate !== 'string' || !payload.effectiveDate.trim()) {
    throw new ServiceError(400, 'Missing or invalid effectiveDate', { field: 'effectiveDate' });
  }

  // Reason is explicitly optional (UT17 / AC03)
  const reason = typeof payload.reason === 'string' && payload.reason.trim()
    ? payload.reason.trim()
    : null;

  const employeeId = session.user.employeeId;

  // Duplicate / Idempotency check (UT19 / AC11)
  const isDuplicate = store.requests.some(
    (req) =>
      req.employeeId === employeeId &&
      req.departmentId === payload.departmentId.trim() &&
      req.locationId === payload.locationId.trim() &&
      req.roleId === payload.roleId.trim() &&
      req.effectiveDate === payload.effectiveDate.trim()
  );

  if (isDuplicate) {
    throw new ServiceError(
      409,
      'Duplicate logical submission: an identical transfer request already exists for this employee'
    );
  }

  const requestId = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const newRequest = {
    requestId,
    employeeId,
    departmentId: payload.departmentId.trim(),
    locationId: payload.locationId.trim(),
    roleId: payload.roleId.trim(),
    effectiveDate: payload.effectiveDate.trim(),
    reason,
    status: 'Submitted',
    pendingActions: [
      {
        stakeholder: 'Manager',
        action: 'Transfer confirmation',
        status: 'Pending'
      }
    ]
  };

  store.requests.push(newRequest);

  return {
    requestId: newRequest.requestId,
    status: newRequest.status
  };
}

/**
 * Implements API02: GET /api/internal-transfers/{requestId}
 *
 * Retrieves transfer request details including current status and pending actions.
 * Enforces ownership access control (AC09 / UT20).
 *
 * @param {string} requestId - Transfer request identifier
 * @param {Object} [session] - User session
 * @returns {Promise<Object>} 200 OK transfer request object
 */
export async function getTransferRequest(requestId, session = DEFAULT_SESSION) {
  validateSession(session);

  const request = store.requests.find((r) => r.requestId === requestId);

  if (!request) {
    throw new ServiceError(404, `Transfer request with ID "${requestId}" not found`);
  }

  // Authorization check (SEC02 / AC09 / UT20)
  if (request.employeeId !== session.user.employeeId) {
    throw new ServiceError(403, 'Access denied: transfer request belongs to another employee');
  }

  return {
    requestId: request.requestId,
    employeeId: request.employeeId,
    departmentId: request.departmentId,
    locationId: request.locationId,
    roleId: request.roleId,
    effectiveDate: request.effectiveDate,
    reason: request.reason,
    status: request.status,
    pendingActions: JSON.parse(JSON.stringify(request.pendingActions || []))
  };
}

/**
 * Implements API03: GET /api/internal-transfers/{requestId}/progress
 *
 * Retrieves a single progress representation of status and pending stakeholder actions.
 *
 * @param {string} requestId - Transfer request identifier
 * @param {Object} [session] - User session
 * @returns {Promise<{ requestId: string, status: string, pendingActions: Array }>}
 */
export async function getTransferProgress(requestId, session = DEFAULT_SESSION) {
  validateSession(session);

  const request = store.requests.find((r) => r.requestId === requestId);

  if (!request) {
    throw new ServiceError(404, `Transfer request with ID "${requestId}" not found`);
  }

  if (request.employeeId !== session.user.employeeId) {
    throw new ServiceError(403, 'Access denied: transfer request belongs to another employee');
  }

  return {
    requestId: request.requestId,
    status: request.status,
    pendingActions: JSON.parse(JSON.stringify(request.pendingActions || []))
  };
}
