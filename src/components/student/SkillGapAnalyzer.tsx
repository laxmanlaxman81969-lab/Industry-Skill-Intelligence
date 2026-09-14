import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_ROLES } from '../../data/seedData';
import { StudentSkill, SkillLevel } from '../../types';
import {
  FileText,
  Upload,
  CheckCircle2,
  XCircle,
  Plus,
  AlertTriangle,
  Building2,
  Target,
  Sparkles,
  HelpCircle,
  Check,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Info
} from 'lucide-react';

const SKILL_CATEGORIES = [
  {
    category: 'Programming Languages',
    skills: ['Java', 'Python', 'C', 'C++', 'JavaScript', 'TypeScript', 'C#', 'Go', 'Rust', 'Kotlin', 'Swift', 'PHP']
  },
  {
    category: 'Frontend Frameworks',
    skills: ['HTML', 'CSS', 'React.js', 'Angular', 'Vue.js', 'Next.js', 'Tailwind CSS']
  },
  {
    category: 'Backend Frameworks',
    skills: ['Spring Boot', 'Node.js', 'Express.js', 'Django', 'Flask', '.NET Core', 'FastAPI']
  },
  {
    category: 'Databases & Storage',
    skills: ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'Cassandra']
  },
  {
    category: 'Core CS Foundations',
    skills: ['Data Structures & Algorithms', 'DBMS', 'Operating Systems', 'Computer Networks', 'OOP', 'System Design']
  },
  {
    category: 'AI & Machine Learning',
    skills: ['Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision', 'Generative AI & LLMs']
  },
  {
    category: 'Cloud & DevOps',
    skills: ['AWS / Azure Cloud', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Linux', 'Terraform']
  },
  {
    category: 'Developer Tools',
    skills: ['Git', 'GitHub', 'Postman', 'Maven', 'Gradle', 'JUnit 5', 'JIRA']
  }
];

interface SkillGapAnalyzerProps {
  onNavigateToRoadmap: () => void;
}

