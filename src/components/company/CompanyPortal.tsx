import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobRequirement, SkillLevel } from '../../types';
import { SUPPORTED_ROLES } from '../../data/seedData';
import {
  Building2,
  Plus,
  Users,
  Briefcase,
  CheckCircle2,
  Award,
  Filter,
  Search,
  ExternalLink,
  MapPin,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CompanyPortal: React.FC = () => {
  const { companies, jobs, postJob, studentProfile } = useApp();
  const activeCompany = companies[0]; // ABC Technologies

  const [activeTab, setActiveTab] = useState<'talent-radar' | 'post-job' | 'active-jobs'>('talent-radar');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Job Posting Form State
  const [jobTitle, setJobTitle] = useState('');
  const [targetRole, setTargetRole] = useState('Java Backend Developer');
  const [jobLocation, setJobLocation] = useState('Bangalore (Hybrid)');
  const [jobType, setJobType] = useState<'Full-time' | 'Internship' | 'Remote'>('Full-time');
  const [jobExperience, setJobExperience] = useState('0-2 Years');
  const [jobPackage, setJobPackage] = useState('₹8.0 - ₹12.0 LPA');
  const [jobDescription, setJobDescription] = useState('');
  const [minReadiness, setMinReadiness] = useState(65);

  const [skillsList, setSkillsList] = useState<{ skill: string; level: SkillLevel; weight: number }[]>([
    { skill: 'Java', level: 'Advanced', weight: 10 },
    { skill: 'Spring Boot', level: 'Intermediate', weight: 9 },
    { skill: 'SQL', level: 'Intermediate', weight: 8 },
    { skill: 'REST API', level: 'Intermediate', weight: 8 }
  ]);

  const [newSkillName, setNewSkillName] = useState('');

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkillsList([
      ...skillsList,
      { skill: newSkillName.trim(), level: 'Intermediate', weight: 8 }
    ]);
    setNewSkillName('');
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    postJob({
      companyId: activeCompany.id,
      companyName: activeCompany.name,
      title: jobTitle,
      role: targetRole,
      location: jobLocation,
      type: jobType,
      experience: jobExperience,
      package: jobPackage,
      description: jobDescription || 'Enterprise microservices development and API design role.',
      requiredSkills: skillsList,
      minReadinessScore: minReadiness
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
    setActiveTab('active-jobs');

    try {
      confetti({ particleCount: 50 });
    } catch (e) {}
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              Company Portal
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">{activeCompany.industry}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {activeCompany.name} Talent Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Discover verified campus candidates and manage weighted role requisitions.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('talent-radar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'talent-radar'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Candidate Talent Radar
          </button>
          <button
            onClick={() => setActiveTab('post-job')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'post-job'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Post Role Requisition
          </button>
          <button
            onClick={() => setActiveTab('active-jobs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'active-jobs'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Requisitions ({jobs.length})
          </button>
        </div>
      </div>

      {showSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in shadow-xl">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>New Requisition Published! Industry demand engine updated with new skill observations.</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CANDIDATE TALENT RADAR */}
      {/* ========================================================================= */}
      {activeTab === 'talent-radar' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Verified Campus Candidate Talent Radar</span>
            </h3>
            <p className="text-xs text-slate-300">
              Filtered candidates verified via AI Video Mock Interviews and Practice Lab assignments. No unverified resume keyword claims.
            </p>
          </div>

          {/* Verified Candidate Profile Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-indigo-500/40 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-bold text-white">{studentProfile.fullName}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20 font-semibold">
                    Verified Candidate
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {studentProfile.college} • {studentProfile.degree} ({studentProfile.branch}) • Graduating {studentProfile.graduationYear}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Verified Readiness</span>
                  <p className="text-2xl font-black text-teal-300">{studentProfile.overallReadiness}%</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Target Role</span>
                <p className="font-bold text-white mt-0.5">{studentProfile.targetRole}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">AI Mock Interview</span>
                <p className="font-bold text-emerald-400 mt-0.5">82% Technical • Low Integrity Risk</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Lab Assignment</span>
                <p className="font-bold text-teal-300 mt-0.5">REST API (78% Code Quality)</p>
              </div>
            </div>

            {/* Verified Skills badges */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                Demonstrated Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {studentProfile.skills.map((s) => (
                  <span
                    key={s.name}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950 border border-slate-800 text-slate-200 flex items-center space-x-1"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] text-teal-400">({s.level})</span>
                    {s.verified && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => alert(`Interview invitation and technical requisition link dispatched to ${studentProfile.email}`)}
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
              >
                Send Fast-Track Interview Requisition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POST REQUISITION FORM */}
      {/* ========================================================================= */}
      {activeTab === 'post-job' && (
        <form onSubmit={handlePostJob} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 max-w-3xl mx-auto shadow-2xl animate-fade-in">
          <div className="space-y-1 border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white">Post Role Requisition</h2>
            <p className="text-xs text-slate-400">
              Define required skills with weights. This dynamically updates the Industry Demand Engine across all student dashboards!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Job Title</label>
              <input
                type="text"
                required
                placeholder="Junior Java Backend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Target Role Category</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
              >
                {SUPPORTED_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Package / CTC</label>
              <input
                type="text"
                value={jobPackage}
                onChange={(e) => setJobPackage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Minimum Verified Readiness Threshold (%)</label>
              <input
                type="number"
                min={40}
                max={95}
                value={minReadiness}
                onChange={(e) => setMinReadiness(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Employment Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          {/* Weighted Skills Input */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-200">
              Required Skills & Weighting (Affects Demand Calculation):
            </label>

            <div className="flex flex-wrap gap-2">
              {skillsList.map((s) => (
                <div
                  key={s.skill}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center space-x-2"
                >
                  <span className="font-semibold text-white">{s.skill}</span>
                  <span className="text-[10px] text-indigo-400 font-mono">({s.level}, W:{s.weight})</span>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Docker, Kafka)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/30 transition-colors"
              >
                + Add Skill
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!jobTitle}
              className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition-all shadow-xl shadow-indigo-500/20"
            >
              Publish Requisition & Update Industry Demand
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* ACTIVE JOBS LIST */}
      {/* ========================================================================= */}
      {activeTab === 'active-jobs' && (
        <div className="space-y-4 animate-fade-in">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-bold text-white">{job.title}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Min {job.minReadinessScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {job.companyName} • {job.location} • {job.package} • Posted {job.postedDate}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {job.requiredSkills.map((req) => (
                    <span key={req.skill} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                      {req.skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-xs font-bold text-teal-400">{job.applicantsCount} Applicants</span>
                  <p className="text-[10px] text-slate-500">Verified Pipeline</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
