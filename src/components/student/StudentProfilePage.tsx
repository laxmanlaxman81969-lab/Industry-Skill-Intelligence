import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  Target,
  CheckCircle2,
  Edit3,
  Save,
  X,
  BookOpen,
  Calendar,
  FileText,
  Award,
  BarChart2
} from 'lucide-react';

interface StudentProfilePageProps {
  onNavigate: (view: string) => void;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ onNavigate }) => {
  const { studentProfile, setStudentProfile, currentUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: studentProfile.fullName,
    college: studentProfile.college,
    degree: studentProfile.degree,
    branch: studentProfile.branch,
    currentYear: studentProfile.currentYear,
    graduationYear: studentProfile.graduationYear,
    targetRole: studentProfile.targetRole,
    targetCompany: studentProfile.targetCompany ?? '',
  });

  const handleSave = () => {
    setStudentProfile((prev) => ({
      ...prev,
      fullName: form.fullName.trim() || prev.fullName,
      college: form.college.trim() || prev.college,
      degree: form.degree.trim() || prev.degree,
      branch: form.branch.trim() || prev.branch,
      currentYear: form.currentYear.trim() || prev.currentYear,
      graduationYear: form.graduationYear.trim() || prev.graduationYear,
      targetRole: form.targetRole.trim() || prev.targetRole,
      targetCompany: form.targetCompany.trim() || undefined,
    }));
    setEditing(false);
  };

  const initials = studentProfile.fullName
    .split(/[\s.]/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const verifiedCount = studentProfile.skills.filter((s) => s.verified).length;

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Profile Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-sm shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{studentProfile.fullName}</h1>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser?.email}</p>
              <p className="text-xs font-semibold text-blue-700 mt-1">{studentProfile.branch} · {studentProfile.degree}</p>
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all shrink-0 shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold shadow-xs transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => { setEditing(false); setForm({ fullName: studentProfile.fullName, college: studentProfile.college, degree: studentProfile.degree, branch: studentProfile.branch, currentYear: studentProfile.currentYear, graduationYear: studentProfile.graduationYear, targetRole: studentProfile.targetRole, targetCompany: studentProfile.targetCompany ?? '' }); }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>{verifiedCount} verified skills</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
              <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{studentProfile.overallReadiness}% career readiness</span>
            </div>
            {studentProfile.hasResume && (
              <div className="flex items-center space-x-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resume uploaded</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic & Career Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Full Name</span>
            </label>
            {editing ? (
              <input
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            ) : (
              <p className="text-sm font-medium text-slate-900">{studentProfile.fullName}</p>
            )}
          </div>

          {/* Email (read only) */}
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email</span>
            </label>
            <p className="text-sm font-medium text-slate-900">{currentUser?.email}</p>
          </div>

          {/* College */}
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>College / Institution</span>
            </label>
            {editing ? (
              <input
                value={form.college}
                onChange={(e) => setForm((p) => ({ ...p, college: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            ) : (
              <p className="text-sm font-medium text-slate-900">{studentProfile.college}</p>
            )}
          </div>

          {/* Degree */}
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              <span>Degree & Branch</span>
            </label>
            {editing ? (
              <div className="flex space-x-2">
                <input
                  value={form.degree}
                  onChange={(e) => setForm((p) => ({ ...p, degree: e.target.value }))}
                  placeholder="e.g. B.Tech"
                  className="w-1/2 px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                <input
                  value={form.branch}
                  onChange={(e) => setForm((p) => ({ ...p, branch: e.target.value }))}
                  placeholder="e.g. CSE"
                  className="w-1/2 px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-900">{studentProfile.degree} · {studentProfile.branch}</p>
            )}
          </div>

          {/* Current Year */}
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Current Year</span>
            </label>
            {editing ? (
              <select
                value={form.currentYear}
                onChange={(e) => setForm((p) => ({ ...p, currentYear: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm font-medium text-slate-900">{studentProfile.currentYear}</p>
            )}
          </div>

          {/* Graduation Year */}
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Graduation Year</span>
            </label>
            {editing ? (
              <input
                value={form.graduationYear}
                onChange={(e) => setForm((p) => ({ ...p, graduationYear: e.target.value }))}
                placeholder="e.g. 2026"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            ) : (
              <p className="text-sm font-medium text-slate-900">{studentProfile.graduationYear}</p>
            )}
          </div>

          {/* Target Role */}
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              <Target className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Role</span>
            </label>
            {editing ? (
              <input
                value={form.targetRole}
                onChange={(e) => setForm((p) => ({ ...p, targetRole: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            ) : (
              <p className="text-sm font-medium text-slate-900">{studentProfile.targetRole}</p>
            )}
          </div>

          {/* Target Company */}
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Company <span className="text-slate-400 font-normal">(optional)</span></span>
            </label>
            {editing ? (
              <input
                value={form.targetCompany}
                onChange={(e) => setForm((p) => ({ ...p, targetCompany: e.target.value }))}
                placeholder="e.g. Google, TCS"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            ) : (
              <p className="text-sm font-medium text-slate-900">{studentProfile.targetCompany || '—'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Resume Section */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Resume & Credentials</p>
            {studentProfile.hasResume ? (
              <p className="text-xs text-emerald-600 mt-0.5 flex items-center space-x-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{studentProfile.resumeFileName} · Score: {studentProfile.resumeScore}/100</span>
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-0.5">No resume uploaded yet</p>
            )}
          </div>
        </div>
        <button
          onClick={() => onNavigate('resume-data')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-xl transition-colors"
        >
          {studentProfile.hasResume ? 'Manage Resumes' : 'Upload Resume'}
        </button>
      </div>
    </div>
  );
};
