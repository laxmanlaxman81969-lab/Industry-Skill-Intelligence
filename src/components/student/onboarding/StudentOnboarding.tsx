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
      <div className="w-full max-w-2xl bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Step Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span className="uppercase tracking-wider">STUDENT ONBOARDING</span>
            <span className="text-blue-600 font-bold">Step {currentStep} of 5</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-blue-600 h-2 transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Basic Profile */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-blue-600 mb-1">
                <User className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Step 1</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tell us about yourself</h2>
              <p className="text-xs text-slate-500">
                Let's set up your foundational profile for personalized career matching.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. N.Lakshman"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Primary Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. lakshman@student.edu"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                disabled={!fullName}
                onClick={() => setCurrentStep(2)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xs"
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
              <div className="flex items-center space-x-2 text-blue-600 mb-1">
                <GraduationCap className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Step 2</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Background</h2>
              <p className="text-xs text-slate-500">
                Your institution and branch help us map campus curriculum to industry demand.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  College / University Name
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="Apex Institute of Technology"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree</label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.E.">B.E.</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Tech">M.Tech</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Branch</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Current Year
                  </label>
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="2027"
                    className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-xs"
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
              <div className="flex items-center space-x-2 text-blue-600 mb-1">
                <Layers className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Step 3</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Current Skills</h2>
              <p className="text-xs text-slate-500">
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border border-blue-400 shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {skill} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>

            {/* Confidence Adjuster for selected skills */}
            {selectedSkills.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <p className="text-xs font-semibold text-slate-700">
                  Refine Confidence for Selected Skills ({selectedSkills.length})
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedSkills.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-200"
                    >
                      <span className="text-slate-800 font-semibold">{s.name}</span>
                      <div className="flex space-x-1">
                        {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => changeSkillConfidence(s.name, level)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                              s.level === level
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
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
                className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-xs"
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
              <div className="flex items-center space-x-2 text-blue-600 mb-1">
                <Target className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Step 4</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Target Career Role</h2>
              <p className="text-xs text-slate-500">
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
                        ? 'bg-blue-50/70 border-blue-600 text-blue-700 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span>{role}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
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
                className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-xs"
              >
                <span>Continue to Resume Decision</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Resume Decision */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-blue-600 mb-1">
                <FileText className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Step 5</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Do you already have a resume?
              </h2>
              <p className="text-xs text-slate-500">
                This decision alters whether you enter Mode A (AI Resume Parser) or Mode B (Interactive Matrix).
              </p>
            </div>

            {/* Two Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setHasResumeChoice(true)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  hasResumeChoice === true
                    ? 'bg-blue-50/70 border-blue-600 text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">YES, I Have a Resume</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload your PDF or DOCX resume. Our AI parser will extract your skills, coursework, and projects for confirmation.
                  </p>
                </div>
                {hasResumeChoice === true && (
                  <span className="mt-4 inline-flex items-center space-x-1 text-xs font-semibold text-blue-700">
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
                    ? 'bg-blue-50/70 border-blue-600 text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">NO, Build My Profile</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    No resume yet? No problem. We'll guide you through a structured career path matrix without blocking your progress.
                  </p>
                </div>
                {hasResumeChoice === false && (
                  <span className="mt-4 inline-flex items-center space-x-1 text-xs font-semibold text-indigo-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selected Mode B</span>
                  </span>
                )}
              </div>
            </div>

            {/* If YES: Upload Dropzone */}
            {hasResumeChoice === true && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
                <Upload className="w-8 h-8 text-blue-600 mx-auto animate-bounce" />
                <div>
                  <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-800 transition-colors shadow-xs">
                    <span>{isUploading ? 'Parsing Resume...' : 'Browse PDF / DOCX'}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleSimulatedFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Supported: PDF, DOCX (Max 10MB)
                  </p>
                </div>

                {uploadedFileName && (
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Uploaded: {uploadedFileName}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={hasResumeChoice === null}
                onClick={handleFinishOnboarding}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xs"
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
