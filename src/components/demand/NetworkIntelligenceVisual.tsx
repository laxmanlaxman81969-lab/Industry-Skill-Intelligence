import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { SkillDemandRecord } from '../../services/industryDemandApi';

export type NodeType = 'Company' | 'Job Role' | 'Skill' | 'Industry' | 'Department' | 'Market Signal';

export interface VisualNode {
  id: string;
  type: NodeType;
  label: string;
  subLabel?: string;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  pulsePhase: number;
  pulseSpeed: number;
  isActive: boolean;
  activeTimer: number;
  demandScore?: number;
  growthRate?: number;
}

export interface NetworkConnection {
  from: string;
  to: string;
  opacity: number;
  active: boolean;
}

export interface DataParticle {
  fromNodeId: string;
  toNodeId: string;
  progress: number; // 0 to 1
  speed: number;
  color: string;
  label: string;
}

interface NetworkIntelligenceVisualProps {
  skills: SkillDemandRecord[];
  selectedDepartment: string;
  selectedIndustry: string;
  onSelectSkill?: (skill: SkillDemandRecord) => void;
}

export const NetworkIntelligenceVisual: React.FC<NetworkIntelligenceVisualProps> = ({
  skills,
  selectedDepartment,
  selectedIndustry,
  onSelectSkill
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Parallax mouse coordinates
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<VisualNode | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('ANALYZING LIVE MARKET SIGNALS');

  // Node & particle references
  const nodesRef = useRef<VisualNode[]>([]);
  const connectionsRef = useRef<NetworkConnection[]>([]);
  const particlesRef = useRef<DataParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const isPausedRef = useRef<boolean>(false);

  // Messages pool for floating signal status
  const signalMessages = useMemo(
    () => [
      'ANALYZING RECENT MARKET SIGNALS',
      'CROSS-INDUSTRY SKILL MOMENTUM DETECTED',
      'NEW EMPLOYER REQUISITION INGESTED',
      'DEMAND VECTOR NORMALIZED ACROSS BRANCHES',
      'EMERGING COMPETENCY SIGNAL DETECTED'
    ],
    []
  );

  // Generate initial node network based on real skills data
  const initNetwork = useCallback(() => {
    const width = 480;
    const height = 300;

    // Select representative skills
    const topSkills = skills.slice(0, 7);
    const nodes: VisualNode[] = [];
    const conns: NetworkConnection[] = [];

    // 1. Data Sources / Market Signal Node (Center Left)
    nodes.push({
      id: 'signal-core',
      type: 'Market Signal',
      label: 'Market Signals',
      subLabel: 'Live Ingestion',
      x: 70,
      y: 150,
      baseX: 70,
      baseY: 150,
      vx: 0.1,
      vy: 0.12,
      radius: 9,
      color: '#2563EB', // Blue 600
      glowColor: 'rgba(37, 99, 235, 0.4)',
      pulsePhase: 0,
      pulseSpeed: 0.04,
      isActive: true,
      activeTimer: 100
    });

    // 2. Company Nodes (Top Left / Mid Left)
    const companyNames = ['Infosys', 'Bosch', 'Qualcomm', 'L&T'];
    companyNames.forEach((comp, idx) => {
      const cy = 60 + idx * 60;
      nodes.push({
        id: `comp-${idx}`,
        type: 'Company',
        label: comp,
        subLabel: 'Active Requisition',
        x: 130 + (idx % 2) * 20,
        y: cy,
        baseX: 130 + (idx % 2) * 20,
        baseY: cy,
        vx: 0.08 * (idx % 2 === 0 ? 1 : -1),
        vy: 0.09 * (idx % 2 === 0 ? -1 : 1),
        radius: 7,
        color: '#4F46E5', // Indigo 600
        glowColor: 'rgba(79, 70, 229, 0.35)',
        pulsePhase: idx * 1.2,
        pulseSpeed: 0.03,
        isActive: false,
        activeTimer: 0
      });
      // Connect to Signal
      conns.push({ from: 'signal-core', to: `comp-${idx}`, opacity: 0.35, active: false });
    });

    // 3. Skill Nodes (Center Column)
    topSkills.forEach((sk, idx) => {
      const sy = 40 + idx * 36;
      const isDeptMatch =
        selectedDepartment !== 'All' &&
        selectedDepartment !== 'All Departments' &&
        sk.departments.includes(selectedDepartment);

      nodes.push({
        id: `skill-${sk.skillId}`,
        type: 'Skill',
        label: sk.name,
        subLabel: `${sk.demandScore}% Demand`,
        x: 230 + ((idx * 23) % 40),
        y: sy,
        baseX: 230 + ((idx * 23) % 40),
        baseY: sy,
        vx: 0.07 * (idx % 2 === 0 ? 1 : -1),
        vy: 0.08 * (idx % 2 === 0 ? -1 : 1),
        radius: isDeptMatch ? 8.5 : 7,
        color: isDeptMatch ? '#0284C7' : '#0EA5E9', // Sky 600
        glowColor: 'rgba(14, 165, 233, 0.4)',
        pulsePhase: idx * 0.8,
        pulseSpeed: 0.035,
        isActive: isDeptMatch,
        activeTimer: isDeptMatch ? 80 : 0,
        demandScore: sk.demandScore,
        growthRate: sk.growthRate
      });

      // Connect companies to skills
      const targetComp = `comp-${idx % companyNames.length}`;
      conns.push({ from: targetComp, to: `skill-${sk.skillId}`, opacity: 0.4, active: false });
    });

    // 4. Job Role Nodes (Mid-Right)
    const roleNames = ['Backend Lead', 'Embedded Eng', 'VLSI Architect', 'Cloud DevOps'];
    roleNames.forEach((role, idx) => {
      const ry = 65 + idx * 55;
      nodes.push({
        id: `role-${idx}`,
        type: 'Job Role',
        label: role,
        subLabel: 'High Demand Role',
        x: 350 + (idx % 2) * 15,
        y: ry,
        baseX: 350 + (idx % 2) * 15,
        baseY: ry,
        vx: 0.07 * (idx % 2 === 0 ? -1 : 1),
        vy: 0.08 * (idx % 2 === 0 ? 1 : -1),
        radius: 7,
        color: '#059669', // Emerald 600
        glowColor: 'rgba(5, 150, 105, 0.35)',
        pulsePhase: idx * 1.5,
        pulseSpeed: 0.03,
        isActive: false,
        activeTimer: 0
      });

      // Connect corresponding skill to role
      if (topSkills[idx]) {
        conns.push({ from: `skill-${topSkills[idx].skillId}`, to: `role-${idx}`, opacity: 0.35, active: false });
      }
    });

    // 5. Department / Industry Target Nodes (Far Right)
    const depts = ['CSE / IT', 'ECE / EEE', 'Mechanical', 'Robotics'];
    depts.forEach((dept, idx) => {
      const dy = 55 + idx * 60;
      const isSelected =
        selectedDepartment !== 'All' &&
        selectedDepartment !== 'All Departments' &&
        dept.toLowerCase().includes(selectedDepartment.toLowerCase().slice(0, 3));

      nodes.push({
        id: `dept-${idx}`,
        type: 'Department',
        label: dept,
        subLabel: 'Academic Branch',
        x: 435,
        y: dy,
        baseX: 435,
        baseY: dy,
        vx: 0.05 * (idx % 2 === 0 ? 1 : -1),
        vy: 0.06 * (idx % 2 === 0 ? -1 : 1),
        radius: isSelected ? 8.5 : 6.5,
        color: isSelected ? '#2563EB' : '#64748B', // Slate 500
        glowColor: 'rgba(37, 99, 235, 0.3)',
        pulsePhase: idx * 0.9,
        pulseSpeed: 0.025,
        isActive: isSelected,
        activeTimer: isSelected ? 90 : 0
      });

      // Connect role to department
      conns.push({ from: `role-${idx % roleNames.length}`, to: `dept-${idx}`, opacity: 0.3, active: false });
    });

    nodesRef.current = nodes;
    connectionsRef.current = conns;
    particlesRef.current = [];
  }, [skills, selectedDepartment]);

  // Re-initialize network when skills or department change
  useEffect(() => {
    initNetwork();
  }, [initNetwork]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Visibility Listener to pause when tab hidden
    const handleVisibilityChange = () => {
      isPausedRef.current = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Particle spawner timer
    let lastParticleSpawn = Date.now();
    let lastStatusChange = Date.now();
    let statusIndex = 0;

    const render = () => {
      if (isPausedRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse parallax interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      const offsetX = mouseRef.current.x;
      const offsetY = mouseRef.current.y;

      const nodes = nodesRef.current;
      const conns = connectionsRef.current;
      const particles = particlesRef.current;

      // 1. Update and drift nodes within controlled boundary
      if (!prefersReducedMotion) {
        nodes.forEach((node) => {
          node.x += node.vx;
          node.y += node.vy;

          // Soft boundary bounce around base
          if (Math.abs(node.x - node.baseX) > 8) node.vx *= -1;
          if (Math.abs(node.y - node.baseY) > 8) node.vy *= -1;

          node.pulsePhase += node.pulseSpeed;

          if (node.activeTimer > 0) {
            node.activeTimer -= 1;
            if (node.activeTimer === 0) node.isActive = false;
          }
        });
      }

      // 2. Spawn Data Particles intermittently along valid connections
      const now = Date.now();
      if (!prefersReducedMotion && now - lastParticleSpawn > 1200 && conns.length > 0) {
        lastParticleSpawn = now;
        // Pick a random connection to send a signal
        const randomConn = conns[Math.floor(Math.random() * conns.length)];
        const fromNode = nodes.find((n) => n.id === randomConn.from);
        const toNode = nodes.find((n) => n.id === randomConn.to);

        if (fromNode && toNode) {
          particles.push({
            fromNodeId: fromNode.id,
            toNodeId: toNode.id,
            progress: 0,
            speed: 0.014 + Math.random() * 0.008,
            color: '#3B82F6', // Blue 500
            label: fromNode.type === 'Skill' ? fromNode.label : 'Demand Signal'
          });
          randomConn.active = true;
          fromNode.isActive = true;
          fromNode.activeTimer = 40;
        }
      }

      // Cycle status message occasionally
      if (now - lastStatusChange > 4500) {
        lastStatusChange = now;
        statusIndex = (statusIndex + 1) % signalMessages.length;
        setStatusMessage(signalMessages[statusIndex]);
      }

      // 3. Draw Network Connections
      conns.forEach((conn) => {
        const from = nodes.find((n) => n.id === conn.from);
        const to = nodes.find((n) => n.id === conn.to);
        if (!from || !to) return;

        const x1 = from.x + offsetX;
        const y1 = from.y + offsetY;
        const x2 = to.x + offsetX;
        const y2 = to.y + offsetY;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        if (conn.active) {
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
          ctx.lineWidth = 1.6;
        } else {
          ctx.strokeStyle = `rgba(148, 163, 184, ${conn.opacity * 0.6})`;
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      });

      // 4. Update and Draw Flowing Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;

        const from = nodes.find((n) => n.id === p.fromNodeId);
        const to = nodes.find((n) => n.id === p.toNodeId);

        if (!from || !to || p.progress >= 1) {
          if (to) {
            to.isActive = true;
            to.activeTimer = 45;
          }
          particles.splice(i, 1);
          continue;
        }

        const px = (from.x + (to.x - from.x) * p.progress) + offsetX;
        const py = (from.y + (to.y - from.y) * p.progress) + offsetY;

        // Glowing particle head
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // 5. Draw Nodes
      nodes.forEach((node) => {
        const nx = node.x + offsetX;
        const ny = node.y + offsetY;

        // Subtle pulsing ring when active
        if (node.isActive) {
          const ringRadius = node.radius + 4 + Math.sin(node.pulsePhase) * 2;
          ctx.beginPath();
          ctx.arc(nx, ny, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = node.glowColor;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }

        // Base node circle
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.glowColor;
        ctx.shadowBlur = node.isActive ? 8 : 3;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node center white pip
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Node Label (Clean Enterprise Light Typography)
        ctx.font = '600 9px Inter, system-ui, -apple-system, sans-serif';
        ctx.fillStyle = node.isActive ? '#0F172A' : '#475569';
        ctx.textAlign = 'left';
        ctx.fillText(node.label, nx + node.radius + 3, ny + 3);
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [signalMessages]);

  // Handle Mouse Move Parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    // Controlled shift: max 8px
    mouseRef.current.targetX = relX * 12;
    mouseRef.current.targetY = relY * 12;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  // Click on Canvas to Inspect Node
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX - mouseRef.current.x;
    const clickY = (e.clientY - rect.top) * scaleY - mouseRef.current.y;

    // Check hit
    const hitNode = nodesRef.current.find((n) => {
      const dist = Math.hypot(n.x - clickX, n.y - clickY);
      return dist <= n.radius + 12; // generous hit area
    });

    if (hitNode) {
      hitNode.isActive = true;
      hitNode.activeTimer = 100;
      setSelectedNodeInfo(hitNode);

      // If clicked node is a Skill, trigger skill callback
      if (hitNode.type === 'Skill' && onSelectSkill) {
        const matched = skills.find((s) => s.name === hitNode.label || s.skillId === hitNode.id.replace('skill-', ''));
        if (matched) onSelectSkill(matched);
      }
    } else {
      setSelectedNodeInfo(null);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[280px] sm:h-[300px] rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white border border-blue-200/80 shadow-xs overflow-hidden flex flex-col justify-between p-3 select-none"
    >
      {/* Floating Status Indicator Badge */}
      <div className="flex items-center justify-between z-10">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-blue-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-900">
            {statusMessage}
          </span>
        </div>

        <span className="text-[10px] font-semibold text-slate-400 bg-white/70 px-2 py-0.5 rounded-md border border-slate-200/60">
          Flow: Source → Signal → Skill → Role → Branch
        </span>
      </div>

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        width={480}
        height={300}
        onClick={handleCanvasClick}
        className="absolute inset-0 w-full h-full cursor-pointer"
        title="Interactive Market Signal Network. Click a node to inspect."
      />

      {/* Bottom Interactive Inspection Tag */}
      <div className="z-10 flex items-center justify-between text-[11px] text-slate-500 pt-1 pointer-events-none">
        {selectedNodeInfo ? (
          <div className="p-2 rounded-xl bg-white/95 backdrop-blur-xs border border-blue-300 shadow-sm text-slate-800 space-y-0.5 pointer-events-auto animate-fade-in max-w-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                {selectedNodeInfo.type}
              </span>
              {selectedNodeInfo.demandScore && (
                <span className="text-[10px] font-bold text-emerald-700">
                  {selectedNodeInfo.demandScore}% Demand
                </span>
              )}
            </div>
            <p className="font-bold text-xs text-slate-900">{selectedNodeInfo.label}</p>
            <p className="text-[10px] text-slate-500">{selectedNodeInfo.subLabel}</p>
          </div>
        ) : (
          <span className="text-[10px] text-slate-400 italic">
            Click any node in the network to inspect real-world hiring evidence.
          </span>
        )}

        <div className="flex items-center space-x-1.5 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="text-[10px] font-medium text-slate-500">Live Network Stream</span>
        </div>
      </div>
    </div>
  );
};
