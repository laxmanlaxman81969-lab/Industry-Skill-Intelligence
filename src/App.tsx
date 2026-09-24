import React, { useState } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { StudentOnboarding } from './components/student/onboarding/StudentOnboarding';
import { StudentPortal } from './components/student/StudentPortal';
import { CompanyPortal } from './components/company/CompanyPortal';
import { CollegePortal } from './components/college/CollegePortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { UserRole } from './types';
import { AuthService } from './services/auth';

function AppContent() {
  const { currentUser, studentProfile, logout } = useApp();

  const [activeView, setActiveView] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/login') {
      return 'login';
    }
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/roadmap')) {
      return 'roadmap';
    }
    const session = AuthService.getInstance().getCurrentSession();
    if (session?.user) {
      if (session.user.role === 'student') return 'student-dashboard';
      if (session.user.role === 'company') return 'company-portal';
      if (session.user.role === 'college') return 'college-portal';
      if (session.user.role === 'admin') return 'admin-portal';
    }
    return 'landing';
  });
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('student');

  // Handle browser back / forward navigation
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.view) {
        setActiveView(event.state.view);
        return;
      }
      const path = window.location.pathname;
      if (path === '/login') {
        setActiveView('login');
      } else if (path === '/' || path === '') {
        setActiveView('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenAuth = (role: UserRole = 'student') => {
    setAuthDefaultRole(role);
    setActiveView('login');
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.history.pushState({ view: 'login' }, '', '/login');
    }
  };

  const handleNavigateToHome = () => {
    setActiveView('landing');
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState({ view: 'landing' }, '', '/');
    }
  };

  const handleAuthSuccess = (role: UserRole) => {
    if (role === 'student') {
      if (!studentProfile.onboardingComplete) {
        setActiveView('student-onboarding');
      } else {
        setActiveView('student-dashboard');
      }
    } else if (role === 'company') {
      setActiveView('company-portal');
    } else if (role === 'college') {
      setActiveView('college-portal');
    } else if (role === 'admin') {
      setActiveView('admin-portal');
    }
    if (typeof window !== 'undefined' && window.location.pathname === '/login') {
      window.history.pushState({ view: 'dashboard' }, '', '/');
    }
  };

  const handleLogout = () => {
    logout();
    handleNavigateToHome();
  };

  // Standalone login page (no navbar/footer)
  if (activeView === 'login') {
    return (
      <LoginPage
        defaultRole={authDefaultRole}
        onBackToHome={handleNavigateToHome}
        onSuccessNavigate={handleAuthSuccess}
      />
    );
  }

  const isStudentPortal =
    currentUser?.role === 'student' &&
    studentProfile.onboardingComplete &&
    activeView !== 'landing' &&
    activeView !== 'login' &&
    activeView !== 'student-onboarding';

  // Standalone Student Application View (NO landing page navbar or footer)
  if (isStudentPortal) {
    return (
      <StudentPortal
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />
    );
  }

  const isCompanyPortal =
    currentUser?.role === 'company' &&
    activeView !== 'landing' &&
    activeView !== 'login';

  // Standalone Company Application View (NO landing page navbar or footer)
  if (isCompanyPortal) {
    return (
      <CompanyPortal
        onLogout={handleLogout}
      />
    );
  }

  const isCollegePortal =
    currentUser?.role === 'college' &&
    activeView !== 'landing' &&
    activeView !== 'login';

  // Standalone College Application View (NO landing page navbar or footer)
  if (isCollegePortal) {
    return (
      <CollegePortal onLogout={handleLogout} />
    );
  }

  const isAdminPortal =
    currentUser?.role === 'admin' &&
    activeView !== 'landing' &&
    activeView !== 'login';

  // Standalone Admin Application View (NO landing page navbar or footer)
  if (isAdminPortal) {
    return (
      <AdminPortal onLogout={handleLogout} />
    );
  }

  // Student Onboarding View
  if (currentUser?.role === 'student' && !studentProfile.onboardingComplete && activeView !== 'login') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StudentOnboarding
            onComplete={() => setActiveView('student-dashboard')}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar
        onOpenAuth={handleOpenAuth}
        activeView={activeView}
        setActiveView={(view) => {
          if (view === 'landing') {
            handleNavigateToHome();
          } else {
            setActiveView(view);
          }
        }}
      />

      <main
        className={`flex-1 ${
          activeView === 'landing'
            ? 'w-full'
            : 'max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6'
        }`}
      >
        {/* LANDING PAGE */}
        {activeView === 'landing' && (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onNavigateToStudent={() => {
              if (currentUser?.role === 'student') {
                setActiveView('student-dashboard');
              } else {
                handleOpenAuth('student');
              }
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
