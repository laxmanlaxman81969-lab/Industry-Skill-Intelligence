import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndustryDemandIntelligence } from '../demand/IndustryDemandIntelligence';
import {
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  Users,
  GraduationCap,
  GitCompare,
  FileText,
  Building2,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Bell,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
  Download,
  Filter,
  Layers,
  Award,
  Info,
  ExternalLink,
  Target,
  BarChart3,
  Calendar,
  Clock,
  Briefcase,
  HelpCircle
} from 'lucide-react';

export type CollegeView =
  | 'dashboard'
  | 'industry-demand'
  | 'curriculum-analysis'
  | 'student-gap'
  | 'training'
  | 'industry-alignment'
  | 'reports'
  | 'profile'
  | 'settings';

interface CollegePortalProps {
  onLogout?: () => void;
}

// Circular progress gauge component matching the platform's Light SaaS system
const CircularGauge: React.FC<{ percentage: number; colorClass: string; size?: number; strokeWidth?: number; label?: string }> = ({
  percentage,
  colorClass,
  size = 64,
  strokeWidth = 6,
  label
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
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
      {label && <span className="text-[11px] font-medium text-slate-500 mt-1 text-center">{label}</span>}
    </div>
  );
};

// Types for the College Portal modules
interface IndustrySkillDemandItem {
  id: string;
  name: string;
  domain: 'Backend' | 'Cloud & DevOps' | 'Data & AI' | 'Frontend' | 'Architecture';
  demandLevel: 'High Demand' | 'Growing' | 'Emerging' | 'Stable';
  trend: string;
  trendPositive: boolean;
  importance: 'Critical' | 'High' | 'Medium';
  curriculumCoverage: 'Covered' | 'Partially Covered' | 'Not Covered';
  studentSkillLevel: 'Proficient' | 'Intermediate' | 'Beginner' | 'Novice';
  activeRequisitions: number;
}

interface CurriculumAnalysisItem {
  id: string;
  skill: string;
  courseCode: string;
  courseTitle: string;
  semester: number;
  industryRequirement: 'High Requirement' | 'Growing Requirement' | 'Emerging Requirement';
  curriculumCoverage: 'Covered' | 'Partially Covered' | 'Not Covered';
  gap: 'Low Gap' | 'Medium Gap' | 'High Gap';
  priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
  syllabusAction: string;
}

interface StudentSkillGapItem {
  id: string;
  skill: string;
  department: string;
  requiredLevel: 'Proficient' | 'Intermediate' | 'Advanced';
  averageStudentLevel: 'Beginner' | 'Novice' | 'Intermediate';
  gap: 'High' | 'Medium' | 'Low';
  studentsAffected: number;
  priority: 'High' | 'Medium' | 'Low';
  trendVsLastSem: string;
}

interface TrainingProgram {
  id: string;
  title: string;
  targetSkill: string;
  targetPrograms: string;
  mode: 'Hands-on Lab' | 'Industry Workshop' | 'Virtual Sprint';
  duration: string;
  enrolledStudents: number;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  attendanceRate: number;
  skillImprovementRate: string;
  reason: string;
}

interface AIRecommendation {
  id: string;
  recommendation: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  suggestedAction: string;
  status: 'Pending Review' | 'In Progress' | 'Adopted into Syllabus';
  impactMetric: string;
}

