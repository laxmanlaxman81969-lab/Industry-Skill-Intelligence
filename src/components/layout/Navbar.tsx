import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Sparkles,
  LogOut,
  User,
  Building2,
  GraduationCap,
  ShieldCheck,
  ChevronDown,
  Home,
  Layers,
  TrendingUp,
  Users,
} from "lucide-react";
import { UserRole } from "../../types";

interface NavbarProps {
  onOpenAuth: (role?: UserRole) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  activeView,
  setActiveView,
}) => {
  const { currentUser, logout, login } = useApp();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => {
              setActiveView("landing");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 group-hover:border-blue-400 transition-all shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  AI Skill Gap Platform
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Enterprise
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">
                Curriculum Alignment & Skill Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-medium text-slate-600">
            <button
              onClick={() => {
                setActiveView("landing");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeView === "landing"
                  ? "text-blue-700 bg-blue-50 border border-blue-200 font-semibold"
                  : "hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Home className="w-3.5 h-3.5 opacity-70" />
              <span>Home</span>
            </button>
            <button
              onClick={() => {
                setActiveView("landing");
                setTimeout(() => {
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                }, 80);
              }}
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center space-x-1.5"
            >
              <Layers className="w-3.5 h-3.5 opacity-70" />
              <span>How It Works</span>
            </button>
            <button
              onClick={() => {
                setActiveView("landing");
                setTimeout(() => {
                  document.getElementById("industry-skills")?.scrollIntoView({ behavior: "smooth" });
                }, 80);
              }}
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center space-x-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 opacity-70" />
              <span>Industry Skills</span>
            </button>
            <button
              onClick={() => {
                setActiveView("landing");
                setTimeout(() => {
                  document.getElementById("stakeholders")?.scrollIntoView({ behavior: "smooth" });
                }, 80);
              }}
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5 opacity-70" />
              <span>Ecosystem</span>
            </button>

          </nav>

          {/* Right Action: Auth & Profile */}
          <div className="flex items-center space-x-3">
            {currentUser && activeView !== "landing" ? (
              <div className="flex items-center space-x-2.5">
                {/* User Avatar & Name */}
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {(() => {
                      const name = currentUser.name === "Aarav Sharma" ? "N.Lakshman" : currentUser.name;
                      const parts = name.split(/[\s.]+/).filter(Boolean);
                      return parts.length >= 2
                        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
                        : name.slice(0, 2).toUpperCase();
                    })()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 leading-tight">
                      {currentUser.name === "Aarav Sharma" ? "N.Lakshman" : currentUser.name}
                    </span>
                    <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setActiveView("landing");
                  }}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth()}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth("student")}
                  className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-all font-sans"
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
