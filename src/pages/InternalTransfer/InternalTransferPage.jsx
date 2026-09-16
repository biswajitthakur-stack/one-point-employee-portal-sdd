import React, { useState, useEffect } from 'react';
import { getTransferOptions, createTransferRequest, getTransferProgress } from '../../services/internalTransferService';


/**
 * Formats error messages safely for user presentation.
 * Masks internal server errors (500+) and sensitive implementation/debugging details
 * such as stack traces, database connection strings, tokens, and secrets (SEC04).
 */
export function formatSafeErrorMessage(err, fallback = 'An unexpected error occurred. Please try again later.') {
  if (!err) return fallback;

  // Mask internal server errors (HTTP 500+)
  if (err.status && err.status >= 500) {
    return 'Service unavailable. Please try again later.';
  }

  const rawMessage = typeof err === 'string' ? err : err.message;
  if (!rawMessage || typeof rawMessage !== 'string') return fallback;

  // Patterns indicating internal stack traces, database connection strings, system paths, or secrets
  const sensitivePatterns = [
    /password/i,
    /secret/i,
    /token/i,
    /mongodb:\/\//i,
    /postgres:\/\//i,
    /mysql:\/\//i,
    /\bat\s+[^\s]+:\d+:\d+/i,
    /node_modules/i
  ];

  for (const pattern of sensitivePatterns) {
    if (pattern.test(rawMessage)) {
      return fallback;
    }
  }

  return rawMessage;
}