export const CollegePortal: React.FC<CollegePortalProps> = ({ onLogout }) => {
  const { collegeProfile, logout } = useApp();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  // State Management
  const [activeView, setActiveView] = useState<CollegeView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncingMarket, setIsSyncingMarket] = useState(false);

  // Filter states
  const [demandDomainFilter, setDemandDomainFilter] = useState<string>('All');
  const [demandLevelFilter, setDemandLevelFilter] = useState<string>('All');
  const [curriculumCoverageFilter, setCurriculumCoverageFilter] = useState<string>('All');
  const [curriculumPriorityFilter, setCurriculumPriorityFilter] = useState<string>('All');
  const [studentDeptFilter, setStudentDeptFilter] = useState<string>('All');
  const [studentYearFilter, setStudentYearFilter] = useState<string>('All');

  // Modal states
  const [isCreateTrainingOpen, setIsCreateTrainingOpen] = useState(false);
  const [isDraftSyllabusOpen, setIsDraftSyllabusOpen] = useState(false);
  const [selectedCourseForSyllabus, setSelectedCourseForSyllabus] = useState<string>('');

  // Form states for creating training
  const [newTrainingTitle, setNewTrainingTitle] = useState('');
  const [newTrainingSkill, setNewTrainingSkill] = useState('Spring Boot');
  const [newTrainingTarget, setNewTrainingTarget] = useState('B.Tech CSE 3rd Year');
  const [newTrainingMode, setNewTrainingMode] = useState<'Hands-on Lab' | 'Industry Workshop' | 'Virtual Sprint'>('Hands-on Lab');
  const [newTrainingDuration, setNewTrainingDuration] = useState('4 Weeks (16 Hours)');

  // Notification popup
  const [showNotifications, setShowNotifications] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. INDUSTRY SKILL DEMAND DATA (Dynamically synchronized from employer requisitions)
  const [demandSkills, setDemandSkills] = useState<IndustrySkillDemandItem[]>([
    {
      id: 'd1',
      name: 'Spring Boot',
      domain: 'Backend',
      demandLevel: 'High Demand',
      trend: '+24% hiring velocity',
      trendPositive: true,
      importance: 'Critical',
      curriculumCoverage: 'Partially Covered',
      studentSkillLevel: 'Beginner',
      activeRequisitions: 1420
    },
    {
      id: 'd2',
      name: 'REST APIs',
      domain: 'Backend',
      demandLevel: 'High Demand',
      trend: '+18% hiring velocity',
      trendPositive: true,
      importance: 'Critical',
      curriculumCoverage: 'Partially Covered',
      studentSkillLevel: 'Beginner',
      activeRequisitions: 1850
    },
    {
      id: 'd3',
      name: 'Cloud Computing (AWS/GCP)',
      domain: 'Cloud & DevOps',
      demandLevel: 'Growing',
      trend: '+32% growth YoY',
      trendPositive: true,
      importance: 'High',
      curriculumCoverage: 'Not Covered',
      studentSkillLevel: 'Novice',
      activeRequisitions: 2100
    },
    {
      id: 'd4',
      name: 'Java & Concurrency',
      domain: 'Backend',
      demandLevel: 'High Demand',
      trend: '+14% sustained demand',
      trendPositive: true,
      importance: 'Critical',
      curriculumCoverage: 'Covered',
      studentSkillLevel: 'Intermediate',
      activeRequisitions: 2800
    },
    {
      id: 'd5',
      name: 'SQL & Database Optimization',
      domain: 'Backend',
      demandLevel: 'High Demand',
      trend: '+8% sustained demand',
      trendPositive: true,
      importance: 'Critical',
      curriculumCoverage: 'Covered',
      studentSkillLevel: 'Proficient',
      activeRequisitions: 1950
    },
    {
      id: 'd6',
      name: 'Docker & Containerization',
      domain: 'Cloud & DevOps',
      demandLevel: 'High Demand',
      trend: '+28% hiring velocity',
      trendPositive: true,
      importance: 'High',
      curriculumCoverage: 'Not Covered',
      studentSkillLevel: 'Novice',
      activeRequisitions: 1640
    },
    {
      id: 'd7',
      name: 'AI/ML Engineering',
      domain: 'Data & AI',
      demandLevel: 'Emerging',
      trend: '+45% emerging roles',
      trendPositive: true,
      importance: 'Medium',
      curriculumCoverage: 'Not Covered',
      studentSkillLevel: 'Novice',
      activeRequisitions: 980
    },
    {
      id: 'd8',
      name: 'React & TypeScript',
      domain: 'Frontend',
      demandLevel: 'Growing',
      trend: '+16% demand increase',
      trendPositive: true,
      importance: 'High',
      curriculumCoverage: 'Partially Covered',
      studentSkillLevel: 'Intermediate',
      activeRequisitions: 1530
    }
  ]);

  // 2. CURRICULUM ANALYSIS DATA
  const [curriculumItems, setCurriculumItems] = useState<CurriculumAnalysisItem[]>([
    {
      id: 'c1',
      skill: 'Spring Boot',
      courseCode: 'CS502',
      courseTitle: 'Enterprise Java & Web Systems',
      semester: 5,
      industryRequirement: 'High Requirement',
      curriculumCoverage: 'Partially Covered',
      gap: 'Medium Gap',
      priority: 'High Priority',
      syllabusAction: 'Replace monolithic Java Servlets module with Spring Boot REST microservices architecture.'
    },
    {
      id: 'c2',
      skill: 'REST APIs',
      courseCode: 'CS502',
      courseTitle: 'Enterprise Java & Web Systems',
      semester: 5,
      industryRequirement: 'High Requirement',
      curriculumCoverage: 'Partially Covered',
      gap: 'High Gap',
      priority: 'High Priority',
      syllabusAction: 'Add hands-on API design, JWT authentication, and Postman test verification lab hours.'
    },
    {
      id: 'c3',
      skill: 'Cloud Computing (AWS/GCP)',
      courseCode: 'CS604',
      courseTitle: 'Distributed Systems & Electives',
      semester: 6,
      industryRequirement: 'Growing Requirement',
      curriculumCoverage: 'Not Covered',
      gap: 'High Gap',
      priority: 'High Priority',
      syllabusAction: 'Introduce dedicated Cloud Fundamentals elective with AWS Academy cloud sandbox credits.'
    },
    {
      id: 'c4',
      skill: 'Docker & Containers',
      courseCode: 'CS503',
      courseTitle: 'System Software & Operating Systems',
      semester: 5,
      industryRequirement: 'High Requirement',
      curriculumCoverage: 'Not Covered',
      gap: 'High Gap',
      priority: 'High Priority',
      syllabusAction: 'Embed containerization basics and Dockerfile deployment in OS practical laboratory.'
    },
    {
      id: 'c5',
      skill: 'Java OOP & Concurrency',
      courseCode: 'CS301',
      courseTitle: 'Object-Oriented Programming with Java',
      semester: 3,
      industryRequirement: 'High Requirement',
      curriculumCoverage: 'Covered',
      gap: 'Low Gap',
      priority: 'Low Priority',
      syllabusAction: 'Syllabus aligned. Modernize practical exercises to Java 21 LTS virtual threads.'
    },
    {
      id: 'c6',
      skill: 'SQL & Database Design',
      courseCode: 'CS402',
      courseTitle: 'Database Management Systems',
      semester: 4,
      industryRequirement: 'High Requirement',
      curriculumCoverage: 'Covered',
      gap: 'Low Gap',
      priority: 'Low Priority',
      syllabusAction: 'Syllabus aligned. Add practical indexing and EXPLAIN query plan optimization lab.'
    },
    {
      id: 'c7',
      skill: 'AI/ML Engineering',
      courseCode: 'CS701',
      courseTitle: 'Artificial Intelligence Elective',
      semester: 7,
      industryRequirement: 'Emerging Requirement',
      curriculumCoverage: 'Not Covered',
      gap: 'High Gap',
      priority: 'Medium Priority',
      syllabusAction: 'Add practical PyTorch & Scikit-learn project milestones to theoretical AI syllabus.'
    }
  ]);

  // 3. STUDENT SKILL GAP DATA (Aggregated across batches)
  const studentGaps: StudentSkillGapItem[] = [
    {
      id: 'sg1',
      skill: 'Spring Boot',
      department: 'Computer Science & Engineering',
      requiredLevel: 'Intermediate',
      averageStudentLevel: 'Beginner',
      gap: 'High',
      studentsAffected: 640,
      priority: 'High',
      trendVsLastSem: '+14% gap increase'
    },
    {
      id: 'sg2',
      skill: 'REST APIs',
      department: 'Computer Science & Engineering',
      requiredLevel: 'Intermediate',
      averageStudentLevel: 'Beginner',
      gap: 'High',
      studentsAffected: 720,
      priority: 'High',
      trendVsLastSem: '+18% gap increase'
    },
    {
      id: 'sg3',
      skill: 'JPA / Hibernate',
      department: 'Information Technology',
      requiredLevel: 'Intermediate',
      averageStudentLevel: 'Beginner',
      gap: 'High',
      studentsAffected: 580,
      priority: 'High',
      trendVsLastSem: '+8% gap increase'
    },
    {
      id: 'sg4',
      skill: 'Cloud Computing (AWS/GCP)',
      department: 'Computer Science & Engineering',
      requiredLevel: 'Intermediate',
      averageStudentLevel: 'Novice',
      gap: 'High',
      studentsAffected: 810,
      priority: 'High',
      trendVsLastSem: '+22% gap increase'
    },
    {
      id: 'sg5',
      skill: 'Docker & Containers',
      department: 'Computer Science & Engineering',
      requiredLevel: 'Intermediate',
      averageStudentLevel: 'Novice',
      gap: 'High',
      studentsAffected: 690,
      priority: 'High',
      trendVsLastSem: '+16% gap increase'
    },
    {
      id: 'sg6',
      skill: 'SQL & Query Optimization',
      department: 'Information Technology',
      requiredLevel: 'Intermediate',
      averageStudentLevel: 'Intermediate',
      gap: 'Low',
      studentsAffected: 190,
      priority: 'Low',
      trendVsLastSem: '-12% gap closed'
    },
    {
      id: 'sg7',
      skill: 'Java OOP Principles',
      department: 'Computer Science & Engineering',
      requiredLevel: 'Proficient',
      averageStudentLevel: 'Intermediate',
      gap: 'Medium',
      studentsAffected: 340,
      priority: 'Medium',
      trendVsLastSem: '-6% gap closed'
    }
  ];

  // 4. TRAINING & DEVELOPMENT PROGRAMS
  const [trainings, setTrainings] = useState<TrainingProgram[]>([
    {
      id: 'tp1',
      title: 'Spring Boot Microservices Bootcamp',
      targetSkill: 'Spring Boot',
      targetPrograms: 'B.Tech CSE 3rd & 4th Year',
      mode: 'Hands-on Lab',
      duration: '4 Weeks (20 Hours)',
      enrolledStudents: 320,
      status: 'In Progress',
      attendanceRate: 91,
      skillImprovementRate: '+34% average assessment score',
      reason: 'High industry demand + large student skill gap (640 students affected)'
    },
    {
      id: 'tp2',
      title: 'RESTful API Architecture Sprint',
      targetSkill: 'REST APIs',
      targetPrograms: 'B.Tech CSE & IT 3rd Year',
      mode: 'Hands-on Lab',
      duration: '3 Weeks (15 Hours)',
      enrolledStudents: 280,
      status: 'Scheduled',
      attendanceRate: 0,
      skillImprovementRate: 'Commencing next week',
      reason: 'High industry requirement + low practical skill level (720 students affected)'
    },
    {
      id: 'tp3',
      title: 'Cloud Native & AWS Cloud Practitioner Prep',
      targetSkill: 'Cloud Computing (AWS/GCP)',
      targetPrograms: 'B.Tech 4th Year & MCA Final Year',
      mode: 'Industry Workshop',
      duration: '6 Weeks (30 Hours)',
      enrolledStudents: 240,
      status: 'In Progress',
      attendanceRate: 88,
      skillImprovementRate: '+42% cloud lab competency',
      reason: 'Growing industry demand + curriculum gap (810 students affected)'
    },
    {
      id: 'tp4',
      title: 'Docker Containerization & CI/CD FastTrack',
      targetSkill: 'Docker & Containers',
      targetPrograms: 'B.Tech CSE 4th Year Placement Cohort',
      mode: 'Virtual Sprint',
      duration: '2 Weeks (12 Hours)',
      enrolledStudents: 195,
      status: 'Completed',
      attendanceRate: 96,
      skillImprovementRate: '+48% verified project submission rate',
      reason: 'High industry prerequisite + missing from formal syllabus'
    }
  ]);

  // 5. AI RECOMMENDATIONS DATA
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: 'rec1',
      recommendation: 'Add more practical REST API development to Web Systems syllabus.',
      reason: 'High industry demand + student skill gap.',
      priority: 'High',
      suggestedAction: 'Embed 4 mandatory laboratory sessions covering Postman testing, HTTP verb semantics, and JWT auth in CS502.',
      status: 'In Progress',
      impactMetric: 'Closes gap for 720 students across CSE & IT'
    },
    {
      id: 'rec2',
      recommendation: 'Increase Spring Boot project-based learning in Semester 5.',
      reason: 'High demand + limited curriculum coverage.',
      priority: 'High',
      suggestedAction: 'Deprecate legacy JSP/Servlet theory in CS502 and introduce a 4-week Spring Boot microservices capstone.',
      status: 'Pending Review',
      impactMetric: 'Boosts placement readiness score by +18%'
    },
    {
      id: 'rec3',
      recommendation: 'Introduce Cloud Computing fundamentals as a core elective.',
      reason: 'Growing industry demand + curriculum gap.',
      priority: 'High',
      suggestedAction: 'Adopt AICTE Model Curriculum Cloud Computing module with AWS Academy or Google Cloud for Education sandbox.',
      status: 'Adopted into Syllabus',
      impactMetric: 'Addresses #1 missing prerequisite across 2,100 job postings'
    },
    {
      id: 'rec4',
      recommendation: 'Organize Docker & Containerization practical bootcamp prior to campus drives.',
      reason: 'High industry hiring demand + student skill gap.',
      priority: 'Medium',
      suggestedAction: 'Run intensive 2-weekend hands-on containerization and CI/CD workshop for 6th and 7th semester batches.',
      status: 'In Progress',
      impactMetric: 'Prepares 400+ students for DevOps & Backend hiring tracks'
    }
  ]);

  // Sync market signals handler
  const handleSyncMarketSignals = () => {
    setIsSyncingMarket(true);
    setTimeout(() => {
      setIsSyncingMarket(false);
      showToast('Market intelligence synchronized with 1,420+ live employer requisitions.');
    }, 1200);
  };

  // Create training submit handler
  const handleCreateTrainingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrainingTitle.trim()) {
      alert('Please provide a training title.');
      return;
    }
    const newProg: TrainingProgram = {
      id: `tp-${Date.now()}`,
      title: newTrainingTitle,
      targetSkill: newTrainingSkill,
      targetPrograms: newTrainingTarget,
      mode: newTrainingMode,
      duration: newTrainingDuration,
      enrolledStudents: 180,
      status: 'Scheduled',
      attendanceRate: 0,
      skillImprovementRate: 'Scheduled to launch',
      reason: `Directly targets ${newTrainingSkill} identified in curriculum & student skill gap audit.`
    };
    setTrainings((prev) => [newProg, ...prev]);
    setIsCreateTrainingOpen(false);
    setNewTrainingTitle('');
    showToast(`Training Program "${newTrainingTitle}" created and scheduled!`);
  };

  // Schedule recommended training directly
  const handleScheduleRecommended = (skillName: string, reasonText: string) => {
    const newProg: TrainingProgram = {
      id: `tp-${Date.now()}`,
      title: `${skillName} Targeted Skill Accelerator`,
      targetSkill: skillName,
      targetPrograms: 'B.Tech CSE & IT 3rd/4th Year',
      mode: 'Hands-on Lab',
      duration: '4 Weeks (16 Hours)',
      enrolledStudents: 220,
      status: 'Scheduled',
      attendanceRate: 0,
      skillImprovementRate: 'Registration opening',
      reason: reasonText
    };
    setTrainings((prev) => [newProg, ...prev]);
    showToast(`Scheduled new training cohort for ${skillName}.`);
  };

  // Navigation Items
  const navItems: { id: CollegeView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'industry-demand', label: 'Industry Skill Demand', icon: <TrendingUp className="w-4 h-4" />, badge: 'Market' },
    { id: 'curriculum-analysis', label: 'Curriculum Analysis', icon: <BookOpen className="w-4 h-4" />, badge: 'Core' },
    { id: 'student-gap', label: 'Student Skill Gap', icon: <Users className="w-4 h-4" /> },
    { id: 'training', label: 'Training & Development', icon: <GraduationCap className="w-4 h-4" />, badge: 'Active' },
    { id: 'industry-alignment', label: 'Industry Alignment', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Recommendations', icon: <FileText className="w-4 h-4" /> },
    { id: 'profile', label: 'College Profile', icon: <Building2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  // Sidebar Component
  const SidebarContent = () => (
    <div className="flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 px-5 py-4 border-b border-slate-200 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
          <GraduationCap className="w-5 h-5" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold text-slate-900 leading-none truncate">Skill Intelligence</h1>
            <p className="text-[11px] text-blue-600 font-medium tracking-tight mt-0.5">Institution Portal</p>
          </div>
        )}
      </div>

      {/* College Info Chip in Sidebar */}
      {!sidebarCollapsed && (
        <div className="px-4 py-3 mx-3 mt-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
          <p className="font-bold text-slate-900 truncate">{collegeProfile.name || 'National Institute of Technology'}</p>
          <div className="flex items-center space-x-1.5 mt-0.5 text-[11px] text-slate-500">
            <Award className="w-3 h-3 text-blue-600 shrink-0" />
            <span className="truncate">{collegeProfile.accreditation || 'NAAC A++ • AICTE Approved'}</span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setMobileSidebarOpen(false);
              }}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group text-left ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-xs border-r-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {item.icon}
              </span>
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md uppercase tracking-wider ${
                      isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout button at bottom */}
      <div className="p-3 border-t border-slate-200 shrink-0">
        <button
          onClick={handleLogout}
          title={sidebarCollapsed ? 'Logout' : undefined}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* ─── DESKTOP SIDEBAR ───────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200 shrink-0 transition-all duration-200 relative ${
          sidebarCollapsed ? 'w-16' : 'w-64'
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

      {/* ─── MOBILE SIDEBAR BACKDROP ───────────────────────── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ─── MOBILE SIDEBAR DRAWER ─────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 md:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-900">Institution Portal</span>
          <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-500 hover:text-slate-900 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>

      {/* ─── MAIN CONTENT CONTAINER ────────────────────────── */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-slate-50">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center relative w-64 lg:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search skills, curriculum, student gaps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            {/* Demonstration Data Pill Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
              title="This institutional view uses verified sample data representing live industry requisitions."
            >
              <Info className="w-3 h-3 text-blue-600" />
              <span>Demonstration Data</span>
            </div>

            {/* Sync Market Data button */}
            <button
              onClick={handleSyncMarketSignals}
              disabled={isSyncingMarket}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSyncingMarket ? 'animate-spin' : ''}`} />
              <span>{isSyncingMarket ? 'Syncing...' : 'Sync Market Demand'}</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Institutional Alerts"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Institutional Alerts</span>
                    <span className="text-[10px] text-blue-600 font-semibold cursor-pointer" onClick={() => setShowNotifications(false)}>
                      Close
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                      <p className="font-semibold text-slate-900">Industry Requisition Spike</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">Spring Boot & REST API demand rose +24% across hiring partners.</p>
                      <span className="text-[10px] text-blue-600 font-mono">1 hour ago</span>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
                      <p className="font-semibold text-slate-900">Curriculum Update Recommendation</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">Semester 5 Web Systems flagged for missing containerization.</p>
                      <span className="text-[10px] text-amber-700 font-mono">3 hours ago</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="font-semibold text-slate-900">Cohort Skill Audit Ready</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">720 students identified needing practical API design labs.</p>
                      <span className="text-[10px] text-slate-500 font-mono">Yesterday</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Chip */}
            <button
              onClick={() => setActiveView('profile')}
              className="flex items-center space-x-2 p-1 pl-1.5 pr-2.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all group"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shadow-xs">
                {collegeProfile.name ? collegeProfile.name.charAt(0) : 'C'}
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 hidden sm:inline max-w-[120px] truncate">
                {collegeProfile.name || 'NIT Dean Office'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
            </button>
          </div>
        </header>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* ========================================================================= */}
            {/* 1. DASHBOARD VIEW */}
            {/* ========================================================================= */}
            {activeView === 'dashboard' && (
              <div className="space-y-6">
                {/* Header Banner */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        Institutional Overview
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-mono">SIH26134 Platform</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Welcome back, {collegeProfile.name || 'National Institute of Technology'}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Monitor industry skill demand, curriculum gaps, and student skill development.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 self-start md:self-auto">
                    <button
                      onClick={() => setActiveView('curriculum-analysis')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Review Curriculum</span>
                    </button>
                    <button
                      onClick={() => setActiveView('training')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Launch Training</span>
                    </button>
                  </div>
                </div>

                {/* 4 Core Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Card 1: Industry Skill Alignment */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry Skill Alignment</span>
                      <p className="text-2xl font-black text-slate-900 mt-1">74%</p>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                        <TrendingUp className="w-3 h-3" /> +6% vs last year
                      </span>
                    </div>
                    <CircularGauge percentage={74} colorClass="text-blue-600" size={54} strokeWidth={5} />
                  </div>

                  {/* Card 2: Curriculum Skill Gap */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Curriculum Skill Gap</span>
                      <p className="text-2xl font-black text-slate-900 mt-1">5 Critical</p>
                      <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="w-3 h-3" /> 3 High Priority Gaps
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 3: Student Skill Gap */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Skill Gap</span>
                      <p className="text-2xl font-black text-slate-900 mt-1">720 Affected</p>
                      <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                        <Users className="w-3 h-3 text-amber-600" /> Avg Gap: 1.8 Levels
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 4: Students Needing Training */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Students Needing Training</span>
                      <p className="text-2xl font-black text-slate-900 mt-1">840 Students</p>
                      <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                        <GraduationCap className="w-3 h-3" /> B.Tech 3rd/4th Year
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Main Dashboard Section: 3 Summaries + Recommended Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Summary 1: Industry Skill Demand Summary */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span>Industry Skill Demand Summary</span>
                        </h3>
                        <p className="text-[11px] text-slate-500">Skills actively sought in live requisitions</p>
                      </div>
                      <button
                        onClick={() => setActiveView('industry-demand')}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-3">
                      {demandSkills.slice(0, 5).map((sk) => (
                        <div key={sk.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900">{sk.name}</p>
                            <span className="text-[10px] text-slate-500">{sk.trend}</span>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              {sk.demandLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary 2: Curriculum Gap Summary */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span>Curriculum Gap Summary</span>
                        </h3>
                        <p className="text-[11px] text-slate-500">Syllabus coverage vs industry benchmarks</p>
                      </div>
                      <button
                        onClick={() => setActiveView('curriculum-analysis')}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Analyze
                      </button>
                    </div>

                    {/* Coverage Ratio Progress Bar */}
                    <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">Curriculum Coverage Ratio</span>
                        <span className="font-bold text-slate-900">72% Aligned</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full" style={{ width: '48%' }} title="Covered: 48%" />
                        <div className="bg-amber-500 h-full" style={{ width: '32%' }} title="Partially Covered: 32%" />
                        <div className="bg-rose-500 h-full" style={{ width: '20%' }} title="Not Covered: 20%" />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Covered: 48%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Partial: 32%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Missing: 20%</span>
                      </div>
                    </div>

                    {/* Impacted Courses List */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Top Flagged Courses</p>
                      {curriculumItems.slice(0, 3).map((item) => (
                        <div key={item.id} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1 rounded">{item.courseCode}</span>
                            <p className="text-xs font-semibold text-slate-900 mt-0.5 truncate max-w-[150px]">{item.courseTitle}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.gap === 'High Gap' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {item.gap}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary 3: Student Skill Gap Summary */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span>Student Skill Gap Summary</span>
                        </h3>
                        <p className="text-[11px] text-slate-500">Student proficiency vs required level</p>
                      </div>
                      <button
                        onClick={() => setActiveView('student-gap')}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Details
                      </button>
                    </div>

                    <div className="space-y-3">
                      {studentGaps.slice(0, 4).map((sg) => (
                        <div key={sg.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-900">{sg.skill}</p>
                            <span className="text-[11px] font-bold text-rose-600">{sg.studentsAffected} Students</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Req: <strong className="text-slate-700">{sg.requiredLevel}</strong></span>
                            <span>Avg: <strong className="text-slate-700">{sg.averageStudentLevel}</strong></span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              {sg.gap} Gap
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommended Actions Banner */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        <span>Recommended Institutional Actions</span>
                      </h3>
                      <p className="text-xs text-slate-500">Priority steps connecting industry demand to syllabus update and student training</p>
                    </div>
                    <button
                      onClick={() => setActiveView('reports')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span>Full Recommendations</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                          Training Action
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-2">Launch Spring Boot Lab Workshop</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          640 students have a high gap in enterprise backend frameworks. A 4-week sprint will bridge baseline proficiency.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          handleScheduleRecommended('Spring Boot', 'High industry demand + 640 student skill gap');
                          setActiveView('training');
                        }}
                        className="mt-3 w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                      >
                        Schedule Cohort
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                          Curriculum Action
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-2">Update CS502 Syllabus for REST APIs</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Replace legacy XML/Servlet modules with RESTful microservices and Postman testing in Semester 5.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCourseForSyllabus('CS502');
                          setIsDraftSyllabusOpen(true);
                        }}
                        className="mt-3 w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
                      >
                        Draft Syllabus Revision
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/80 space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                          Elective Action
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-2">Introduce Cloud Computing Elective</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Cloud Computing demand is +32% YoY with zero current curriculum coverage. Adopt AICTE sandbox module.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveView('industry-alignment')}
                        className="mt-3 w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                      >
                        View Alignment Impact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. INDUSTRY SKILL DEMAND VIEW */}
            {/* ========================================================================= */}
            {activeView === 'industry-demand' && (
              <IndustryDemandIntelligence
                onNavigateToCurriculum={() => setActiveView('curriculum-analysis')}
                onNavigateToTraining={() => setActiveView('training')}
              />
            )}

            {/* ========================================================================= */}
            {/* 3. CURRICULUM ANALYSIS VIEW (CORE FEATURE) */}
            {/* ========================================================================= */}
            {activeView === 'curriculum-analysis' && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        Core Intelligence Module
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-medium">Syllabus vs Market Demands</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Curriculum Analysis</h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Evaluates active college syllabus against industry-demanded skills. Identifies covered, partially covered, and missing competencies.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedCourseForSyllabus('CS502');
                        setIsDraftSyllabusOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Draft Syllabus Revision</span>
                    </button>
                  </div>
                </div>

                {/* Alignment Score Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-blue-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Overall Institutional Metric</span>
                    <h3 className="text-3xl font-black text-slate-900">Curriculum Industry Alignment: 72%</h3>
                    <p className="text-xs text-slate-600 max-w-xl">
                      72% of critical industry hiring competencies are formally integrated into the B.Tech & MCA curricula. Gaps remain concentrated in practical cloud infrastructure and modern microservice frameworks.
                    </p>
                  </div>

                  <div className="flex items-center space-x-6 shrink-0">
                    <div className="text-center">
                      <span className="text-2xl font-black text-emerald-600">12</span>
                      <p className="text-[11px] font-semibold text-slate-500">Covered Skills (48%)</p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-black text-amber-600">8</span>
                      <p className="text-[11px] font-semibold text-slate-500">Partially Covered (32%)</p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-black text-rose-600">5</span>
                      <p className="text-[11px] font-semibold text-slate-500">Not Covered (20%)</p>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 mr-1">Coverage:</span>
                    {['All', 'Covered', 'Partially Covered', 'Not Covered'].map((cov) => (
                      <button
                        key={cov}
                        onClick={() => setCurriculumCoverageFilter(cov)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          curriculumCoverageFilter === cov
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cov}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-500">Priority:</span>
                    <select
                      value={curriculumPriorityFilter}
                      onChange={(e) => setCurriculumPriorityFilter(e.target.value)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-blue-600"
                    >
                      <option value="All">All Priorities</option>
                      <option value="High Priority">High Priority</option>
                      <option value="Medium Priority">Medium Priority</option>
                      <option value="Low Priority">Low Priority</option>
                    </select>
                  </div>
                </div>

                {/* Curriculum Analysis Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {curriculumItems
                    .filter((c) => (curriculumCoverageFilter === 'All' || c.curriculumCoverage === curriculumCoverageFilter))
                    .filter((c) => (curriculumPriorityFilter === 'All' || c.priority === curriculumPriorityFilter))
                    .filter((c) => (searchQuery === '' || c.skill.toLowerCase().includes(searchQuery.toLowerCase()) || c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())))
                    .map((item) => (
                      <div key={item.id} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                Sem {item.semester} • {item.courseCode}
                              </span>
                              <h3 className="text-base font-bold text-slate-900 mt-1">{item.skill}</h3>
                              <p className="text-xs text-slate-500">{item.courseTitle}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              item.priority === 'High Priority'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : item.priority === 'Medium Priority'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {item.priority}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                            <div className="p-2 rounded-xl bg-slate-50">
                              <span className="text-[10px] text-slate-500 block">Industry Requirement</span>
                              <span className="font-semibold text-slate-800">{item.industryRequirement}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-50">
                              <span className="text-[10px] text-slate-500 block">Curriculum Coverage</span>
                              <span className={`font-semibold ${
                                item.curriculumCoverage === 'Covered'
                                  ? 'text-emerald-700'
                                  : item.curriculumCoverage === 'Partially Covered'
                                  ? 'text-amber-700'
                                  : 'text-rose-700'
                              }`}>
                                {item.curriculumCoverage} ({item.gap})
                              </span>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1 text-xs">
                            <p className="font-bold text-blue-700 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                              <span>AI Syllabus Recommendation:</span>
                            </p>
                            <p className="text-slate-600 leading-relaxed">{item.syllabusAction}</p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 font-mono">Status: Ready for Board Review</span>
                          <button
                            onClick={() => {
                              setSelectedCourseForSyllabus(item.courseCode);
                              setIsDraftSyllabusOpen(true);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                          >
                            Draft Revision
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 4. STUDENT SKILL GAP VIEW */}
            {/* ========================================================================= */}
            {activeView === 'student-gap' && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        Cohort Intelligence
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">Aggregated Competency Deficits</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Skill Gap</h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Answers: <strong className="text-slate-800">“What skills are our students missing compared with industry requirements?”</strong> Displays anonymized aggregate cohort metrics to protect student privacy.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveView('training')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Create Training from Gaps</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 mr-1">Department:</span>
                    {['All', 'Computer Science & Engineering', 'Information Technology'].map((dept) => (
                      <button
                        key={dept}
                        onClick={() => setStudentDeptFilter(dept)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          studentDeptFilter === dept
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {dept === 'Computer Science & Engineering' ? 'CSE' : dept === 'Information Technology' ? 'IT' : dept}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-500">Batch Year:</span>
                    <select
                      value={studentYearFilter}
                      onChange={(e) => setStudentYearFilter(e.target.value)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-blue-600"
                    >
                      <option value="All">All Years</option>
                      <option value="3rd Year">3rd Year (Batch 2027)</option>
                      <option value="4th Year">4th Year (Batch 2026)</option>
                    </select>
                  </div>
                </div>

                {/* Student Skill Gap Table */}
                <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="px-5 py-3.5">Skill & Department</th>
                          <th className="px-5 py-3.5">Required Level</th>
                          <th className="px-5 py-3.5">Average Student Level</th>
                          <th className="px-5 py-3.5">Gap Severity</th>
                          <th className="px-5 py-3.5">Students Affected</th>
                          <th className="px-5 py-3.5">Priority</th>
                          <th className="px-5 py-3.5 text-right">Intervention</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {studentGaps
                          .filter((sg) => (studentDeptFilter === 'All' || sg.department === studentDeptFilter))
                          .filter((sg) => (searchQuery === '' || sg.skill.toLowerCase().includes(searchQuery.toLowerCase())))
                          .map((sg) => (
                            <tr key={sg.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-5 py-4">
                                <p className="font-bold text-slate-900 text-sm">{sg.skill}</p>
                                <span className="text-[11px] text-slate-500">{sg.department}</span>
                              </td>
                              <td className="px-5 py-4">
                                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                  {sg.requiredLevel}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <span className="font-semibold text-slate-800">{sg.averageStudentLevel}</span>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                  sg.gap === 'High'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : sg.gap === 'Medium'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}>
                                  {sg.gap} Gap
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <span className="font-black text-slate-900 text-sm">{sg.studentsAffected}</span>
                                <span className="text-[11px] text-slate-400 block">{sg.trendVsLastSem}</span>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  sg.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {sg.priority}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-right">
                                <button
                                  onClick={() => {
                                    handleScheduleRecommended(sg.skill, `Directly targets ${sg.studentsAffected} students affected by ${sg.gap} gap in ${sg.skill}`);
                                    setActiveView('training');
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
                                >
                                  Create Training
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 5. TRAINING & DEVELOPMENT VIEW */}
            {/* ========================================================================= */}
            {activeView === 'training' && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        Institutional Upskilling
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-medium">Gap-Driven Interventions</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Training & Development</h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Recommend and manage skill trainings based <strong className="text-slate-800">ONLY on identified industry demand, curriculum gaps, and student skill gaps</strong>.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsCreateTrainingOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Training</span>
                  </button>
                </div>

                {/* AI-Recommended Trainings (Derived from identified gaps) */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span>AI Recommended Trainings (Connected to Identified Gaps)</span>
                      </h3>
                      <p className="text-xs text-slate-500">Directly addresses high industry hiring demand and documented cohort deficits</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                          Backend Core
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-2">Spring Boot Microservices Training</h4>
                        <div className="p-2.5 rounded-lg bg-white border border-blue-100 text-xs mt-2 text-slate-600 space-y-1">
                          <p className="font-semibold text-blue-700">Identified Reason:</p>
                          <p>High industry demand (+24% hiring) + large student skill gap (640 students affected).</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleScheduleRecommended('Spring Boot', 'High industry demand + large student skill gap')}
                        className="mt-3 w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                      >
                        Schedule Cohort
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                          API Engineering
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-2">REST API Architecture Workshop</h4>
                        <div className="p-2.5 rounded-lg bg-white border border-amber-100 text-xs mt-2 text-slate-600 space-y-1">
                          <p className="font-semibold text-amber-800">Identified Reason:</p>
                          <p>High industry requirement + low practical student skill level (720 students affected).</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleScheduleRecommended('REST APIs', 'High industry requirement + low practical skill level')}
                        className="mt-3 w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
                      >
                        Schedule Cohort
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                          Cloud Architecture
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-2">Cloud Computing Fundamentals</h4>
                        <div className="p-2.5 rounded-lg bg-white border border-indigo-100 text-xs mt-2 text-slate-600 space-y-1">
                          <p className="font-semibold text-indigo-700">Identified Reason:</p>
                          <p>Growing industry demand (+32% YoY) + zero formal curriculum coverage.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleScheduleRecommended('Cloud Computing (AWS/GCP)', 'Growing industry demand + curriculum gap')}
                        className="mt-3 w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                      >
                        Schedule Cohort
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active & Scheduled Training Programs List */}
                <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        <span>Active & Scheduled Training Cohorts</span>
                      </h3>
                      <p className="text-xs text-slate-500">Track student attendance, progress, and post-training assessment impact</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {trainings.map((tp) => (
                      <div key={tp.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              tp.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800'
                                : tp.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {tp.status}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-semibold text-blue-600">{tp.targetSkill}</span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900">{tp.title}</h4>
                          <p className="text-xs text-slate-500">
                            Target: <strong className="text-slate-700">{tp.targetPrograms}</strong> • Mode: {tp.mode} • Duration: {tp.duration}
                          </p>
                          <p className="text-[11px] text-slate-600 italic mt-1">Reason: {tp.reason}</p>
                        </div>

                        <div className="flex items-center space-x-6 shrink-0 self-end md:self-center">
                          <div className="text-right">
                            <span className="text-[10px] font-semibold text-slate-500 uppercase block">Enrolled Students</span>
                            <span className="text-xl font-bold text-slate-900">{tp.enrolledStudents}</span>
                          </div>

                          {tp.attendanceRate > 0 && (
                            <div className="text-right">
                              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Attendance</span>
                              <span className="text-xl font-bold text-emerald-600">{tp.attendanceRate}%</span>
                            </div>
                          )}

                          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-right min-w-[140px]">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Impact Metric</span>
                            <span className="text-xs font-bold text-blue-700">{tp.skillImprovementRate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 6. INDUSTRY ALIGNMENT VIEW */}
            {/* ========================================================================= */}
            {activeView === 'industry-alignment' && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        Triad Alignment Engine
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">Transparent Calculation</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Industry Alignment</h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Measures mathematical alignment between <strong className="text-slate-800">Industry Requirements</strong>, <strong className="text-slate-800">Curriculum Coverage</strong>, and <strong className="text-slate-800">Student Skills</strong>.
                    </p>
                  </div>
                </div>

                {/* 4 Core Alignment Gauges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center space-y-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Curriculum Alignment</span>
                    <CircularGauge percentage={72} colorClass="text-blue-600" size={76} strokeWidth={7} />
                    <p className="text-xs text-slate-600">Syllabus coverage of verified industry requisitions</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center space-y-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Skill Alignment</span>
                    <CircularGauge percentage={64} colorClass="text-indigo-600" size={76} strokeWidth={7} />
                    <p className="text-xs text-slate-600">Enrolled students meeting industry baseline proficiency</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center space-y-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Industry Requirement Coverage</span>
                    <CircularGauge percentage={78} colorClass="text-emerald-600" size={76} strokeWidth={7} />
                    <p className="text-xs text-slate-600">Core CS, Database & Java foundations alignment</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center space-y-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Practical Skill Coverage</span>
                    <CircularGauge percentage={58} colorClass="text-amber-600" size={76} strokeWidth={7} />
                    <p className="text-xs text-slate-600">Skills validated through hands-on labs & assessments</p>
                  </div>
                </div>

                {/* HOW THE ALIGNMENT IS CALCULATED (Mandatory Transparency Section) */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                    <Info className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">How Alignment Is Calculated</h3>
                      <p className="text-xs text-slate-500">Methodology and calculation transparency for institutional accreditation</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-800 space-y-1">
                    <p className="font-bold text-blue-700">Institutional Industry Alignment Index (IAI):</p>
                    <p className="text-slate-700">
                      IAI = (0.40 × Curriculum Coverage Score) + (0.35 × Student Practical Assessment Pass Rate) + (0.25 × Employer Benchmark Match Rate)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-50 space-y-1.5">
                      <p className="font-bold text-slate-900">1. Curriculum Coverage (40% weight)</p>
                      <p className="text-slate-600 leading-relaxed">
                        Calculated by parsing academic syllabus course modules against the top 20 verified industry hiring competencies. Covered = 100%, Partially = 50%, Missing = 0%.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 space-y-1.5">
                      <p className="font-bold text-slate-900">2. Student Assessment (35% weight)</p>
                      <p className="text-slate-600 leading-relaxed">
                        Calculated from aggregate student lab challenge submissions, code evaluations, and mock technical interview scoring across all enrolled department batches.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 space-y-1.5">
                      <p className="font-bold text-slate-900">3. Employer Match Rate (25% weight)</p>
                      <p className="text-slate-600 leading-relaxed">
                        Calculated from hiring partner shortlisting thresholds and candidate job requisition match scores in campus placement drives.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Calculations conform to National Board of Accreditation (NBA) Outcome-Based Education (OBE) guidelines.</span>
                  </div>
                </div>

                {/* Domain-by-Domain Breakdown */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Departmental Technical Domain Alignment</h3>
                  <div className="space-y-3">
                    {[
                      { domain: 'Database & SQL Engineering', score: 84, status: 'Strongly Aligned' },
                      { domain: 'Core Backend Development (Java / REST)', score: 76, status: 'Adequately Aligned' },
                      { domain: 'System Architecture & Concurrency', score: 61, status: 'Needs Improvement' },
                      { domain: 'Cloud Infrastructure & AWS', score: 42, status: 'Critical Gap' },
                      { domain: 'Modern DevOps & Containerization', score: 38, status: 'Critical Gap' }
                    ].map((d) => (
                      <div key={d.domain} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-900">{d.domain}</span>
                          <span className={`font-bold ${d.score >= 70 ? 'text-emerald-600' : d.score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                            {d.score}% • {d.status}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full ${d.score >= 70 ? 'bg-emerald-500' : d.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${d.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 7. REPORTS & RECOMMENDATIONS VIEW */}
            {/* ========================================================================= */}
            {activeView === 'reports' && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        Institutional Intelligence Briefs
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">Board & Academic Council</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Recommendations</h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Combined reporting and actionable AI-driven recommendations for curriculum updates and training interventions.
                    </p>
                  </div>
                </div>

                {/* Institutional Reports Grid */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Download Institutional Intelligence Reports</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { title: 'Industry Skill Demand Report', desc: 'Aggregated hiring signals from 1,420+ company requisitions.', format: 'PDF & CSV' },
                      { title: 'Curriculum Gap Audit Report', desc: 'Course-by-course syllabus deficit analysis against market demands.', format: 'PDF (Board Ready)' },
                      { title: 'Student Skill Gap Intelligence', desc: 'Cohort-wide competency breakdown across CSE & IT streams.', format: 'Excel & PDF' },
                      { title: 'Industry Alignment Index Brief', desc: 'Mathematical accreditation compliance metrics for NBA/NAAC.', format: 'Official PDF' }
                    ].map((rep) => (
                      <div key={rep.title} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {rep.format}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mt-2">{rep.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{rep.desc}</p>
                        </div>
                        <button
                          onClick={() => showToast(`Generating and downloading: ${rep.title}...`)}
                          className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-600" />
                          <span>Export Report</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI-Based Strategic Recommendations */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span>AI-Generated Strategic Recommendations</span>
                      </h3>
                      <p className="text-xs text-slate-500">Formulated from live industry demand signals and documented student skill deficits</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                rec.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {rec.priority} Priority
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs font-semibold text-blue-700">{rec.impactMetric}</span>
                            </div>
                            <h4 className="text-base font-bold text-slate-900">{rec.recommendation}</h4>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            rec.status === 'Adopted into Syllabus'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : rec.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {rec.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                          <div className="p-3 rounded-xl bg-white border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Underlying Reason:</span>
                            <p className="font-semibold text-slate-800 mt-0.5">{rec.reason}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Suggested Action:</span>
                            <p className="text-slate-700 mt-0.5">{rec.suggestedAction}</p>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                          <button
                            onClick={() => {
                              handleScheduleRecommended(rec.recommendation.split(' ')[2] || 'Spring Boot', rec.reason);
                              setActiveView('training');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                          >
                            Launch Training From Recommendation
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 8. COLLEGE PROFILE VIEW */}
            {/* ========================================================================= */}
            {activeView === 'profile' && (
              <div className="space-y-6 max-w-4xl">
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      Institutional Record
                    </span>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">College Profile</h1>
                    <p className="text-xs text-slate-500">Official institutional identity, technical programs, and administrative contacts</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-sm">
                    {collegeProfile.name ? collegeProfile.name.charAt(0) : 'N'}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Institutional Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">Institution Name</label>
                      <input
                        type="text"
                        defaultValue={collegeProfile.name || 'National Institute of Technology'}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">Affiliation / Approval Body</label>
                      <input
                        type="text"
                        defaultValue={collegeProfile.universityAffiliation || 'AICTE / Autonomous State Technical University'}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">Accreditation Status</label>
                      <input
                        type="text"
                        defaultValue={collegeProfile.accreditation || 'NAAC A++ (CGPA 3.82) • NBA Tier-1'}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">Dean / Principal Email</label>
                      <input
                        type="email"
                        defaultValue={collegeProfile.email || 'dean.academics@nit.edu'}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">Campus Location</label>
                      <input
                        type="text"
                        defaultValue={collegeProfile.location || 'Technology Campus, Tech City, Karnataka'}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">Enrolled Engineering Students</label>
                      <input
                        type="number"
                        defaultValue={collegeProfile.totalStudents || 2450}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => showToast('Institutional profile updated successfully.')}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      Save Profile Updates
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 9. SETTINGS VIEW */}
            {/* ========================================================================= */}
            {activeView === 'settings' && (
              <div className="space-y-6 max-w-4xl">
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    Institutional Controls
                  </span>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Platform Settings</h1>
                  <p className="text-xs text-slate-500">Configure market intelligence synchronization, privacy thresholds, and automated alerts</p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5 text-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Automated Market Intelligence Ingestion</p>
                      <p className="text-slate-500">Synchronize employer requisition signals with curriculum analyzer automatically</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Student Privacy & Data Anonymization</p>
                      <p className="text-slate-500">Ensure all student skill gaps are aggregated at cohort level without exposing individual transcripts</p>
                    </div>
                    <input type="checkbox" defaultChecked disabled className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Skill Deficit Alert Threshold</p>
                      <p className="text-slate-500">Trigger immediate board alert when high-priority student gap exceeds 500 students</p>
                    </div>
                    <select className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none">
                      <option>500 Students (Recommended)</option>
                      <option>300 Students</option>
                      <option>700 Students</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Accreditation Compliance Export Mode</p>
                      <p className="text-slate-500">Format curriculum intelligence tables to NBA Criterion 2 and NAAC Criterion 5 formats</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => showToast('Platform settings saved.')}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ─── MODAL: CREATE TRAINING ────────────────────────── */}
      {isCreateTrainingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Create New Training Program</span>
                </h3>
                <p className="text-xs text-slate-500">Targets documented industry demand & student skill gaps</p>
              </div>
              <button onClick={() => setIsCreateTrainingOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTrainingSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Training Title</label>
                <input
                  type="text"
                  placeholder="e.g. Spring Boot Microservices Intensive Lab"
                  value={newTrainingTitle}
                  onChange={(e) => setNewTrainingTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Target Skill</label>
                  <select
                    value={newTrainingSkill}
                    onChange={(e) => setNewTrainingSkill(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Spring Boot">Spring Boot</option>
                    <option value="REST APIs">REST APIs</option>
                    <option value="Cloud Computing (AWS/GCP)">Cloud Computing (AWS/GCP)</option>
                    <option value="Docker & Containers">Docker & Containers</option>
                    <option value="SQL & Query Optimization">SQL & Query Optimization</option>
                    <option value="AI/ML Engineering">AI/ML Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Delivery Mode</label>
                  <select
                    value={newTrainingMode}
                    onChange={(e) => setNewTrainingMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Hands-on Lab">Hands-on Lab</option>
                    <option value="Industry Workshop">Industry Workshop</option>
                    <option value="Virtual Sprint">Virtual Sprint</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Target Students / Program</label>
                  <input
                    type="text"
                    value={newTrainingTarget}
                    onChange={(e) => setNewTrainingTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Duration & Schedule</label>
                  <input
                    type="text"
                    value={newTrainingDuration}
                    onChange={(e) => setNewTrainingDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 text-[11px] text-blue-800 leading-relaxed">
                <strong>Intelligence Link:</strong> Enrolled students will receive automated assignments and progress tracking directly mapped to this training cohort.
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateTrainingOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-xs"
                >
                  Schedule Training
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: DRAFT SYLLABUS REVISION ────────────────── */}
      {isDraftSyllabusOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Draft Syllabus Revision Requisition</span>
                </h3>
                <p className="text-xs text-slate-500">Submission to Board of Studies & Academic Council</p>
              </div>
              <button onClick={() => setIsDraftSyllabusOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Target Course</label>
                <input
                  type="text"
                  defaultValue={selectedCourseForSyllabus || 'CS502 - Enterprise Java & Web Systems (Sem 5)'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Proposed Syllabus Revisions</label>
                <textarea
                  rows={4}
                  defaultValue="Unit 4: Deprecate legacy Java Servlets/JSP theory. Introduce Spring Boot Microservices, RESTful API architecture, Swagger documentation, and JWT token authentication.
Unit 5: Add 16 hours of practical laboratory exercises on Postman test collections and Docker container deployment."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 font-mono text-[11px]"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 text-[11px] text-emerald-800 leading-relaxed">
                <strong>Projected Impact:</strong> Increases Curriculum Alignment Score from 72% to 86% and satisfies 3 critical hiring partner criteria.
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDraftSyllabusOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDraftSyllabusOpen(false);
                    showToast('Syllabus revision draft submitted for Academic Council review.');
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-xs"
                >
                  Submit Revision Requisition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
