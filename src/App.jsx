import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import LoginPage from './pages/Auth/LoginPage';
import InternalTransferPage from './pages/InternalTransfer/InternalTransferPage';
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import { getSession, logout } from './services/authService';

function App({ initialView }) {
  const [session, setSessionState] = useState(() => getSession());

  const getInitialView = () => {
    if (initialView) return initialView;
    const activeSession = getSession();
    if (!activeSession) return 'login';
    if (activeSession.user?.role === 'admin') return 'admin_dashboard';
    if (activeSession.user?.role === 'employee') return 'employee_dashboard';
    return 'internal_transfer';
  };

  const [currentView, setCurrentView] = useState(getInitialView);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const activeSession = getSession();
    setSessionState(activeSession);
  }, [currentView]);

  const handleNavigate = (viewId) => {
    const activeSession = getSession();

    // Guard role-protected views if user is unauthenticated or has wrong role
    if (!activeSession && viewId !== 'login' && viewId !== 'internal_transfer' && !initialView) {
      setCurrentView('login');
      return;
    }

    if (activeSession?.user?.role === 'employee' && (viewId === 'admin_dashboard' || viewId === 'admin_requests')) {
      // Role protection: Employee cannot access admin views
      setCurrentView('employee_dashboard');
      return;
    }

    setCurrentView(viewId);
    setIsMobileMenuOpen(false);
  };

  const handleLoginSuccess = (newSession) => {
    setSessionState(newSession);
    if (newSession.user?.role === 'admin') {
      setCurrentView('admin_dashboard');
    } else {
      setCurrentView('employee_dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    setSessionState(null);
    setCurrentView('login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Render Sidebar only when authenticated or on transfer view */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          isMobileOpen={isMobileMenuOpen}
        />

        {/* Mobile backdrop overlay */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-10 bg-slate-900/50 backdrop-blur-xs md:hidden"
            aria-hidden="true"
          />
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {currentView === 'login' && (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )}

          {currentView === 'internal_transfer' && (
            <InternalTransferPage />
          )}

          {currentView === 'employee_dashboard' && (
            <EmployeeDashboard session={session} onNavigate={handleNavigate} />
          )}

          {currentView === 'admin_dashboard' && (
            <AdminDashboard session={session} onNavigate={handleNavigate} />
          )}

          {currentView === 'admin_requests' && (
            <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Admin Transfer Requests List Shell</h2>
              <p className="text-sm text-slate-600">
                Full Admin Requests List will be expanded in Task P2-T07.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
