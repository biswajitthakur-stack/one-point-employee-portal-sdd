import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { setSession, clearSession, DEFAULT_EMPLOYEE_SESSION, DEFAULT_ADMIN_SESSION } from '../../src/services/authService';
import EmployeeDashboard from '../../src/pages/EmployeeDashboard/EmployeeDashboard';
import App from '../../src/App';

describe('P2-T04: EmployeeDashboard component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    sessionStorage.clear();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders the employee dashboard for an authenticated employee session', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<EmployeeDashboard session={DEFAULT_EMPLOYEE_SESSION} onNavigate={mockNavigate} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays the logged-in employee name from the session', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<EmployeeDashboard session={DEFAULT_EMPLOYEE_SESSION} onNavigate={mockNavigate} />);
    const names = screen.getAllByText(/Alex Morgan/i);
    expect(names.length).toBeGreaterThanOrEqual(1);
  });

  it('renders employee profile summary card with static demo data', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<EmployeeDashboard session={DEFAULT_EMPLOYEE_SESSION} onNavigate={mockNavigate} />);
    expect(screen.getByText(/EMP-001/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Engineering/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/London/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Active/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders quick statistics cards', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<EmployeeDashboard session={DEFAULT_EMPLOYEE_SESSION} onNavigate={mockNavigate} />);
    expect(screen.getByText(/Active Requests/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending Actions/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Completed/i).length).toBeGreaterThanOrEqual(1);
  });

  it('shows a quick action for Internal Transfer Request', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<EmployeeDashboard session={DEFAULT_EMPLOYEE_SESSION} onNavigate={mockNavigate} />);
    const transferBtns = screen.getAllByRole('button', { name: /internal transfer/i });
    expect(transferBtns.length).toBeGreaterThanOrEqual(1);
  });

  it('navigates to internal_transfer view when the quick action button is clicked', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<EmployeeDashboard session={DEFAULT_EMPLOYEE_SESSION} onNavigate={mockNavigate} />);
    const transferBtns = screen.getAllByRole('button', { name: /internal transfer/i });
    fireEvent.click(transferBtns[0]);
    expect(mockNavigate).toHaveBeenCalledWith('internal_transfer');
  });

  it('does not render admin-only content on the employee dashboard', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<EmployeeDashboard session={DEFAULT_EMPLOYEE_SESSION} onNavigate={mockNavigate} />);
    expect(screen.queryByText(/admin dashboard/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/all transfer requests/i)).not.toBeInTheDocument();
  });

  it('renders a recent activity or request summary section', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<EmployeeDashboard session={DEFAULT_EMPLOYEE_SESSION} onNavigate={mockNavigate} />);
    expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
  });

  it('has a meaningful accessible heading on the dashboard', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<EmployeeDashboard session={DEFAULT_EMPLOYEE_SESSION} onNavigate={mockNavigate} />);
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it('quick action buttons all have accessible names', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<EmployeeDashboard session={DEFAULT_EMPLOYEE_SESSION} onNavigate={mockNavigate} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      const name = btn.getAttribute('aria-label') || btn.textContent?.trim();
      expect(name).toBeTruthy();
    });
  });

  it('displays a contextual welcome message on the dashboard', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<EmployeeDashboard session={DEFAULT_EMPLOYEE_SESSION} onNavigate={mockNavigate} />);
    expect(screen.getByText(/manage your employee requests/i)).toBeInTheDocument();
  });
});

describe('P2-T04: App routing integration for Employee Dashboard', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => sessionStorage.clear());

  it('redirects unauthenticated users to login, not employee dashboard', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1, name: /welcome back/i })).toBeInTheDocument();
    expect(screen.queryByText(/manage your employee requests/i)).not.toBeInTheDocument();
  });

  it('admin session renders admin dashboard shell, not employee dashboard', async () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(<App />);
    expect(await screen.findByText(/Transfer Requests Pipeline/i)).toBeInTheDocument();
    expect(screen.queryByText(/manage your employee requests/i)).not.toBeInTheDocument();
  });

  it('employee session lands on the employee dashboard page with full content', async () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<App />);
    expect((await screen.findAllByText(/Alex Morgan/i)).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/manage your employee requests/i)).toBeInTheDocument();
  });

  it('clicking Internal Transfer action from App routes to the internal transfer page', async () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<App />);
    const transferBtns = await screen.findAllByRole('button', { name: /internal transfer/i });
    expect(transferBtns.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(transferBtns[0]);
    expect(await screen.findByRole('heading', { level: 1, name: /internal transfer request/i })).toBeInTheDocument();
  });
});