export const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({ onNavigateToRoadmap }) => {
  const {
    studentProfile,
    setStudentProfile,
    industrySkills,
    companies,
    jobs,
    addSkillToRoadmap,
    calculateReadiness
  } = useApp();

  // Mode Selection: Mode A (Resume) vs Mode B (No Resume / Manual)
  const [activeMode, setActiveMode] = useState<'mode-a' | 'mode-b'>(
    studentProfile.hasResume ? 'mode-a' : 'mode-b'
  );

  // Target selectors
  const [selectedRole, setSelectedRole] = useState(studentProfile.targetRole || 'Java Backend Developer');
  const [selectedCompany, setSelectedCompany] = useState(studentProfile.targetCompany || 'ABC Technologies');

  // Mode A: Resume confirmation states
  const [extractedSkills, setExtractedSkills] = useState<StudentSkill[]>(() => {
    return studentProfile.skills.length > 0
      ? studentProfile.skills
      : [
          { name: 'Java', category: 'Language', level: 'Advanced', verified: true, verifiedSource: 'resume' },
          { name: 'SQL', category: 'Database', level: 'Intermediate', verified: true, verifiedSource: 'resume' },
          { name: 'JDBC', category: 'Backend', level: 'Intermediate', verified: true, verifiedSource: 'resume' },
          { name: 'HTML', category: 'Frontend', level: 'Intermediate', verified: true, verifiedSource: 'resume' },
          { name: 'CSS', category: 'Frontend', level: 'Intermediate', verified: true, verifiedSource: 'resume' }
        ];
  });

  const [newSkillInput, setNewSkillInput] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState(false);

  // Role-specific required skills
  const roleRequiredSkills = industrySkills.filter(
    (s) => s.role.toLowerCase() === selectedRole.toLowerCase() || s.role === 'Java Backend Developer'
  );

  // Selected company job requirements
  const companyJob = jobs.find(
    (j) => j.companyName.toLowerCase() === selectedCompany.toLowerCase()
  );

  // Current confirmed skills lookup
  const currentSkillsList = activeMode === 'mode-a' ? extractedSkills : studentProfile.skills;
  const currentSkillNames = currentSkillsList.map((s) => s.name.toLowerCase());

  // Matched, Partial, Missing classifications
  const matchedSkills = roleRequiredSkills.filter((req) => {
    const found = currentSkillsList.find(
      (s) => s.name.toLowerCase() === req.name.toLowerCase()
    );
    return found && (found.level === 'Intermediate' || found.level === 'Advanced');
  });

  const partialSkills = roleRequiredSkills.filter((req) => {
    const found = currentSkillsList.find(
      (s) => s.name.toLowerCase() === req.name.toLowerCase()
    );
    return found && found.level === 'Beginner';
  });

  const missingSkills = roleRequiredSkills.filter((req) => {
    return !currentSkillNames.includes(req.name.toLowerCase());
  });

  // Calculate dynamic match score
  const matchPercentage = calculateReadiness(currentSkillsList, selectedRole, selectedCompany);

  // Mode A Handlers
  const handleConfirmSkill = (skillName: string) => {
    setExtractedSkills((prev) =>
      prev.map((s) => (s.name === skillName ? { ...s, verified: true } : s))
    );
  };

  const handleRemoveSkill = (skillName: string) => {
    setExtractedSkills((prev) => prev.filter((s) => s.name !== skillName));
  };

  const handleAddManualSkill = () => {
    if (!newSkillInput.trim()) return;
    const exists = extractedSkills.find(
      (s) => s.name.toLowerCase() === newSkillInput.trim().toLowerCase()
    );
    if (!exists) {
      const added: StudentSkill = {
        name: newSkillInput.trim(),
        category: 'Custom',
        level: newSkillLevel,
        verified: true,
        verifiedSource: 'self'
      };
      setExtractedSkills([...extractedSkills, added]);
      setNewSkillInput('');
    }
  };

  const handleSaveConfirmedSkills = () => {
    setStudentProfile((prev) => ({
      ...prev,
      skills: extractedSkills,
      targetRole: selectedRole,
      targetCompany: selectedCompany,
      overallReadiness: matchPercentage
    }));
    setConfirmationNotice(true);
    setTimeout(() => setConfirmationNotice(false), 3000);
  };

  // Mode B Handlers (Matrix toggling)
  const handleToggleMatrixSkill = (skillName: string, category: string) => {
    const existing = studentProfile.skills.find(
      (s) => s.name.toLowerCase() === skillName.toLowerCase()
    );
    let updated: StudentSkill[];
    if (existing) {
      updated = studentProfile.skills.filter(
        (s) => s.name.toLowerCase() !== skillName.toLowerCase()
      );
    } else {
      updated = [
        ...studentProfile.skills,
        {
          name: skillName,
          category,
          level: 'Intermediate',
          verified: false,
          verifiedSource: 'self'
        }
      ];
    }
    const updatedReadiness = calculateReadiness(updated, selectedRole, selectedCompany);
    setStudentProfile((prev) => ({
      ...prev,
      skills: updated,
      overallReadiness: updatedReadiness
    }));
  };

  const handleMatrixConfidenceChange = (skillName: string, level: SkillLevel) => {
    const updated = studentProfile.skills.map((s) =>
      s.name.toLowerCase() === skillName.toLowerCase() ? { ...s, level } : s
    );
    const updatedReadiness = calculateReadiness(updated, selectedRole, selectedCompany);
    setStudentProfile((prev) => ({
      ...prev,
      skills: updated,
      overallReadiness: updatedReadiness
    }));
  };

  const handleSimulateResumeReupload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingResume(true);
      setTimeout(() => {
        setIsUploadingResume(false);
        setStudentProfile((prev) => ({
          ...prev,
          hasResume: true,
          resumeFileName: file.name
        }));
        setActiveMode('mode-a');
      }, 1200);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
              AI Diagnostic Engine
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Target Role & Company Benchmarking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Skill Gap Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Compare student profile against real industry requisitions and calculate verified readiness.
          </p>
        </div>

        {/* MODE SWITCHER TABS */}
        <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveMode('mode-a')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'mode-a'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>MODE A: Resume Upload</span>
          </button>
          <button
            onClick={() => setActiveMode('mode-b')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'mode-b'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>MODE B: Skill Matrix (No Resume)</span>
          </button>
        </div>
      </div>

      {/* TARGET ROLE & TARGET COMPANY SELECTORS */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
            <Target className="w-4 h-4 text-teal-400" />
            <span>Target Role for Gap Comparison</span>
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
          >
            {SUPPORTED_ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>Target Company Benchmarking (Optional)</span>
          </label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
          >
            {companies.map((cmp) => (
              <option key={cmp.id} value={cmp.name}>{cmp.name} ({cmp.industry})</option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE A: RESUME UPLOAD & CONFIRMATION SECTION (PARTS 10 & 11) */}
      {/* ========================================================================= */}
      {activeMode === 'mode-a' && (
        <div className="space-y-6 animate-fade-in">
          {/* Resume Upload & Quality Score Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Resume Details & Upload Box */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                  Uploaded Document
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  Parsed by AI Engine
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
                <FileText className="w-8 h-8 text-teal-400 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">
                    {studentProfile.resumeFileName || 'Aarav_Sharma_Backend_Resume.pdf'}
                  </p>
                  <p className="text-[10px] text-slate-400">PDF • 142 KB • Parsed 6 sections</p>
                </div>
              </div>

              <div>
                <label className="cursor-pointer flex items-center justify-center space-x-2 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingResume ? 'Parsing Document...' : 'Upload Updated Resume (PDF/DOCX)'}</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleSimulateResumeReupload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">Extracted Resume Metadata:</p>
                <p>• Degree: {studentProfile.degree} ({studentProfile.branch})</p>
                <p>• Coursework: OOP, Data Structures, DBMS, Software Engineering</p>
                <p>• Projects: CLI Banking System, Student Portal Front-end</p>
              </div>
            </div>

            {/* Right: AI Resume Quality Score (Part 11) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-teal-400 font-semibold">
                    Part 11 Evaluation
                  </span>
                  <h3 className="text-base font-bold text-white">AI Resume Quality Score</h3>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-teal-300">
                    {studentProfile.resumeScore || 78}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Transparent evaluation assessing ATS keywords, project substance, and target role relevance.
              </p>

              {/* 6-Axis Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Skills Relevance</span>
                  <p className="text-sm font-bold text-white">82%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Project Relevance</span>
                  <p className="text-sm font-bold text-amber-400">76%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Education</span>
                  <p className="text-sm font-bold text-emerald-400">90%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Experience / Internships</span>
                  <p className="text-sm font-bold text-rose-400">65%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Keyword Coverage</span>
                  <p className="text-sm font-bold text-white">80%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Format & Structure</span>
                  <p className="text-sm font-bold text-teal-400">78%</p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="space-y-1">
                  <p className="text-teal-400 font-semibold flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Key Strengths</span>
                  </p>
                  <ul className="text-slate-400 space-y-1 text-[11px]">
                    <li>• Solid Core Java and OOP principles</li>
                    <li>• Good SQL database grounding</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <p className="text-rose-400 font-semibold flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Improvement Opportunities</span>
                  </p>
                  <ul className="text-slate-400 space-y-1 text-[11px]">
                    <li>• Missing Spring Boot & REST APIs</li>
                    <li>• Lack of containerization (Docker)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* AI EXTRACTED SKILLS CONFIRMATION PANEL (VERY IMPORTANT PART 10 SPEC) */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-teal-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <h3 className="text-base font-bold text-white">
                    AI Detected These Skills. Please Confirm.
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Never blindly trust AI extraction. Verify your skills, adjust proficiency, or add unlisted skills.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveConfirmedSkills}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs hover:bg-teal-300 transition-all shadow-md shadow-teal-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save & Update Profile</span>
                </button>
              </div>
            </div>

            {confirmationNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmed skills saved! Career readiness has been recalculated.</span>
              </div>
            )}

            {/* Extracted Skills List with Confirm/Remove/Level options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {extractedSkills.map((skill) => (
                <div
                  key={skill.name}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    skill.verified
                      ? 'bg-slate-950 border-teal-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-200">{skill.name}</span>
                      {skill.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 capitalize">
                      Proficiency: <strong className="text-teal-300">{skill.level}</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => handleConfirmSkill(skill.name)}
                      title="Confirm Skill"
                      className="p-1 rounded-md bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemoveSkill(skill.name)}
                      title="Remove Skill"
                      className="p-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Skill Form */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">+ Add Skill:</span>
              <input
                type="text"
                placeholder="e.g. Git, Docker, Hibernate..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-teal-500 focus:outline-none"
              />
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                className="px-2 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-teal-500 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button
                type="button"
                onClick={handleAddManualSkill}
                className="px-3 py-1.5 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold hover:bg-teal-500/30 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE B: NO RESUME STRUCTURED SKILL MATRIX (PART 10 SPEC) */}
      {/* ========================================================================= */}
      {activeMode === 'mode-b' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Layers className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">
                No Resume? Build Your Skill Profile
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Select the technologies you know across categories. Set your true confidence level—a student selecting "Java" does not automatically mean advanced mastery.
            </p>
          </div>

          {/* Categorized Skill Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SKILL_CATEGORIES.map((catGroup) => (
              <div
                key={catGroup.category}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
                  {catGroup.category}
                </h4>

                <div className="space-y-2">
                  {catGroup.skills.map((skillName) => {
                    const studentSkill = studentProfile.skills.find(
                      (s) => s.name.toLowerCase() === skillName.toLowerCase()
                    );
                    const isSelected = !!studentSkill;

                    return (
                      <div
                        key={skillName}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          isSelected
                            ? 'bg-slate-950 border-teal-500/40'
                            : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800'
                        }`}
                      >
                        <div
                          className="flex items-center space-x-2 cursor-pointer flex-1"
                          onClick={() => handleToggleMatrixSkill(skillName, catGroup.category)}
                        >
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-teal-500 border-teal-500 text-slate-950'
                                : 'border-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span
                            className={`font-semibold ${
                              isSelected ? 'text-white' : 'text-slate-400'
                            }`}
                          >
                            {skillName}
                          </span>
                        </div>

                        {/* Confidence selector for selected skills */}
                        {isSelected && (
                          <div className="flex space-x-1 shrink-0">
                            {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map(
                              (level) => (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => handleMatrixConfidenceChange(skillName, level)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                                    studentSkill?.level === level
                                      ? 'bg-teal-500 text-slate-950 font-bold'
                                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                                  }`}
                                >
                                  {level[0]}
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SKILL MATCH SCORE & WHY IT MATTERS (PART 12) */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
              Part 12 Gap Synthesis
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Target Role Match Score: {selectedRole}
            </h3>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 font-mono">YOUR MATCH:</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-black text-teal-300">{matchPercentage}%</span>
            </div>
          </div>
        </div>

        {/* 3 Categories: Matched, Partial, Missing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Matched Skills */}
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 uppercase font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Matched Skills ({matchedSkills.length})</span>
              </h4>
              <span className="text-[10px] text-emerald-300 font-semibold">Demonstrated</span>
            </div>

            <div className="space-y-2">
              {matchedSkills.map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-xs flex items-center justify-between"
                >
                  <span className="font-semibold text-white">{s.name}</span>
                  <span className="text-[10px] font-mono text-emerald-300">✓ Strong Match</span>
                </div>
              ))}
              {matchedSkills.length === 0 && (
                <p className="text-xs text-slate-500 italic">No strong skills matched yet.</p>
              )}
            </div>
          </div>

          {/* Partial Skills */}
          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-400 flex items-center space-x-1.5 uppercase font-mono">
                <AlertTriangle className="w-4 h-4" />
                <span>Partial Skills ({partialSkills.length})</span>
              </h4>
              <span className="text-[10px] text-amber-300 font-semibold">Needs Depth</span>
            </div>

            <div className="space-y-2">
              {partialSkills.map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">{s.name}</p>
                    <span className="text-[10px] text-amber-400">Current: Beginner</span>
                  </div>
                  <button
                    onClick={() => addSkillToRoadmap(s.name)}
                    className="text-[10px] px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-semibold hover:bg-amber-500/30 transition-colors"
                  >
                    + Roadmap
                  </button>
                </div>
              ))}
              {partialSkills.length === 0 && (
                <p className="text-xs text-slate-500 italic">No partial skills identified.</p>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-rose-400 flex items-center space-x-1.5 uppercase font-mono">
                <XCircle className="w-4 h-4" />
                <span>Missing Skills ({missingSkills.length})</span>
              </h4>
              <span className="text-[10px] text-rose-300 font-semibold">Critical Gaps</span>
            </div>

            <div className="space-y-2">
              {missingSkills.map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-rose-500/20 text-xs flex flex-col justify-between space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{s.name}</span>
                    <span className="text-[10px] font-mono text-rose-400">{s.demandScore}% Demand</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{s.whyItMatters}</p>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => addSkillToRoadmap(s.name)}
                      className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold hover:bg-rose-500/30 transition-colors"
                    >
                      + Add to Roadmap
                    </button>
                  </div>
                </div>
              ))}
              {missingSkills.length === 0 && (
                <p className="text-xs text-slate-500 italic">All role skills covered!</p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Explanation: Why Each Missing Skill Matters (Part 12 Spec) */}
        {missingSkills.length > 0 && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Why Each Missing Skill Matters for {selectedRole}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {missingSkills.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-teal-300">{s.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{s.importance} Priority</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {s.whyItMatters}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* COMPANY-SPECIFIC GAP ANALYSIS (PART 13) */}
      {/* ========================================================================= */}
      {companyJob && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/30 to-slate-900 border border-indigo-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                Part 13 Company Benchmark
              </span>
              <h3 className="text-lg font-bold text-white">
                Company-Specific Requisition Match: {companyJob.companyName}
              </h3>
              <p className="text-xs text-slate-400">
                Evaluating against requisition: <strong className="text-slate-200">{companyJob.title}</strong>
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300">
              Requisition Match: <strong className="text-white">{matchPercentage}%</strong>
            </div>
          </div>

          {/* Detailed table of Company Requirement vs Student Skill vs Match */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">Company Requirement</th>
                  <th className="py-2.5 px-3">Required Level</th>
                  <th className="py-2.5 px-3">Your Demonstrated Skill</th>
                  <th className="py-2.5 px-3">Match Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {companyJob.requiredSkills.map((req) => {
                  const studentHas = currentSkillsList.find(
                    (s) => s.name.toLowerCase() === req.skill.toLowerCase()
                  );

                  let statusText = 'Missing';
                  let statusClass = 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                  if (studentHas) {
                    if (studentHas.level === 'Advanced' || studentHas.level === req.level) {
                      statusText = 'Strong Match';
                      statusClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                    } else {
                      statusText = `${studentHas.level} (Needs Depth)`;
                      statusClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                    }
                  }

                  return (
                    <tr key={req.skill} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">{req.skill}</td>
                      <td className="py-3 px-3 text-slate-400">{req.level}</td>
                      <td className="py-3 px-3 text-slate-300">
                        {studentHas ? `${studentHas.level} (${studentHas.verified ? 'Verified' : 'Claimed'})` : 'None'}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${statusClass}`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {!studentHas && (
                          <button
                            onClick={() => {
                              addSkillToRoadmap(req.skill);
                              onNavigateToRoadmap();
                            }}
                            className="px-2.5 py-1 rounded bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/20 text-[10px] font-semibold transition-colors"
                          >
                            Add to Roadmap
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onNavigateToRoadmap}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-400 text-slate-950 text-xs font-bold hover:bg-teal-300 transition-all shadow-md"
            >
              <span>View Your Personalized Career Growth Roadmap</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
