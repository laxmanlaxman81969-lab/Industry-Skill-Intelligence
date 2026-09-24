import React, { useEffect, useRef, useState } from "react";
import {
  Building2,
  BrainCircuit,
  Database,
  Cloud,
  Cpu,
  Target,
  Compass,
  Briefcase,
  TrendingUp,
  User,
  Sparkles,
  ArrowDown,
  Activity,
  Layers,
  CheckCircle2
} from "lucide-react";

export const IndustrySkillLogo: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={"flex items-end space-x-1 " + className}>
    <div className="w-1.5 h-3.5 bg-blue-500 rounded-xs shadow-xs" />
    <div className="w-1.5 h-5 bg-blue-600 rounded-xs shadow-xs" />
    <div className="w-1.5 h-6.5 bg-blue-700 rounded-xs shadow-xs" />
  </div>
);

export const SkillIntelligenceVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // High-FPS Video-Quality Canvas Animation (Particles + Flowing Cyber Sine Waves)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle nodes
    const particleCount = 28;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.35 + 0.15,
      });
    }

    let wavePhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      wavePhase += 0.015;

      // 1. Flowing Cyber Soundwaves / Energy Streams in background
      ctx.lineWidth = 1.2;
      for (let waveIdx = 0; waveIdx < 2; waveIdx++) {
        ctx.beginPath();
        const yOffset = height * (0.45 + waveIdx * 0.3);
        const waveFreq = 0.008 + waveIdx * 0.003;
        const waveAmp = 18 - waveIdx * 6;

        ctx.strokeStyle = waveIdx === 0
          ? "rgba(59, 130, 246, 0.12)"
          : "rgba(99, 102, 241, 0.09)";

        for (let x = 0; x < width; x += 4) {
          const y = yOffset + Math.sin(x * waveFreq + wavePhase + waveIdx * 1.5) * waveAmp;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // 2. Draw light connecting filaments between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(59, 130, 246, " + (0.13 * (1 - dist / 125)) + ")";
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw floating glowing particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37, 99, 235, " + p.alpha + ")";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Subtle mouse parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex flex-col justify-between p-5 lg:p-6 xl:p-8 bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-slate-50 overflow-hidden select-none"
    >
      {/* Dynamic Background Particle & Wave Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-75"
      />

      {/* Ambient Radial Gradient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER BRANDING */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <IndustrySkillLogo className="w-5 h-5" />
            <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-wider">
              INDUSTRY SKILL INTELLIGENCE
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium pl-7">
            Connecting student capabilities with live enterprise hiring demand.
          </p>
        </div>

        {/* Live Animated Flow Badge */}
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-700 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
          <span>LIVE ECOSYSTEM</span>
        </div>
      </div>

      {/* CENTER ECOSYSTEM VISUALIZATION WITH TRAVELING DATA PACKETS */}
      <div
        style={{
          transform: "translate3d(" + mouseOffset.x + "px, " + mouseOffset.y + "px, 0)",
          transition: "transform 0.25s ease-out",
        }}
        className="relative z-10 my-auto py-2 flex flex-col items-center justify-center w-full max-w-[580px] mx-auto"
      >
        {/* SVG DATA STREAM CONNECTIONS WITH TRAVELING PACKETS */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          viewBox="0 0 580 430"
          fill="none"
        >
          <defs>
            <linearGradient id="gradFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Path 1: Industry Demand -> AI Core */}
          <path
            id="stream-ind-ai"
            d="M 155 55 C 215 55, 235 95, 280 110"
            stroke="#93c5fd"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-flow-dash"
          />
          {/* Traveling Pulse Circle */}
          <circle r="3.5" fill="#2563eb" filter="url(#glow)">
            <animateMotion
              dur="2.4s"
              repeatCount="indefinite"
              path="M 155 55 C 215 55, 235 95, 280 110"
            />
          </circle>

          {/* Path 2: AI Core -> Tech Skills */}
          <path
            id="stream-ai-tech"
            d="M 300 110 C 340 95, 360 55, 420 55"
            stroke="#93c5fd"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-flow-dash-reverse"
          />
          <circle r="3.5" fill="#3b82f6" filter="url(#glow)">
            <animateMotion
              dur="2.8s"
              repeatCount="indefinite"
              path="M 300 110 C 340 95, 360 55, 420 55"
            />
          </circle>

          {/* Path 3: AI Core -> Student Skills */}
          <path
            id="stream-ai-student"
            d="M 290 145 L 290 220"
            stroke="#3b82f6"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="animate-flow-dash"
          />
          <circle r="4" fill="#2563eb" filter="url(#glow)">
            <animateMotion
              dur="1.8s"
              repeatCount="indefinite"
              path="M 290 145 L 290 220"
            />
          </circle>

          {/* Path 4: Student Skills -> Skill Gap */}
          <path
            id="stream-student-gap"
            d="M 290 255 L 290 295"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle r="3.5" fill="#1d4ed8" filter="url(#glow)">
            <animateMotion
              dur="1.6s"
              repeatCount="indefinite"
              path="M 290 255 L 290 295"
            />
          </circle>

          {/* Path 5: Skill Gap -> Roadmap (Left Branch) */}
          <path
            id="stream-gap-roadmap"
            d="M 260 320 C 230 340, 205 355, 165 375"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-flow-dash"
          />
          <circle r="3.5" fill="#60a5fa" filter="url(#glow)">
            <animateMotion
              dur="2.6s"
              repeatCount="indefinite"
              path="M 260 320 C 230 340, 205 355, 165 375"
            />
          </circle>

          {/* Path 6: Skill Gap -> Career (Right Branch) */}
          <path
            id="stream-gap-career"
            d="M 320 320 C 350 340, 375 355, 415 375"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-flow-dash"
          />
          <circle r="3.5" fill="#60a5fa" filter="url(#glow)">
            <animateMotion
              dur="2.6s"
              repeatCount="indefinite"
              path="M 320 320 C 350 340, 375 355, 415 375"
            />
          </circle>
        </svg>

        {/* TOP ROW: Industry Demand (Left) & Technology Skills (Right) */}
        <div className="w-full flex items-start justify-between gap-3 mb-1 z-10">
          {/* Node 1: Industry Demand */}
          <div className="animate-float-soft flex items-center space-x-2.5 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-blue-100 shadow-sm shadow-blue-500/5 hover:border-blue-300 transition-all">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-900 leading-tight">Industry Demand</div>
              <div className="text-[9px] text-slate-500 font-medium">Live Market Trends · Future Skills</div>
            </div>
          </div>

          {/* Node 2: Technology Skills Cluster */}
          <div className="flex flex-col items-end space-y-1.5">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-blue-100 shadow-xs">
              <span className="text-[10px] font-bold text-blue-600">{"</>"}</span>
              <span className="text-[10px] font-bold text-slate-900">In-Demand Skills</span>
            </div>

            {/* In-demand Skills Tags Grid */}
            <div className="grid grid-cols-2 gap-1">
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-white/95 border border-slate-200 text-[10px] font-semibold text-slate-700 shadow-2xs hover:border-blue-300 transition-colors">
                <span className="text-[#e76f51]">☕</span>
                <span>Java</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-white/95 border border-slate-200 text-[10px] font-semibold text-slate-700 shadow-2xs hover:border-blue-300 transition-colors">
                <span className="text-[#3776ab]">🐍</span>
                <span>Python</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-white/95 border border-slate-200 text-[10px] font-semibold text-slate-700 shadow-2xs hover:border-blue-300 transition-colors">
                <span className="text-[#6db33f]">🍃</span>
                <span>Spring Boot</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-white/95 border border-slate-200 text-[10px] font-semibold text-slate-700 shadow-2xs hover:border-blue-300 transition-colors">
                <span className="text-[#61dafb]">⚛️</span>
                <span>React</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-white/95 border border-slate-200 text-[10px] font-semibold text-slate-700 shadow-2xs hover:border-blue-300 transition-colors">
                <Database className="w-2.5 h-2.5 text-blue-500" />
                <span>SQL</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-white/95 border border-slate-200 text-[10px] font-semibold text-slate-700 shadow-2xs hover:border-blue-300 transition-colors">
                <span className="text-[#f7df1e] font-bold">JS</span>
                <span>JavaScript</span>
              </span>
            </div>
          </div>
        </div>

        {/* CENTER: REVOLVING HOLOGRAPHIC AI ANALYSIS CORE */}
        <div className="relative my-2 flex flex-col items-center z-20">
          {/* Concentric Rotating Orbital Rings */}
          <div className="relative w-22 h-22 flex items-center justify-center">
            {/* Outer Rotating Dashed Ring */}
            <svg
              className="absolute inset-0 w-full h-full animate-spin pointer-events-none"
              style={{ animationDuration: "14s" }}
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="#60a5fa"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                fill="none"
                opacity="0.6"
              />
            </svg>

            {/* Inner Reverse Rotating Ring */}
            <svg
              className="absolute inset-0 w-full h-full animate-spin pointer-events-none"
              style={{ animationDuration: "9s", animationDirection: "reverse" }}
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="36"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                fill="none"
                opacity="0.7"
              />
            </svg>

            {/* Glowing Pulse Shockwave */}
            <div className="absolute inset-0 -m-2 rounded-full bg-blue-400/20 animate-pulse-glow" />

            {/* Central Glowing AI Orb */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-blue-400 text-white flex flex-col items-center justify-center shadow-lg shadow-blue-500/35 border-2 border-white">
              <BrainCircuit className="w-6 h-6 drop-shadow-xs" />
              <span className="text-[9px] font-black tracking-wider">AI</span>
            </div>
          </div>

          <div className="text-center mt-1">
            <div className="text-xs font-bold text-slate-900 tracking-wide">AI Analysis Core</div>
            <div className="text-[9px] text-blue-600 font-semibold tracking-wider uppercase">
              Extract · Match · Predict
            </div>
          </div>
        </div>

        {/* MID HORIZONTAL SKILL PILLS */}
        <div className="w-full flex items-center justify-center flex-wrap gap-1.5 my-1 z-10">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-white/90 border border-blue-100 text-[9px] font-semibold text-slate-700 shadow-xs">
            <Cloud className="w-2.5 h-2.5 text-sky-500" />
            <span>Cloud</span>
          </span>
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-white/90 border border-blue-100 text-[9px] font-semibold text-slate-700 shadow-xs">
            <span className="text-[#ff9900] font-bold text-[9px]">aws</span>
            <span>AWS</span>
          </span>
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-white/90 border border-blue-100 text-[9px] font-semibold text-slate-700 shadow-xs">
            <span className="bg-blue-600 text-white text-[7px] font-bold px-0.5 rounded">API</span>
            <span>REST API</span>
          </span>
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-white/90 border border-blue-100 text-[9px] font-semibold text-slate-700 shadow-xs">
            <TrendingUp className="w-2.5 h-2.5 text-indigo-500" />
            <span>Data Analytics</span>
          </span>
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-white/90 border border-blue-100 text-[9px] font-semibold text-slate-700 shadow-xs">
            <Cpu className="w-2.5 h-2.5 text-purple-500" />
            <span>Machine Learning</span>
          </span>
        </div>

        {/* NODE 3: Student Skills */}
        <div className="my-1 z-10">
          <div className="flex items-center space-x-2.5 px-4 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-blue-100 shadow-xs hover:border-blue-300 transition-all">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-900 leading-tight">Student Skills</div>
              <div className="text-[9px] text-slate-500 font-medium">Current Profile · Verified Competencies</div>
            </div>
          </div>
        </div>

        {/* Direct Link Arrow */}
        <div className="text-blue-500 my-0.5 animate-bounce">
          <ArrowDown className="w-3 h-3" />
        </div>

        {/* NODE 4: Skill Gap */}
        <div className="my-1 z-10">
          <div className="flex items-center space-x-2.5 px-4 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-blue-200 shadow-xs hover:border-blue-400 transition-all">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-xs">
              <Target className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-900 leading-tight">Skill Gap Diagnostics</div>
              <div className="text-[9px] text-slate-500 font-medium">Target Role Deficit & Recommendations</div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Roadmap (Left) & Career (Right) */}
        <div className="w-full flex items-center justify-around gap-3 mt-1.5 z-10">
          {/* Node 5: Roadmap */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-blue-100 shadow-xs hover:border-blue-300 transition-all">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-3 h-3" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-900 leading-tight">Roadmap</div>
              <div className="text-[8px] text-slate-500">Learn · Build · Grow</div>
            </div>
          </div>

          {/* Node 6: Career */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-blue-100 shadow-xs hover:border-blue-300 transition-all">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Briefcase className="w-3 h-3" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-900 leading-tight">Career</div>
              <div className="text-[8px] text-slate-500">Enterprise Placement</div>
            </div>
          </div>
        </div>
      </div>

      {/* AMBIENT INSIGHTS DOCKED STRIP */}
      <div className="relative z-10 pt-2 border-t border-blue-100/80 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Card 1: Industry Trends */}
          <div className="p-2 rounded-xl bg-white/90 backdrop-blur-xs border border-slate-200/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-900">
              <span className="flex items-center space-x-1 text-blue-600">
                <TrendingUp className="w-3 h-3" />
                <span>Industry Trends</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-x-2 text-[9px] text-slate-600">
              <div>Cloud <span className="text-emerald-600 font-bold">↑ 32%</span></div>
              <div>AI/ML <span className="text-emerald-600 font-bold">↑ 28%</span></div>
            </div>
          </div>

          {/* Card 2: Skills Match 78% Gauge */}
          <div className="p-2 rounded-xl bg-white/90 backdrop-blur-xs border border-slate-200/80 shadow-2xs flex items-center space-x-2">
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600"
                  strokeDasharray="78, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[8px] font-black text-blue-600">78%</span>
            </div>
            <div className="leading-tight">
              <div className="text-[10px] font-bold text-slate-900">Skills Match</div>
              <div className="text-[8px] text-emerald-600 font-semibold">Matched: 78% · Gap: 22%</div>
            </div>
          </div>
        </div>

        {/* Bottom Slogan */}
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center space-x-1 font-semibold text-slate-700">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Real Industry Data · Powered by AI</span>
          </span>
          <span className="font-semibold text-blue-600">Better Skills • Better Opportunities</span>
        </div>
      </div>
    </div>
  );
};
