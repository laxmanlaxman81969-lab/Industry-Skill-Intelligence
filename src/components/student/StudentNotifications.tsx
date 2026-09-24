import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  Zap,
  TrendingUp,
  Video,
  Briefcase,
  Star
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'action';
  icon: React.ReactNode;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'action',
    icon: <Zap className="w-4 h-4 text-amber-400" />,
    title: 'Skill Gap Detected',
    body: 'Your profile is missing Docker and Kubernetes — both in high demand for Backend roles. Update your roadmap.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'info',
    icon: <TrendingUp className="w-4 h-4 text-blue-600" />,
    title: 'Industry Demand Updated',
    body: 'React and TypeScript demand has increased by 12% this month for Full-Stack Engineer roles.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'action',
    icon: <Video className="w-4 h-4 text-indigo-600" />,
    title: 'AI Mock Interview Available',
    body: 'Your roadmap step 3 (REST API Design) has a practice interview ready. Attempt it to verify your skills.',
    time: '1 day ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'success',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    title: 'Assignment Completed',
    body: 'You successfully submitted the REST API Design assignment. Check your feedback in the Performance section.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'info',
    icon: <Briefcase className="w-4 h-4 text-slate-400" />,
    title: 'New Opportunity Match',
    body: 'TCS has posted a new Backend Developer role matching your target. Check Opportunities to view details.',
    time: '3 days ago',
    read: true,
  },
  {
    id: 'n6',
    type: 'success',
    icon: <Star className="w-4 h-4 text-amber-400" />,
    title: 'Roadmap Milestone Reached',
    body: 'You completed Step 2 of your Career Growth Roadmap. Keep going — Step 3 is unlocked!',
    time: '5 days ago',
    read: true,
  },
];

const TYPE_STYLE: Record<string, { border: string; bg: string }> = {
  success: { border: 'border-emerald-200', bg: 'bg-emerald-50 text-emerald-600' },
  info: { border: 'border-blue-200', bg: 'bg-blue-50 text-blue-600' },
  warning: { border: 'border-amber-200', bg: 'bg-amber-50 text-amber-600' },
  action: { border: 'border-blue-200', bg: 'bg-blue-50 text-blue-600' },
};

export const StudentNotifications: React.FC = () => {
  const { studentProfile } = useApp();
  const unreadCount = DEMO_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center space-x-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 ml-10">Platform alerts, skill updates and career insights for {studentProfile.fullName}.</p>
        </div>
      </div>

      {/* Notification list */}
      <div className="space-y-4">
        {/* Unread */}
        {DEMO_NOTIFICATIONS.filter((n) => !n.read).length > 0 && (
          <div className="space-y-2.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Unread Alerts</p>
            {DEMO_NOTIFICATIONS.filter((n) => !n.read).map((notif) => (
              <div
                key={notif.id}
                className="flex items-start space-x-4 p-4 rounded-xl bg-white border border-blue-200/80 shadow-xs relative hover:border-blue-300 transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${TYPE_STYLE[notif.type]?.bg || 'bg-slate-100 text-slate-600'}`}>
                  {notif.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{notif.title}</p>
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.body}</p>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Read */}
        {DEMO_NOTIFICATIONS.filter((n) => n.read).length > 0 && (
          <div className="space-y-2.5 pt-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Earlier Notifications</p>
            {DEMO_NOTIFICATIONS.filter((n) => n.read).map((notif) => (
              <div
                key={notif.id}
                className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  {notif.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.body}</p>
                  <p className="text-[11px] text-slate-400 mt-2">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
