import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SUPPORTED_ROLES } from '../../../data/seedData';
import { StudentSkill, SkillLevel } from '../../../types';
import {
  User,
  GraduationCap,
  Layers,
  Target,
  FileText,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileUp,
  AlertCircle
} from 'lucide-react';

interface StudentOnboardingProps {
  onComplete: () => void;
}

const COMMON_STARTER_SKILLS = [
  'Java', 'Python', 'C++', 'C', 'JavaScript', 'HTML', 'CSS', 'SQL',
  'Git', 'Data Structures & Algorithms', 'DBMS', 'Operating Systems',
  'React.js', 'Spring Boot', 'Node.js', 'Docker', 'AWS'
];

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({ onComplete }) => {
  const { studentProfile, setStudentProfile, calculateReadiness } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 Form
  const [fullName, setFullName] = useState(studentProfile.fullName || '');
  const [email, setEmail] = useState(studentProfile.email || '');

  // Step 2 Form
  const [college, setCollege] = useState(studentProfile.college || 'Apex Institute of Technology');
  const [degree, setDegree] = useState(studentProfile.degree || 'B.Tech');
  const [branch, setBranch] = useState(studentProfile.branch || 'Computer Science & Engineering');
  const [currentYear, setCurrentYear] = useState(studentProfile.currentYear || '3rd Year');
  const [graduationYear, setGraduationYear] = useState(studentProfile.graduationYear || '2027');

  // Step 3 Form: Selected skills with confidence
  const [selectedSkills, setSelectedSkills] = useState<{ name: string; level: SkillLevel }[]>([
    { name: 'Java', level: 'Intermediate' },
    { name: 'SQL', level: 'Intermediate' },
    { name: 'HTML', level: 'Intermediate' },
    { name: 'CSS', level: 'Intermediate' }
  ]);

  // Step 4 Form: Target Role
  const [targetRole, setTargetRole] = useState(studentProfile.targetRole || 'Java Backend Developer');

  // Step 5 Form: Resume choice & upload
  const [hasResumeChoice, setHasResumeChoice] = useState<boolean | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const toggleSkill = (skillName: string) => {
    const exists = selectedSkills.find((s) => s.name === skillName);
    if (exists) {
      setSelectedSkills(selectedSkills.filter((s) => s.name !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, { name: skillName, level: 'Intermediate' }]);
    }
  };

  const changeSkillConfidence = (skillName: string, level: SkillLevel) => {
    setSelectedSkills(
      selectedSkills.map((s) => (s.name === skillName ? { ...s, level } : s))
    );
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setUploadedFileName(file.name);
        setIsUploading(false);
      }, 1200);
    }
  };

  const handleFinishOnboarding = () => {
    const formattedSkills: StudentSkill[] = selectedSkills.map((s) => ({
      name: s.name,
      category: 'Core',
      level: s.level,
      verified: hasResumeChoice ? true : false,
      verifiedSource: hasResumeChoice ? 'resume' : 'self'
    }));

    const computedReadiness = calculateReadiness(formattedSkills, targetRole);

    setStudentProfile((prev) => ({
      ...prev,
      fullName: fullName || prev.fullName,
      email: email || prev.email,
      college,
      degree,
      branch,
      currentYear,
      graduationYear,
      targetRole,
      hasResume: !!hasResumeChoice,
      resumeFileName: uploadedFileName || (hasResumeChoice ? 'Uploaded_Resume.pdf' : undefined),
      skills: formattedSkills,
      overallReadiness: computedReadiness,
      onboardingComplete: true
    }));

    onComplete();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Step Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>STUDENT ONBOARDING</span>
            <span className="text-teal-400 font-bold">Step {currentStep} of 5</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2 transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Basic Profile */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-teal-400 mb-1">
                <User className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-wider">Step 1</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Tell us about yourself</h2>
              <p className="text-xs text-slate-400">
                Let's set up your foundational profile for personalized career matching.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aarav@student.edu"
                  className="w-full px-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                disabled={!fullName}
                onClick={() => setCurrentStep(2)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs hover:bg-teal-300 disabled:opacity-50 transition-all"
              >
                <span>Continue to Education</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Education */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-teal-400 mb-1">
                <GraduationCap className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-wider">Step 2</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Academic Background</h2>
              <p className="text-xs text-slate-400">
                Your institution and branch help us map campus curriculum to industry demand.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  College / University Name
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="Apex Institute of Technology"
                  className="w-full px-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Degree</label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.E.">B.E.</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Tech">M.Tech</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Branch</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Current Year
                  </label>
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="2027"
                    className="w-full px-3 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs hover:bg-teal-300 transition-all"
              >
                <span>Continue to Skills</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Current Skills */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-teal-400 mb-1">
                <Layers className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-wider">Step 3</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Your Current Skills</h2>
              <p className="text-xs text-slate-400">
                Select the technologies you have studied or practiced, and set your confidence level.
              </p>
            </div>

            {/* Quick Multi-Select Badges */}
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
              {COMMON_STARTER_SKILLS.map((skill) => {
                const isSelected = selectedSkills.some((s) => s.name === skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-sm'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {skill} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>

            {/* Confidence Adjuster for selected skills */}
            {selectedSkills.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <p className="text-xs font-semibold text-slate-300">
                  Refine Confidence for Selected Skills ({selectedSkills.length})
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedSkills.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-900"
                    >
                      <span className="text-slate-300 font-medium">{s.name}</span>
                      <div className="flex space-x-1">
                        {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => changeSkillConfidence(s.name, level)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                              s.level === level
                                ? 'bg-teal-500 text-slate-950 font-bold'
                                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs hover:bg-teal-300 transition-all"
              >
                <span>Continue to Target Role</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Target Career Role */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-teal-400 mb-1">
                <Target className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-wider">Step 4</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Target Career Role</h2>
              <p className="text-xs text-slate-400">
                Industry requisitions and AI skill gap analysis will calibrate around this target.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {SUPPORTED_ROLES.map((role) => {
                const isSelected = targetRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTargetRole(role)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-md shadow-teal-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span>{role}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Enterprise & Startup Requisitions
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs hover:bg-teal-300 transition-all"
              >
                <span>Continue to Resume Decision</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Resume Decision (PART 7) */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-teal-400 mb-1">
                <FileText className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-wider">Step 5</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Do you already have a resume?
              </h2>
              <p className="text-xs text-slate-400">
                This decision alters whether you enter Mode A (AI Resume Parser) or Mode B (Interactive Matrix).
              </p>
            </div>

            {/* Two Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setHasResumeChoice(true)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  hasResumeChoice === true
                    ? 'bg-teal-500/15 border-teal-500 text-teal-300 shadow-lg shadow-teal-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">YES, I Have a Resume</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Upload your PDF or DOCX resume. Our AI parser will extract your skills, coursework, and projects for confirmation.
                  </p>
                </div>
                {hasResumeChoice === true && (
                  <span className="mt-4 inline-flex items-center space-x-1 text-xs font-bold text-teal-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selected Mode A</span>
                  </span>
                )}
              </div>

              <div
                onClick={() => {
                  setHasResumeChoice(false);
                  setUploadedFileName('');
                }}
                className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  hasResumeChoice === false
                    ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">NO, Build My Profile</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No resume yet? No problem. We'll guide you through a structured career path matrix without blocking your progress.
                  </p>
                </div>
                {hasResumeChoice === false && (
                  <span className="mt-4 inline-flex items-center space-x-1 text-xs font-bold text-indigo-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selected Mode B</span>
                  </span>
                )}
              </div>
            </div>

            {/* If YES: Upload Dropzone */}
            {hasResumeChoice === true && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-dashed border-slate-700 text-center space-y-3">
                <Upload className="w-8 h-8 text-teal-400 mx-auto animate-bounce" />
                <div>
                  <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors">
                    <span>{isUploading ? 'Parsing Resume...' : 'Browse PDF / DOCX'}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleSimulatedFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Supported: PDF, DOCX (Max 10MB)
                  </p>
                </div>

                {uploadedFileName && (
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Uploaded: {uploadedFileName}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={hasResumeChoice === null}
                onClick={handleFinishOnboarding}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold text-xs hover:from-teal-300 hover:to-emerald-300 disabled:opacity-50 transition-all shadow-md shadow-teal-500/20"
              >
                <span>Launch Career Dashboard</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
