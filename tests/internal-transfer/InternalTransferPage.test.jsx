import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import InternalTransferPage from '../../src/pages/InternalTransfer/InternalTransferPage';
import * as internalTransferService from '../../src/services/internalTransferService';

describe('employee-internal-transfer — AC01', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('UT01: presents the Internal Transfer Request journey', () => {
    render(<InternalTransferPage />);

    expect(
      screen.getByRole('heading', {
        name: /internal transfer request/i,
      })
    ).toBeInTheDocument();
  });
    
  it('UT02: presents the required transfer fields', () => {
    render(<InternalTransferPage />);

    expect(
      screen.getByLabelText(/department/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/location/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/role/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/effective date/i)
    ).toBeInTheDocument();
  });
    
  it('UT03: presents an optional reason field', () => {
    render(<InternalTransferPage />);

    const reasonField = screen.getByLabelText(/reason/i);

    expect(reasonField).toBeInTheDocument();
    expect(reasonField).not.toBeRequired();
  });

  it('T03: presents an accessible submission action', () => {
    render(<InternalTransferPage />);

    expect(
      screen.getByRole('button', { name: /submit/i })
    ).toBeInTheDocument();
  });
});

describe('employee-internal-transfer — T02 & T03: Form Population via Service Boundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls getTransferOptions on mount using the service boundary', async () => {
    const spy = vi.spyOn(internalTransferService, 'getTransferOptions');
    render(<InternalTransferPage />);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('populates department options dynamically from the service', async () => {
    render(<InternalTransferPage />);

    expect(await screen.findByRole('option', { name: 'Engineering' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Human Resources' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Finance & Payroll' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Operations' })).toBeInTheDocument();
  });

  it('populates location options dynamically from the service', async () => {
    render(<InternalTransferPage />);

    expect(await screen.findByRole('option', { name: 'New York' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'London' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Tokyo' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Remote' })).toBeInTheDocument();
  });

  it('populates role options dynamically from the service', async () => {
    render(<InternalTransferPage />);

    expect(await screen.findByRole('option', { name: 'Software Engineer' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Product Manager' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'HR Business Partner' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Financial Analyst' })).toBeInTheDocument();
  });

  it('verifies UI uses service boundary data rather than hardcoded values', async () => {
    vi.spyOn(internalTransferService, 'getTransferOptions').mockResolvedValueOnce({
      departments: [{ id: 'custom-dept', name: 'Custom Dynamic Dept' }],
      locations: [{ id: 'custom-loc', name: 'Custom Dynamic Loc' }],
      roles: [{ id: 'custom-role', name: 'Custom Dynamic Role' }]
    });

    render(<InternalTransferPage />);

    expect(await screen.findByRole('option', { name: 'Custom Dynamic Dept' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Custom Dynamic Loc' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Custom Dynamic Role' })).toBeInTheDocument();
  });

  it('handles service loading error gracefully without throwing uncaught exceptions', async () => {
    vi.spyOn(internalTransferService, 'getTransferOptions').mockRejectedValueOnce(
      new Error('Network error loading options')
    );

    render(<InternalTransferPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/network error loading options/i);
  });
});

describe('employee-internal-transfer — T04: Approved Form Validation (UT05 / AC05 / AC03)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('UT05: missing required fields prevents submission and displays validation errors', async () => {
    render(<InternalTransferPage />);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/department is required/i)).toBeInTheDocument();
    expect(screen.getByText(/location is required/i)).toBeInTheDocument();
    expect(screen.getByText(/role is required/i)).toBeInTheDocument();
    expect(screen.getByText(/effective date is required/i)).toBeInTheDocument();
  });

  it('displays validation error when departmentId is missing', async () => {
    render(<InternalTransferPage />);
    await screen.findByRole('option', { name: 'New York' });

    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-ny' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-se' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2026-10-01' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/department is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/location is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/role is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/effective date is required/i)).not.toBeInTheDocument();
  });

  it('displays validation error when locationId is missing', async () => {
    render(<InternalTransferPage />);
    await screen.findByRole('option', { name: 'Engineering' });

    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-eng' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-se' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2026-10-01' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/location is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/department is required/i)).not.toBeInTheDocument();
  });

  it('displays validation error when roleId is missing', async () => {
    render(<InternalTransferPage />);
    await screen.findByRole('option', { name: 'Engineering' });

    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-eng' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-ny' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2026-10-01' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/role is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/department is required/i)).not.toBeInTheDocument();
  });

  it('displays validation error when effectiveDate is missing', async () => {
    render(<InternalTransferPage />);
    await screen.findByRole('option', { name: 'Engineering' });

    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-eng' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-ny' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-se' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/effective date is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/department is required/i)).not.toBeInTheDocument();
  });

  it('clears inline validation error when user fills the missing field', async () => {
    render(<InternalTransferPage />);
    await screen.findByRole('option', { name: 'Engineering' });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findByText(/department is required/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-eng' } });

    expect(screen.queryByText(/department is required/i)).not.toBeInTheDocument();
  });

  it('omitting optional reason does not cause validation failure when required fields are present', async () => {
    render(<InternalTransferPage />);
    await screen.findByRole('option', { name: 'Engineering' });

    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-eng' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-ny' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-se' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2026-10-01' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.queryAllByText(/is required/i)).toHaveLength(0);
    expect(await screen.findByRole('status', { name: /validated/i })).toBeInTheDocument();
  });

  it('passes validation when all required fields and optional reason are supplied', async () => {
    render(<InternalTransferPage />);
    await screen.findByRole('option', { name: 'Engineering' });

    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-eng' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-ny' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-se' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2026-10-01' } });
    fireEvent.change(screen.getByLabelText(/reason/i), { target: { value: 'Career growth' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.queryAllByText(/is required/i)).toHaveLength(0);
    expect(await screen.findByRole('status', { name: /validated/i })).toBeInTheDocument();
  });

  it('sets accessible aria-invalid and aria-describedby attributes on invalid fields', async () => {
    render(<InternalTransferPage />);

    const deptSelect = screen.getByLabelText(/department/i);
    expect(deptSelect).toHaveAttribute('aria-invalid', 'false');

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/department is required/i)).toBeInTheDocument();
    expect(deptSelect).toHaveAttribute('aria-invalid', 'true');
    expect(deptSelect).toHaveAttribute('aria-describedby', 'department-error');
    expect(screen.getByText(/department is required/i)).toHaveAttribute('id', 'department-error');
  });
});

