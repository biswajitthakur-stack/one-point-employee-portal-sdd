import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../src/components/common/Navbar';
import Sidebar from '../../src/components/common/Sidebar';
import App from '../../src/App';
import { setSession, DEFAULT_EMPLOYEE_SESSION, DEFAULT_ADMIN_SESSION } from '../../src/services/authService';

describe('P2-T01: Navigation Shell & View State Foundation', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders Navbar with title, user session info, and mobile toggle', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(
      <Navbar
        currentView="internal_transfer"
        onNavigate={() => {}}
        isMobileMenuOpen={false}
        onToggleMobileMenu={() => {}}
      />
    );

    expect(screen.getByRole('heading', { level: 1, name: /one-point employee portal/i })).toBeInTheDocument();
    expect(screen.getByText(/Alex Morgan/i)).toBeInTheDocument();
    expect(screen.getByText('Employee')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle navigation menu/i })).toBeInTheDocument();
  });

  it('renders role-aware Sidebar links for employee', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(
      <Sidebar
        currentView="employee_dashboard"
        onNavigate={() => {}}
        isMobileOpen={false}
      />
    );

    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /internal transfer/i })).toBeInTheDocument();
  });

  it('renders role-aware Sidebar links for admin', () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(
      <Sidebar
        currentView="admin_dashboard"
        onNavigate={() => {}}
        isMobileOpen={false}
      />
    );

    expect(screen.getByRole('button', { name: /admin dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /all transfer requests/i })).toBeInTheDocument();
  });

  it('renders App shell and allows switching views without breaking existing transfer page rendering', async () => {
    render(<App initialView="internal_transfer" />);

    expect(await screen.findByRole('heading', { level: 1, name: /internal transfer request/i })).toBeInTheDocument();
  });
});

describe('P2-T03: Session Handling, Role Protection & Logout', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('unauthenticated App shows login page, not protected dashboard content', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1, name: /welcome back/i })).toBeInTheDocument();
    expect(screen.queryByText(/manage your employee requests/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Transfer Requests Pipeline/i)).not.toBeInTheDocument();
  });

  it('employee session renders employee dashboard, not admin dashboard', async () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<App />);
    expect(await screen.findByText(/manage your employee requests/i)).toBeInTheDocument();
    expect(screen.queryByText(/Transfer Requests Pipeline/i)).not.toBeInTheDocument();
  });

  it('admin session renders admin dashboard, not employee dashboard', async () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(<App />);
    expect(await screen.findByText(/Transfer Requests Pipeline/i)).toBeInTheDocument();
    expect(screen.queryByText(/manage your employee requests/i)).not.toBeInTheDocument();
  });

  it('Navbar renders accessible logout button for authenticated employee', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(
      <Navbar
        currentView="employee_dashboard"
        onNavigate={() => {}}
        isMobileMenuOpen={false}
        onToggleMobileMenu={() => {}}
      />
    );
    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    expect(logoutBtn).toBeInTheDocument();
    expect(logoutBtn).toBeVisible();
  });

  it('clicking logout from Navbar clears session and calls onNavigate with login', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    const onNavigate = vi.fn();
    render(
      <Navbar
        currentView="employee_dashboard"
        onNavigate={onNavigate}
        isMobileMenuOpen={false}
        onToggleMobileMenu={() => {}}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(sessionStorage.getItem('onepoint_portal_session')).toBeNull();
    expect(onNavigate).toHaveBeenCalledWith('login');
  });
});
