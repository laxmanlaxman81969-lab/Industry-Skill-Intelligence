import React, { useState } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { StudentOnboarding } from './components/student/onboarding/StudentOnboarding';
import { StudentDashboard } from './components/student/StudentDashboard';
import { SkillGapAnalyzer } from './components/student/SkillGapAnalyzer';
import { SkillGapPage } from './components/student/SkillGapPage';
import { CareerRoadmap } from './components/student/CareerRoadmap';
import { PracticeLab } from './components/student/PracticeLab';
import { MockInterview } from './components/student/MockInterview';
import { OpportunityRadar } from './components/student/OpportunityRadar';
import { CompanyPortal } from './components/company/CompanyPortal';
import { CollegePortal } from './components/college/CollegePortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { UserRole } from './types';

function AppContent() {
  const { currentUser, studentProfile, setStudentProfile } = useApp();

  const [activeView, setActiveView] = useState<string>('landing');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('student');

  // Open auth modal with specific role pre-selected
  const handleOpenAuth = (role: UserRole = 'student') => {
    setAuthDefaultRole(role);
    setAuthModalOpen(true);
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
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenAuth={handleOpenAuth}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* STUDENT ONBOARDING (IF NOT COMPLETED) */}
        {currentUser?.role === 'student' && !studentProfile.onboardingComplete && (
          <StudentOnboarding
            onComplete={() => {
              setActiveView('student-dashboard');
            }}
          />
        )}

        {/* GUEST LANDING PAGE */}
        {(activeView === 'landing' || (!currentUser && activeView !== 'landing')) && (
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

        {/* STUDENT PORTAL VIEWS */}
        {currentUser?.role === 'student' && studentProfile.onboardingComplete && (
          <>
            {/* Student Navigation Sub-bar */}
            <div className="mb-6 flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveView('student-dashboard')}
                className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeView === 'student-dashboard'
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Dashboard (Industry Demand)
              </button>
              <button
                onClick={() => setActiveView('gap-analyzer')}
                className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeView === 'gap-analyzer'
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                AI Skill Gap Analyzer
              </button>
              <button
                onClick={() => setActiveView('skill-gap-page')}
                className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeView === 'skill-gap-page'
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Your Skill Gap
              </button>
              <button
                onClick={() => setActiveView('roadmap')}
                className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeView === 'roadmap'
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Career Growth Roadmap
              </button>
              <button
                onClick={() => setActiveView('practice-lab')}
                className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeView === 'practice-lab'
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Skill Practice Lab
              </button>
              <button
                onClick={() => setActiveView('mock-interview')}
                className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeView === 'mock-interview'
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                AI Video Mock Interview
              </button>
              <button
                onClick={() => setActiveView('opportunities')}
                className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeView === 'opportunities'
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Opportunity Radar
              </button>
            </div>

            {/* Active View Rendering */}
            {activeView === 'student-dashboard' && (
              <StudentDashboard onNavigate={(tab) => setActiveView(tab)} />
            )}
            {activeView === 'gap-analyzer' && (
              <SkillGapAnalyzer onNavigateToRoadmap={() => setActiveView('roadmap')} />
            )}
            {activeView === 'skill-gap-page' && (
              <SkillGapPage onNavigateToRoadmap={() => setActiveView('roadmap')} />
            )}
            {activeView === 'roadmap' && (
              <CareerRoadmap
                onNavigateToLab={() => setActiveView('practice-lab')}
                onNavigateToInterview={() => setActiveView('mock-interview')}
              />
            )}
            {activeView === 'practice-lab' && (
              <PracticeLab onNavigateToRoadmap={() => setActiveView('roadmap')} />
            )}
            {activeView === 'mock-interview' && (
              <MockInterview onNavigateToOpportunities={() => setActiveView('opportunities')} />
            )}
            {activeView === 'opportunities' && <OpportunityRadar />}
          </>
        )}

        {/* COMPANY PORTAL */}
        {currentUser?.role === 'company' && activeView === 'company-portal' && (
          <CompanyPortal />
        )}

        {/* COLLEGE PORTAL */}
        {currentUser?.role === 'college' && activeView === 'college-portal' && (
          <CollegePortal />
        )}

        {/* ADMIN PORTAL */}
        {currentUser?.role === 'admin' && activeView === 'admin-portal' && (
          <AdminPortal />
        )}
      </main>

      <Footer />

      {/* MULTI-PORTAL AUTH MODAL */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={authDefaultRole}
        onSuccessNavigate={handleAuthSuccess}
      />
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