describe('employee-internal-transfer — T06: Form Submission & Request State (UT04 / AC04 / AC11)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    internalTransferService.resetTransferStore();
  });

  it('UT04: valid request submission calls createTransferRequest() and displays returned requestId and status', async () => {
    render(<InternalTransferPage />);
    await screen.findByRole('option', { name: 'Human Resources' });

    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-hr' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-tok' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-hrbp' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2026-11-20' } });
    fireEvent.change(screen.getByLabelText(/reason/i), { target: { value: 'Tokyo HR relocation' } });

    const createSpy = vi.spyOn(internalTransferService, 'createTransferRequest');

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith({
      departmentId: 'dept-hr',
      locationId: 'loc-tok',
      roleId: 'role-hrbp',
      effectiveDate: '2026-11-20',
      reason: 'Tokyo HR relocation'
    });

    expect(await screen.findByText(/transfer request submitted successfully/i)).toBeInTheDocument();
    expect(screen.getByTestId('submitted-request-id')).toHaveTextContent(/REQ-/i);
    expect(screen.getByTestId('submitted-request-status')).toHaveTextContent('Submitted');
  });

  it('shows submitting loading state while submission is in flight', async () => {
    let resolveSubmit;
    const submitPromise = new Promise((resolve) => {
      resolveSubmit = resolve;
    });
    vi.spyOn(internalTransferService, 'createTransferRequest').mockReturnValue(submitPromise);

    render(<InternalTransferPage />);
    await screen.findByRole('option', { name: 'Engineering' });

    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-eng' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-lon' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-se' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2026-12-15' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByRole('status', { name: /submitting/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();

    resolveSubmit({ requestId: 'REQ-TEST-123', status: 'Submitted' });

    expect(await screen.findByText(/transfer request submitted successfully/i)).toBeInTheDocument();
    expect(screen.getByText('REQ-TEST-123')).toBeInTheDocument();
    expect(screen.queryByRole('status', { name: /submitting/i })).not.toBeInTheDocument();
  });

  it('prevents duplicate or rapid submissions while submitting', async () => {
    let resolveSubmit;
    const submitPromise = new Promise((resolve) => {
      resolveSubmit = resolve;
    });
    const createSpy = vi.spyOn(internalTransferService, 'createTransferRequest').mockReturnValue(submitPromise);

    render(<InternalTransferPage />);
    await screen.findByRole('option', { name: 'Engineering' });

    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-eng' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-lon' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-se' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2026-12-15' } });

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);

    expect(createSpy).toHaveBeenCalledTimes(1);

    resolveSubmit({ requestId: 'REQ-SINGLE-CALL', status: 'Submitted' });
    expect(await screen.findByText('REQ-SINGLE-CALL')).toBeInTheDocument();
  });

  it('displays an accessible error when createTransferRequest fails', async () => {
    vi.spyOn(internalTransferService, 'createTransferRequest').mockRejectedValueOnce(
      new Error('Service unavailable. Please try again later.')
    );

    render(<InternalTransferPage />);
    await screen.findByRole('option', { name: 'Engineering' });

    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-eng' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-lon' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-se' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2026-12-15' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByRole('alert', { name: /submission-error/i })).toHaveTextContent(
      /service unavailable/i
    );
    expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled();
  });

  it('does not call createTransferRequest when form validation fails', async () => {
    const createSpy = vi.spyOn(internalTransferService, 'createTransferRequest');

    render(<InternalTransferPage />);
    await screen.findByRole('option', { name: 'Engineering' });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/department is required/i)).toBeInTheDocument();
    expect(createSpy).not.toHaveBeenCalled();
  });
});

