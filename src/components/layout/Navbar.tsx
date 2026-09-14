import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Radar,
  Sparkles,
  LogOut,
  User,
  Building2,
  GraduationCap,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenAuth: (role?: UserRole) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  activeView,
  setActiveView
}) => {
  const { currentUser, logout, login } = useApp();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveView('landing')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-500/5 border border-teal-500/30 text-teal-400 group-hover:border-teal-400/60 transition-all shadow-lg shadow-teal-950/30">
              <Radar className="w-5 h-5 animate-pulse-subtle" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  AI Industry Skill Gap & Curriculum Platform
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                  Enterprise Platform
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 font-medium">
                From Campus Skills to Industry Opportunities
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveView('landing')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeView === 'landing'
                  ? 'text-teal-400 bg-teal-500/10'
                  : 'hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveView('landing');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setActiveView('landing');
                setTimeout(() => {
                  document.getElementById('industry-skills')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Industry Skills
            </button>
            <button
              onClick={() => {
                setActiveView('landing');
                setTimeout(() => {
                  document.getElementById('stakeholders')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Ecosystem
            </button>

            {/* Quick Portal Switcher for Testing/Review */}
            <div className="relative group ml-2">
              <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:border-teal-500/50 hover:text-teal-300 transition-all">
                <span>Switch Portal</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>
              <div className="absolute right-0 mt-1 w-48 py-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <button
                  onClick={() => {
                    login('student');
                    setActiveView('student-dashboard');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-left hover:bg-teal-500/10 hover:text-teal-300 text-slate-300"
                >
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  <span>Student Portal</span>
                </button>
                <button
                  onClick={() => {
                    login('company');
                    setActiveView('company-portal');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-left hover:bg-indigo-500/10 hover:text-indigo-300 text-slate-300"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Company Portal</span>
                </button>
                <button
                  onClick={() => {
                    login('college');
                    setActiveView('college-portal');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-left hover:bg-amber-500/10 hover:text-amber-300 text-slate-300"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>College Portal</span>
                </button>
                <button
                  onClick={() => {
                    login('admin');
                    setActiveView('admin-portal');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-left hover:bg-rose-500/10 hover:text-rose-300 text-slate-300"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  <span>Admin Portal</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Right Action: Auth & Profile */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-white">{currentUser.name}</span>
                  <span className="text-[10px] text-teal-400 font-mono uppercase tracking-wider">
                    {currentUser.role} Portal
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (currentUser.role === 'student') setActiveView('student-dashboard');
                    if (currentUser.role === 'company') setActiveView('company-portal');
                    if (currentUser.role === 'college') setActiveView('college-portal');
                    if (currentUser.role === 'admin') setActiveView('admin-portal');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    setActiveView('landing');
                  }}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth()}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('student')}
                  className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 hover:from-teal-400 hover:to-emerald-400 shadow-md shadow-teal-500/20 hover:shadow-teal-500/40 transition-all font-sans"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
