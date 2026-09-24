import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndustrySkill, TrendDirection } from '../../types';
import { SUPPORTED_ROLES } from '../../data/seedData';
import {
  LayoutDashboard,
  Users,
  Database,
  Layers,
  Link2,
  Brain,
  FileText,
  Bell,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Edit2,
  Save,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  BarChart2,
  RefreshCw,
  Download,
  Eye,
  ToggleLeft,
  ToggleRight,
  Star,
  Zap,
  Activity,
  Filter,
  Clock,
  ArrowRight,
  Check,
  XCircle
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminView =
  | 'dashboard'
  | 'user-management'
  | 'skill-data'
  | 'role-requirements'
  | 'data-sources'
  | 'skill-intelligence'
  | 'reports'
  | 'notifications'
  | 'profile'
  | 'settings';

interface AdminPortalProps {
  onLogout?: () => void;
}

// ─── Sidebar nav config ───────────────────────────────────────────────────────
const NAV_ITEMS: { id: AdminView; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'user-management', label: 'User Management', icon: <Users className="w-4 h-4" /> },
  { id: 'skill-data', label: 'Industry Skill Data', icon: <Database className="w-4 h-4" />, badge: 'Core' },
  { id: 'role-requirements', label: 'Role & Skill Requirements', icon: <Layers className="w-4 h-4" /> },
  { id: 'data-sources', label: 'Data Sources', icon: <Link2 className="w-4 h-4" /> },
  { id: 'skill-intelligence', label: 'Skill Intelligence', icon: <Brain className="w-4 h-4" />, badge: 'AI' },
  { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: '4' },
  { id: 'profile', label: 'Admin Profile', icon: <UserCircle className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

// ─── Helper badge ─────────────────────────────────────────────────────────────
const DemoBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
    <Star className="w-2.5 h-2.5" />
    Demonstration Data
  </span>
);

const TrendBadge: React.FC<{ trend: TrendDirection }> = ({ trend }) => {
  const map = {
    Growing: { cls: 'bg-emerald-50 text-emerald-700', icon: <TrendingUp className="w-3 h-3" /> },
    Stable: { cls: 'bg-slate-100 text-slate-600', icon: <Minus className="w-3 h-3" /> },
    Declining: { cls: 'bg-rose-50 text-rose-700', icon: <TrendingDown className="w-3 h-3" /> },
  };
  const { cls, icon } = map[trend];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${cls}`}>
      {icon}{trend}
    </span>
  );
};

// ─── Section card wrapper ─────────────────────────────────────────────────────
const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`bg-white border border-slate-200/90 rounded-2xl shadow-sm ${className}`}>{children}</div>
);

// ─── SECTION: Dashboard ───────────────────────────────────────────────────────
const AdminDashboard: React.FC<{ industrySkills: IndustrySkill[] }> = ({ industrySkills }) => {
  const kpis = [
    { label: 'Total Students', value: '1,248', icon: <GraduationCap className="w-5 h-5 text-blue-600" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Colleges', value: '32', icon: <Building2 className="w-5 h-5 text-violet-600" />, color: 'bg-violet-50 text-violet-600' },
    { label: 'Companies', value: '18', icon: <Briefcase className="w-5 h-5 text-emerald-600" />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Skills in Database', value: String(industrySkills.length), icon: <Database className="w-5 h-5 text-orange-500" />, color: 'bg-orange-50 text-orange-500' },
    { label: 'Active Requirements', value: '47', icon: <Layers className="w-5 h-5 text-cyan-600" />, color: 'bg-cyan-50 text-cyan-600' },
    { label: 'Data Sources', value: '5', icon: <Link2 className="w-5 h-5 text-rose-500" />, color: 'bg-rose-50 text-rose-500' },
  ];

  const recentActivity = [
    { event: 'Spring Boot demand updated to Growing', time: '2h ago', type: 'skill', icon: <Database className="w-3.5 h-3.5 text-blue-600" /> },
    { event: 'New company registered: InnovateTech Pvt. Ltd.', time: '4h ago', type: 'company', icon: <Briefcase className="w-3.5 h-3.5 text-emerald-600" /> },
    { event: 'Cloud Computing trend marked Increasing', time: '6h ago', type: 'skill', icon: <TrendingUp className="w-3.5 h-3.5 text-violet-600" /> },
    { event: 'Employer feedback data source synced', time: '8h ago', type: 'data', icon: <Link2 className="w-3.5 h-3.5 text-orange-500" /> },
    { event: 'New college registered: JNTU Hyderabad', time: '1d ago', type: 'college', icon: <GraduationCap className="w-3.5 h-3.5 text-cyan-600" /> },
  ];

  const trendingSkills = industrySkills.slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, Admin</h1>
        <p className="text-sm text-slate-500 mt-0.5">Monitor the platform's industry skill intelligence and connected users.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4 flex flex-col gap-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${k.color}`}>{k.icon}</div>
            <div className="text-2xl font-extrabold text-slate-900">{k.value}</div>
            <div className="text-xs text-slate-500 font-medium leading-tight">{k.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Trends */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" /> Industry Skill Trends
            </h3>
            <DemoBadge />
          </div>
          <div className="space-y-3">
            {trendingSkills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-3">
                <div className="w-24 text-xs font-semibold text-slate-700 truncate">{skill.name}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${skill.demandScore}%` }}
                  />
                </div>
                <div className="text-xs font-bold text-blue-600 w-10 text-right">{skill.demandScore}%</div>
                <TrendBadge trend={skill.trend} />
              </div>
            ))}
          </div>
        </Card>

        {/* Platform Activity */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" /> Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  {a.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-700 font-medium leading-snug">{a.event}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Data Quality */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Data Quality Status
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Verified Skills', count: 8, badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
            { label: 'Demonstration Data', count: industrySkills.length - 8, badge: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Star className="w-4 h-4 text-amber-500" /> },
            { label: 'Needs Review', count: 2, badge: 'bg-rose-50 text-rose-700 border-rose-200', icon: <AlertTriangle className="w-4 h-4 text-rose-500" /> },
            { label: 'Recently Updated', count: 5, badge: 'bg-blue-50 text-blue-700 border-blue-200', icon: <RefreshCw className="w-4 h-4 text-blue-600" /> },
          ].map((d) => (
            <div key={d.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              {d.icon}
              <div>
                <div className="text-lg font-bold text-slate-900">{d.count}</div>
                <div className="text-[11px] text-slate-500 font-medium">{d.label}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── SECTION: User Management ─────────────────────────────────────────────────
const UserManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const users = [
    { id: 'u1', name: 'N.Lakshman', email: 'lakshman@student.edu', role: 'Student', status: 'Active', registered: '2024-08-15', lastActive: '2h ago' },
    { id: 'u2', name: 'Rohan Mehta', email: 'rohan@student.edu', role: 'Student', status: 'Active', registered: '2024-08-20', lastActive: '1d ago' },
    { id: 'u3', name: 'Priya Verma', email: 'priya@student.edu', role: 'Student', status: 'Inactive', registered: '2024-09-01', lastActive: '5d ago' },
    { id: 'u4', name: 'JNTU Hyderabad Admin', email: 'admin@jntu.edu', role: 'College', status: 'Active', registered: '2024-07-10', lastActive: '3h ago' },
    { id: 'u5', name: 'NIT Warangal', email: 'admin@nitwgl.ac.in', role: 'College', status: 'Active', registered: '2024-07-15', lastActive: '1d ago' },
    { id: 'u6', name: 'TechNova HR', email: 'campus@technova.io', role: 'Company', status: 'Active', registered: '2024-06-20', lastActive: '2h ago' },
    { id: 'u7', name: 'InnovateTech Ltd.', email: 'hr@innovatetech.com', role: 'Company', status: 'Active', registered: '2024-09-12', lastActive: 'Today' },
    { id: 'u8', name: 'Platform Admin', email: 'admin@sih26134.in', role: 'Admin', status: 'Active', registered: '2024-01-01', lastActive: 'Now' },
  ];

  const [userStatuses, setUserStatuses] = useState<Record<string, string>>(
    Object.fromEntries(users.map((u) => [u.id, u.status]))
  );

  const roles = ['All', 'Student', 'College', 'Company', 'Admin'];
  const statuses = ['All', 'Active', 'Inactive'];

  const filtered = users.filter((u) => {
    const matchRole = filterRole === 'All' || u.role === filterRole;
    const matchStatus = filterStatus === 'All' || userStatuses[u.id] === filterStatus;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  const roleBadge: Record<string, string> = {
    Student: 'bg-blue-50 text-blue-700 border-blue-200',
    College: 'bg-violet-50 text-violet-700 border-violet-200',
    Company: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Admin: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">User Management</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage platform access for all registered users.</p>
      </div>

      <Card className="p-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:border-blue-600 focus:outline-none"
          >
            {roles.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:border-blue-600 focus:outline-none"
          >
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-[11px]">
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Registered</th>
                <th className="py-2.5 px-3">Last Active</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">{u.name}</td>
                  <td className="py-3 px-3 text-slate-500">{u.email}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${roleBadge[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      userStatuses[u.id] === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {userStatuses[u.id]}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{u.registered}</td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{u.lastActive}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() =>
                        setUserStatuses((prev) => ({
                          ...prev,
                          [u.id]: prev[u.id] === 'Active' ? 'Inactive' : 'Active',
                        }))
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                        userStatuses[u.id] === 'Active'
                          ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {userStatuses[u.id] === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">No users found.</div>
          )}
        </div>
      </Card>
    </div>
  );
};

// ─── SECTION: Industry Skill Data ─────────────────────────────────────────────
const IndustrySkillData: React.FC<{
  industrySkills: IndustrySkill[];
  updateIndustrySkill: (id: string, updates: Partial<IndustrySkill>) => void;
  addIndustrySkill: (skill: Omit<IndustrySkill, 'id'>) => void;
}> = ({ industrySkills, updateIndustrySkill, addIndustrySkill }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState(85);
  const [editTrend, setEditTrend] = useState<TrendDirection>('Growing');
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [search, setSearch] = useState('');

  const [newSkill, setNewSkill] = useState({
    name: '', category: 'Backend' as IndustrySkill['category'], role: SUPPORTED_ROLES[0],
    demandScore: 80, trend: 'Growing' as TrendDirection, totalObservations: 1200,
    importance: 'High' as IndustrySkill['importance'], whyItMatters: ''
  });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const categories = ['All', ...Array.from(new Set(industrySkills.map((s) => s.category)))];
  const filtered = industrySkills.filter((s) => {
    const matchCat = filterCategory === 'All' || s.category === filterCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const demandLabel = (score: number) =>
    score >= 80 ? { txt: 'High Demand', cls: 'bg-blue-50 text-blue-700 border-blue-200' }
      : score >= 60 ? { txt: 'Growing Demand', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
        : { txt: 'Moderate', cls: 'bg-slate-100 text-slate-600 border-slate-200' };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Industry Skill Data</h2>
          <p className="text-sm text-slate-500 mt-0.5">Core intelligence database — manages skills used across all platform portals.</p>
        </div>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Skill
        </button>
      </div>

      {toast && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />{toast}
        </div>
      )}

      {/* Add Skill Form */}
      {showAddForm && (
        <Card className="p-5 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Add New Industry Skill</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              { label: 'Skill Name', key: 'name', type: 'text', placeholder: 'e.g. LangChain' },
              { label: 'Demand Score (%)', key: 'demandScore', type: 'number', placeholder: '80' },
              { label: 'Observations', key: 'totalObservations', type: 'number', placeholder: '1200' },
            ].map((f) => (
              <div key={f.key}>
                <label className="block font-semibold text-slate-700 mb-1">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={(newSkill as any)[f.key]}
                  onChange={(e) => setNewSkill((prev) => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            ))}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select value={newSkill.category} onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value as any }))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none">
                {['Language', 'Backend', 'Frontend', 'Database', 'AI/ML', 'Cloud/DevOps', 'Security', 'Tools'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Trend</label>
              <select value={newSkill.trend} onChange={(e) => setNewSkill((p) => ({ ...p, trend: e.target.value as TrendDirection }))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none">
                {['Growing', 'Stable', 'Declining'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Associated Role</label>
              <select value={newSkill.role} onChange={(e) => setNewSkill((p) => ({ ...p, role: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none">
                {SUPPORTED_ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Why It Matters (for Students)</label>
            <textarea rows={2} value={newSkill.whyItMatters}
              onChange={(e) => setNewSkill((p) => ({ ...p, whyItMatters: e.target.value }))}
              placeholder="Critical for building enterprise-grade microservices..."
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => {
                if (!newSkill.name) return;
                addIndustrySkill({ ...newSkill, industry: 'Technology', source: 'Admin Verified', lastUpdated: new Date().toISOString().split('T')[0] });
                setShowAddForm(false);
                showToast(`Skill "${newSkill.name}" added to intelligence database.`);
                setNewSkill({ name: '', category: 'Backend', role: SUPPORTED_ROLES[0], demandScore: 80, trend: 'Growing', totalObservations: 1200, importance: 'High', whyItMatters: '' });
              }}
              disabled={!newSkill.name}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-40"
            >
              Add to Database
            </button>
            <button onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors">
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search skill..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none" />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:border-blue-600 focus:outline-none">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <Card>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" /> Skill Intelligence Database
          </h3>
          <div className="flex items-center gap-2">
            <DemoBadge />
            <span className="text-xs text-slate-400">{filtered.length} skills</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-[11px]">
                <th className="py-2.5 px-4">Skill</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Demand Level</th>
                <th className="py-2.5 px-4">Score</th>
                <th className="py-2.5 px-4">Trend</th>
                <th className="py-2.5 px-4">Observations</th>
                <th className="py-2.5 px-4">Updated</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((skill) => {
                const isEditing = editingId === skill.id;
                const dl = demandLabel(isEditing ? editScore : skill.demandScore);
                return (
                  <tr key={skill.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{skill.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">{skill.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${dl.cls}`}>{dl.txt}</span>
                    </td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input type="number" min={1} max={99} value={editScore}
                          onChange={(e) => setEditScore(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs bg-white border border-blue-600 rounded text-slate-900" />
                      ) : (
                        <span className="font-bold text-blue-600">{skill.demandScore}%</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <select value={editTrend} onChange={(e) => setEditTrend(e.target.value as TrendDirection)}
                          className="px-2 py-1 text-xs bg-white border border-blue-600 rounded text-slate-900">
                          {['Growing', 'Stable', 'Declining'].map((t) => <option key={t}>{t}</option>)}
                        </select>
                      ) : <TrendBadge trend={skill.trend} />}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{skill.totalObservations.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{skill.lastUpdated}</td>
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <button onClick={() => {
                          updateIndustrySkill(skill.id, { demandScore: editScore, trend: editTrend, lastUpdated: new Date().toISOString().split('T')[0] });
                          setEditingId(null);
                          showToast(`"${skill.name}" updated across all portals.`);
                        }} className="p-1.5 rounded-lg bg-blue-600 text-white">
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button onClick={() => { setEditingId(skill.id); setEditScore(skill.demandScore); setEditTrend(skill.trend); }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ─── SECTION: Role & Skill Requirements ──────────────────────────────────────
const RoleRequirements: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'r1', name: 'Java Developer', domain: 'Backend Engineering', lastUpdated: '2026-09-01',
      skills: [
        { name: 'Java', type: 'Required', importance: 'Critical', proficiency: 'Intermediate' },
        { name: 'SQL', type: 'Required', importance: 'High', proficiency: 'Intermediate' },
        { name: 'Spring Boot', type: 'Required', importance: 'High', proficiency: 'Intermediate' },
        { name: 'REST APIs', type: 'Required', importance: 'High', proficiency: 'Intermediate' },
        { name: 'JPA / Hibernate', type: 'Preferred', importance: 'Medium', proficiency: 'Beginner' },
        { name: 'Microservices', type: 'Preferred', importance: 'Medium', proficiency: 'Beginner' },
      ]
    },
    {
      id: 'r2', name: 'Backend Developer', domain: 'Software Engineering', lastUpdated: '2026-09-05',
      skills: [
        { name: 'Java / Python', type: 'Required', importance: 'Critical', proficiency: 'Intermediate' },
        { name: 'SQL', type: 'Required', importance: 'High', proficiency: 'Intermediate' },
        { name: 'REST APIs', type: 'Required', importance: 'High', proficiency: 'Intermediate' },
        { name: 'Git & GitHub', type: 'Required', importance: 'High', proficiency: 'Beginner' },
        { name: 'Cloud Basics', type: 'Preferred', importance: 'Medium', proficiency: 'Beginner' },
      ]
    },
    {
      id: 'r3', name: 'Full Stack Developer', domain: 'Software Engineering', lastUpdated: '2026-09-08',
      skills: [
        { name: 'Java / Node.js', type: 'Required', importance: 'Critical', proficiency: 'Intermediate' },
        { name: 'React / Angular', type: 'Required', importance: 'High', proficiency: 'Intermediate' },
        { name: 'SQL', type: 'Required', importance: 'High', proficiency: 'Intermediate' },
        { name: 'REST APIs', type: 'Required', importance: 'High', proficiency: 'Intermediate' },
        { name: 'Docker', type: 'Preferred', importance: 'Medium', proficiency: 'Beginner' },
      ]
    },
    {
      id: 'r4', name: 'Data Analyst', domain: 'Data & Analytics', lastUpdated: '2026-09-10',
      skills: [
        { name: 'SQL', type: 'Required', importance: 'Critical', proficiency: 'Intermediate' },
        { name: 'Python', type: 'Required', importance: 'High', proficiency: 'Intermediate' },
        { name: 'Excel / Power BI', type: 'Required', importance: 'High', proficiency: 'Intermediate' },
        { name: 'Statistics', type: 'Required', importance: 'High', proficiency: 'Intermediate' },
        { name: 'ML Basics', type: 'Preferred', importance: 'Medium', proficiency: 'Beginner' },
      ]
    },
    {
      id: 'r5', name: 'AI Engineer', domain: 'AI & Machine Learning', lastUpdated: '2026-09-12',
      skills: [
        { name: 'Python', type: 'Required', importance: 'Critical', proficiency: 'Advanced' },
        { name: 'Machine Learning', type: 'Required', importance: 'Critical', proficiency: 'Intermediate' },
        { name: 'SQL', type: 'Required', importance: 'High', proficiency: 'Intermediate' },
        { name: 'Deep Learning', type: 'Preferred', importance: 'High', proficiency: 'Intermediate' },
        { name: 'Cloud Computing', type: 'Preferred', importance: 'Medium', proficiency: 'Beginner' },
      ]
    },
  ];

  const active = roles.find((r) => r.id === selectedRole);
  const importanceBadge: Record<string, string> = {
    Critical: 'bg-rose-50 text-rose-700 border-rose-200',
    High: 'bg-orange-50 text-orange-700 border-orange-200',
    Medium: 'bg-blue-50 text-blue-700 border-blue-200',
    Low: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Role & Skill Requirements</h2>
        <p className="text-sm text-slate-500 mt-0.5">Standardized industry roles and their required skills — used across Student, College, and Company portals.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role List */}
        <Card className="p-4 lg:col-span-1">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Industry Roles</h3>
          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${selectedRole === role.id
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-200'
                  }`}
              >
                <div className="text-xs font-bold">{role.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{role.domain}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Skill Detail */}
        <div className="lg:col-span-2">
          {active ? (
            <Card className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{active.name}</h3>
                  <p className="text-xs text-slate-500">{active.domain} · Updated: {active.lastUpdated}</p>
                </div>
                <DemoBadge />
              </div>
              <p className="text-xs text-slate-500 mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3">
                This standardized role definition is used by Students for skill-gap analysis, Colleges for curriculum alignment, and Companies for candidate requirement matching.
              </p>
              <div className="space-y-2">
                {active.skills.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex-1 text-xs font-semibold text-slate-800">{skill.name}</div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${skill.type === 'Required' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{skill.type}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${importanceBadge[skill.importance]}`}>{skill.importance}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{skill.proficiency}</span>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-10 flex flex-col items-center justify-center text-center h-full">
              <Layers className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-500">Select a role to view skill requirements</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── SECTION: Data Sources ────────────────────────────────────────────────────
const DataSources: React.FC = () => {
  const [sources, setSources] = useState([
    { id: 'ds1', name: 'Employer Requirement Aggregation', type: 'Employer Data', lastUpdated: '2026-09-14', status: true, quality: 'High', description: 'Aggregated skill requirements from campus recruitment requisitions.' },
    { id: 'ds2', name: 'Industry Job Market Data', type: 'Market Data', lastUpdated: '2026-09-10', status: true, quality: 'High', description: 'Curated job posting trend analysis from Indian tech market.' },
    { id: 'ds3', name: 'Technology Industry Reports', type: 'Verified', lastUpdated: '2026-08-30', status: true, quality: 'Verified', description: 'Annual technology skill demand reports from industry bodies.' },
    { id: 'ds4', name: 'Employer Feedback Data', type: 'Employer Data', lastUpdated: '2026-09-12', status: true, quality: 'High', description: 'Post-hiring skill feedback submitted by registered employers.' },
    { id: 'ds5', name: 'Prototype / Demonstration Dataset', type: 'Demo', lastUpdated: '2026-01-01', status: true, quality: 'Demo', description: 'Sample data for platform demonstration. Not real-world statistics.' },
    { id: 'ds6', name: 'College Placement Outcomes', type: 'Imported', lastUpdated: '2026-07-20', status: false, quality: 'Medium', description: 'Placement result data submitted by affiliated colleges.' },
  ]);

  const qualityBadge: Record<string, string> = {
    Verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    High: 'bg-blue-50 text-blue-700 border-blue-200',
    Medium: 'bg-orange-50 text-orange-700 border-orange-200',
    Demo: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Data Sources</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage where the platform receives industry skill intelligence from.</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {sources.map((src) => (
          <Card key={src.id} className={`p-5 ${!src.status ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-900">{src.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${qualityBadge[src.quality]}`}>{src.quality}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">{src.type}</span>
                  {src.quality === 'Demo' && <DemoBadge />}
                </div>
                <p className="text-xs text-slate-500 mb-2">{src.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated: {src.lastUpdated}</span>
                  <span className={`flex items-center gap-1 font-semibold ${src.status ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {src.status ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {src.status ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSources((prev) => prev.map((s) => s.id === src.id ? { ...s, status: !s.status } : s))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-colors ${src.status ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}
                >
                  {src.status ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  {src.status ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── SECTION: Skill Intelligence ──────────────────────────────────────────────
const SkillIntelligence: React.FC<{ industrySkills: IndustrySkill[] }> = ({ industrySkills }) => {
  const highDemand = industrySkills.filter((s) => s.demandScore >= 80).slice(0, 5);
  const growing = industrySkills.filter((s) => s.trend === 'Growing').slice(0, 5);
  const emerging = industrySkills.filter((s) => s.demandScore >= 60 && s.demandScore < 80).slice(0, 4);
  const declining = industrySkills.filter((s) => s.trend === 'Declining').slice(0, 3);

  const intelligenceFlow = [
    { label: 'Industry Demand', color: 'bg-blue-600', desc: 'Admin-managed skill data' },
    { label: 'Student Skill Gap', color: 'bg-violet-600', desc: 'Gap vs. demand profile' },
    { label: 'Curriculum Analysis', color: 'bg-emerald-600', desc: 'College alignment check' },
    { label: 'Company Requirements', color: 'bg-orange-500', desc: 'Role-skill matching' },
    { label: 'Training Recommendations', color: 'bg-cyan-600', desc: 'Upskilling guidance' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Skill Intelligence</h2>
        <p className="text-sm text-slate-500 mt-0.5">Central intelligence view — how industry skills are trending across the platform.</p>
      </div>

      {/* Intelligence Flow */}
      <Card className="p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Brain className="w-4 h-4 text-blue-600" /> Platform Intelligence Flow
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {intelligenceFlow.map((step, i) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center">
                <div className={`${step.color} text-white text-xs font-semibold px-3 py-1.5 rounded-xl`}>{step.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{step.desc}</div>
              </div>
              {i < intelligenceFlow.length - 1 && <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most In-Demand */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" /> Most In-Demand Skills
            </h3>
            <DemoBadge />
          </div>
          <div className="space-y-3">
            {highDemand.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex-1 text-xs font-semibold text-slate-700">{s.name}</div>
                <div className="w-28 bg-slate-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${s.demandScore}%` }} />
                </div>
                <span className="text-xs font-bold text-blue-600 w-8 text-right">{s.demandScore}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Fast-Growing */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Fast-Growing Skills
            </h3>
            <DemoBadge />
          </div>
          <div className="space-y-3">
            {growing.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <div className="flex-1 text-xs font-semibold text-slate-800">{s.name}</div>
                <span className="text-[10px] text-slate-500">{s.category}</span>
                <TrendBadge trend={s.trend} />
              </div>
            ))}
          </div>
        </Card>

        {/* Emerging */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-orange-500" /> Emerging Skills
            </h3>
            <DemoBadge />
          </div>
          <div className="space-y-2">
            {emerging.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl bg-orange-50/60 border border-orange-100">
                <div className="flex-1 text-xs font-semibold text-slate-800">{s.name}</div>
                <span className="text-[11px] font-bold text-orange-600">{s.demandScore}%</span>
                <TrendBadge trend={s.trend} />
              </div>
            ))}
          </div>
        </Card>

        {/* Declining */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" /> Declining Skills
            </h3>
            <DemoBadge />
          </div>
          {declining.length > 0 ? (
            <div className="space-y-2">
              {declining.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl bg-rose-50/60 border border-rose-100">
                  <div className="flex-1 text-xs font-semibold text-slate-800">{s.name}</div>
                  <span className="text-[11px] font-bold text-rose-600">{s.demandScore}%</span>
                  <TrendBadge trend={s.trend} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              No declining skills in current database.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// ─── SECTION: Reports ─────────────────────────────────────────────────────────
const Reports: React.FC = () => {
  const reports = [
    { id: 'rpt1', title: 'Industry Skill Demand Report', desc: 'Complete view of all skills, demand scores, trends, and category breakdown.', icon: <Database className="w-5 h-5 text-blue-600" />, color: 'bg-blue-50 border-blue-200', updated: 'Sep 14, 2026' },
    { id: 'rpt2', title: 'Skill Trend Report', desc: 'Growing, stable, and declining skill trends with time-series context.', icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, color: 'bg-emerald-50 border-emerald-200', updated: 'Sep 14, 2026' },
    { id: 'rpt3', title: 'Role–Skill Requirement Report', desc: 'Standardized role definitions and their required/preferred skills with proficiency.', icon: <Layers className="w-5 h-5 text-violet-600" />, color: 'bg-violet-50 border-violet-200', updated: 'Sep 12, 2026' },
    { id: 'rpt4', title: 'User Overview Report', desc: 'Platform user summary — students, colleges, companies, and admins by status.', icon: <Users className="w-5 h-5 text-orange-500" />, color: 'bg-orange-50 border-orange-200', updated: 'Sep 14, 2026' },
    { id: 'rpt5', title: 'Data Source & Quality Report', desc: 'Status and quality rating for all connected data sources.', icon: <Link2 className="w-5 h-5 text-cyan-600" />, color: 'bg-cyan-50 border-cyan-200', updated: 'Sep 10, 2026' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Reports</h2>
        <p className="text-sm text-slate-500 mt-0.5">Platform monitoring reports for the Industry Demand and Skills Development system.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rpt) => (
          <Card key={rpt.id} className="p-5">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${rpt.color}`}>{rpt.icon}</div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 mb-1">{rpt.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{rpt.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{rpt.updated}</span>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-xl border border-slate-200 transition-colors">
                    <Download className="w-3 h-3" /> Export PDF
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── SECTION: Notifications ───────────────────────────────────────────────────
const Notifications: React.FC = () => {
  const notifs = [
    { id: 'n1', title: 'New Industry Data Available', desc: 'Technology Trend Dataset Q3 2026 is ready for review.', time: '2h ago', type: 'data', read: false },
    { id: 'n2', title: 'Skill Demand Updated', desc: 'Cloud Computing demand increased from 75% → 82%.', time: '4h ago', type: 'skill', read: false },
    { id: 'n3', title: 'New Company Registered', desc: 'InnovateTech Pvt. Ltd. joined the platform.', time: '5h ago', type: 'company', read: false },
    { id: 'n4', title: 'Data Source Requires Review', desc: 'College Placement Outcomes feed has not synced in 60 days.', time: '1d ago', type: 'alert', read: false },
    { id: 'n5', title: 'New College Registered', desc: 'JNTU Hyderabad registered on the platform.', time: '1d ago', type: 'college', read: true },
    { id: 'n6', title: 'Skill Trend Changed', desc: 'AI/ML trend updated from Stable → Growing.', time: '2d ago', type: 'skill', read: true },
    { id: 'n7', title: 'Platform System Update', desc: 'Skill Intelligence engine v2.1 deployed successfully.', time: '3d ago', type: 'system', read: true },
  ];

  const [notifState, setNotifState] = useState(notifs);

  const typeIcon: Record<string, React.ReactNode> = {
    data: <Database className="w-4 h-4 text-blue-600" />,
    skill: <Brain className="w-4 h-4 text-violet-600" />,
    company: <Briefcase className="w-4 h-4 text-emerald-600" />,
    college: <GraduationCap className="w-4 h-4 text-cyan-600" />,
    alert: <AlertTriangle className="w-4 h-4 text-rose-500" />,
    system: <ShieldCheck className="w-4 h-4 text-orange-500" />,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
          <p className="text-sm text-slate-500 mt-0.5">Platform-level alerts and updates for the Admin.</p>
        </div>
        <button onClick={() => setNotifState((prev) => prev.map((n) => ({ ...n, read: true })))}
          className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5">
          <Check className="w-3 h-3" /> Mark All Read
        </button>
      </div>
      <Card className="divide-y divide-slate-100">
        {notifState.map((n) => (
          <div key={n.id} className={`flex items-start gap-4 p-4 transition-colors ${n.read ? 'opacity-60' : 'bg-blue-50/30'}`}>
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              {typeIcon[n.type]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-slate-400">{n.time}</span>
              {!n.read && (
                <button onClick={() => setNotifState((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                  className="text-[11px] text-blue-600 hover:underline font-medium">
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ─── SECTION: Admin Profile ───────────────────────────────────────────────────
const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState({ name: 'Platform Admin', email: 'admin@sih26134.in', role: 'Platform Administrator', institution: 'SIH26134 — Industry Demand & Skills Development' });
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Admin Profile</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage your platform administrator account information.</p>
      </div>
      <Card className="p-6">
        <div className="flex items-center gap-5 mb-6 pb-5 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
            {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
            <p className="text-sm text-slate-500">{profile.role}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck className="w-3 h-3" /> Admin Access
            </span>
          </div>
        </div>
        <div className="space-y-4 text-xs">
          {[
            { label: 'Full Name', key: 'name' },
            { label: 'Email Address', key: 'email' },
            { label: 'Role', key: 'role' },
            { label: 'Platform', key: 'institution' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block font-semibold text-slate-700 mb-1">{f.label}</label>
              {editing ? (
                <input value={(profile as any)[f.key]} onChange={(e) => setProfile((p) => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none" />
              ) : (
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">{(profile as any)[f.key]}</div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          {editing ? (
            <>
              <button onClick={() => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2500); }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors">Save Profile</button>
              <button onClick={() => setEditing(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors">Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-2">
              <Edit2 className="w-3 h-3" /> Edit Profile
            </button>
          )}
        </div>
        {saved && (
          <div className="mt-4 flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs">
            <CheckCircle2 className="w-4 h-4" /> Profile updated successfully.
          </div>
        )}
      </Card>
    </div>
  );
};

// ─── SECTION: Settings ────────────────────────────────────────────────────────
const AdminSettings: React.FC<{ isPrototypeData: boolean; togglePrototypeLabel: () => void }> = ({ isPrototypeData, togglePrototypeLabel }) => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [dataAlerts, setDataAlerts] = useState(true);
  const [autoSync, setAutoSync] = useState(false);

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
    <button onClick={onChange} className={`relative w-10 h-5.5 rounded-full transition-colors focus:outline-none ${enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
      style={{ height: '22px', width: '40px' }}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-[18px]' : ''}`} />
    </button>
  );

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Platform administration and account settings.</p>
      </div>

      {/* Data Governance */}
      <Card className="p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" /> Data Transparency
        </h3>
        <p className="text-xs text-slate-500 mb-4">Control how data labels are shown across all platform portals.</p>
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <p className="text-xs font-semibold text-slate-800">Demonstration Data Label</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Show "Demonstration Data" badge on prototype datasets across all portals.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${isPrototypeData ? 'text-amber-600' : 'text-emerald-600'}`}>
              {isPrototypeData ? 'Active' : 'Off'}
            </span>
            <ToggleSwitch enabled={isPrototypeData} onChange={togglePrototypeLabel} />
          </div>
        </div>
      </Card>

      {/* Notifications Settings */}
      <Card className="p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" /> Notification Preferences
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Email Notifications', desc: 'Receive platform alerts via email.', enabled: emailNotifs, set: setEmailNotifs },
            { label: 'Data Source Alerts', desc: 'Alert when a data source is outdated or fails.', enabled: dataAlerts, set: setDataAlerts },
            { label: 'Auto-Sync Data Sources', desc: 'Automatically sync enabled data sources daily.', enabled: autoSync, set: setAutoSync },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-800">{s.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
              </div>
              <ToggleSwitch enabled={s.enabled} onChange={() => s.set((v) => !v)} />
            </div>
          ))}
        </div>
      </Card>

      {/* Platform Info */}
      <Card className="p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" /> Platform Information
        </h3>
        <div className="space-y-2 text-xs">
          {[
            { label: 'Platform', value: 'SIH26134 — Industry Demand and Skills Development' },
            { label: 'Version', value: '2.0.0 (Production Build)' },
            { label: 'Data Engine', value: 'Skill Intelligence v2.1' },
            { label: 'Last Full Sync', value: 'Sep 14, 2026 at 06:00 IST' },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-600 w-32 shrink-0">{r.label}</span>
              <span className="text-slate-700">{r.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── MAIN AdminPortal ─────────────────────────────────────────────────────────
export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const { industrySkills, updateIndustrySkill, addIndustrySkill, isPrototypeData, togglePrototypeLabel, logout } = useApp();

  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => { logout(); onLogout?.(); };

  const notifications = [
    { title: 'New Industry Data Available', time: '2h ago' },
    { title: 'Skill Demand Updated: Cloud Computing', time: '4h ago' },
    { title: 'New Company Registered', time: '5h ago' },
    { title: 'Data Source Requires Review', time: '1d ago' },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <AdminDashboard industrySkills={industrySkills} />;
      case 'user-management': return <UserManagement />;
      case 'skill-data': return <IndustrySkillData industrySkills={industrySkills} updateIndustrySkill={updateIndustrySkill} addIndustrySkill={addIndustrySkill} />;
      case 'role-requirements': return <RoleRequirements />;
      case 'data-sources': return <DataSources />;
      case 'skill-intelligence': return <SkillIntelligence industrySkills={industrySkills} />;
      case 'reports': return <Reports />;
      case 'notifications': return <Notifications />;
      case 'profile': return <AdminProfile />;
      case 'settings': return <AdminSettings isPrototypeData={isPrototypeData} togglePrototypeLabel={togglePrototypeLabel} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-slate-200 transition-all duration-300
        ${sidebarCollapsed ? 'lg:w-[68px]' : 'lg:w-60'}
        ${mobileSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className={`flex items-center h-14 border-b border-slate-100 px-4 shrink-0 ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-slate-900 truncate">Admin Portal</div>
              <div className="text-[10px] text-slate-400 font-medium truncate">SIH26134 Platform</div>
            </div>
          )}
          <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id); setMobileSidebarOpen(false); }}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${active
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 rounded-r-none'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <span className={`shrink-0 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{item.icon}</span>
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                {!sidebarCollapsed && item.badge && (
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${item.badge === 'Core' ? 'bg-blue-50 text-blue-600 border-blue-200' : item.badge === 'AI' ? 'bg-violet-50 text-violet-600 border-violet-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle + Logout */}
        <div className="border-t border-slate-100 p-2 space-y-1 shrink-0">
          <button
            onClick={() => handleLogout()}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            title={sidebarCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
          <button
            onClick={() => setSidebarCollapsed((v) => !v)}
            className="hidden lg:flex w-full items-center justify-center py-2 rounded-xl text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 shrink-0">
          <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100">
            <Menu className="w-4 h-4" />
          </button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search platform..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg z-50 overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {notifications.map((n, i) => (
                      <div key={i} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                        <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-slate-100">
                    <button onClick={() => { setNotifOpen(false); setActiveView('notifications'); }}
                      className="text-[11px] text-blue-600 font-semibold hover:underline">View all notifications →</button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin avatar */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">PA</div>
              {!sidebarCollapsed && <span className="text-xs font-semibold text-slate-700 hidden sm:block">Platform Admin</span>}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};