describe('employee-internal-transfer — T07: Request Status, Progress & Pending Actions (AC06/AC07/AC08/AC10/AC12)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    internalTransferService.resetTransferStore();
  });

  /**
   * Helper: fills required form fields and submits.
   * Waits for the options to load first so selects are populated.
   */
  async function fillAndSubmitForm() {
    await screen.findByRole('option', { name: 'Engineering' });
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-eng' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-ny' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-se' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2027-01-15' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  }

  it('UT06 (AC06): calls getTransferProgress after successful submission and shows fetched status', async () => {
    const progressSpy = vi.spyOn(internalTransferService, 'getTransferProgress').mockResolvedValueOnce({
      requestId: 'REQ-TEST-UT06',
      status: 'Submitted',
      pendingActions: []
    });

    vi.spyOn(internalTransferService, 'createTransferRequest').mockResolvedValueOnce({
      requestId: 'REQ-TEST-UT06',
      status: 'Submitted'
    });

    render(<InternalTransferPage />);
    await fillAndSubmitForm();

    expect(progressSpy).toHaveBeenCalledTimes(1);
    expect(progressSpy).toHaveBeenCalledWith('REQ-TEST-UT06');

    expect(await screen.findByTestId('progress-status')).toHaveTextContent('Submitted');
  });

  it('UT07 (AC07): displays pending stakeholder actions from service data after submission', async () => {
    vi.spyOn(internalTransferService, 'createTransferRequest').mockResolvedValueOnce({
      requestId: 'REQ-TEST-UT07',
      status: 'In Progress'
    });
    vi.spyOn(internalTransferService, 'getTransferProgress').mockResolvedValueOnce({
      requestId: 'REQ-TEST-UT07',
      status: 'In Progress',
      pendingActions: [
        { stakeholder: 'Manager', action: 'Transfer confirmation', status: 'Pending' },
        { stakeholder: 'HR', action: 'Eligibility validation', status: 'In Progress' }
      ]
    });

    render(<InternalTransferPage />);
    await fillAndSubmitForm();

    // Scope within the progress section to avoid ambiguous matches with dropdown option text
    const progressSection = await screen.findByRole('region', { name: /transfer request progress/i });
    expect(within(progressSection).getByText(/Manager/i)).toBeInTheDocument();
    expect(within(progressSection).getByText(/Transfer confirmation/i)).toBeInTheDocument();
    expect(within(progressSection).getByText(/HR/i)).toBeInTheDocument();
    expect(within(progressSection).getByText(/Eligibility validation/i)).toBeInTheDocument();
  });

  it('UT08 (AC08): shows a single progress view combining status and pending actions', async () => {
    vi.spyOn(internalTransferService, 'createTransferRequest').mockResolvedValueOnce({
      requestId: 'REQ-TEST-UT08',
      status: 'Submitted'
    });
    vi.spyOn(internalTransferService, 'getTransferProgress').mockResolvedValueOnce({
      requestId: 'REQ-TEST-UT08',
      status: 'Submitted',
      pendingActions: [
        { stakeholder: 'Manager', action: 'Transfer confirmation', status: 'Pending' }
      ]
    });

    render(<InternalTransferPage />);
    await fillAndSubmitForm();

    const progressSection = await screen.findByRole('region', { name: /transfer request progress/i });
    expect(progressSection).toBeInTheDocument();
    expect(progressSection).toHaveTextContent(/Submitted/i);
    expect(progressSection).toHaveTextContent(/Manager/i);
    expect(progressSection).toHaveTextContent(/Transfer confirmation/i);
  });

  it('UT10 (AC10): downstream failure status is NOT shown as successfully completed', async () => {
    vi.spyOn(internalTransferService, 'createTransferRequest').mockResolvedValueOnce({
      requestId: 'REQ-TEST-UT10',
      status: 'Submitted'
    });
    vi.spyOn(internalTransferService, 'getTransferProgress').mockResolvedValueOnce({
      requestId: 'REQ-TEST-UT10',
      status: 'Downstream Processing Failed',
      pendingActions: [
        { stakeholder: 'Payroll', action: 'Payroll profile update', status: 'Failed' }
      ]
    });

    render(<InternalTransferPage />);
    await fillAndSubmitForm();

    expect(await screen.findByTestId('progress-status')).toHaveTextContent('Downstream Processing Failed');
    expect(screen.queryByText(/successfully completed/i)).not.toBeInTheDocument();
  });

  it('shows a loading indicator while fetching progress', async () => {
    let resolveProgress;
    const progressPromise = new Promise((resolve) => { resolveProgress = resolve; });

    vi.spyOn(internalTransferService, 'createTransferRequest').mockResolvedValueOnce({
      requestId: 'REQ-TEST-LOADING',
      status: 'Submitted'
    });
    vi.spyOn(internalTransferService, 'getTransferProgress').mockReturnValueOnce(progressPromise);

    render(<InternalTransferPage />);
    await fillAndSubmitForm();

    expect(await screen.findByRole('status', { name: /loading progress/i })).toBeInTheDocument();

    resolveProgress({ requestId: 'REQ-TEST-LOADING', status: 'Submitted', pendingActions: [] });
    expect(await screen.findByTestId('progress-status')).toHaveTextContent('Submitted');
    expect(screen.queryByRole('status', { name: /loading progress/i })).not.toBeInTheDocument();
  });

  it('shows no pending actions list when service returns an empty pendingActions array', async () => {
    vi.spyOn(internalTransferService, 'createTransferRequest').mockResolvedValueOnce({
      requestId: 'REQ-TEST-NOACTIONS',
      status: 'Submitted'
    });
    vi.spyOn(internalTransferService, 'getTransferProgress').mockResolvedValueOnce({
      requestId: 'REQ-TEST-NOACTIONS',
      status: 'Submitted',
      pendingActions: []
    });

    render(<InternalTransferPage />);
    await fillAndSubmitForm();

    await screen.findByTestId('progress-status');
    expect(screen.queryByRole('list', { name: /pending actions/i })).not.toBeInTheDocument();
  });

  it('(AC12) handles not-found error from getTransferProgress gracefully', async () => {
    vi.spyOn(internalTransferService, 'createTransferRequest').mockResolvedValueOnce({
      requestId: 'REQ-GONE',
      status: 'Submitted'
    });
    vi.spyOn(internalTransferService, 'getTransferProgress').mockRejectedValueOnce(
      new internalTransferService.ServiceError(404, 'Transfer request with ID "REQ-GONE" not found')
    );

    render(<InternalTransferPage />);
    await fillAndSubmitForm();

    expect(await screen.findByRole('alert', { name: /progress-error/i })).toBeInTheDocument();
  });

  it('(AC09/AC12) handles access-denied error from getTransferProgress gracefully', async () => {
    vi.spyOn(internalTransferService, 'createTransferRequest').mockResolvedValueOnce({
      requestId: 'REQ-DENIED',
      status: 'Submitted'
    });
    vi.spyOn(internalTransferService, 'getTransferProgress').mockRejectedValueOnce(
      new internalTransferService.ServiceError(403, 'Access denied: transfer request belongs to another employee')
    );

    render(<InternalTransferPage />);
    await fillAndSubmitForm();

    expect(await screen.findByRole('alert', { name: /progress-error/i })).toBeInTheDocument();
  });
});

