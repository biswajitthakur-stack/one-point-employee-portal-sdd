import React, { useState, useRef } from 'react';
import { loginDemo, DEMO_CREDENTIALS } from '../../services/authService';

function LoginPage({ onLoginSuccess }) {
  const [activeRole, setActiveRole] = useState('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setErrors({});
    setLoginError('');
  };

  const handleFillDemoCredentials = (role) => {
    const creds = DEMO_CREDENTIALS[role];
    if (creds) {
      setActiveRole(role);
      setEmail(creds.email);
      setPassword(creds.password);
      setErrors({});
      setLoginError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.email && emailInputRef.current) {
        emailInputRef.current.focus();
      } else if (newErrors.password && passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const session = loginDemo(email, password, activeRole);
      setIsSubmitting(false);
      if (onLoginSuccess) {
        onLoginSuccess(session);
      }
    } catch (err) {
      setIsSubmitting(false);
      setLoginError(err.message || 'Invalid credentials or role selection.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Branding & Welcome */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md text-lg">
            1P
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to access your One-Point Employee Portal account
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl bg-white p-8 shadow-xl border border-slate-200/80">
          {/* Role Selection Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Select Portal Role
            </label>
            <div role="tablist" aria-label="Portal Role Selection" className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                role="tab"
                aria-selected={activeRole === 'employee'}
                onClick={() => handleRoleChange('employee')}
                className={`rounded-lg py-2 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  activeRole === 'employee'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Employee Portal
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeRole === 'admin'}
                onClick={() => handleRoleChange('admin')}
                className={`rounded-lg py-2 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  activeRole === 'admin'
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin Portal
              </button>
            </div>
          </div>

          {/* Alert Error Message */}
          {loginError && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-start space-x-2"
            >
              <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address / Username <span className="text-red-500">*</span>
              </label>
              <input
                ref={emailInputRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-required="true"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                placeholder={activeRole === 'admin' ? 'admin@onepoint.demo' : 'employee@onepoint.demo'}
                className={`block w-full rounded-lg border p-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  ref={passwordInputRef}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-required="true"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  placeholder="••••••••"
                  className={`block w-full rounded-lg border p-2.5 pr-10 text-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.05 10.05 0 014.122-.924c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-2.115 1.54A9.976 9.976 0 0112 19c-1.393 0-2.715-.285-3.914-.8L15 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-xs text-red-600 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-lg py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeRole === 'admin'
                  ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Signing in...' : `Sign in to ${activeRole === 'admin' ? 'Admin' : 'Employee'} Portal`}
            </button>
          </form>

          {/* Quick-Fill Demo Helper Area */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Quick Fill Demo Credentials
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                aria-label="Fill Employee Demo"
                onClick={() => handleFillDemoCredentials('employee')}
                className="flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50/50 p-2 text-left hover:bg-indigo-50 transition-colors group"
              >
                <div>
                  <div className="text-xs font-semibold text-indigo-950">Employee Demo</div>
                  <div className="text-[11px] text-slate-500 font-mono">employee@onepoint.demo</div>
                </div>
                <span className="text-xs text-indigo-700 font-medium group-hover:underline">Fill</span>
              </button>

              <button
                type="button"
                aria-label="Fill Admin Demo"
                onClick={() => handleFillDemoCredentials('admin')}
                className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/50 p-2 text-left hover:bg-amber-50 transition-colors group"
              >
                <div>
                  <div className="text-xs font-semibold text-amber-950">Admin Demo</div>
                  <div className="text-[11px] text-slate-500 font-mono">admin@onepoint.demo</div>
                </div>
                <span className="text-xs text-amber-700 font-medium group-hover:underline">Fill</span>
              </button>
            </div>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <p className="text-center text-xs text-slate-500">
          Frontend demonstration portal environment using session-based mock authentication.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
