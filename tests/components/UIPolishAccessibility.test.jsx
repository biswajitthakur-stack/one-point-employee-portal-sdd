import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { setSession, DEFAULT_ADMIN_SESSION, DEFAULT_EMPLOYEE_SESSION } from '../../src/services/authService';
import AdminDashboard from '../../src/pages/AdminDashboard/AdminDashboard';
import EmployeeDashboard from '../../src/pages/EmployeeDashboard/EmployeeDashboard';
import LoginPage from '../../src/pages/Auth/LoginPage';
import Navbar from '../../src/components/common/Navbar';
import Sidebar from '../../src/components/common/Sidebar';

describe('P2-T06: Global UI Polish & Accessibility Refinements', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('AdminDashboard modal handles Escape key to close modal', () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(<AdminDashboard session={DEFAULT_ADMIN_SESSION} onNavigate={() => {}} />);
    const viewBtns = screen.getAllByRole('button', { name: /view details/i });
    fireEvent.click(viewBtns[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('AdminDashboard modal includes aria-modal="true" for screen readers', () => {
    setSession(DEFAULT_ADMIN_SESSION);
    render(<AdminDashboard session={DEFAULT_ADMIN_SESSION} onNavigate={() => {}} />);
    const viewBtns = screen.getAllByRole('button', { name: /view details/i });
    fireEvent.click(viewBtns[0]);
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  it('Navbar logout button includes visible focus ring classes', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<Navbar currentView="employee_dashboard" onNavigate={() => {}} isMobileMenuOpen={false} onToggleMobileMenu={() => {}} />);
    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    expect(logoutBtn.className).toContain('focus:ring-2');
  });

  it('Sidebar nav item buttons include visible focus ring classes', () => {
    setSession(DEFAULT_EMPLOYEE_SESSION);
    render(<Sidebar currentView="employee_dashboard" onNavigate={() => {}} isMobileOpen={false} />);
    const dashBtn = screen.getByRole('button', { name: /dashboard/i });
    expect(dashBtn.className).toContain('focus:ring-2');
  });

  it('LoginPage role tab buttons include visible focus ring classes', () => {
    render(<LoginPage onLoginSuccess={() => {}} />);
    const empTab = screen.getByRole('tab', { name: /employee portal/i });
    expect(empTab.className).toContain('focus:ring-2');
  });
});
