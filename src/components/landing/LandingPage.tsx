import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Target,
  Map,
  Zap,
  BookOpen,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Building2,
  Sparkles,
} from "lucide-react";
import { UserRole } from "../../types";

interface LandingPageProps {
  onOpenAuth: (role?: UserRole) => void;
  onNavigateToStudent: () => void;
}

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function FadeSection({
  children,
  className = "",
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      id={id}
      className={`${className} transition-all duration-700`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function LandingPage({ onOpenAuth }: LandingPageProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full bg-slate-50 text-slate-900 font-sans">
      {/* ── HERO SECTION ── */}
      <section
        id="hero"
        className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-50"
      >
        {/* Ambient glow backgrounds */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Hero Text */}
          <div
            className="flex-1 text-center lg:text-left"
            style={{ animation: "fadeSlideUp 0.7s ease both" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-6 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>AI-POWERED INDUSTRY SKILL INTELLIGENCE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
              Build the Skills{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                Industry Needs.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              An AI-powered platform that connects real industry demand to student skill development
              and curriculum alignment — so every learning decision is backed by market intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start mb-8">
              <button
                onClick={() => onOpenAuth("student")}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-sm hover:shadow hover:-translate-y-0.5 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollTo("how-it-works")}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-blue-400 px-6 py-3.5 rounded-xl shadow-xs transition-all font-medium"
              >
                <span>Learn How It Works</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-500 font-mono">
              <span className="text-blue-600 font-bold">●</span> Industry Demand
              <span className="text-slate-300">•</span>
              <span className="text-indigo-600 font-bold">●</span> Skill Development
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600 font-bold">●</span> Curriculum Alignment
            </div>
          </div>

          {/* Right Concept Flow Card */}
          <div
            className="flex-1 max-w-md w-full"
            style={{ animation: "fadeSlideUp 0.7s ease 0.15s both" }}
          >
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-semibold">
                  <Brain className="w-3.5 h-3.5 text-blue-600" />
                  Concept Flow Architecture
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                  Live Engine
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    Icon: TrendingUp,
                    color: "blue",
                    label: "Industry Demand",
                    desc: "Real-time skill signals from live market data",
                  },
                  {
                    Icon: BarChart3,
                    color: "indigo",
                    label: "Required Skills",
                    desc: "What companies are hiring for right now",
                  },
                  {
                    Icon: Target,
                    color: "amber",
                    label: "Skill Gap Analysis",
                    desc: "AI-detected gaps compared with your profile",
                  },
                  {
                    Icon: Map,
                    color: "emerald",
                    label: "Skill Development",
                    desc: "Personalized milestone learning roadmap",
                  },
                ].map(({ Icon, color, label, desc }, i) => (
                  <React.Fragment key={label}>
                    <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 hover:border-slate-300 transition-colors">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          color === "blue"
                            ? "bg-blue-50 border border-blue-200 text-blue-600"
                            : color === "indigo"
                            ? "bg-indigo-50 border border-indigo-200 text-indigo-600"
                            : color === "amber"
                            ? "bg-amber-50 border border-amber-200 text-amber-600"
                            : "bg-emerald-50 border border-emerald-200 text-emerald-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{label}</p>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                    </div>
                    {i < 3 && (
                      <div className="flex justify-center my-0.5">
                        <ChevronRight className="w-4 h-4 text-slate-300 rotate-90" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY SECTION (id="industry-skills") ── */}
      <section id="industry-skills" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeSection className="text-center mb-14">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-600 mb-2">
              WHY INDUSTRY SKILL INTELLIGENCE?
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Connecting Industry Needs With Skill Development.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Most students graduate without knowing what industry actually needs. Most curricula are
              updated years too late. This platform closes that loop with AI.
            </p>
          </FadeSection>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                Icon: TrendingUp,
                color: "blue",
                title: "Industry Demand",
                body: "Live signals from job postings, industry shifts, and market data reveal which skills employers are hiring for right now.",
              },
              {
                Icon: Brain,
                color: "indigo",
                title: "AI Skill Gap Analysis",
                body: "Our AI engine compares your current skills against industry benchmarks to surface the exact gaps you need to close.",
              },
              {
                Icon: Map,
                color: "emerald",
                title: "Personalized Development",
                body: "Receive a step-by-step skill development roadmap, practice assignments, and AI mock interviews tailored to your target role.",
              },
              {
                Icon: BookOpen,
                color: "amber",
                title: "Curriculum Intelligence",
                body: "Colleges get data-driven insights to align their programs with industry reality — before students graduate unprepared.",
              },
            ].map(({ Icon, color, title, body }, i) => (
              <FadeSection key={title} delay={i * 80}>
                <div className="h-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-blue-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      color === "blue"
                        ? "bg-blue-50 border border-blue-200 text-blue-600"
                        : color === "indigo"
                        ? "bg-indigo-50 border border-indigo-200 text-indigo-600"
                        : color === "emerald"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
                        : "bg-amber-50 border border-amber-200 text-amber-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS SECTION (id="how-it-works") ── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <FadeSection className="text-center mb-14">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-600 mb-2">
              HOW IT WORKS
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Four Steps from Demand to Readiness.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
              The platform handles everything between industry signal and career confidence.
            </p>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                Icon: TrendingUp,
                title: "Understand Demand",
                body: "The platform ingests live industry data to map which skills and roles are in demand across sectors.",
              },
              {
                step: "02",
                Icon: Target,
                title: "Identify Your Gap",
                body: "AI analyses your skills profile against industry benchmarks and pinpoints precise skill gaps.",
              },
              {
                step: "03",
                Icon: Map,
                title: "Develop Strategically",
                body: "Follow a personalised roadmap, complete practice projects, and build portfolio evidence.",
              },
              {
                step: "04",
                Icon: Zap,
                title: "Improve & Interview",
                body: "AI mock interviews give feedback on readiness. Track your career confidence score in real time.",
              },
            ].map(({ step, Icon, title, body }, i) => (
              <FadeSection key={step} delay={i * 100}>
                <div className="h-full bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-blue-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black font-mono text-slate-200 group-hover:text-blue-200 transition-colors">
                      {step}
                    </span>
                    <div className="w-9 h-9 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS IT FOR SECTION (id="stakeholders") ── */}
      <section id="stakeholders" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeSection className="text-center mb-14">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-600 mb-2">
              WHO IS IT FOR
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              One Platform. Three Stakeholders.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
              Students, colleges, and employers each get a dedicated experience.
            </p>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                Icon: GraduationCap,
                role: "student" as UserRole,
                audience: "Students",
                color: "blue",
                tagline: "Know what to learn before you graduate.",
                points: [
                  "AI Skill Gap Analysis vs. target role",
                  "Personalised 8-step career roadmap",
                  "Practice projects & mock interviews",
                  "Career readiness score & opportunity match",
                ],
                cta: "Start as a Student",
                sectionId: "for-students",
              },
              {
                Icon: BookOpen,
                role: "college" as UserRole,
                audience: "Colleges",
                color: "amber",
                tagline: "Align your curriculum with market reality.",
                points: [
                  "Curriculum gap dashboard per department",
                  "Industry demand mapping to your courses",
                  "Student batch readiness analytics",
                  "Placement outcome intelligence",
                ],
                cta: "Start as a College",
                sectionId: "for-colleges",
              },
              {
                Icon: Building2,
                role: "company" as UserRole,
                audience: "Employers",
                color: "indigo",
                tagline: "Find candidates who match what you need.",
                points: [
                  "Post skill-based requirements, not just JDs",
                  "AI-matched candidate shortlisting",
                  "Campus hiring pipeline management",
                  "Workforce demand intelligence dashboard",
                ],
                cta: "Start as an Employer",
                sectionId: "for-employers",
              },
            ].map(({ Icon, role, audience, color, tagline, points, cta, sectionId }, i) => (
              <FadeSection key={audience} delay={i * 100} id={sectionId}>
                <div
                  className={`h-full rounded-2xl p-7 flex flex-col border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    color === "blue"
                      ? "border-blue-200 bg-gradient-to-b from-blue-50/40 via-white to-white hover:border-blue-300"
                      : color === "amber"
                      ? "border-amber-200 bg-gradient-to-b from-amber-50/40 via-white to-white hover:border-amber-300"
                      : "border-indigo-200 bg-gradient-to-b from-indigo-50/40 via-white to-white hover:border-indigo-300"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                      color === "blue"
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : color === "amber"
                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                        : "bg-indigo-50 text-indigo-600 border border-indigo-200"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1 font-semibold">{audience}</p>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{tagline}</h3>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <CheckCircle2
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            color === "blue"
                              ? "text-blue-600"
                              : color === "amber"
                              ? "text-amber-600"
                              : "text-indigo-600"
                          }`}
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onOpenAuth(role)}
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                      color === "blue"
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10"
                        : color === "amber"
                        ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/10"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/10"
                    }`}
                  >
                    {cta}
                  </button>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATOR SECTION ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <FadeSection>
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80 p-8 sm:p-12 text-center shadow-xs">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 pointer-events-none" />

              <p className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-600 mb-3">
                WHAT MAKES THIS DIFFERENT
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
                Don&apos;t Just Learn More.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Learn What Matters.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-10">
                Generic courses teach skills in the abstract. This platform starts with what industry
                demands today and works backwards to exactly what you should learn next.
              </p>

              {/* Flow Visual Badges */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap relative z-10">
                {[
                  "Industry Signal",
                  "Role Requirements",
                  "Skill Gap",
                  "Learning Path",
                  "Career Readiness",
                ].map((label, i, arr) => (
                  <React.Fragment key={label}>
                    <div className="bg-white border border-slate-200/90 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-xs">
                      {label}
                    </div>
                    {i < arr.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 hidden sm:block" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── FINAL CTA SECTION ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <FadeSection>
            <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-sm">
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                Ready to Understand Your Skill Gap?
              </h2>
              <p className="text-base text-slate-600 mb-8 max-w-xl mx-auto">
                Join students, colleges, and employers who are using real industry intelligence
                to make smarter skill development decisions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onOpenAuth("student")}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-sm hover:shadow hover:-translate-y-0.5 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth("student")}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold px-8 py-3.5 rounded-xl shadow-xs transition-all"
                >
                  Login to Your Account
                </button>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
