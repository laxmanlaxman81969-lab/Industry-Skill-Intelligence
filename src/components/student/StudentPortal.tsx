import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentDashboard } from './StudentDashboard';
import { SkillGapAnalyzer } from './SkillGapAnalyzer';
import { AnalysisResultPage } from './AnalysisResultPage';
import { ResumeData } from './ResumeData';
import { ResumeDetailPage } from './ResumeDetailPage';
import { SkillGapPage } from './SkillGapPage';
import { CareerRoadmap } from './CareerRoadmap';
import { PracticeLab } from './PracticeLab';
import { MockInterview } from './MockInterview';
import { OpportunityRadar } from './OpportunityRadar';
import { StudentMySkills } from './StudentMySkills';
import { StudentFeedback } from './StudentFeedback';
import { StudentNotifications } from './StudentNotifications';
import { StudentProfilePage } from './StudentProfilePage';
import { StudentSettings } from './StudentSettings';
import {
  GraduationCap,
  LayoutDashboard,
  ScanSearch,
  BarChart3,
  User,
  Map,
  ClipboardList,
  Video,
  Star,
  Briefcase,
  Bell,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';

export type StudentView =
  | 'student-dashboard'
  | 'gap-analyzer'
  | 'resume-analysis'
  | 'resume-data'
  | 'skill-gap-page'
  | 'my-skills'
  | 'roadmap'
  | 'practice-lab'
  | 'mock-interview'
  | 'feedback'
  | 'opportunities'
  | 'notifications'
  | 'student-profile'
  | 'student-settings';

interface NavGroup {
  category: string;
  items: {
    id: StudentView;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
  }[];
}

interface StudentPortalProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout: () => void;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class PortalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[PortalErrorBoundary] Uncaught render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto my-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Something went wrong in this view</h2>
            <p className="text-xs text-slate-500 mt-1">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              this.props.onReset();
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm"
          >
            <span>Return to Dashboard</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ activeView, setActiveView, onLogout }) => {
  const { currentUser, studentProfile, assignments } = useApp();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = (view: StudentView | string) => {
    setActiveView(view);
    setMobileSidebarOpen(false);
    const analysisId = view.startsWith('resume-analysis:') ? view.split(':')[1] : null;
    const path = analysisId ? `/ai-skill-analyzer/result/${encodeURIComponent(analysisId)}` : '/';
    window.history.pushState({ view }, '', path);
  };

  const pendingAssignments = assignments?.filter((a) => !a.completed).length || 0;
  const notifCount = 3;

  const navGroups: NavGroup[] = [
    {
      category: 'OVERVIEW',
      items: [
        { id: 'student-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }
      ]
    },
    {
      category: 'SKILL INTELLIGENCE',
      items: [
        { id: 'skill-gap-page', label: 'Industry Demand', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'my-skills', label: 'My Skills', icon: <User className="w-4 h-4" /> },
        { id: 'opportunities', label: 'Opportunities', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'gap-analyzer', label: 'AI Skill Analyzer', icon: <ScanSearch className="w-4 h-4" /> },
        { id: 'resume-data', label: 'Resume Data', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'roadmap', label: 'Skill Roadmap', icon: <Map className="w-4 h-4" /> }
      ]
    },
    {
      category: 'ACTIVITY',
      items: [
        { id: 'practice-lab', label: 'Assignments', icon: <ClipboardList className="w-4 h-4" />, badge: pendingAssignments > 0 ? pendingAssignments : undefined },
        { id: 'mock-interview', label: 'AI Video Interview', icon: <Video className="w-4 h-4" /> },
        { id: 'feedback', label: 'Feedback & Performance', icon: <Star className="w-4 h-4" /> }
      ]
    },
    {
      category: 'ACCOUNT',
      items: [
        { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: notifCount },
        { id: 'student-profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
        { id: 'student-settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
      ]
    }
  ];

  const name = currentUser?.name || studentProfile.fullName || 'N.Lakshman';
  const displayName = name.split(' ')[0] || 'Lakshman';

  const renderContent = () => {
    // Handle resume-analysis:<analysisId> prefix → dedicated result page
    if (activeView.startsWith('resume-analysis')) {
      const analysisId = activeView.includes(':') ? activeView.split(':').slice(1).join(':') : undefined;
      return (
        <AnalysisResultPage
          analysisId={analysisId}
          onNavigate={(tab) => navigate(tab as StudentView)}
          onNavigateToRoadmap={() => navigate('roadmap')}
          onNavigateBack={() => navigate('gap-analyzer')}
        />
      );
    }

    // Handle resume-detail:<fileHash> prefix → dedicated resume detail page
    if (activeView.startsWith('resume-detail')) {
      const fileHash = activeView.includes(':') ? activeView.split(':').slice(1).join(':') : undefined;
      return (
        <ResumeDetailPage
          fileHash={fileHash}
          onNavigate={(tab) => navigate(tab as StudentView)}
          onNavigateBack={() => navigate('resume-data')}
        />
      );
    }

    const view = activeView as StudentView;
    switch (view) {
      case 'student-dashboard':
        return <StudentDashboard onNavigate={(tab) => navigate(tab as StudentView)} />;
      case 'gap-analyzer':
        return (
          <SkillGapAnalyzer
            onNavigate={(tab) => navigate(tab as StudentView)}
            onNavigateToRoadmap={() => navigate('roadmap')}
            onNavigateBack={() => navigate('opportunities')}
          />
        );
      case 'resume-data':
        return <ResumeData onNavigate={(tab) => navigate(tab as StudentView)} onNavigateToAnalyzer={() => navigate('gap-analyzer')} />;
      case 'skill-gap-page':
        return <SkillGapPage onNavigateToRoadmap={() => navigate('roadmap')} />;
      case 'my-skills':
        return <StudentMySkills onNavigate={(v) => navigate(v as StudentView)} />;
      case 'roadmap':
        return (
          <CareerRoadmap
            onNavigateToLab={() => navigate('practice-lab')}
            onNavigateToInterview={() => navigate('mock-interview')}
            onNavigateToResume={() => navigate('resume-data')}
          />
        );
      case 'practice-lab':
        return <PracticeLab onNavigateToRoadmap={() => navigate('roadmap')} />;
      case 'mock-interview':
        return <MockInterview onNavigateToOpportunities={() => navigate('opportunities')} />;
      case 'feedback':
        return <StudentFeedback onNavigate={(v) => navigate(v as StudentView)} />;
      case 'opportunities':
        return <OpportunityRadar onNavigate={(tab) => navigate(tab as StudentView)} />;
      case 'notifications':
        return <StudentNotifications />;
      case 'student-profile':
        return <StudentProfilePage onNavigate={(v) => navigate(v as StudentView)} />;
      case 'student-settings':
        return <StudentSettings />;
      default:
        return <StudentDashboard onNavigate={(tab) => navigate(tab as StudentView)} />;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-slate-700">
      {/* Brand Header */}
      <div className={`p-4 border-b border-slate-200 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
        {!sidebarCollapsed ? (
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-slate-900 tracking-tight leading-tight truncate">
                Industry Skill Intelligence
              </h2>
              <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">
                Industry Demand and Skills Development
              </p>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Grouped Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.category} className="space-y-1">
            {!sidebarCollapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.category}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                  } py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <div className={`flex items-center ${sidebarCollapsed ? '' : 'space-x-3'}`}>
                    <span className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-800'}`}>
                      {item.icon}
                    </span>
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!sidebarCollapsed && item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold leading-none ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout Footer */}
      <div className={`p-3 border-t border-slate-200 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={onLogout}
          title={sidebarCollapsed ? 'Logout' : undefined}
          className={`w-full flex items-center ${
            sidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-3'
          } py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all group`}
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:text-rose-600" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      {/* ─── DESKTOP SIDEBAR ─────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-200 shrink-0 relative z-20 ${
          sidebarCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        <SidebarContent />
        <button
          onClick={() => setSidebarCollapsed((p) => !p)}
          className="absolute -right-3 top-14 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* ─── MOBILE DRAWER BACKDROP ───────────────────────── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ─── MOBILE DRAWER ────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 md:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-900">Industry Skill Intelligence</span>
          <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-500 hover:text-slate-900 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ────────────────────────────── */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[#f8fafc]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-900">Student Portal</span>
          </div>

          <div className="hidden md:flex items-center relative w-72 lg:w-96">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search skills, roles, resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            <button
              onClick={() => navigate('notifications')}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            <button
              onClick={() => navigate('student-profile')}
              className="flex items-center space-x-2 p-1 pl-1.5 pr-2.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all group"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                L
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                {displayName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <PortalErrorBoundary key={activeView} onReset={() => navigate('student-dashboard')}>
              {renderContent()}
            </PortalErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};