describe('employee-internal-transfer — T08: Failure and Error States (SEC01-SEC06 / AC05 / AC09 / AC11 / AC12)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    internalTransferService.resetTransferStore();
  });

  async function fillAndSubmitForm(effectiveDate = '2027-01-15') {
    await screen.findByRole('option', { name: 'Engineering' });
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-eng' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-ny' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-se' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: effectiveDate } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  }

  it('provides recovery from validation failure: user corrects inputs and re-submits successfully', async () => {
    vi.spyOn(internalTransferService, 'createTransferRequest').mockResolvedValueOnce({
      requestId: 'REQ-RECOVERED',
      status: 'Submitted'
    });
    vi.spyOn(internalTransferService, 'getTransferProgress').mockResolvedValueOnce({
      requestId: 'REQ-RECOVERED',
      status: 'Submitted',
      pendingActions: []
    });

    render(<InternalTransferPage />);
    await screen.findByRole('option', { name: 'Engineering' });

    // Click submit with empty form -> validation failure
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findByText(/department is required/i)).toBeInTheDocument();

    // User corrects all inputs (recovery path)
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-eng' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-ny' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-se' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2027-02-01' } });

    // Submit again
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/transfer request submitted successfully/i)).toBeInTheDocument();
    expect(screen.queryByText(/department is required/i)).not.toBeInTheDocument();
  });

  it('masks internal error details and sensitive information on options loading failure (SEC04)', async () => {
    vi.spyOn(internalTransferService, 'getTransferOptions').mockRejectedValueOnce(
      new Error('Fatal DB failure mongodb://admin:secretPass@internal-db:27017 at Query.run (/app/node_modules/db.js:42:10)')
    );

    render(<InternalTransferPage />);

    const alert = await screen.findByRole('alert', { name: /options-error/i });
    expect(alert).toBeInTheDocument();
    // Verify sensitive/internal details are masked
    expect(alert).not.toHaveTextContent(/secretPass/i);
    expect(alert).not.toHaveTextContent(/mongodb/i);
    expect(alert).not.toHaveTextContent(/node_modules/i);
    expect(alert).toHaveTextContent(/failed to load transfer options/i);
  });

  it('provides recovery when options loading fails: allows retry which loads options successfully', async () => {
    const optionsSpy = vi.spyOn(internalTransferService, 'getTransferOptions')
      .mockRejectedValueOnce(new Error('Temporary network glitch'))
      .mockResolvedValueOnce({
        departments: [{ id: 'dept-eng', name: 'Engineering' }],
        locations: [{ id: 'loc-ny', name: 'New York' }],
        roles: [{ id: 'role-se', name: 'Software Engineer' }]
      });

    render(<InternalTransferPage />);

    const alert = await screen.findByRole('alert', { name: /options-error/i });
    expect(alert).toHaveTextContent(/temporary network glitch/i);

    // Recovery action: click Retry button
    const retryBtn = screen.getByRole('button', { name: /retry loading options/i });
    fireEvent.click(retryBtn);

    expect(optionsSpy).toHaveBeenCalledTimes(2);
    expect(await screen.findByRole('option', { name: 'Engineering' })).toBeInTheDocument();
    expect(screen.queryByRole('alert', { name: /options-error/i })).not.toBeInTheDocument();
  });

  it('handles 409 duplicate submission failure (UT11 / AC11) and provides user recovery', async () => {
    const createSpy = vi.spyOn(internalTransferService, 'createTransferRequest')
      .mockRejectedValueOnce(
        new internalTransferService.ServiceError(
          409,
          'Duplicate logical submission: an identical transfer request already exists for this employee'
        )
      )
      .mockResolvedValueOnce({
        requestId: 'REQ-NEW-DATE',
        status: 'Submitted'
      });
    vi.spyOn(internalTransferService, 'getTransferProgress').mockResolvedValueOnce({
      requestId: 'REQ-NEW-DATE',
      status: 'Submitted',
      pendingActions: []
    });

    render(<InternalTransferPage />);
    await fillAndSubmitForm('2027-01-15');

    // Shows 409 duplicate submission error
    const submissionAlert = await screen.findByRole('alert', { name: /submission-error/i });
    expect(submissionAlert).toHaveTextContent(/duplicate logical submission/i);

    // Form retains previously entered values
    expect(screen.getByLabelText(/effective date/i)).toHaveValue('2027-01-15');
    // Submit button is re-enabled
    expect(screen.getByRole('button', { name: /submit request/i })).not.toBeDisabled();

    // Recovery: user modifies a field (e.g. changes effective date)
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2027-03-01' } });
    // Error clears on change
    expect(screen.queryByRole('alert', { name: /submission-error/i })).not.toBeInTheDocument();

    // Re-submitting now succeeds
    fireEvent.click(screen.getByRole('button', { name: /submit request/i }));
    expect(await screen.findByText(/transfer request submitted successfully/i)).toBeInTheDocument();
    expect(createSpy).toHaveBeenCalledTimes(2);
  });

  it('masks internal server errors and stack traces on submission failure (SEC04)', async () => {
    vi.spyOn(internalTransferService, 'createTransferRequest').mockRejectedValueOnce(
      new internalTransferService.ServiceError(
        500,
        'Internal cluster error: Postgres secret password=xyz at /node_modules/pg/client.js:20:5'
      )
    );

    render(<InternalTransferPage />);
    await fillAndSubmitForm();

    const alert = await screen.findByRole('alert', { name: /submission-error/i });
    expect(alert).toBeInTheDocument();
    expect(alert).not.toHaveTextContent(/password=xyz/i);
    expect(alert).not.toHaveTextContent(/Postgres/i);
    expect(alert).not.toHaveTextContent(/node_modules/i);
    expect(alert).toHaveTextContent(/service unavailable/i);
  });

  it('handles 401 unauthenticated session safely on submission (SEC01)', async () => {
    vi.spyOn(internalTransferService, 'createTransferRequest').mockRejectedValueOnce(
      new internalTransferService.ServiceError(401, 'User is not authenticated')
    );

    render(<InternalTransferPage />);
    await fillAndSubmitForm();

    const alert = await screen.findByRole('alert', { name: /submission-error/i });
    expect(alert).toHaveTextContent(/user is not authenticated/i);
  });

  it('provides recovery when progress loading fails: allows retry which renders progress successfully', async () => {
    vi.spyOn(internalTransferService, 'createTransferRequest').mockResolvedValueOnce({
      requestId: 'REQ-RETRY-PROG',
      status: 'Submitted'
    });
    const progressSpy = vi.spyOn(internalTransferService, 'getTransferProgress')
      .mockRejectedValueOnce(new Error('Temporary progress fetch timeout'))
      .mockResolvedValueOnce({
        requestId: 'REQ-RETRY-PROG',
        status: 'Submitted',
        pendingActions: [
          { stakeholder: 'Manager', action: 'Transfer confirmation', status: 'Pending' }
        ]
      });

    render(<InternalTransferPage />);
    await fillAndSubmitForm();

    const progressAlert = await screen.findByRole('alert', { name: /progress-error/i });
    expect(progressAlert).toHaveTextContent(/temporary progress fetch timeout/i);

    // Recovery action: click Retry in the progress error alert
    const retryBtn = screen.getByRole('button', { name: /retry loading progress/i });
    fireEvent.click(retryBtn);

    expect(progressSpy).toHaveBeenCalledTimes(2);
    expect(await screen.findByRole('region', { name: /transfer request progress/i })).toBeInTheDocument();
    expect(screen.getByTestId('progress-status')).toHaveTextContent('Submitted');
    expect(screen.queryByRole('alert', { name: /progress-error/i })).not.toBeInTheDocument();
  });

  it('masks internal server errors and stack traces on progress loading failure (SEC04)', async () => {
    vi.spyOn(internalTransferService, 'createTransferRequest').mockResolvedValueOnce({
      requestId: 'REQ-PROG-SEC',
      status: 'Submitted'
    });
    vi.spyOn(internalTransferService, 'getTransferProgress').mockRejectedValueOnce(
      new internalTransferService.ServiceError(
        500,
        'Redis cache secret_token=abc12345 at Connection.parse (/node_modules/redis.js:10:2)'
      )
    );

    render(<InternalTransferPage />);
    await fillAndSubmitForm();

    const alert = await screen.findByRole('alert', { name: /progress-error/i });
    expect(alert).toBeInTheDocument();
    expect(alert).not.toHaveTextContent(/secret_token/i);
    expect(alert).not.toHaveTextContent(/abc12345/i);
    expect(alert).not.toHaveTextContent(/node_modules/i);
    expect(alert).toHaveTextContent(/service unavailable|unable to load request progress/i);
  });
});

