import React from 'react';
import dashboardData from '../../data/employee-dashboard.json';
import { getUser } from '../../services/authService';

function EmployeeDashboard({ session, onNavigate }) {
  const activeUser = session?.user || getUser() || dashboardData.profile;

  const handleQuickAction = (actionId) => {
    if (actionId === 'internal_transfer' && onNavigate) {
      onNavigate('internal_transfer');
    }
  };

  return (
    <main aria-label="Employee Dashboard" className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              Employee Portal
            </span>
            <span className="text-xs text-slate-500 font-mono">Demo Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {activeUser.name || 'Alex Morgan'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your employee requests and workplace information from one place.
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={() => handleQuickAction('internal_transfer')}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Submit Internal Transfer
          </button>
        </div>
      </div>

      {/* Grid: Profile Card & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Employee Profile</span>
              </h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                {activeUser.status || 'Active'}
              </span>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <dt className="text-slate-500 font-medium">Employee Name</dt>
                <dd className="font-semibold text-slate-800 text-right">{activeUser.name || 'Alex Morgan'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <dt className="text-slate-500 font-medium">Employee ID</dt>
                <dd className="font-mono font-semibold text-slate-800 text-right">{activeUser.employeeId || 'EMP-001'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <dt className="text-slate-500 font-medium">Role / Designation</dt>
                <dd className="font-medium text-slate-800 text-right">{activeUser.position || activeUser.role || 'Software Engineer'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <dt className="text-slate-500 font-medium">Current Department</dt>
                <dd className="font-medium text-slate-800 text-right">{activeUser.department || 'Engineering'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <dt className="text-slate-500 font-medium">Current Location</dt>
                <dd className="font-medium text-slate-800 text-right">{activeUser.location || 'London, UK'}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-slate-500 font-medium">Workplace Email</dt>
                <dd className="font-mono text-xs text-slate-700 text-right truncate max-w-[180px]">{activeUser.email || 'employee@onepoint.demo'}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Static Demo Profile</span>
            <span className="text-indigo-600 font-medium">Verified Session</span>
          </div>
        </div>

        {/* Quick Statistics Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dashboardData.stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </span>
                <span className="rounded-lg bg-slate-100 p-2 text-slate-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-slate-500 font-medium">
                  {stat.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData.quickActions.map((action) => (
            <div
              key={action.id}
              className={`rounded-2xl bg-white p-6 shadow-sm border transition-all flex flex-col justify-between ${
                action.available
                  ? 'border-indigo-200 bg-linear-to-br from-white to-indigo-50/30 hover:shadow-md'
                  : 'border-slate-200/80 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900">{action.title}</h3>
                  {action.available ? (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-700 tracking-wider">
                      Available
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {action.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleQuickAction(action.id)}
                disabled={!action.available}
                aria-label={action.title}
                className={`w-full rounded-xl py-2.5 px-4 text-xs font-semibold transition-all flex items-center justify-center space-x-2 ${
                  action.available
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xs cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{action.actionText}</span>
                {action.available && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Recent Activity / Request Summary */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
            <p className="text-xs text-slate-500">Summary of recent workplace requests and updates</p>
          </div>
          <span className="text-xs font-medium text-slate-400 font-mono">Static Demo Stream</span>
        </div>

        <div className="divide-y divide-slate-100">
          {dashboardData.recentActivity.map((activity) => (
            <div key={activity.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{activity.title}</div>
                  <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                    <span>{activity.type}</span>
                    <span>•</span>
                    <span>{activity.timeAgo}</span>
                  </div>
                </div>
              </div>

              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold flex-shrink-0 ${
                activity.badgeColor === 'amber'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default EmployeeDashboard;
