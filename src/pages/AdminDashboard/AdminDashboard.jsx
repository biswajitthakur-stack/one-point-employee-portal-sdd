import React, { useState, useEffect } from 'react';
import adminData from '../../data/admin-dashboard.json';
import { getUser } from '../../services/authService';

function AdminDashboard({ session, onNavigate }) {
  const activeUser = session?.user || getUser() || { name: 'Sarah Jenkins', role: 'admin' };
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Keyboard accessibility: Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedRequest) {
        setSelectedRequest(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRequest]);

  const filteredRequests = adminData.requests.filter((req) => {
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.currentDepartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requestedDepartment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Pending':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusBadgeIcon = (status) => {
    switch (status) {
      case 'Approved':
        return '✓';
      case 'Rejected':
        return '✕';
      case 'Under Review':
        return '⏳';
      case 'Pending':
      default:
        return '•';
    }
  };

  return (
    <main aria-label="Admin Dashboard" className="space-y-6 max-w-7xl mx-auto pb-8 px-4 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              Admin Portal
            </span>
            <span className="text-xs text-slate-500 font-mono">Static Demo Environment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Transfer Requests Pipeline
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Welcome, {activeUser.name || 'Sarah Jenkins'}. Overview of internal transfer requests across all enterprise departments.
          </p>
        </div>
      </div>

      {/* Quick Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminData.stats.map((stat, idx) => (
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

      {/* Transfer Requests Table Section */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Employee Transfer Requests</h2>
            <p className="text-xs text-slate-500">Review submitted internal transfer applications</p>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests..."
                aria-label="Search requests by name or ID"
                className="block w-full sm:w-64 rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div>
              <label htmlFor="status-filter" className="sr-only">Filter by status</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="block w-full sm:w-auto rounded-xl border border-slate-300 py-2 px-3 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table / Empty State */}
        {filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Request ID</th>
                  <th className="py-3 px-3">Employee</th>
                  <th className="py-3 px-3">Current Dept</th>
                  <th className="py-3 px-3">Requested Dept</th>
                  <th className="py-3 px-3">Target Location</th>
                  <th className="py-3 px-3">Effective Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-indigo-950">{req.id}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{req.employeeName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{req.employeeId}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700">{req.currentDepartment}</td>
                    <td className="py-3.5 px-3 text-slate-900 font-semibold">{req.requestedDepartment}</td>
                    <td className="py-3.5 px-3 text-slate-700">{req.requestedLocation}</td>
                    <td className="py-3.5 px-3 text-slate-600 font-mono">{req.effectiveDate}</td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${getStatusBadgeClass(req.status)}`}>
                        <span aria-hidden="true">{getStatusBadgeIcon(req.status)}</span>
                        <span>{req.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(req)}
                        aria-label={`View details for ${req.id}`}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <svg className="mx-auto h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-slate-700">No matching transfer requests found</p>
            <p className="text-xs text-slate-500">Try adjusting your search criteria or status filter.</p>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getStatusBadgeClass(selectedRequest.status)} mb-1`}>
                  <span aria-hidden="true">{getStatusBadgeIcon(selectedRequest.status)}</span>
                  <span>{selectedRequest.status}</span>
                </span>
                <h3 id="modal-title" className="text-lg font-bold text-slate-900">
                  Request Details — {selectedRequest.id}
                </h3>
                <p className="text-xs text-slate-500">Submitted on {selectedRequest.submittedDate}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                aria-label="Close modal"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <dt className="font-medium text-slate-500">Employee Name</dt>
                <dd className="font-bold text-slate-900 text-sm mt-0.5">{selectedRequest.employeeName}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Employee ID</dt>
                <dd className="font-mono font-semibold text-slate-800 mt-0.5">{selectedRequest.employeeId}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Current Department</dt>
                <dd className="font-semibold text-slate-800 mt-0.5">{selectedRequest.currentDepartment}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Requested Department</dt>
                <dd className="font-semibold text-indigo-700 mt-0.5">{selectedRequest.requestedDepartment}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Target Location</dt>
                <dd className="font-medium text-slate-800 mt-0.5">{selectedRequest.requestedLocation}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Effective Date</dt>
                <dd className="font-mono font-medium text-slate-800 mt-0.5">{selectedRequest.effectiveDate}</dd>
              </div>
            </dl>

            <div className="space-y-1 text-xs border-t border-slate-100 pt-3">
              <div className="font-medium text-slate-500">Transfer Reason / Justification</div>
              <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {selectedRequest.reason}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
              <span className="text-slate-500">Reporting Manager: <strong className="text-slate-800">{selectedRequest.managerName}</strong></span>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminDashboard;