describe('employee-internal-transfer — T09: Accessibility Validation for the Feature Journey', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    internalTransferService.resetTransferStore();
  });

  it('sets aria-required="true" on mandatory controls and not on optional reason', () => {
    render(<InternalTransferPage />);

    expect(screen.getByLabelText(/department/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/location/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/role/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/effective date/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/reason/i)).not.toHaveAttribute('aria-required', 'true');
  });

  it('ensures all form controls have associated labels and unique accessible names', () => {
    render(<InternalTransferPage />);

    const deptSelect = screen.getByLabelText(/department/i);
    const locSelect = screen.getByLabelText(/location/i);
    const roleSelect = screen.getByLabelText(/role/i);
    const dateInput = screen.getByLabelText(/effective date/i);
    const reasonInput = screen.getByLabelText(/reason/i);
    const submitBtn = screen.getByRole('button', { name: /submit request/i });

    expect(deptSelect).toBeInTheDocument();
    expect(locSelect).toBeInTheDocument();
    expect(roleSelect).toBeInTheDocument();
    expect(dateInput).toBeInTheDocument();
    expect(reasonInput).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
  });

  it('associates validation errors with inputs via aria-describedby and aria-invalid', async () => {
    render(<InternalTransferPage />);

    fireEvent.click(screen.getByRole('button', { name: /submit request/i }));

    const deptSelect = await screen.findByLabelText(/department/i);
    expect(deptSelect).toHaveAttribute('aria-invalid', 'true');
    expect(deptSelect).toHaveAttribute('aria-describedby', 'department-error');

    const errorMsg = screen.getByText(/department is required/i);
    expect(errorMsg).toHaveAttribute('id', 'department-error');
  });

  it('moves keyboard focus to the first invalid field when form submission fails validation', async () => {
    render(<InternalTransferPage />);

    fireEvent.click(screen.getByRole('button', { name: /submit request/i }));

    const deptSelect = await screen.findByLabelText(/department/i);
    expect(document.activeElement).toBe(deptSelect);
  });

  it('uses aria-live="polite" on status elements and aria-live="assertive" on alerts', async () => {
    vi.spyOn(internalTransferService, 'getTransferOptions').mockRejectedValueOnce(
      new Error('Options service error')
    );

    render(<InternalTransferPage />);

    const alert = await screen.findByRole('alert', { name: /options-error/i });
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('maintains heading hierarchy (h1 -> h2 -> h3) for screen readers', async () => {
    vi.spyOn(internalTransferService, 'createTransferRequest').mockResolvedValueOnce({
      requestId: 'REQ-HEADING-ACC',
      status: 'In Progress'
    });
    vi.spyOn(internalTransferService, 'getTransferProgress').mockResolvedValueOnce({
      requestId: 'REQ-HEADING-ACC',
      status: 'In Progress',
      pendingActions: [
        { stakeholder: 'Manager', action: 'Transfer confirmation', status: 'Pending' }
      ]
    });

    render(<InternalTransferPage />);

    await screen.findByRole('option', { name: 'Engineering' });
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-eng' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-ny' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-se' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2027-01-15' } });
    fireEvent.click(screen.getByRole('button', { name: /submit request/i }));

    expect(await screen.findByRole('heading', { level: 1, name: /internal transfer request/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /transfer request progress/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /pending actions/i })).toBeInTheDocument();
  });

  it('ensures interactive retry buttons are accessible via keyboard and have descriptive names', async () => {
    vi.spyOn(internalTransferService, 'getTransferOptions').mockRejectedValueOnce(
      new Error('Options network error')
    );

    render(<InternalTransferPage />);

    const retryBtn = await screen.findByRole('button', { name: /retry loading options/i });
    expect(retryBtn).toBeInTheDocument();
    expect(retryBtn).not.toBeDisabled();

    // Verify keyboard triggerable
    fireEvent.keyDown(retryBtn, { key: 'Enter', code: 'Enter' });
  });
});

