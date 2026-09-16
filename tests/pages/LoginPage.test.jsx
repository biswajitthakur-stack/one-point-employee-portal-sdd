import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../src/pages/Auth/LoginPage';
import { getSession, clearSession } from '../../src/services/authService';

describe('P2-T02: LoginPage & Demo Authentication UI', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders login page with title, role selector, inputs, and demo helpers', () => {
    render(<LoginPage onLoginSuccess={() => {}} />);

    expect(screen.getByRole('heading', { level: 1, name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /employee portal/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /admin portal/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address \/ username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in to/i })).toBeInTheDocument();
    expect(screen.getByText(/employee@onepoint.demo/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@onepoint.demo/i)).toBeInTheDocument();
  });

  it('allows switching role tabs between Employee and Admin', () => {
    render(<LoginPage onLoginSuccess={() => {}} />);

    const employeeTab = screen.getByRole('tab', { name: /employee portal/i });
    const adminTab = screen.getByRole('tab', { name: /admin portal/i });

    expect(employeeTab).toHaveAttribute('aria-selected', 'true');
    expect(adminTab).toHaveAttribute('aria-selected', 'false');

    fireEvent.click(adminTab);

    expect(employeeTab).toHaveAttribute('aria-selected', 'false');
    expect(adminTab).toHaveAttribute('aria-selected', 'true');
  });

  it('validates mandatory email and password fields on submit', async () => {
    render(<LoginPage onLoginSuccess={() => {}} />);

    const submitBtn = screen.getByRole('button', { name: /sign in to/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('toggles password visibility with keyboard-accessible show/hide button', () => {
    render(<LoginPage onLoginSuccess={() => {}} />);

    const passwordInput = screen.getByLabelText(/^password/i);
    const toggleBtn = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
  });

  it('fills employee demo credentials when clicking employee quick-fill helper', () => {
    render(<LoginPage onLoginSuccess={() => {}} />);

    const empHelperBtn = screen.getByRole('button', { name: /fill employee demo/i });
    fireEvent.click(empHelperBtn);

    expect(screen.getByLabelText(/email address \/ username/i)).toHaveValue('employee@onepoint.demo');
    expect(screen.getByLabelText(/^password/i)).toHaveValue('Employee@123');
  });

  it('fills admin demo credentials when clicking admin quick-fill helper', () => {
    render(<LoginPage onLoginSuccess={() => {}} />);

    const adminHelperBtn = screen.getByRole('button', { name: /fill admin demo/i });
    fireEvent.click(adminHelperBtn);

    expect(screen.getByLabelText(/email address \/ username/i)).toHaveValue('admin@onepoint.demo');
    expect(screen.getByLabelText(/^password/i)).toHaveValue('Admin@123');
    expect(screen.getByRole('tab', { name: /admin portal/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('shows error message on invalid credentials', async () => {
    render(<LoginPage onLoginSuccess={() => {}} />);

    fireEvent.change(screen.getByLabelText(/email address \/ username/i), { target: { value: 'wrong@onepoint.demo' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'Wrong@123' } });

    fireEvent.click(screen.getByRole('button', { name: /sign in to/i }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/invalid credentials or role selection/i)).toBeInTheDocument();
  });

  it('creates employee session and triggers onLoginSuccess on valid employee login', async () => {
    const handleSuccess = vi.fn();
    render(<LoginPage onLoginSuccess={handleSuccess} />);

    fireEvent.click(screen.getByRole('button', { name: /fill employee demo/i }));
    fireEvent.click(screen.getByRole('button', { name: /sign in to/i }));

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledWith(expect.objectContaining({
        user: expect.objectContaining({ role: 'employee', email: 'employee@onepoint.demo' })
      }));
    });

    const session = getSession();
    expect(session.user.role).toBe('employee');
  });

  it('creates admin session and triggers onLoginSuccess on valid admin login', async () => {
    const handleSuccess = vi.fn();
    render(<LoginPage onLoginSuccess={handleSuccess} />);

    fireEvent.click(screen.getByRole('button', { name: /fill admin demo/i }));
    fireEvent.click(screen.getByRole('button', { name: /sign in to/i }));

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledWith(expect.objectContaining({
        user: expect.objectContaining({ role: 'admin', email: 'admin@onepoint.demo' })
      }));
    });

    const session = getSession();
    expect(session.user.role).toBe('admin');
  });
});
