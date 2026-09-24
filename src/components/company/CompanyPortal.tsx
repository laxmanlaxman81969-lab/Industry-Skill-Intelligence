import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SkillLevel } from '../../types';
import {
  GraduationCap,
  LayoutDashboard,
  FilePlus,
  Sliders,
  Users,
  GitCompare,
  Video,
  MessageSquareQuote,
  Briefcase,
  Bell,
  Building2,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Edit3,
  Save,
  Share2,
  Eye,
  ShieldCheck,
  TrendingUp,
  FileText,
  Lightbulb,
  Award,
  Zap,
  Filter,
  Lock,
  Mail,
  Globe,
  Key,
  Database,
  UserPlus,
  Copy,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type CompanyView =
  | 'dashboard'
  | 'create-role'
  | 'required-skills'
  | 'candidates'
  | 'matching'
  | 'interviews'
  | 'feedback'
  | 'outcomes'
  | 'notifications'
  | 'profile'
  | 'settings';

interface NavGroup {
  category: string;
  items: {
    id: CompanyView;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
  }[];
}

interface CompanyPortalProps {
  onLogout: () => void;
}

// Circular progress gauge with light track
const CircularGauge: React.FC<{ percentage: number; colorClass: string; size?: number; strokeWidth?: number }> = ({
  percentage,
  colorClass,
  size = 64,
  strokeWidth = 6,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-1000 ease-out`}
          fill="transparent"
        />
      </svg>
      <span className="absolute text-sm font-extrabold text-slate-900">{percentage}%</span>
    </div>
  );
};

export const CompanyPortal: React.FC<CompanyPortalProps> = ({ onLogout }) => {
  const { companies, jobs, postJob } = useApp();
  const company = companies[0] || {
    id: 'cmp-01',
    name: 'TechNova',
    industry: 'Enterprise Software & Cloud Platforms',
    companySize: '500-1000',
    website: 'https://technova.io',
    location: 'Bangalore, India (Hybrid)',
    description: 'Next-generation cloud infrastructure, microservices architecture, and enterprise software engineering.'
  };

  const [companyName, setCompanyName] = useState('TechNova');
  const [activeView, setActiveView] = useState<CompanyView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // State: Role Requirements
  const [roleRequirements, setRoleRequirements] = useState([
    {
      id: 'role-1',
      title: 'Java Backend Developer',
      department: 'Engineering',
      experience: 'Fresher',
      requiredSkills: ['Java', 'SQL', 'Spring Boot', 'REST APIs'],
      preferredSkills: ['Microservices', 'Docker', 'AWS'],
      candidatesCount: 24,
      status: 'Active'
    },
    {
      id: 'role-2',
      title: 'Software Developer',
      department: 'Platform Team',
      experience: 'Fresher',
      requiredSkills: ['Java', 'SQL', 'Git', 'APIs'],
      preferredSkills: ['Linux', 'CI/CD'],
      candidatesCount: 18,
      status: 'Active'
    },
    {
      id: 'role-3',
      title: 'AI Engineer',
      department: 'Data & AI',
      experience: '0-2 Years',
      requiredSkills: ['Python', 'ML', 'SQL', 'APIs'],
      preferredSkills: ['PyTorch', 'Vector DBs'],
      candidatesCount: 12,
      status: 'Draft'
    }
  ]);

  // State: Required Skills Management
  const [managedSkills, setManagedSkills] = useState([
    { id: 'ms-1', skill: 'Java', importance: 'Required', level: 'Intermediate', coverage: 82, demand: 'High Demand' },
    { id: 'ms-2', skill: 'Spring Boot', importance: 'Required', level: 'Intermediate', coverage: 61, demand: 'High Demand' },
    { id: 'ms-3', skill: 'SQL', importance: 'Required', level: 'Intermediate', coverage: 78, demand: 'High Demand' },
    { id: 'ms-4', skill: 'REST APIs', importance: 'Required', level: 'Intermediate', coverage: 55, demand: 'High Demand' },
    { id: 'ms-5', skill: 'JPA / Hibernate', importance: 'Preferred', level: 'Intermediate', coverage: 43, demand: 'Growing Demand' },
    { id: 'ms-6', skill: 'Microservices', importance: 'Preferred', level: 'Intermediate', coverage: 38, demand: 'Growing Demand' },
    { id: 'ms-7', skill: 'Git & GitHub', importance: 'Required', level: 'Beginner', coverage: 88, demand: 'High Demand' }
  ]);

  // State: Candidate Profiles
  const [candidatesList] = useState([
    {
      id: 'cand-1',
      name: 'N.Lakshman',
      alias: 'Candidate A',
      targetRole: 'Java Backend Developer',
      matchScore: 84,
      readiness: 72,
      matchedSkills: ['Java', 'SQL', 'Spring Boot', 'JDBC'],
      skillGaps: ['REST APIs', 'JPA / Hibernate'],
      verifiedSkills: ['Java', 'SQL', 'JDBC'],
      selfDeclared: ['Spring Boot'],
      status: 'Recommended'
    },
    {
      id: 'cand-2',
      name: 'Rohan Mehta',
      alias: 'Candidate B',
      targetRole: 'Java Backend Developer',
      matchScore: 76,
      readiness: 68,
      matchedSkills: ['SQL', 'Spring Boot'],
      skillGaps: ['REST APIs', 'Microservices'],
      verifiedSkills: ['SQL'],
      selfDeclared: ['Spring Boot'],
      status: 'In Review'
    },
    {
      id: 'cand-3',
      name: 'Priya Verma',
      alias: 'Candidate C',
      targetRole: 'Java Backend Developer',
      matchScore: 69,
      readiness: 64,
      matchedSkills: ['SQL', 'Git'],
      skillGaps: ['Java', 'REST APIs'],
      verifiedSkills: ['Git'],
      selfDeclared: ['SQL'],
      status: 'Evaluating'
    }
  ]);

  // State: Create Role Form
  const [newRoleForm, setNewRoleForm] = useState({
    title: '',
    department: 'Software Engineering',
    experience: 'Fresher / 0-1 Years',
    requiredSkills: 'Java, Spring Boot, SQL, REST APIs',
    preferredSkills: 'Microservices, Docker, Git',
    proficiencyLevel: 'Intermediate' as SkillLevel,
    importance: 'Required',
    description: '',
    responsibilities: '',
    certifications: '',
    projects: ''
  });

  // State: Employer Feedback Form
  const [feedbackSkill, setFeedbackSkill] = useState('Spring Boot');
  const [candidateLevelObserved, setCandidateLevelObserved] = useState('Beginner');
  const [employerExpectedLevel, setEmployerExpectedLevel] = useState('Intermediate');
  const [feedbackNotes, setFeedbackNotes] = useState(
    'Candidate demonstrates foundational knowledge of Java, but needs deeper hands-on implementation experience with Spring Boot and enterprise RESTful API contracts.'
  );

  // State: Hiring Outcomes
  const [placementOutcomes, setPlacementOutcomes] = useState([
    { id: 'po-1', candidate: 'Candidate A (N.Lakshman)', role: 'Java Backend Developer', result: 'Selected', matchScore: 84, outcome: 'Placed', feedbackImpact: 'Reinforces Spring Boot + REST API roadmap weight' },
    { id: 'po-2', candidate: 'Candidate B', role: 'Java Backend Developer', result: 'Not Selected', matchScore: 76, outcome: 'Skill Gap', feedbackImpact: 'Identified Microservices project gap' },
    { id: 'po-3', candidate: 'Candidate C', role: 'Java Backend Developer', result: 'Not Selected', matchScore: 69, outcome: 'Skill Gap', feedbackImpact: 'Requires Core Java OOP strengthening' },
    { id: 'po-4', candidate: 'Candidate D', role: 'Software Developer', result: 'Selected', matchScore: 88, outcome: 'Placed', feedbackImpact: 'Validates SQL + API readiness benchmark' }
  ]);

  // State: Company Profile (Editable)
  const [profileData, setProfileData] = useState({
    companyName: 'TechNova',
    industry: 'Enterprise Software & Cloud Platforms',
    companySize: '500-1000 Employees',
    location: 'Bangalore, India (Hybrid)',
    website: 'https://technova.io',
    contactEmail: 'campus.hiring@technova.io',
    contactPhone: '+91 80 4123 8900',
    description: 'TechNova builds high-throughput cloud infrastructure and distributed enterprise microservices platforms for global financial institutions.',
    primaryTechStack: 'Java, Spring Boot, PostgreSQL, Docker, Kubernetes, AWS',
    collegeTierPreference: 'Tier 1 & Tier 2 Engineering Colleges',
    placementSeason: 'Academic Year 2026-2027'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // State: Company Settings
  const [settingsState, setSettingsState] = useState({
    minReadinessCutoff: 70,
    autoShortlist: true,
    verifiedSkillsOnly: true,
    anonymousInitialScreening: true,
    realtimeMatchAlerts: true,
    weeklySkillIntelligenceDigest: true,
    interviewIntegrityAlerts: true,
    emailFrequency: 'Instant Alerts',
    atsIntegrationActive: true,
    atsPlatform: 'Workday / Greenhouse Webhook',
    webhookUrl: 'https://api.technova.io/v1/campus-hires/webhook',
    apiKey: 'tn_live_sec_994821a8d4e21b7c',
    twoFactorEnabled: true,
    ssoEnabled: true
  });

  const handlePublishRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleForm.title.trim()) return;

    const skillsArray = newRoleForm.requiredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const createdRole = {
      id: `role-${Date.now()}`,
      title: newRoleForm.title.trim(),
      department: newRoleForm.department,
      experience: newRoleForm.experience,
      requiredSkills: skillsArray,
      preferredSkills: newRoleForm.preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      candidatesCount: 15,
      status: 'Active'
    };

    setRoleRequirements((prev) => [createdRole, ...prev]);

    postJob({
      companyId: company.id,
      companyName: companyName,
      title: newRoleForm.title.trim(),
      role: newRoleForm.title.trim(),
      location: company.location,
      type: 'Full-time',
      experience: newRoleForm.experience,
      package: '₹7.5 - ₹11.0 LPA',
      description: newRoleForm.description || 'Enterprise role with structured skill benchmark.',
      requiredSkills: skillsArray.map((s) => ({ skill: s, level: newRoleForm.proficiencyLevel, weight: 9 })),
      minReadinessScore: 70
    });

    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch {}

    showToast(`Role requirement "${newRoleForm.title}" published and connected to platform demand intelligence!`);
    setActiveView('dashboard');
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Feedback on ${feedbackSkill} submitted to platform continuous skill intelligence engine!`);
  };

  const navGroups: NavGroup[] = [
    {
      category: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }
      ]
    },
    {
      category: 'REQUISITIONS & SKILLS',
      items: [
        { id: 'create-role', label: 'Create Role Requirement', icon: <FilePlus className="w-4 h-4" /> },
        { id: 'required-skills', label: 'Required Skills', icon: <Sliders className="w-4 h-4" /> }
      ]
    },
    {
      category: 'CANDIDATES',
      items: [
        { id: 'candidates', label: 'Candidate Profiles', icon: <Users className="w-4 h-4" /> },
        { id: 'matching', label: 'Candidate Matching', icon: <GitCompare className="w-4 h-4" /> }
      ]
    },
    {
      category: 'EVALUATION & OUTCOMES',
      items: [
        { id: 'interviews', label: 'Interview & Evaluation', icon: <Video className="w-4 h-4" /> },
        { id: 'feedback', label: 'Employer Feedback', icon: <MessageSquareQuote className="w-4 h-4" /> },
        { id: 'outcomes', label: 'Hiring / Outcomes', icon: <Briefcase className="w-4 h-4" /> }
      ]
    },
    {
      category: 'ACCOUNT',
      items: [
        { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: 3 },
        { id: 'profile', label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
      ]
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-slate-700">
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
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileSidebarOpen(false);
                  }}
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

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: COMPANY DASHBOARD
  // ──────────────────────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {companyName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your industry skill requirements and evaluate candidate readiness.
          </p>
        </div>
        <span className="self-start sm:self-auto text-[10px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
          Demonstration Data
        </span>
      </div>

      {/* ROW 1: 4 Compact Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Role Requirements</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">5</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skills in Demand</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">18</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Candidates Matched</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">42</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Evaluations</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">8</p>
          </div>
        </div>
      </div>

      {/* ROW 2: INDUSTRY DEMAND | ACTIVE ROLE REQUIREMENTS | TOP CANDIDATE MATCHES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Company Skill Requirements</h3>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                Demonstration Data
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Skills currently required across your company roles</p>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
              <span>Skill</span>
              <span>Demand Level</span>
            </div>

            <div className="space-y-3 mt-3">
              {[
                { name: 'Java', level: 92, status: 'High Demand', color: 'bg-blue-600', statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                { name: 'Spring Boot', level: 88, status: 'High Demand', color: 'bg-blue-600', statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                { name: 'SQL', level: 85, status: 'High Demand', color: 'bg-blue-600', statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                { name: 'REST APIs', level: 82, status: 'High Demand', color: 'bg-blue-600', statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                { name: 'JPA / Hibernate', level: 68, status: 'Growing Demand', color: 'bg-blue-500', statusColor: 'text-blue-700 bg-blue-50 border-blue-200' },
                { name: 'Microservices', level: 62, status: 'Growing Demand', color: 'bg-blue-500', statusColor: 'text-blue-700 bg-blue-50 border-blue-200' }
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 w-28 truncate">{item.name}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.level}%` }} />
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveView('required-skills')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <span>Manage Required Skills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Active Role Requirements</h3>
              </div>
              <button
                onClick={() => setActiveView('create-role')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
              >
                <span>View All Roles</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Defined industry requirements linked to campus matching</p>

            <div className="space-y-3">
              {roleRequirements.map((role) => (
                <div key={role.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{role.title}</h4>
                      <p className="text-[10px] text-slate-500">{role.experience} · {role.department}</p>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        role.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {role.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {role.requiredSkills.map((s) => (
                      <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px]">
                    <span className="text-slate-500">{role.candidatesCount} Candidates Matched</span>
                    <button
                      onClick={() => setActiveView('matching')}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Match Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveView('create-role')}
            className="mt-4 w-full py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Role Requirement</span>
          </button>
        </div>

        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Top Candidate Matches</h3>
                  <p className="text-[10px] text-slate-500">Java Backend Developer</p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('candidates')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
              >
                <span>View Candidates</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {candidatesList.map((cand) => (
                <div key={cand.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3">
                  <CircularGauge
                    percentage={cand.matchScore}
                    colorClass={cand.matchScore >= 80 ? 'text-blue-600' : 'text-cyan-500'}
                    size={54}
                    strokeWidth={5}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{cand.alias}</h4>
                      <span className="text-[9px] text-slate-500">Readiness: {cand.readiness}%</span>
                    </div>

                    <div className="mt-1 space-y-1">
                      <div className="flex items-center space-x-1 text-[10px] text-slate-600">
                        <span className="text-slate-400">Matched:</span>
                        <span className="text-emerald-700 font-medium truncate">
                          {cand.matchedSkills.slice(0, 3).join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-[10px] text-slate-600">
                        <span className="text-slate-400">Gaps:</span>
                        <span className="text-rose-600 font-medium truncate">
                          {cand.skillGaps.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveView('matching')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <span>Open Candidate Matching Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ROW 3: 4 PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900">Common Candidate Skill Gaps</h3>
            </div>
            <p className="text-[10px] text-slate-500 mb-3">Identified across matched student cohorts</p>

            <div className="space-y-2.5">
              {[
                { name: 'REST APIs', gapPercent: 42 },
                { name: 'JPA / Hibernate', gapPercent: 38 },
                { name: 'Spring Boot', gapPercent: 31 },
                { name: 'Microservices', gapPercent: 27 }
              ].map((gap) => (
                <div key={gap.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-700 font-medium">{gap.name}</span>
                    <span className="text-slate-500 font-bold">{gap.gapPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${gap.gapPercent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[10px] text-blue-800 flex items-start space-x-1.5">
            <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-600" />
            <span>Practical backend development skills are the most common gaps among matched candidates.</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Video className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">Pending Evaluations</h3>
            </div>
            <p className="text-[10px] text-slate-500 mb-3">Evaluations ready for recruiter review</p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Java Backend Mock Reviews</h4>
                  <p className="text-[10px] text-slate-500">8 candidates pending</p>
                </div>
                <button
                  onClick={() => setActiveView('interviews')}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors"
                >
                  Review
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">AI Video Interviews</h4>
                  <p className="text-[10px] text-slate-500">5 evaluations pending</p>
                </div>
                <button
                  onClick={() => setActiveView('interviews')}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors"
                >
                  Review
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveView('interviews')}
            className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center space-x-1"
          >
            <span>View All Evaluations</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <MessageSquareQuote className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">Employer Feedback</h3>
            </div>
            <p className="text-[10px] text-slate-500 mb-3">Your feedback helps improve industry skill recommendations.</p>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-[10px]">
              <div className="border-b border-slate-200/60 pb-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Spring Boot</span>
                  <span className="text-slate-500 font-normal">Expected: Intermediate</span>
                </div>
                <p className="text-slate-500 mt-0.5">Candidate Average: Beginner</p>
              </div>

              <div>
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>REST APIs</span>
                  <span className="text-slate-500 font-normal">Expected: Intermediate</span>
                </div>
                <p className="text-slate-500 mt-0.5">Candidate Average: Beginner</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveView('feedback')}
            className="mt-3 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Feedback</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Industry Skill Insight</h3>
            </div>

            <p className="text-xs text-slate-800 leading-snug font-medium mb-2">
              Spring Boot and REST API proficiency are currently important requirements for your Java backend roles.
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Consider increasing practical project requirements and assessments for these skills.
            </p>
          </div>

          <button
            onClick={() => setActiveView('required-skills')}
            className="mt-3 w-full py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all flex items-center justify-center space-x-1"
          >
            <span>Manage Required Skills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ROW 4: HIRING OUTCOMES & NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Hiring / Placement Outcomes</h3>
            </div>
            <button
              onClick={() => setActiveView('outcomes')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
            >
              <span>View Outcomes</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-2xl font-black text-blue-600">42</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Candidates Evaluated</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-2xl font-black text-emerald-600">12</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Selected</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-2xl font-black text-rose-600">30</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Not Selected</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
            </div>
            <button
              onClick={() => setActiveView('notifications')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-slate-800 font-medium">3 new candidate matches</span>
              </div>
              <span className="text-[10px] text-slate-400">2h ago</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-slate-800 font-medium">2 evaluations pending</span>
              </div>
              <span className="text-[10px] text-slate-400">4h ago</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-800 font-medium">1 skill trend update</span>
              </div>
              <span className="text-[10px] text-slate-400">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: CREATE ROLE REQUIREMENT
  // ──────────────────────────────────────────────────────────────────────────
  const renderCreateRole = () => (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900">Create Job / Role Requirement</h2>
        <p className="text-xs text-slate-500 mt-1">
          Define role expectations to update platform industry demand intelligence and match campus candidates.
        </p>
      </div>

      <form onSubmit={handlePublishRole} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Role Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Java Backend Developer"
              value={newRoleForm.title}
              onChange={(e) => setNewRoleForm({ ...newRoleForm, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <input
              type="text"
              value={newRoleForm.department}
              onChange={(e) => setNewRoleForm({ ...newRoleForm, department: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Experience Level
            </label>
            <select
              value={newRoleForm.experience}
              onChange={(e) => setNewRoleForm({ ...newRoleForm, experience: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="Entry Level / Fresher">Entry Level / Fresher</option>
              <option value="0-2 Years">0-2 Years</option>
              <option value="2-4 Years">2-4 Years</option>
              <option value="Internship to Full-time">Internship to Full-time</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Skill Proficiency Target
            </label>
            <select
              value={newRoleForm.proficiencyLevel}
              onChange={(e) => setNewRoleForm({ ...newRoleForm, proficiencyLevel: e.target.value as SkillLevel })}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Required Skills (comma separated) *
          </label>
          <input
            type="text"
            required
            value={newRoleForm.requiredSkills}
            onChange={(e) => setNewRoleForm({ ...newRoleForm, requiredSkills: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
          <p className="text-[10px] text-slate-500 mt-1">Example: Java, SQL, Spring Boot, REST APIs</p>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Preferred / Bonus Skills (comma separated)
          </label>
          <input
            type="text"
            value={newRoleForm.preferredSkills}
            onChange={(e) => setNewRoleForm({ ...newRoleForm, preferredSkills: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Job Description & Responsibilities
          </label>
          <textarea
            rows={4}
            value={newRoleForm.description}
            onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
            placeholder="Outline the core responsibilities, practical architecture expectations, and project scope..."
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Requirement</span>
          </button>
        </div>
      </form>
    </div>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: REQUIRED SKILLS
  // ──────────────────────────────────────────────────────────────────────────
  const renderRequiredSkills = () => (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Manage Required Skills</h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain skills associated with your company roles and view candidate coverage rates.
          </p>
        </div>
        <button
          onClick={() => {
            const skillName = prompt('Enter new skill name:');
            if (skillName && skillName.trim()) {
              setManagedSkills([
                ...managedSkills,
                {
                  id: `ms-${Date.now()}`,
                  skill: skillName.trim(),
                  importance: 'Required',
                  level: 'Intermediate',
                  coverage: 50,
                  demand: 'Growing Demand'
                }
              ]);
              showToast(`Skill ${skillName} added to company requirements.`);
            }
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-3">Skill</th>
                <th className="pb-3 px-3">Importance</th>
                <th className="pb-3 px-3">Required Level</th>
                <th className="pb-3 px-3">Candidate Coverage</th>
                <th className="pb-3 px-3">Demand Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {managedSkills.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{item.skill}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => {
                        setManagedSkills((prev) =>
                          prev.map((s) =>
                            s.id === item.id
                              ? { ...s, importance: s.importance === 'Required' ? 'Preferred' : 'Required' }
                              : s
                          )
                        );
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.importance === 'Required'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item.importance}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{item.level}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${item.coverage}%` }} />
                      </div>
                      <span className="text-slate-600 font-mono text-[11px]">{item.coverage}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        item.demand === 'High Demand'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : 'text-blue-700 bg-blue-50 border-blue-200'
                      }`}
                    >
                      {item.demand}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setManagedSkills((prev) => prev.filter((s) => s.id !== item.id))}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: CANDIDATE PROFILES & MATCHING
  // ──────────────────────────────────────────────────────────────────────────
  const renderCandidates = () => (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900">Candidate Skill Profiles & Matching</h2>
        <p className="text-xs text-slate-500 mt-1">
          Compare role expectations with verified candidate profiles based on practical proficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {candidatesList.map((cand) => (
          <div key={cand.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{cand.alias}</h3>
                  <p className="text-[11px] text-slate-500">{cand.targetRole}</p>
                </div>
                <CircularGauge percentage={cand.matchScore} colorClass="text-blue-600" size={56} strokeWidth={5} />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Verified Skills</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cand.matchedSkills.map((s) => (
                      <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                        <Check className="w-2.5 h-2.5" />
                        <span>{s}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Skill Gaps</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cand.skillGaps.map((g) => (
                      <span key={g} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>{g}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Career Readiness:</span>
                  <span className="font-bold text-slate-900">{cand.readiness}%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  showToast(`Candidate interview invitation sent to ${cand.alias}.`);
                }}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Schedule Technical Interview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: INTERVIEWS & EVALUATIONS
  // ──────────────────────────────────────────────────────────────────────────
  const renderInterviews = () => (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900">Interview & Evaluation Scorecards</h2>
        <p className="text-xs text-slate-500 mt-1">
          Review candidate technical responses, problem solving, and interview integrity signals.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Interview Evaluation</span>
            <h3 className="text-sm font-bold text-slate-900 mt-1">Candidate A (N.Lakshman) — Java Backend Developer</h3>
            <p className="text-xs text-slate-500 mt-0.5">Assessed on Core Java, REST API design, Collections, and Exception Handling</p>
          </div>
          <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">80% Overall</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-sm font-bold text-slate-900">82%</p>
            <p className="text-[10px] text-slate-500">Technical Knowledge</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-sm font-bold text-slate-900">76%</p>
            <p className="text-[10px] text-slate-500">Problem Solving</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-sm font-bold text-slate-900">74%</p>
            <p className="text-[10px] text-slate-500">Communication</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-sm font-bold text-slate-900">86%</p>
            <p className="text-[10px] text-slate-500">Role Relevance</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1.5">
          <p className="font-bold text-blue-700 text-[11px] uppercase tracking-wider">Interview Integrity Signals:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <p>• Face Presence: <span className="text-emerald-700 font-semibold">Active & Continuous</span></p>
            <p>• Multiple Faces: <span className="text-emerald-700 font-semibold">None detected</span></p>
            <p>• Tab Switching: <span className="text-slate-500 font-semibold">1 transient event</span></p>
          </div>
        </div>
      </div>
    </div>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: EMPLOYER FEEDBACK
  // ──────────────────────────────────────────────────────────────────────────
  const renderFeedback = () => (
    <div className="space-y-6 max-w-3xl pb-12">
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900">Employer Feedback & Skill Intelligence</h2>
        <p className="text-xs text-slate-500 mt-1">
          Provide feedback on student readiness and skill gaps to directly influence college curriculum recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmitFeedback} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Skill
            </label>
            <select
              value={feedbackSkill}
              onChange={(e) => setFeedbackSkill(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="Spring Boot">Spring Boot</option>
              <option value="REST APIs">REST APIs</option>
              <option value="JPA / Hibernate">JPA / Hibernate</option>
              <option value="Microservices">Microservices</option>
              <option value="SQL">SQL</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Candidate Level Observed
            </label>
            <select
              value={candidateLevelObserved}
              onChange={(e) => setCandidateLevelObserved(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Employer Expected Level
            </label>
            <select
              value={employerExpectedLevel}
              onChange={(e) => setEmployerExpectedLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Structured Feedback & Practical Recommendations
          </label>
          <textarea
            rows={4}
            value={feedbackNotes}
            onChange={(e) => setFeedbackNotes(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Submit to Platform Intelligence</span>
        </button>
      </form>
    </div>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: PLACEMENT OUTCOMES
  // ──────────────────────────────────────────────────────────────────────────
  const renderOutcomes = () => (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900">Hiring & Placement Outcomes</h2>
        <p className="text-xs text-slate-500 mt-1">
          Recorded outcomes close the loop by training student roadmaps and informing syllabus alignment.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 px-3">Candidate</th>
              <th className="pb-3 px-3">Role</th>
              <th className="pb-3 px-3">Skill Match</th>
              <th className="pb-3 px-3">Result</th>
              <th className="pb-3 px-3">Outcome</th>
              <th className="pb-3 px-3">Feedback Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {placementOutcomes.map((po) => (
              <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-900">{po.candidate}</td>
                <td className="py-3 px-3 text-slate-700">{po.role}</td>
                <td className="py-3 px-3 font-bold text-blue-600">{po.matchScore}%</td>
                <td className="py-3 px-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      po.result === 'Selected'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {po.result}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-700 font-semibold">{po.outcome}</td>
                <td className="py-3 px-3 text-slate-500 text-[11px]">{po.feedbackImpact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: NOTIFICATIONS
  // ──────────────────────────────────────────────────────────────────────────
  const renderNotifications = () => (
    <div className="space-y-6 max-w-3xl pb-12">
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900">Company Notifications</h2>
        <p className="text-xs text-slate-500 mt-1">Real-time alerts for candidate matches, evaluations, and skill demand updates.</p>
      </div>

      <div className="space-y-3">
        {[
          { title: 'New candidate match: 84% on Java Backend Developer', time: '2 hours ago', unread: true },
          { title: 'Assessment completed: 8 submissions ready for review', time: '4 hours ago', unread: true },
          { title: 'Industry demand update: Spring Boot + REST API demand surged by 14%', time: '1 day ago', unread: false },
          { title: 'Employer feedback processed by curriculum engine', time: '2 days ago', unread: false }
        ].map((notif, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`w-2 h-2 rounded-full ${notif.unread ? 'bg-blue-600' : 'bg-slate-300'}`} />
              <div>
                <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{notif.time}</p>
              </div>
            </div>
            {notif.unread && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                New
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: COMPANY PROFILE (Rich, 2-Column SaaS Workspace)
  // ──────────────────────────────────────────────────────────────────────────
  const renderProfile = () => (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-black text-xl shadow-sm">
            T
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{profileData.companyName}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{profileData.industry} · {profileData.location}</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (isEditingProfile) {
              setCompanyName(profileData.companyName);
              showToast('Company profile updated successfully.');
            }
            setIsEditingProfile(!isEditingProfile);
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 self-start sm:self-auto"
        >
          {isEditingProfile ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          <span>{isEditingProfile ? 'Save Profile' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Institutional Overview</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Company Name</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileData.companyName}
                  onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                />
              ) : (
                <p className="text-xs font-bold text-slate-900">{profileData.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Industry Domain</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileData.industry}
                  onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                />
              ) : (
                <p className="text-xs text-slate-700">{profileData.industry}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Company Size</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileData.companySize}
                  onChange={(e) => setProfileData({ ...profileData, companySize: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                />
              ) : (
                <p className="text-xs text-slate-700">{profileData.companySize}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                />
              ) : (
                <p className="text-xs text-slate-700">{profileData.location}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Official Website</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileData.website}
                  onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-blue-600"
                />
              ) : (
                <a href={profileData.website} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                  {profileData.website}
                </a>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Campus Contact Email</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileData.contactEmail}
                  onChange={(e) => setProfileData({ ...profileData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                />
              ) : (
                <p className="text-xs text-slate-700">{profileData.contactEmail}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">About Company</label>
            {isEditingProfile ? (
              <textarea
                rows={3}
                value={profileData.description}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
              />
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">{profileData.description}</p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Tech Stack & Activity */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Core Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {profileData.primaryTechStack.split(',').map((tech) => (
                <span key={tech} className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Campus Engagement</h4>
            <p className="text-xs text-slate-600">{profileData.collegeTierPreference}</p>
            <p className="text-[11px] text-slate-400">Season: {profileData.placementSeason}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: COMPANY SETTINGS (Enterprise SaaS Suite)
  // ──────────────────────────────────────────────────────────────────────────
  const renderSettings = () => (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Company Settings & Preferences</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure campus hiring criteria, candidate matching thresholds, security, and ATS data sync.
          </p>
        </div>

        <button
          onClick={() => {
            showToast('All company settings successfully saved.');
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* SECTION 1: Matching Criteria */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Campus Matching & Screening Criteria
          </h3>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <p className="text-xs font-bold text-slate-900">Minimum Candidate Readiness Score</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Only show students whose readiness benchmark reaches or exceeds this threshold.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={settingsState.minReadinessCutoff}
                onChange={(e) => setSettingsState({ ...settingsState, minReadinessCutoff: Number(e.target.value) })}
                className="w-28 accent-blue-600"
              />
              <span className="text-xs font-black text-blue-600 w-10 text-right">{settingsState.minReadinessCutoff}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <p className="text-xs font-bold text-slate-900">Require Verified Skills Only</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Exclude unverified self-declared skills from role matching calculations.
              </p>
            </div>
            <button
              onClick={() => setSettingsState({ ...settingsState, verifiedSkillsOnly: !settingsState.verifiedSkillsOnly })}
              className={`p-1 rounded-lg transition-colors ${settingsState.verifiedSkillsOnly ? 'text-blue-600' : 'text-slate-400'}`}
            >
              {settingsState.verifiedSkillsOnly ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <p className="text-xs font-bold text-slate-900">Anonymous Initial Candidate Screening</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mask candidate names and demographics as Candidate A, B, C until interview assignment.
              </p>
            </div>
            <button
              onClick={() => setSettingsState({ ...settingsState, anonymousInitialScreening: !settingsState.anonymousInitialScreening })}
              className={`p-1 rounded-lg transition-colors ${settingsState.anonymousInitialScreening ? 'text-blue-600' : 'text-slate-400'}`}
            >
              {settingsState.anonymousInitialScreening ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Notifications */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Notification & Intelligence Alerts
          </h3>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <p className="text-xs font-bold text-slate-900">Real-Time Candidate Match Alerts</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Notify instantly when a student completes roadmap milestones meeting your open role.
              </p>
            </div>
            <button
              onClick={() => setSettingsState({ ...settingsState, realtimeMatchAlerts: !settingsState.realtimeMatchAlerts })}
              className={`p-1 rounded-lg transition-colors ${settingsState.realtimeMatchAlerts ? 'text-blue-600' : 'text-slate-400'}`}
            >
              {settingsState.realtimeMatchAlerts ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <p className="text-xs font-bold text-slate-900">Weekly Campus Cohort Skill Gap Digest</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Email weekly analytics summarizing how college cohorts are progressing against your skills.
              </p>
            </div>
            <button
              onClick={() => setSettingsState({ ...settingsState, weeklySkillIntelligenceDigest: !settingsState.weeklySkillIntelligenceDigest })}
              className={`p-1 rounded-lg transition-colors ${settingsState.weeklySkillIntelligenceDigest ? 'text-blue-600' : 'text-slate-400'}`}
            >
              {settingsState.weeklySkillIntelligenceDigest ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: Security & Team */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Security & Team Members
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Two-Factor Authentication</p>
              <p className="text-[11px] text-emerald-700 mt-0.5 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active & Enforced</span>
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">SSO / SAML Identity</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Okta / Azure AD</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Connected</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-900">Authorized Recruiters & Evaluators</p>
            <button
              onClick={() => showToast('Team invitation link generated and copied.')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite Team Member</span>
            </button>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Priya Nair', role: 'Talent Acquisition Lead', email: 'priya.nair@technova.io', badge: 'Admin' },
              { name: 'Vikram Das', role: 'Engineering Manager', email: 'vikram.das@technova.io', badge: 'Evaluator' },
              { name: 'Anil Kumar', role: 'Technical Recruiter', email: 'anil.kumar@technova.io', badge: 'Member' }
            ].map((member) => (
              <div key={member.email} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{member.name}</p>
                  <p className="text-[10px] text-slate-500">{member.role} · {member.email}</p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                  {member.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: ATS Integration */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            ATS Integration & Readiness Webhooks
          </h3>
        </div>

        <div className="space-y-3 pt-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Webhook Endpoint (Shortlists & Outcomes)</label>
            <input
              type="text"
              value={settingsState.webhookUrl}
              onChange={(e) => setSettingsState({ ...settingsState, webhookUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Production API Key</label>
            <div className="flex items-center space-x-2">
              <input
                type="password"
                readOnly
                value={settingsState.apiKey}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 font-mono"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(settingsState.apiKey);
                  showToast('API Key copied to clipboard.');
                }}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center space-x-1 text-xs font-semibold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'create-role':
        return renderCreateRole();
      case 'required-skills':
        return renderRequiredSkills();
      case 'candidates':
      case 'matching':
        return renderCandidates();
      case 'interviews':
        return renderInterviews();
      case 'feedback':
        return renderFeedback();
      case 'outcomes':
        return renderOutcomes();
      case 'notifications':
        return renderNotifications();
      case 'profile':
        return renderProfile();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

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
            <span className="text-xs font-bold text-slate-900">Company Portal</span>
          </div>

          <div className="hidden md:flex items-center relative w-72 lg:w-96">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search roles, skills, candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            <button
              onClick={() => setActiveView('notifications')}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            <button
              onClick={() => setActiveView('profile')}
              className="flex items-center space-x-2 p-1 pl-1.5 pr-2.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all group"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                T
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                {companyName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content Scroll Container */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
