import React from 'react';
import { getUser, clearSession } from '../../services/authService';

function Navbar({ currentView, onNavigate, isMobileMenuOpen, onToggleMobileMenu }) {
  const user = getUser();

  const handleLogout = () => {
    clearSession();
    if (onNavigate) {
      onNavigate('login');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          {/* Mobile menu toggle button */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo & Portal Title */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">
              1P
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              One-Point <span className="text-indigo-400 font-normal">Employee Portal</span>
            </h1>
          </div>
        </div>

        {/* User Info / Role Badge / Logout */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold text-white">{user.name}</div>
                <div className="text-xs text-slate-400">{user.email}</div>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                user.role === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              }`}>
                {user.role === 'admin' ? 'Admin' : 'Employee'}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="ml-2 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                Demo Mode
              </span>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('login')}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
