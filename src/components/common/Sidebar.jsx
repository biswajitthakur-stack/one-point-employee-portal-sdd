import React from 'react';
import { getUser } from '../../services/authService';

function Sidebar({ currentView, onNavigate, isMobileOpen }) {
  const user = getUser();
  const isAdmin = user?.role === 'admin';

  const employeeNavItems = [
    { id: 'employee_dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'internal_transfer', label: 'Internal Transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' }
  ];

  const adminNavItems = [
    { id: 'admin_dashboard', label: 'Admin Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'admin_requests', label: 'All Transfer Requests', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
  ];

  const guestNavItems = [
    { id: 'login', label: 'Login', icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' },
    { id: 'internal_transfer', label: 'Internal Transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' }
  ];

  const navItems = user
    ? (isAdmin ? adminNavItems : employeeNavItems)
    : guestNavItems;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 w-64 transform bg-slate-900 border-r border-slate-800 text-slate-300 pt-16 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-label="Sidebar navigation"
    >
      <div className="flex h-full flex-col justify-between p-4">
        <div className="space-y-6">
          <div className="px-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {isAdmin ? 'Admin Portal' : 'Main Menu'}
            </h2>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate && onNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Demo Notice footer */}
        <div className="rounded-lg bg-slate-800/80 p-3 text-xs text-slate-400 border border-slate-700/50">
          <p className="font-semibold text-slate-300 mb-1">Phase 2 Demo Shell</p>
          <p>Session-based mock authentication environment.</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
