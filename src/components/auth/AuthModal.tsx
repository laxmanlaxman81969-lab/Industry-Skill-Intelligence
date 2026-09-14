import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { SUPPORTED_ROLES, INDUSTRIES } from '../../data/seedData';
import {
  X,
  User,
  Building2,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  Building,
  BookOpen
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onSuccessNavigate: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'student',
  onSuccessNavigate
}) => {
  const { login, setStudentProfile } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [isRegistering, setIsRegistering] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Student specific registration fields
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    college: '',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    currentYear: '3rd Year',
    graduationYear: '2027',
    targetRole: 'Java Backend Developer'
  });

  // Company specific fields
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    industry: 'Enterprise Software & SaaS',
    companySize: '500 - 1,000 employees',
    website: '',
    location: ''
  });

  // College specific fields
  const [collegeForm, setCollegeForm] = useState({
    collegeName: '',
    universityAffiliation: '',
    location: '',
    accreditation: 'NAAC A++'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegistering && selectedRole === 'student') {
      setStudentProfile(prev => ({
        ...prev,
        fullName: studentForm.fullName || 'New Student',
        email: email || 'student@radar.edu',
        college: studentForm.college || 'Apex Institute of Technology',
        degree: studentForm.degree,
        branch: studentForm.branch,
        currentYear: studentForm.currentYear,
        graduationYear: studentForm.graduationYear,
        targetRole: studentForm.targetRole,
        onboardingComplete: false // trigger onboarding!
      }));
    }

    login(selectedRole, email);
    onClose();
    onSuccessNavigate(selectedRole);
  };

  const handleQuickDemo = (role: UserRole) => {
    login(role);
    onClose();
    onSuccessNavigate(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-200">
              AI-Powered Skill Gap & Curriculum Alignment Platform
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Secure
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Role Selector Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Continue as
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('student');
                  setIsRegistering(false);
                }}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-xs font-semibold transition-all ${
                  selectedRole === 'student'
                    ? 'bg-teal-500/15 border-teal-500 text-teal-300 shadow-sm shadow-teal-500/10'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <User className="w-4 h-4 mb-1" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('company');
                  setIsRegistering(false);
                }}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-xs font-semibold transition-all ${
                  selectedRole === 'company'
                    ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/10'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4 mb-1" />
                <span>Company</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('college');
                  setIsRegistering(false);
                }}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-xs font-semibold transition-all ${
                  selectedRole === 'college'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/10'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="w-4 h-4 mb-1" />
                <span>College</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setIsRegistering(false); // Admin registration never exposed publicly
                }}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-xs font-semibold transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-rose-500/15 border-rose-500 text-rose-300 shadow-sm shadow-rose-500/10'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mb-1" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Fill Banner */}
          <div className="mb-6 p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-xs text-slate-300">
                Platform Demonstration Review? Use Instant 1-Click Access:
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickDemo(selectedRole)}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30 transition-colors"
            >
              Demo {selectedRole.toUpperCase()} Login
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white capitalize">
                {selectedRole} Portal {isRegistering ? 'Registration' : 'Login'}
              </h3>
              {selectedRole !== 'admin' && (
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-xs text-teal-400 hover:text-teal-300 transition-colors underline"
                >
                  {isRegistering ? 'Already registered? Login' : 'Create new account'}
                </button>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {selectedRole === 'company'
                  ? 'Official Work Email'
                  : selectedRole === 'college'
                  ? 'Official Institutional Email'
                  : selectedRole === 'admin'
                  ? 'Admin Verified Email'
                  : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder={
                    selectedRole === 'student'
                      ? 'aarav@college.edu'
                      : selectedRole === 'company'
                      ? 'talent@abctech.com'
                      : selectedRole === 'college'
                      ? 'dean@apextech.edu.in'
                      : 'admin@radar.gov.in'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Extra Student Registration Fields */}
            {isRegistering && selectedRole === 'student' && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Aarav Sharma"
                    value={studentForm.fullName}
                    onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">College / Institution</label>
                    <input
                      type="text"
                      required
                      placeholder="Apex Institute of Technology"
                      value={studentForm.college}
                      onChange={(e) => setStudentForm({ ...studentForm, college: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Degree</label>
                    <select
                      value={studentForm.degree}
                      onChange={(e) => setStudentForm({ ...studentForm, degree: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                    >
                      <option value="B.Tech">B.Tech</option>
                      <option value="B.E.">B.E.</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                      <option value="M.Tech">M.Tech</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Branch</label>
                    <input
                      type="text"
                      required
                      value={studentForm.branch}
                      onChange={(e) => setStudentForm({ ...studentForm, branch: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Current Year</label>
                    <select
                      value={studentForm.currentYear}
                      onChange={(e) => setStudentForm({ ...studentForm, currentYear: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Grad Year</label>
                    <input
                      type="text"
                      value={studentForm.graduationYear}
                      onChange={(e) => setStudentForm({ ...studentForm, graduationYear: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Career Role</label>
                  <select
                    value={studentForm.targetRole}
                    onChange={(e) => setStudentForm({ ...studentForm, targetRole: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  >
                    {SUPPORTED_ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Extra Company Registration Fields */}
            {isRegistering && selectedRole === 'company' && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="ABC Technologies"
                    value={companyForm.companyName}
                    onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Industry</label>
                    <select
                      value={companyForm.industry}
                      onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                    >
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Company Size</label>
                    <select
                      value={companyForm.companySize}
                      onChange={(e) => setCompanyForm({ ...companyForm, companySize: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="10 - 50 employees">10 - 50 employees</option>
                      <option value="50 - 200 employees">50 - 200 employees</option>
                      <option value="200 - 500 employees">200 - 500 employees</option>
                      <option value="500 - 1,000 employees">500 - 1,000 employees</option>
                      <option value="1,000 - 5,000 employees">1,000 - 5,000 employees</option>
                      <option value="5,000+ employees">5,000+ employees</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="url"
                    placeholder="https://company.com"
                    value={companyForm.website}
                    onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Location (e.g. Bangalore, Remote)"
                    value={companyForm.location}
                    onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Extra College Registration Fields */}
            {isRegistering && selectedRole === 'college' && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">College Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Apex Institute of Technology"
                    value={collegeForm.collegeName}
                    onChange={(e) => setCollegeForm({ ...collegeForm, collegeName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Affiliated University"
                    value={collegeForm.universityAffiliation}
                    onChange={(e) => setCollegeForm({ ...collegeForm, universityAffiliation: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="NAAC / NBA Accreditation"
                    value={collegeForm.accreditation}
                    onChange={(e) => setCollegeForm({ ...collegeForm, accreditation: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Admin Notice */}
            {selectedRole === 'admin' && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                <strong>Platform Security Policy:</strong> Admin credentials are strictly audited. Public self-registration is disabled. Default demo credentials are pre-configured.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-950 transition-all ${
                selectedRole === 'student'
                  ? 'bg-teal-400 hover:bg-teal-300'
                  : selectedRole === 'company'
                  ? 'bg-indigo-400 hover:bg-indigo-300'
                  : selectedRole === 'college'
                  ? 'bg-amber-400 hover:bg-amber-300'
                  : 'bg-rose-400 hover:bg-rose-300'
              }`}
            >
              <span>{isRegistering ? 'Complete Registration' : `Enter ${selectedRole.toUpperCase()} Portal`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
