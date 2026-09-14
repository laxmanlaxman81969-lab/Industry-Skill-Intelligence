import React from 'react';
import { Radar, Shield, Award, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/95 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <Radar className="w-4 h-4" />
              </div>
              <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                AI-Powered Industry Skill Gap & Curriculum Alignment Platform
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-world career intelligence platform connecting Students, Colleges, Companies, and Industry Demand for Smart India Hackathon 2026.
            </p>
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/20">
              Problem Statement: SIH26134
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Platform Pillars
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-teal-400 transition-colors">Industry Demand Aggregator</li>
              <li className="hover:text-teal-400 transition-colors">AI Skill Gap Analyzer</li>
              <li className="hover:text-teal-400 transition-colors">Personalized Growth Roadmap</li>
              <li className="hover:text-teal-400 transition-colors">Skill Practice Lab</li>
              <li className="hover:text-teal-400 transition-colors">AI Video Mock Interview</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Stakeholder Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-teal-400 transition-colors">Students & Graduates</li>
              <li className="hover:text-teal-400 transition-colors">Hiring Companies & Talent Teams</li>
              <li className="hover:text-teal-400 transition-colors">Colleges & University Deans</li>
              <li className="hover:text-teal-400 transition-colors">Platform Administrators</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Transparency & Ethics
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Ethical Verification: Non-punitive Skill Verification Concern checks</span>
              </div>
              <div className="flex items-start space-x-2">
                <Award className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Transparent AI Quality scoring without unverified claims</span>
              </div>
              <div className="flex items-start space-x-2">
                <Layers className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Dynamic demand derived from verifiable hiring requisitions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 AI-Powered Industry Skill Gap & Curriculum Alignment Platform. Smart India Hackathon 2026 Prototype.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span>Prototype / Sample Industry Data Engine</span>
            <span>Privacy & Integrity Framework</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