function InternalTransferPage() {
  const [options, setOptions] = useState({
    departments: [],
    locations: [],
    roles: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    departmentId: '',
    locationId: '',
    roleId: '',
    effectiveDate: '',
    reason: ''
  });
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [progressData, setProgressData] = useState(null);
  const [progressError, setProgressError] = useState(null);

  const fetchOptions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTransferOptions();
      setOptions(data || { departments: [], locations: [], roles: [] });
      setError(null);
    } catch (err) {
      setError(formatSafeErrorMessage(err, 'Failed to load transfer options'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  function validate(data) {
    const newErrors = {};
    if (!data.departmentId || !data.departmentId.trim()) {
      newErrors.departmentId = 'Department is required';
    }
    if (!data.locationId || !data.locationId.trim()) {
      newErrors.locationId = 'Location is required';
    }
    if (!data.roleId || !data.roleId.trim()) {
      newErrors.roleId = 'Role is required';
    }
    if (!data.effectiveDate || !data.effectiveDate.trim()) {
      newErrors.effectiveDate = 'Effective Date is required';
    }
    // Reason is explicitly optional; no validation error when empty
    return newErrors;
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsValid(false);
    setSubmissionError(null);
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const loadProgress = async (requestId) => {
    if (!requestId) return;
    setIsLoadingProgress(true);
    setProgressData(null);
    setProgressError(null);
    try {
      const progress = await getTransferProgress(requestId);
      setProgressData(progress);
    } catch (progressErr) {
      setProgressError(formatSafeErrorMessage(progressErr, 'Unable to load request progress'));
    } finally {
      setIsLoadingProgress(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsValid(false);
      const firstErrorField = Object.keys(validationErrors)[0];
      const elementIdMap = {
        departmentId: 'department',
        locationId: 'location',
        roleId: 'role',
        effectiveDate: 'effective-date'
      };
      const targetId = elementIdMap[firstErrorField];
      if (targetId) {
        document.getElementById(targetId)?.focus();
      }
      return;
    }

    setIsValid(true);
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await createTransferRequest({
        departmentId: formData.departmentId,
        locationId: formData.locationId,
        roleId: formData.roleId,
        effectiveDate: formData.effectiveDate,
        reason: formData.reason
      });
      setSubmittedRequest(response);

      // T07/T08 — fetch full progress view after successful submission (AC06/AC07/AC08/SEC04)
      await loadProgress(response.requestId);
    } catch (err) {
      setSubmissionError(formatSafeErrorMessage(err, 'Failed to submit transfer request'));
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Internal Transfer Request</h1>

      {error && (
        <div role="alert" aria-label="options-error" aria-live="assertive" className="p-3 mb-4 text-red-700 bg-red-100 rounded flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchOptions}
            className="ml-4 px-3 py-1 bg-red-200 hover:bg-red-300 text-red-800 text-sm font-medium rounded"
          >
            Retry loading options
          </button>
        </div>
      )}

      {isLoading && (
        <div role="status" aria-live="polite" className="p-2 mb-4 text-gray-500">
          Loading options...
        </div>
      )}

      {isSubmitting && (
        <div role="status" aria-label="submitting" aria-live="polite" className="p-2 mb-4 text-blue-600">
          Submitting transfer request...
        </div>
      )}

      {isValid && (
        <div role="status" aria-label="validated" aria-live="polite" className="p-3 mb-4 text-green-700 bg-green-100 rounded">
          Transfer request details validated successfully.
        </div>
      )}

      {submissionError && (
        <div role="alert" aria-label="submission-error" aria-live="assertive" className="p-3 mb-4 text-red-700 bg-red-100 rounded">
          {submissionError}
        </div>
      )}

      {submittedRequest && (
        <div role="status" aria-label="submission-success" aria-live="polite" className="p-4 mb-4 text-green-800 bg-green-50 border border-green-200 rounded">
          <p className="font-semibold">Transfer request submitted successfully.</p>
          <p>Request ID: <span data-testid="submitted-request-id" className="font-mono">{submittedRequest.requestId}</span></p>
          <p>Status: <span data-testid="submitted-request-status" className="font-medium">{submittedRequest.status}</span></p>
        </div>
      )}

      {/* T07 — Progress loading indicator (AC06) */}
      {isLoadingProgress && (
        <div role="status" aria-label="loading progress" aria-live="polite" className="p-2 mb-4 text-gray-500">
          Loading request progress...
        </div>
      )}

      {/* T07/T08 — Progress error (AC12 / AC09 / SEC04) */}
      {progressError && (
        <div role="alert" aria-label="progress-error" aria-live="assertive" className="p-3 mb-4 text-red-700 bg-red-100 rounded flex items-center justify-between">
          <span>{progressError}</span>
          {submittedRequest?.requestId && (
            <button
              type="button"
              onClick={() => loadProgress(submittedRequest.requestId)}
              className="ml-4 px-3 py-1 bg-red-200 hover:bg-red-300 text-red-800 text-sm font-medium rounded"
            >
              Retry loading progress
            </button>
          )}
        </div>
      )}

      {/* T07 — Single progress view: status + pending actions (AC06/AC07/AC08) */}
      {progressData && !isLoadingProgress && (
        <section
          aria-labelledby="progress-heading"
          className="p-4 mb-4 bg-white border border-gray-200 rounded"
        >
          <h2 id="progress-heading" className="text-lg font-semibold mb-3">Transfer Request Progress</h2>
          <p>
            Status:{' '}
            <span data-testid="progress-status" className="font-medium">
              {progressData.status}
            </span>
          </p>
          {progressData.pendingActions && progressData.pendingActions.length > 0 && (
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Pending Actions</h3>
              <ul aria-label="pending actions" className="space-y-2">
                {progressData.pendingActions.map((action, index) => (
                  <li key={index} className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="font-medium">{action.stakeholder}</span>
                    {' — '}
                    {action.action}
                    {' '}
                    <span className="text-sm text-gray-500">({action.status})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="department" className="block text-sm font-medium">Department</label>
          <select
            id="department"
            name="department"
            value={formData.departmentId}
            onChange={(e) => handleChange('departmentId', e.target.value)}
            aria-required="true"
            aria-invalid={errors.departmentId ? 'true' : 'false'}
            aria-describedby={errors.departmentId ? 'department-error' : undefined}
            className="mt-1 block w-full rounded border p-2"
          >
            <option value="">Select department</option>
            {options.departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <p id="department-error" role="alert" aria-live="assertive" className="mt-1 text-sm text-red-600">
              {errors.departmentId}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium">Location</label>
          <select
            id="location"
            name="location"
            value={formData.locationId}
            onChange={(e) => handleChange('locationId', e.target.value)}
            aria-required="true"
            aria-invalid={errors.locationId ? 'true' : 'false'}
            aria-describedby={errors.locationId ? 'location-error' : undefined}
            className="mt-1 block w-full rounded border p-2"
          >
            <option value="">Select location</option>
            {options.locations?.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          {errors.locationId && (
            <p id="location-error" role="alert" aria-live="assertive" className="mt-1 text-sm text-red-600">
              {errors.locationId}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium">Role</label>
          <select
            id="role"
            name="role"
            value={formData.roleId}
            onChange={(e) => handleChange('roleId', e.target.value)}
            aria-required="true"
            aria-invalid={errors.roleId ? 'true' : 'false'}
            aria-describedby={errors.roleId ? 'role-error' : undefined}
            className="mt-1 block w-full rounded border p-2"
          >
            <option value="">Select role</option>
            {options.roles?.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.roleId && (
            <p id="role-error" role="alert" aria-live="assertive" className="mt-1 text-sm text-red-600">
              {errors.roleId}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="effective-date" className="block text-sm font-medium">Effective Date</label>
          <input
            id="effective-date"
            name="effectiveDate"
            type="date"
            value={formData.effectiveDate}
            onChange={(e) => handleChange('effectiveDate', e.target.value)}
            aria-required="true"
            aria-invalid={errors.effectiveDate ? 'true' : 'false'}
            aria-describedby={errors.effectiveDate ? 'effective-date-error' : undefined}
            className="mt-1 block w-full rounded border p-2"
          />
          {errors.effectiveDate && (
            <p id="effective-date-error" role="alert" aria-live="assertive" className="mt-1 text-sm text-red-600">
              {errors.effectiveDate}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium">Reason</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            aria-invalid="false"
            className="mt-1 block w-full rounded border p-2"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </main>
  );
}

export default InternalTransferPage;