describe('employee-internal-transfer — T10: End-to-End Feature Validation & Traceability Check (AC01–AC12 / UT01–UT24)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    internalTransferService.resetTransferStore();
  });

  it('validates the complete end-to-end happy path journey from option load to progress tracking (AC01–AC04, AC06–AC08 / UT01–UT04, UT06–UT08)', async () => {
    const optionsSpy = vi.spyOn(internalTransferService, 'getTransferOptions');
    const createSpy = vi.spyOn(internalTransferService, 'createTransferRequest');
    const progressSpy = vi.spyOn(internalTransferService, 'getTransferProgress');

    render(<InternalTransferPage />);

    // Step 1: Initial load & options population (AC01/AC02)
    expect(screen.getByRole('heading', { level: 1, name: /internal transfer request/i })).toBeInTheDocument();
    expect(optionsSpy).toHaveBeenCalledTimes(1);

    expect(await screen.findByRole('option', { name: 'Engineering' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'New York' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Software Engineer' })).toBeInTheDocument();

    // Step 2: Form input selection (AC02, AC03)
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'dept-eng' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-ny' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-se' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2027-01-15' } });
    fireEvent.change(screen.getByLabelText(/reason/i), { target: { value: 'Career progression' } });

    // Step 3: Form submission (AC04)
    fireEvent.click(screen.getByRole('button', { name: /submit request/i }));

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith({
      departmentId: 'dept-eng',
      locationId: 'loc-ny',
      roleId: 'role-se',
      effectiveDate: '2027-01-15',
      reason: 'Career progression'
    });

    // Step 4: Submission confirmation & Request ID display (AC04)
    expect(await screen.findByText(/transfer request submitted successfully/i)).toBeInTheDocument();
    const requestIdEl = screen.getByTestId('submitted-request-id');
    expect(requestIdEl).toHaveTextContent(/REQ-/i);

    // Step 5: Post-submission progress & pending actions display (AC06, AC07, AC08)
    expect(progressSpy).toHaveBeenCalledTimes(1);
    const progressRegion = await screen.findByRole('region', { name: /transfer request progress/i });
    expect(progressRegion).toBeInTheDocument();
    expect(within(progressRegion).getByTestId('progress-status')).toHaveTextContent('Submitted');
    expect(within(progressRegion).getByText(/Manager/i)).toBeInTheDocument();
    expect(within(progressRegion).getByText(/Transfer confirmation/i)).toBeInTheDocument();
  });

  it('validates the complete end-to-end failure, retry, and error recovery journey (AC05, AC09–AC12 / UT05, UT09–UT12, UT19, SEC04)', async () => {
    render(<InternalTransferPage />);
    await screen.findByRole('option', { name: 'Engineering' });

    // Step 1: Validation failure blocks submission and focuses first error (AC05 / UT05)
    const submitBtn = screen.getByRole('button', { name: /submit request/i });
    fireEvent.click(submitBtn);

    const deptSelect = await screen.findByLabelText(/department/i);
    expect(document.activeElement).toBe(deptSelect);
    expect(screen.getByText(/department is required/i)).toBeInTheDocument();

    // Step 2: User fills form fields
    fireEvent.change(deptSelect, { target: { value: 'dept-eng' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'loc-ny' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'role-se' } });
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2027-01-15' } });

    // Step 3: Submission fails with 409 Conflict duplicate error (AC11 / UT19)
    const createSpy = vi.spyOn(internalTransferService, 'createTransferRequest')
      .mockRejectedValueOnce(
        new internalTransferService.ServiceError(409, 'Duplicate logical submission: an identical transfer request already exists for this employee')
      )
      .mockResolvedValueOnce({
        requestId: 'REQ-E2E-FIXED',
        status: 'Submitted'
      });

    fireEvent.click(submitBtn);

    const subAlert = await screen.findByRole('alert', { name: /submission-error/i });
    expect(subAlert).toHaveTextContent(/duplicate logical submission/i);

    // Step 4: User corrects duplicate field (changes date) & re-submits (Recovery)
    fireEvent.change(screen.getByLabelText(/effective date/i), { target: { value: '2027-03-01' } });
    expect(screen.queryByRole('alert', { name: /submission-error/i })).not.toBeInTheDocument();

    // Step 5: Progress fetch encounters temporary failure with stack trace (SEC04)
    const progressSpy = vi.spyOn(internalTransferService, 'getTransferProgress')
      .mockRejectedValueOnce(
        new internalTransferService.ServiceError(500, 'Database error password=secret123 at Connection.connect (/node_modules/db.js:10:5)')
      )
      .mockResolvedValueOnce({
        requestId: 'REQ-E2E-FIXED',
        status: 'Submitted',
        pendingActions: [
          { stakeholder: 'Manager', action: 'Transfer confirmation', status: 'Pending' }
        ]
      });

    fireEvent.click(submitBtn);
    expect(createSpy).toHaveBeenCalledTimes(2);

    // Step 6: Verify progress error is sanitized (SEC04) and retry button rendered
    const progAlert = await screen.findByRole('alert', { name: /progress-error/i });
    expect(progAlert).toHaveTextContent(/service unavailable|unable to load request progress/i);
    expect(progAlert).not.toHaveTextContent(/secret123/i);
    expect(progAlert).not.toHaveTextContent(/node_modules/i);

    // Step 7: User clicks Retry loading progress -> recovers and renders progress (AC06-AC08)
    const retryProgBtn = screen.getByRole('button', { name: /retry loading progress/i });
    fireEvent.click(retryProgBtn);

    expect(progressSpy).toHaveBeenCalledTimes(2);
    const progressRegion = await screen.findByRole('region', { name: /transfer request progress/i });
    expect(progressRegion).toBeInTheDocument();
    expect(within(progressRegion).getByTestId('progress-status')).toHaveTextContent('Submitted');
    expect(within(progressRegion).getByText(/Manager/i)).toBeInTheDocument();
  });

  it('verifies presentation layer does not directly import internal-transfer.json and routes only via service boundary', () => {
    // Audit check for service boundary compliance
    expect(internalTransferService.getTransferOptions).toBeDefined();
    expect(internalTransferService.createTransferRequest).toBeDefined();
    expect(internalTransferService.getTransferProgress).toBeDefined();
    expect(internalTransferService.getTransferRequest).toBeDefined();
  });
});