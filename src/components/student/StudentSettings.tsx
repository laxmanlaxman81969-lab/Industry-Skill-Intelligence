import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Bell,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  Lock
} from 'lucide-react';

const Toggle2 = ({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) => (
  <div className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0">
    <div className="flex-1 pr-4">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      {description && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        checked ? 'bg-blue-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export const StudentSettings: React.FC = () => {
  const { studentProfile, setStudentProfile } = useApp();

  const [notifSettings, setNotifSettings] = useState({
    skillGapAlerts: true,
    industryDemandUpdates: true,
    assignmentReminders: true,
    interviewReminders: true,
    opportunityMatches: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    showProfileToEmployers: true,
    shareVerifiedSkills: true,
    allowCollegeAccess: true,
  });

  const [showEmail, setShowEmail] = useState(false);

  const toggleNotif = (key: keyof typeof notifSettings) => {
    setNotifSettings((p) => ({ ...p, [key]: !p[key] }));
  };

  const togglePrivacy = (key: keyof typeof privacySettings) => {
    setPrivacySettings((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Settings</h1>
        </div>
        <p className="text-xs text-slate-500 ml-10">Manage your notifications, privacy, and account preferences.</p>
      </div>

      {/* Account Info */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <Lock className="w-4 h-4 text-slate-400" />
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Overview</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</p>
            <p className="text-sm font-semibold text-slate-800">{studentProfile.fullName}</p>
          </div>
          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</p>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-semibold text-slate-800">
                {showEmail ? studentProfile.email : studentProfile.email.replace(/(?<=.{2}).(?=.*@)/g, '*')}
              </p>
              <button
                onClick={() => setShowEmail((p) => !p)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showEmail ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Role</p>
            <p className="text-sm font-semibold text-slate-800">Student</p>
          </div>
          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Portal ID</p>
            <p className="text-xs font-mono text-slate-600">{studentProfile.id}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <p className="text-xs text-slate-500">
            This is a demo platform (SIH26134). Account credentials are pre-seeded and cannot be changed in the demo.
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Bell className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notification Preferences</h2>
        </div>
        <div>
          <Toggle2
            checked={notifSettings.skillGapAlerts}
            onChange={() => toggleNotif('skillGapAlerts')}
            label="Skill Gap Alerts"
            description="Get notified when industry demand for skills in your target role changes"
          />
          <Toggle2
            checked={notifSettings.industryDemandUpdates}
            onChange={() => toggleNotif('industryDemandUpdates')}
            label="Industry Demand Updates"
            description="Monthly summary of trending skills in your field"
          />
          <Toggle2
            checked={notifSettings.assignmentReminders}
            onChange={() => toggleNotif('assignmentReminders')}
            label="Assignment Reminders"
            description="Reminders for pending assignments and their deadlines"
          />
          <Toggle2
            checked={notifSettings.interviewReminders}
            onChange={() => toggleNotif('interviewReminders')}
            label="AI Interview Reminders"
            description="Nudges to complete practice interviews for skill verification"
          />
          <Toggle2
            checked={notifSettings.opportunityMatches}
            onChange={() => toggleNotif('opportunityMatches')}
            label="Opportunity Match Alerts"
            description="Notify when new job postings match your readiness profile"
          />
        </div>
      </div>

      {/* Privacy */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Shield className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Privacy & Data Sharing</h2>
        </div>
        <div>
          <Toggle2
            checked={privacySettings.showProfileToEmployers}
            onChange={() => togglePrivacy('showProfileToEmployers')}
            label="Show Profile to Employers"
            description="Allow registered companies to view your verified skill profile when you apply"
          />
          <Toggle2
            checked={privacySettings.shareVerifiedSkills}
            onChange={() => togglePrivacy('shareVerifiedSkills')}
            label="Share Verified Skills"
            description="Include verified skill badges in your employer-facing profile"
          />
          <Toggle2
            checked={privacySettings.allowCollegeAccess}
            onChange={() => togglePrivacy('allowCollegeAccess')}
            label="Allow College to View Readiness"
            description="Your institution's placement cell can see your readiness score (not raw data)"
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <h2 className="text-xs font-bold text-rose-700 uppercase tracking-wider">Danger Zone</h2>
        </div>
        <p className="text-xs text-rose-800 leading-relaxed">
          Resetting your profile will clear all skill data, roadmap progress, and assignment history. This cannot be undone in the live version.
        </p>
        <button
          disabled
          className="px-4 py-2 rounded-xl bg-rose-100 border border-rose-300 text-rose-600 text-xs font-semibold opacity-60 cursor-not-allowed"
        >
          Reset Profile Data (Demo — Disabled)
        </button>
      </div>
    </div>
  );
};
