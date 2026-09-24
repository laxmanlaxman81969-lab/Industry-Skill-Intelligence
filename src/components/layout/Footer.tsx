import React from "react";
import { Sparkles, ShieldCheck, Award, Layers, ChevronRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-slate-200 bg-white text-slate-600 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Col 1: Brand & Status */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                AI Skill Gap Platform
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enterprise career intelligence connecting Students, Colleges, and Hiring Companies
              with real-time industry demand and curriculum alignment.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-[11px] font-medium bg-slate-50 border border-slate-200 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Demand Feed Active</span>
            </div>
          </div>

          {/* Col 2: Platform Architecture */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-1.5">
              <span className="w-1 h-3 rounded-full bg-blue-600" />
              Platform Architecture
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                "Industry Demand Engine",
                "AI Skill Gap Analyzer",
                "Personalized Career Roadmap",
                "Skill Practice Lab",
                "AI Video Mock Interview",
                "Industry Opportunity Matches",
              ].map((item) => (
                <li key={item} className="flex items-center space-x-1.5 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer group">
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Stakeholder Hubs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-1.5">
              <span className="w-1 h-3 rounded-full bg-indigo-600" />
              Stakeholder Hubs
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                "Students & Job Seekers",
                "Colleges & University Deans",
                "Hiring Companies & Talent Teams",
                "Institutional Governance Panel",
                "Curriculum Alignment Engine",
                "Talent Verification Dashboard",
              ].map((item) => (
                <li key={item} className="flex items-center space-x-1.5 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer group">
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Trust, Ethics & Standards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-1.5">
              <span className="w-1 h-3 rounded-full bg-emerald-600" />
              Trust & Standards
            </h4>
            <div className="space-y-3 text-xs text-slate-500">
              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  Ethical AI verification with non-punitive gap assessments.
                </span>
              </div>
              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  Transparent readiness scoring supported by portfolio proof.
                </span>
              </div>
              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <Layers className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  Dynamic skill demands derived from verifiable market requisitions.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 AI-Powered Industry Skill Gap & Curriculum Alignment Platform. All rights reserved.</p>
          <div className="flex items-center space-x-5 text-[11px]">
            <span className="hover:text-slate-600 transition-colors cursor-pointer">Verification Standards</span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-slate-600 transition-colors cursor-pointer">Privacy Framework</span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-slate-600 transition-colors cursor-pointer">Data Governance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
