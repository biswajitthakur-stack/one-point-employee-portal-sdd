import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { setSession, clearSession, DEFAULT_EMPLOYEE_SESSION, DEFAULT_ADMIN_SESSION } from '../../src/services/authService';
import AdminDashboard from '../../src/pages/AdminDashboard/AdminDashboard';
import App from '../../src/App';

describe('P2-T05: AdminDashboard component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    sessionStorage.clear();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders the admin dashboard for an authenticated admin session', () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(<AdminDashboard session={DEFAULT_ADMIN_SESSION} onNavigate={mockNavigate} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getAllByText(/Sarah Jenkins/i).length).toBeGreaterThanOrEqual(1);
  });

  it('displays summary statistic cards', () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(<AdminDashboard session={DEFAULT_ADMIN_SESSION} onNavigate={mockNavigate} />);
    expect(screen.getByText(/Total Transfer Requests/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pending Review/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Approved Requests/i)).toBeInTheDocument();
    expect(screen.getByText(/Rejected Requests/i)).toBeInTheDocument();
  });

  it('renders the transfer request table with static records', () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(<AdminDashboard session={DEFAULT_ADMIN_SESSION} onNavigate={mockNavigate} />);
    expect(screen.getByText(/REQ-2026-0891/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Alex Morgan/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Elena Rostova/i)).toBeInTheDocument();
  });

  it('renders status badges for request statuses', () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(<AdminDashboard session={DEFAULT_ADMIN_SESSION} onNavigate={mockNavigate} />);
    expect(screen.getAllByText(/Under Review/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Pending/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Approved/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Rejected/i).length).toBeGreaterThanOrEqual(1);
  });

  it('opens request detail modal upon clicking View Details button', () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(<AdminDashboard session={DEFAULT_ADMIN_SESSION} onNavigate={mockNavigate} />);
    const viewBtns = screen.getAllByRole('button', { name: /view details/i });
    expect(viewBtns.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(viewBtns[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Request Details — REQ-2026-0891/i)).toBeInTheDocument();
  });

  it('closes detail modal when close button is clicked', () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(<AdminDashboard session={DEFAULT_ADMIN_SESSION} onNavigate={mockNavigate} />);
    const viewBtns = screen.getAllByRole('button', { name: /view details/i });
    fireEvent.click(viewBtns[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('filters request records by text search', () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(<AdminDashboard session={DEFAULT_ADMIN_SESSION} onNavigate={mockNavigate} />);
    const searchInput = screen.getByPlaceholderText(/search requests/i);
    fireEvent.change(searchInput, { target: { value: 'Elena' } });
    expect(screen.getByText(/Elena Rostova/i)).toBeInTheDocument();
    expect(screen.queryByText(/REQ-2026-0891/i)).not.toBeInTheDocument();
  });

  it('filters request records by status filter dropdown', () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(<AdminDashboard session={DEFAULT_ADMIN_SESSION} onNavigate={mockNavigate} />);
    const statusFilter = screen.getByLabelText(/filter by status/i);
    fireEvent.change(statusFilter, { target: { value: 'Rejected' } });
    expect(screen.getByText(/Carlos Gomez/i)).toBeInTheDocument();
    expect(screen.queryByText(/Elena Rostova/i)).not.toBeInTheDocument();
  });

  it('renders empty state message when search returns no matching records', () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(<AdminDashboard session={DEFAULT_ADMIN_SESSION} onNavigate={mockNavigate} />);
    const searchInput = screen.getByPlaceholderText(/search requests/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistentEmployeeXYZ' } });
    expect(screen.getByText(/no matching transfer requests found/i)).toBeInTheDocument();
  });
});

describe('P2-T05: App routing integration for Admin Dashboard', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => sessionStorage.clear());

  it('redirects unauthenticated users to login page, not admin dashboard', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1, name: /welcome back/i })).toBeInTheDocument();
    expect(screen.queryByText(/Sarah Jenkins/i)).not.toBeInTheDocument();
  });

  it('employee session renders employee dashboard, not admin dashboard', async () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<App />);
    expect(await screen.findByText(/manage your employee requests/i)).toBeInTheDocument();
    expect(screen.queryByText(/Transfer Requests Pipeline/i)).not.toBeInTheDocument();
  });

  it('admin session lands on admin dashboard page with full metrics and table', async () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(<App />);
    expect(await screen.findByText(/Transfer Requests Pipeline/i)).toBeInTheDocument();
    expect((await screen.findAllByText(/Sarah Jenkins/i)).length).toBeGreaterThanOrEqual(1);
  });
});