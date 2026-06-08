/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Download,
  Eye,
  FileText,
  HeartHandshake,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  MessageCircle,
  Moon,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  Zap
} from 'lucide-react';
import { Attendee, BulletMessage, Connection, Exhibit, Poll, Question, Session } from '../types';

interface AdminDashboardProps {
  myProfile: Attendee;
  setMyProfile: React.Dispatch<React.SetStateAction<Attendee>>;
  attendees: Attendee[];
  setAttendees: React.Dispatch<React.SetStateAction<Attendee[]>>;
  sessions: Session[];
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  polls: Poll[];
  exhibits: Exhibit[];
  setExhibits: React.Dispatch<React.SetStateAction<Exhibit[]>>;
  connections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  bulletMessages: BulletMessage[];
  setBulletMessages: React.Dispatch<React.SetStateAction<BulletMessage[]>>;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

type AdminTab = 'overview' | 'attendees' | 'checkin' | 'network' | 'portfolio' | 'content' | 'schedule' | 'reports' | 'settings';
type AdminSettingsState = {
  eventName: string;
  eventDate: string;
  venue: string;
  userDomain: string;
  openRegistration: boolean;
  enableCheckin: boolean;
  enableReports: boolean;
  logoLabel: string;
  coverImage?: string;
  reportBgImage?: string;
  themeColors: string[];
  allowAvatar: boolean;
  allowWorks: boolean;
  allowEvents: boolean;
  phoneVerification: boolean;
  roles: { superAdmin: number; contentReviewer: number; fieldStaff: number; reportViewer: number };
  notifications: { newUser: boolean; pendingQuestion: boolean; abnormalCheckin: boolean; reportDone: boolean };
  integrations: { supabaseDb: boolean; supabaseStorage: boolean; geminiApi: boolean; vercelHosting: boolean };
  personalReportModules: string[];
  meetingReportModules: string[];
  requireAdminLogin: boolean;
  watermarkReports: boolean;
  exportFormat: 'PNG' | 'PDF' | 'Both';
};

const menuItems: { id: AdminTab; label: string; desc: string; icon: React.ElementType }[] = [
  { id: 'overview', label: '总览', desc: '核心数据与可视化大盘', icon: LayoutDashboard },
  { id: 'attendees', label: '参会用户', desc: '用户资料与详情查看', icon: Users },
  { id: 'checkin', label: '签到管理', desc: '签到状态与现场核销', icon: QrCode },
  { id: 'network', label: '同频关系', desc: '关系链路与通讯录', icon: HeartHandshake },
  { id: 'portfolio', label: '作品资料', desc: '设计作品与图像墙', icon: ImageIcon },
  { id: 'content', label: '互动内容', desc: '提问、弹幕、审核', icon: MessageCircle },
  { id: 'schedule', label: '议程管理', desc: '议程排期与直播状态', icon: CalendarDays },
  { id: 'reports', label: '报告中心', desc: '个人报告 · 会议总报告', icon: FileText },
  { id: 'settings', label: '系统设置', desc: '品牌、权限与集成配置', icon: Settings }
];

const DEFAULT_ADMIN_SETTINGS: AdminSettingsState = {
  eventName: '2026 跨界设计与人性体验峰会',
  eventDate: '2026-05-25',
  venue: '上海当代艺术创意园 · A1馆',
  userDomain: 'welcome-me-vercel.vercel.app',
  openRegistration: true,
  enableCheckin: true,
  enableReports: true,
  logoLabel: 'ME',
  themeColors: ['#ec4899', '#8b5cf6', '#14b8a6', '#0f172a', '#f8fafc'],
  allowAvatar: true,
  allowWorks: true,
  allowEvents: true,
  phoneVerification: false,
  roles: { superAdmin: 1, contentReviewer: 3, fieldStaff: 6, reportViewer: 2 },
  notifications: { newUser: true, pendingQuestion: true, abnormalCheckin: true, reportDone: true },
  integrations: { supabaseDb: false, supabaseStorage: false, geminiApi: true, vercelHosting: true },
  personalReportModules: ['头像与身份信息', '设计方向标签', '作品图像模块', '成长曲线图', 'PNG 导出'],
  meetingReportModules: ['签到率与活跃趋势', '会议关键词词云', '议程热度排行', '用户结构分布', '图片摘要模块'],
  requireAdminLogin: false,
  watermarkReports: true,
  exportFormat: 'PNG'
};

function classNames(...values: (string | false | null | undefined)[]) {
  return values.filter(Boolean).join(' ');
}

function readAdminSettings(): AdminSettingsState {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_SETTINGS;
  try {
    const raw = window.localStorage.getItem('welcomeMeAdminSettings');
    if (!raw) return DEFAULT_ADMIN_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AdminSettingsState>;
    return {
      ...DEFAULT_ADMIN_SETTINGS,
      ...parsed,
      roles: { ...DEFAULT_ADMIN_SETTINGS.roles, ...(parsed.roles || {}) },
      notifications: { ...DEFAULT_ADMIN_SETTINGS.notifications, ...(parsed.notifications || {}) },
      integrations: { ...DEFAULT_ADMIN_SETTINGS.integrations, ...(parsed.integrations || {}) }
    };
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
}

function persistAdminSettings(settings: AdminSettingsState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('welcomeMeAdminSettings', JSON.stringify(settings));
}

function fmtPercent(v: number) {
  return `${Math.round(v)}%`;
}

function getAttendeeById(id: string, people: Attendee[]) {
  return people.find((item) => item.id === id);
}

function commonTags(a: Attendee, b: Attendee) {
  const aa = [...a.designDirections, ...a.interests, ...a.goals];
  const bb = [...b.designDirections, ...b.interests, ...b.goals];
  return aa.filter((tag) => bb.includes(tag)).slice(0, 5);
}

function completionTone(value: number) {
  if (value >= 80) return 'text-emerald-600 bg-emerald-500/10 dark:text-emerald-300';
  if (value >= 60) return 'text-amber-600 bg-amber-500/10 dark:text-amber-300';
  return 'text-rose-600 bg-rose-500/10 dark:text-rose-300';
}

function statusTone(status: Connection['status']) {
  if (status === 'confirmed') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300';
  if (status === 'pending') return 'bg-amber-500/10 text-amber-600 dark:text-amber-300';
  return 'bg-rose-500/10 text-rose-600 dark:text-rose-300';
}

function questionStatusTone(status: Question['status']) {
  if (status === 'approved') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300';
  if (status === 'pending') return 'bg-amber-500/10 text-amber-600 dark:text-amber-300';
  return 'bg-slate-500/10 text-slate-600 dark:text-slate-300';
}

function Avatar({ person, size = 'md' }: { person: Attendee; size?: 'sm' | 'md' | 'lg' }) {
  const map = { sm: 'w-10 h-10 text-base rounded-2xl', md: 'w-12 h-12 text-lg rounded-[18px]', lg: 'w-16 h-16 text-2xl rounded-[22px]' };
  return person.avatarImage ? (
    <img src={person.avatarImage} alt={person.nickName} className={classNames(map[size], 'object-cover border border-white/60 dark:border-slate-800 shadow-sm')} />
  ) : (
    <div className={classNames(map[size], person.avatarColor, 'text-white flex items-center justify-center shadow-sm shrink-0')}>{person.avatarEmoji}</div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold">{tag}</span>
      ))}
    </div>
  );
}

function SectionCard({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-[32px] border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm overflow-hidden">
      <div className="px-5 md:px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg md:text-xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </div>
  );
}

function MiniMetric({ label, value, helper, icon: Icon, accent }: { label: string; value: string | number; helper: string; icon: React.ElementType; accent: string }) {
  return (
    <div className="rounded-[26px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 relative overflow-hidden shadow-sm">
      <div className={classNames('absolute right-0 top-0 w-28 h-28 rounded-full blur-3xl opacity-15', accent)} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</div>
          <div className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{value}</div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{helper}</div>
        </div>
        <div className={classNames('w-11 h-11 rounded-2xl text-white flex items-center justify-center shadow-lg', accent)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label?: string }) {
  return (
    <button type="button" onClick={onChange} className={classNames('relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors', checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700')} aria-label={label || 'toggle setting'}>
      <span className={classNames('h-5 w-5 rounded-full bg-white shadow-sm transition-transform', checked ? 'translate-x-5' : 'translate-x-0')} />
    </button>
  );
}

function SettingRow({ title, desc, checked, onToggle }: { title: string; desc: string; checked: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-[22px] border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-between gap-3">
      <div>
        <div className="font-black text-slate-950 dark:text-white">{title}</div>
        <div className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300">{desc}</div>
      </div>
      <ToggleSwitch checked={checked} onChange={onToggle} label={title} />
    </div>
  );
}

function RoleCounter({ label, desc, value, onChange }: { label: string; desc: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="rounded-[22px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center justify-between gap-3">
      <div>
        <div className="font-black text-slate-950 dark:text-white">{label}</div>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">{desc}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 font-black">-</button>
        <span className="w-10 text-center text-sm font-black text-slate-950 dark:text-white">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black">+</button>
      </div>
    </div>
  );
}

function SimpleAreaChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const points = values.map((v, i) => `${(i / Math.max(values.length - 1, 1)) * 100},${100 - (v / max) * 82}`).join(' ');
  const area = `0,100 ${points} 100,100`;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-40">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" /><stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" /></linearGradient>
        <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#ec4899" /><stop offset="50%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#14b8a6" /></linearGradient>
      </defs>
      {[20, 40, 60, 80].map((y) => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(148,163,184,0.18)" strokeWidth="1" strokeDasharray="2 3" />)}
      <polygon points={area} fill="url(#areaFill)" />
      <polyline points={points} fill="none" stroke="url(#lineStroke)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => <circle key={i} cx={(i / Math.max(values.length - 1, 1)) * 100} cy={100 - (v / max) * 82} r="2.2" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" />)}
    </svg>
  );
}

function DonutChart({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const circumference = 2 * Math.PI * 42;
  const dash = (clamped / 100) * circumference;
  return (
    <div className="relative w-36 h-36">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <defs><linearGradient id="donutGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ec4899" /><stop offset="55%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#14b8a6" /></linearGradient></defs>
        <circle cx="50" cy="50" r="42" stroke="rgba(148,163,184,0.16)" strokeWidth="9" fill="none" />
        <circle cx="50" cy="50" r="42" stroke="url(#donutGradient)" strokeWidth="9" fill="none" strokeLinecap="round" strokeDasharray={`${dash} ${circumference}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center"><div className="text-3xl font-black text-slate-950 dark:text-white">{clamped}%</div><div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">资料完整度</div></div>
    </div>
  );
}

function WordCloudPanel({ items }: { items: { label: string; value: number }[] }) {
  const tones = ['bg-pink-500/12 text-pink-700 dark:text-pink-300 border-pink-500/15', 'bg-violet-500/12 text-violet-700 dark:text-violet-300 border-violet-500/15', 'bg-cyan-500/12 text-cyan-700 dark:text-cyan-300 border-cyan-500/15', 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/15', 'bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/15'];
  if (!items.length) return <div className="text-sm text-slate-500 dark:text-slate-400">暂无关键词数据。</div>;
  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map((item, index) => <div key={item.label} className={`rounded-full border px-4 py-2 font-black shadow-sm ${tones[index % tones.length]}`} style={{ fontSize: `${Math.min(28, 12 + item.value * 2.2)}px`, lineHeight: 1.1 }}>{item.label}</div>)}
    </div>
  );
}


function MeetingTrendChart() {
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const series = [
    { name: '访问热度', color: '#ec4899', values: [10, 49, 70, 76, 89, 83, 96, 78, 90] },
    { name: '互动提问', color: '#8b5cf6', values: [8, 34, 44, 56, 52, 64, 68, 51, 58] },
    { name: '作品浏览', color: '#14b8a6', values: [6, 16, 20, 24, 35, 45, 39, 34, 37] }
  ];
  const chartW = 520;
  const chartH = 210;
  const left = 44;
  const top = 18;
  const max = 100;
  const pointList = (values: number[]) => values.map((value, index) => {
    const x = left + (index / (values.length - 1)) * chartW;
    const y = top + chartH - (value / max) * chartH;
    return `${x},${y}`;
  }).join(' ');
  const areaList = (values: number[]) => `${left},${top + chartH} ${pointList(values)} ${left + chartW},${top + chartH}`;

  return (
    <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-black text-slate-950 dark:text-white">会议热度趋势</h4>
            <span className="rounded-full border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[10px] font-black text-slate-500 dark:text-slate-300">LIVE</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-slate-500 dark:text-slate-300">
            {series.map((item) => <span key={item.name} className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>)}
          </div>
        </div>
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-black">
          {['时段', '小时', '累计'].map((item, index) => <span key={item} className={classNames('px-3 py-1.5 rounded-xl', index === 0 ? 'bg-violet-500 text-white shadow-sm' : 'text-slate-500 dark:text-slate-300')}>{item}</span>)}
        </div>
      </div>
      <svg viewBox="0 0 600 280" className="mt-5 h-[270px] w-full overflow-visible">
        <defs>
          <linearGradient id="meetingTrendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ec4899" stopOpacity="0.28" /><stop offset="100%" stopColor="#14b8a6" stopOpacity="0.02" /></linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = top + chartH - (tick / max) * chartH;
          return <g key={tick}><line x1={left} x2={left + chartW} y1={y} y2={y} stroke="rgba(148,163,184,0.18)" strokeDasharray="4 8" /><text x={8} y={y + 4} fill="currentColor" className="text-[10px] text-slate-400">{tick}</text></g>;
        })}
        <polygon points={areaList(series[0].values)} fill="url(#meetingTrendFill)" />
        {series.map((item) => (
          <g key={item.name}>
            <polyline points={pointList(item.values)} fill="none" stroke={item.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {item.values.map((value, index) => {
              const x = left + (index / (item.values.length - 1)) * chartW;
              const y = top + chartH - (value / max) * chartH;
              return <circle key={`${item.name}-${index}`} cx={x} cy={y} r="5" fill="#0f172a" stroke={item.color} strokeWidth="3" />;
            })}
          </g>
        ))}
        {times.map((time, index) => {
          const x = left + (index / (times.length - 1)) * chartW;
          return <text key={time} x={x} y={260} textAnchor="middle" fill="currentColor" className="text-[10px] text-slate-400">{time}</text>;
        })}
      </svg>
    </div>
  );
}

function ReportMiniBar({ label, value, color, suffix = '%' }: { label: string; value: number; color: string; suffix?: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-slate-600 dark:text-slate-200">{label}</span>
        <span className="font-black text-slate-950 dark:text-white">{value}{suffix}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full" style={{ width: `${Math.max(6, Math.min(100, value))}%`, background: color }} />
      </div>
    </div>
  );
}

function ReportDonut({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, value));
  const circumference = 2 * Math.PI * 38;
  const dash = (pct / 100) * circumference;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r="38" stroke="rgba(148,163,184,0.18)" strokeWidth="12" fill="none" />
        <circle cx="50" cy="50" r="38" stroke="url(#reportDonutGradient)" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={`${dash} ${circumference}`} />
        <defs><linearGradient id="reportDonutGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#14b8a6" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center"><div className="text-2xl font-black text-slate-950 dark:text-white">{pct}%</div><div className="text-[11px] font-bold text-slate-500 dark:text-slate-300">{label}</div></div>
    </div>
  );
}

export default function AdminDashboard({
  myProfile,
  setMyProfile,
  attendees,
  setAttendees,
  sessions,
  setSessions,
  questions,
  setQuestions,
  polls,
  exhibits,
  setExhibits,
  connections,
  setConnections,
  bulletMessages,
  setBulletMessages,
  isDarkMode,
  setIsDarkMode
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [adminSettings, setAdminSettings] = useState<AdminSettingsState>(() => readAdminSettings());
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  const allAttendees = useMemo(() => [myProfile, ...attendees], [myProfile, attendees]);
  const selectedUser = selectedUserId ? allAttendees.find((item) => item.id === selectedUserId) || null : null;
  const checkedInCount = allAttendees.filter((person) => person.checkedIn).length;
  const avgCompletion = Math.round(allAttendees.reduce((sum, person) => sum + person.personaCompletion, 0) / Math.max(allAttendees.length, 1));
  const workCards = useMemo(() => {
    const userWorks = allAttendees.flatMap((person) => (person.designWorks || []).map((work) => ({ ...work, owner: person.nickName, ownerId: person.id })));
    if (userWorks.length) return userWorks;
    return exhibits.slice(0, 8).map((exhibit) => ({ id: exhibit.id, title: exhibit.name, description: exhibit.description, imageUrl: exhibit.imageUrl, role: exhibit.zone, year: '2026', owner: exhibit.artist, ownerId: allAttendees[0]?.id || 'me' }));
  }, [allAttendees, exhibits]);
  const stats = useMemo(() => {
    const pendingQuestions = questions.filter((q) => q.status === 'pending').length;
    const approvedQuestions = questions.filter((q) => q.status === 'approved').length;
    const confirmedConnections = connections.filter((c) => c.status === 'confirmed').length;
    const reportReadyCount = allAttendees.filter((person) => person.checkedIn && person.personaCompletion >= 70).length;
    return { pendingQuestions, approvedQuestions, confirmedConnections, reportReadyCount };
  }, [questions, connections, allAttendees]);
  const filteredAttendees = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return allAttendees.filter((person) => {
      const text = [person.nickName, person.organization, person.title, person.industry, ...(person.designDirections || []), ...(person.interests || [])].join(' ').toLowerCase();
      return !keyword || text.includes(keyword);
    });
  }, [allAttendees, query]);
  const distribution = useMemo(() => {
    const map = new Map<string, number>();
    allAttendees.forEach((person) => person.designDirections.forEach((tag) => map.set(tag, (map.get(tag) || 0) + 1)));
    return Array.from(map.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [allAttendees]);
  const meetingWordCloud = useMemo(() => {
    const words = [...allAttendees.flatMap((person) => person.designDirections || []), ...allAttendees.flatMap((person) => person.interests || []), ...allAttendees.flatMap((person) => person.goals || []), ...sessions.flatMap((session) => session.tags || []), ...exhibits.flatMap((exhibit) => exhibit.tags || []), ...connections.flatMap((connection) => connection.matchedTags || [])];
    const counter = new Map<string, number>();
    words.filter(Boolean).forEach((word) => counter.set(word, (counter.get(word) || 0) + 1));
    return Array.from(counter.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 22);
  }, [allAttendees, sessions, exhibits, connections]);
  const recentQuestions = questions.slice(0, 3);
  const recentBullets = bulletMessages.slice(0, 4);
  const topSessions = [...sessions].sort((a, b) => b.likesCount - a.likesCount);
  const phaseValues = [58, 72, 66, 82, 77, 91, 86];

  const flashAdminNotice = (message: string) => {
    setAdminNotice(message);
    window.setTimeout(() => setAdminNotice(null), 2600);
  };
  const saveAdminSettings = (updater: (prev: AdminSettingsState) => AdminSettingsState, message = '设置已保存') => {
    setAdminSettings((prev) => {
      const next = updater(prev);
      persistAdminSettings(next);
      return next;
    });
    flashAdminNotice(message);
  };
  const patchAdminSettings = (patch: Partial<AdminSettingsState>, message?: string) => saveAdminSettings((prev) => ({ ...prev, ...patch }), message);
  const updateRoleCount = (role: keyof AdminSettingsState['roles'], value: number) => saveAdminSettings((prev) => ({ ...prev, roles: { ...prev.roles, [role]: value } }), '角色人数已更新');
  const toggleListItem = (key: 'personalReportModules' | 'meetingReportModules', item: string) => saveAdminSettings((prev) => ({ ...prev, [key]: prev[key].includes(item) ? prev[key].filter((value) => value !== item) : [...prev[key], item] }), '报告模块已更新');
  const handleAssetUpload = (kind: 'coverImage' | 'reportBgImage') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patchAdminSettings({ [kind]: String(reader.result) } as Partial<AdminSettingsState>, kind === 'coverImage' ? '活动封面已更新' : '报告背景已更新');
    reader.readAsDataURL(file);
  };
  const updateAttendee = (id: string, patch: Partial<Attendee>) => id === myProfile.id ? setMyProfile((prev) => ({ ...prev, ...patch })) : setAttendees((prev) => prev.map((person) => person.id === id ? { ...person, ...patch } : person));
  const toggleCheckin = (person: Attendee) => updateAttendee(person.id, { checkedIn: !person.checkedIn, checkedInAt: !person.checkedIn ? new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }) : undefined });
  const updateConnectionStatus = (id: string, status: Connection['status']) => setConnections((prev) => prev.map((item) => item.id === id ? { ...item, status } : item));
  const updateQuestionStatus = (id: string, status: Question['status']) => setQuestions((prev) => prev.map((item) => item.id === id ? { ...item, status } : item));
  const toggleSessionLive = (id: string) => setSessions((prev) => prev.map((item) => item.id === id ? { ...item, isLive: !item.isLive } : item));
  const toggleSessionSubscribe = (id: string) => setSessions((prev) => prev.map((item) => item.id === id ? { ...item, isSubscribed: !item.isSubscribed } : item));
  const exportJSON = (filename: string, data: unknown) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };
  const exportAdminSnapshot = () => {
    exportJSON(`welcome-me-admin-snapshot-${Date.now()}.json`, { generatedAt: new Date().toISOString(), settings: adminSettings, attendees: allAttendees, sessions, questions, connections, exhibits, bulletMessages, polls });
    flashAdminNotice('运营快照已导出');
  };
  const exportAdminSettings = () => {
    exportJSON(`welcome-me-admin-settings-${Date.now()}.json`, adminSettings);
    flashAdminNotice('系统设置已导出');
  };
  const resetLocalDemoData = () => {
    window.localStorage.removeItem('welcomeMeProfile');
    window.localStorage.removeItem('welcomeMeConnections');
    window.localStorage.removeItem('welcomeMeLoggedIn');
    flashAdminNotice('已清除本机演示缓存，刷新后生效');
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 premium-admin-surface">
      {adminNotice && <div className="fixed top-5 left-1/2 z-[100] -translate-x-1/2 rounded-2xl border border-emerald-500/20 bg-white/95 dark:bg-slate-900/95 px-4 py-3 text-sm font-black text-emerald-600 dark:text-emerald-300 shadow-xl backdrop-blur-xl">{adminNotice}</div>}
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-80 shrink-0 flex-col border-r border-white/10 bg-[#080f24] text-white sticky top-0 h-screen overflow-hidden premium-admin-sidebar">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(236,72,153,0.32),transparent_34%),radial-gradient(circle_at_90%_18%,rgba(20,184,166,0.18),transparent_28%),linear-gradient(180deg,#11142d_0%,#081023_100%)]" />
          <div className="relative p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-pink-500 via-purple-500 to-teal-400 flex items-center justify-center text-white font-black shadow-[0_12px_32px_rgba(236,72,153,0.35)] ring-1 ring-white/20">{adminSettings.logoLabel || 'ME'}</div>
              <div>
                <div className="text-lg font-black tracking-tight text-white">欢迎ME 策展后台</div>
                <div className="text-xs text-white/55 font-bold">Curatorial Ops Console</div>
              </div>
            </div>
          </div>
          <nav className="relative flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              const iconTones = [
                'from-pink-400 via-violet-400 to-teal-300',
                'from-violet-300 via-indigo-300 to-sky-300',
                'from-teal-300 via-cyan-300 to-emerald-300',
                'from-pink-300 via-purple-300 to-indigo-300',
                'from-amber-200 via-pink-200 to-violet-300',
                'from-sky-200 via-indigo-300 to-purple-300',
                'from-teal-200 via-emerald-300 to-cyan-300',
                'from-rose-200 via-violet-300 to-slate-100',
                'from-slate-100 via-violet-200 to-teal-200'
              ];
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={classNames(
                    'w-full text-left rounded-[26px] transition px-4 py-4 flex items-center gap-4 group',
                    active
                      ? 'bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_18px_40px_rgba(236,72,153,0.18)] ring-1 ring-pink-300/25'
                      : 'hover:bg-white/6'
                  )}
                >
                  <div className={classNames(
                    'w-14 h-14 rounded-[22px] flex items-center justify-center shrink-0 relative overflow-hidden ring-1 transition',
                    active ? 'bg-white/16 ring-white/22 shadow-[0_12px_30px_rgba(139,92,246,0.24)]' : 'bg-white/8 ring-white/10 group-hover:bg-white/12'
                  )}>
                    <div className={classNames('absolute inset-0 bg-gradient-to-br opacity-20', iconTones[index % iconTones.length])} />
                    <Icon className={classNames('relative w-7 h-7 transition drop-shadow-[0_0_12px_rgba(255,255,255,0.42)]', active ? 'text-white' : 'text-white/82 group-hover:text-white')} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[18px] leading-6 font-black tracking-tight text-white">{item.label}</div>
                    <div className="mt-1 text-[12px] leading-4 text-white/62 truncate font-bold">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </nav>
          <div className="relative p-4 border-t border-white/10 space-y-3">
            <button onClick={exportAdminSnapshot} className="w-full px-4 py-3 rounded-2xl bg-white text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-[0_14px_30px_rgba(255,255,255,0.16)]"><Download className="w-4 h-4" /> 导出运营快照</button>
            <a href="/" className="block text-center text-xs font-bold text-white/60 hover:text-white">返回用户端</a>
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 bg-[#f6f7fb]/88 dark:bg-slate-950/88 backdrop-blur-xl border-b border-slate-200/75 dark:border-slate-800">
            <div className="px-4 md:px-8 py-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div><div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-black text-slate-400 dark:text-slate-500"><ShieldCheck className="w-4 h-4 text-teal-500" /> ADMIN WORKSPACE / {menuItems.find((item) => item.id === activeTab)?.label}</div><h2 className="mt-1 text-2xl md:text-3xl font-black tracking-tight text-slate-950 dark:text-white">{menuItems.find((item) => item.id === activeTab)?.label}</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">以策展运营、现场管理和数据复盘为核心的服务端工作台。</p></div><div className="flex flex-wrap items-center gap-2"><div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300"><CircleDot className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Live Ready</div><button onClick={() => setIsDarkMode((prev) => !prev)} className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">{isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}{isDarkMode ? '浅色模式' : '夜间模式'}</button><a href="/" className="px-3 py-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black flex items-center gap-2">打开用户端 <ChevronRight className="w-4 h-4" /></a></div></div>
            <div className="lg:hidden px-4 pb-4 overflow-x-auto flex gap-2">{menuItems.map((item) => <button key={item.id} onClick={() => setActiveTab(item.id)} className={classNames('shrink-0 px-3 py-2 rounded-2xl text-xs font-black border', activeTab === item.id ? 'bg-slate-950 text-white border-slate-950' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500')}>{item.label}</button>)}</div>
          </header>
          <section className="p-4 md:p-8 space-y-6">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6"><div className="premium-admin-hero relative overflow-hidden rounded-[36px] text-white p-6 md:p-8 shadow-[0_28px_80px_rgba(15,23,42,0.28)]"><div className="absolute -top-12 -right-8 w-44 h-44 rounded-full bg-pink-500/25 blur-3xl" /><div className="absolute -bottom-12 left-0 w-56 h-56 rounded-full bg-teal-400/18 blur-3xl" /><div className="relative grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-6 items-center"><div><div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/10 text-[11px] font-black tracking-[0.22em] uppercase text-white/80"><Sparkles className="w-3.5 h-3.5" /> Curatorial Command</div><h3 className="mt-4 text-3xl md:text-4xl font-black tracking-tight leading-tight text-white max-w-2xl">策展级服务端控制台</h3><p className="mt-4 text-base leading-8 text-white/88 max-w-2xl">用展览级视觉统一管理用户、签到、关系、作品、内容、议程与报告，让后台也像正式产品一样可信、清晰、可演示。</p><div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">{[['注册用户', allAttendees.length], ['签到率', fmtPercent((checkedInCount / Math.max(allAttendees.length, 1)) * 100)], ['作品总数', workCards.length], ['报告可生成', stats.reportReadyCount]].map(([label, value]) => <div key={label} className="rounded-2xl bg-white/10 border border-white/10 p-3"><div className="text-[11px] text-white/80 font-bold">{label}</div><div className="mt-1 text-2xl font-black text-white">{value}</div></div>)}</div></div><div className="rounded-[30px] bg-white/8 border border-white/10 p-4 md:p-5 backdrop-blur-sm"><div className="flex items-center justify-between mb-3"><div><div className="text-xs uppercase tracking-[0.18em] font-black text-white/60">Visual Board</div><div className="text-xl font-black text-white">活动封面与热度趋势</div></div><Activity className="w-5 h-5 text-pink-300" /></div><div className="rounded-[24px] overflow-hidden h-44 bg-slate-800 border border-white/10">{adminSettings.coverImage ? <img src={adminSettings.coverImage} alt="活动封面" className="w-full h-full object-cover" /> : workCards[0]?.imageUrl ? <img src={workCards[0].imageUrl} alt={workCards[0].title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-teal-400/30 flex items-center justify-center text-6xl">🎉</div>}</div><div className="mt-4"><SimpleAreaChart values={[58, 72, 66, 82, 77, 91, 86]} /></div></div></div></div><div className="space-y-4"><MiniMetric label="待审核提问" value={stats.pendingQuestions} helper="建议优先处理高热度问题" icon={Bell} accent="bg-gradient-to-br from-amber-400 to-orange-500" /><MiniMetric label="同频已连接" value={stats.confirmedConnections} helper="用于关系沉淀与通讯录" icon={HeartHandshake} accent="bg-gradient-to-br from-emerald-400 to-teal-500" /><MiniMetric label="平均资料完整度" value={fmtPercent(avgCompletion)} helper="个人报告与匹配质量核心指标" icon={Sparkles} accent="bg-gradient-to-br from-pink-500 to-violet-500" /></div></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4"><MiniMetric label="注册用户" value={allAttendees.length} helper="含当前用户与预置嘉宾" icon={Users} accent="bg-gradient-to-br from-pink-500 to-purple-500" /><MiniMetric label="已签到" value={checkedInCount} helper={`${fmtPercent((checkedInCount / Math.max(allAttendees.length, 1)) * 100)} 签到率`} icon={QrCode} accent="bg-gradient-to-br from-teal-400 to-cyan-500" /><MiniMetric label="设计作品" value={workCards.length} helper="用户上传 + 展品资料" icon={ImageIcon} accent="bg-gradient-to-br from-amber-400 to-orange-500" /><MiniMetric label="互动内容" value={questions.length + bulletMessages.length} helper={`${stats.approvedQuestions} 条内容已通过`} icon={MessageCircle} accent="bg-gradient-to-br from-indigo-500 to-violet-500" /></div>
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6"><SectionCard title="用户方向分布" subtitle="帮助主办方判断议程与内容结构是否平衡。" action={<BarChart3 className="w-5 h-5 text-pink-500" />}><div className="space-y-4">{distribution.map((item) => { const pct = (item.value / Math.max(allAttendees.length, 1)) * 100; return <div key={item.label}><div className="flex items-center justify-between text-sm mb-2"><span className="font-bold text-slate-700 dark:text-slate-200">{item.label}</span><span className="font-black text-slate-950 dark:text-white">{item.value} 人</span></div><div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-teal-400" style={{ width: `${Math.max(12, pct)}%` }} /></div></div>; })}</div></SectionCard><SectionCard title="会议关键词词云" subtitle="从用户标签、议程标签、作品标签和连接关系中提取热词。" action={<Sparkles className="w-5 h-5 text-teal-500" />}><WordCloudPanel items={meetingWordCloud} /></SectionCard></div>
              </>
            )}

            {activeTab === 'attendees' && (
              <div className="grid grid-cols-1 2xl:grid-cols-[1.05fr_0.95fr] gap-6"><SectionCard title="参会用户资料" subtitle="支持搜索、浏览与查看详细个人信息。" action={<div className="relative w-full md:w-[340px]"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索姓名 / 机构 / 方向" className="w-full pl-9 pr-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-700 dark:text-slate-100" /></div>}><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{filteredAttendees.map((person) => <button key={person.id} onClick={() => setSelectedUserId(person.id)} className={classNames('admin-user-card text-left border p-5 transition min-h-[220px] w-full', selectedUserId === person.id ? 'border-pink-300 dark:border-pink-500/30 bg-pink-50/70 dark:bg-slate-900 shadow-sm' : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-pink-200 dark:hover:border-pink-500/30 hover:shadow-md')}><div className="flex items-start gap-4"><Avatar person={person} size="lg" /><div className="flex-1 min-w-0"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="font-black text-2xl leading-none text-slate-950 dark:text-white truncate">{person.nickName}</div><div className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300 truncate">{person.organization}</div><div className="mt-1 text-sm text-slate-500 dark:text-slate-400 truncate">{person.title}</div></div><span className={classNames('admin-chip shrink-0', completionTone(person.personaCompletion))}>{person.personaCompletion}%</span></div><div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 line-clamp-2">{person.quote || person.industry}</div><div className="mt-4 flex flex-wrap items-center gap-2">{person.designDirections.slice(0, 2).map((tag) => <span key={tag} className="admin-chip bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{tag}</span>)}<span className={classNames('admin-chip ml-auto', person.checkedIn ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300')}>{person.checkedIn ? '已签到' : '未签到'}</span></div></div></div></button>)}</div></SectionCard><SectionCard title="用户详情" subtitle="查看头像、设计方向、作品、活动经历等更完整的信息。" action={<Eye className="w-5 h-5 text-pink-500" />}>{selectedUser ? <div className="space-y-5"><div className="rounded-[30px] border border-slate-200/80 dark:border-slate-800 p-5 bg-gradient-to-br from-pink-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"><div className="flex flex-col md:flex-row md:items-center gap-4"><Avatar person={selectedUser} size="lg" /><div className="flex-1 min-w-0"><div className="text-2xl font-black text-slate-950 dark:text-white">{selectedUser.nickName}</div><div className="mt-1 text-sm text-slate-500 dark:text-slate-300">{selectedUser.organization} · {selectedUser.title}</div><div className="mt-3 text-sm text-slate-600 dark:text-slate-200 leading-6">{selectedUser.quote || selectedUser.designArchetype || selectedUser.industry}</div></div><DonutChart value={selectedUser.personaCompletion} /></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950"><div className="text-sm font-black text-slate-950 dark:text-white">设计方向</div><div className="mt-3"><TagList tags={selectedUser.designDirections} /></div></div><div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950"><div className="text-sm font-black text-slate-950 dark:text-white">兴趣与目标</div><div className="mt-3"><TagList tags={[...selectedUser.interests.slice(0, 2), ...selectedUser.goals.slice(0, 2)]} /></div></div></div></div> : <div className="text-center py-16 text-slate-500 dark:text-slate-300"><Users className="w-10 h-10 mx-auto mb-3 opacity-60" />请选择左侧一个用户，查看更完整的设计信息与作品内容。</div>}</SectionCard></div>
            )}

            {activeTab === 'checkin' && <SectionCard title="签到管理" subtitle="查看签到状态，并支持现场手动核销。" action={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}><div className="grid grid-cols-1 xl:grid-cols-2 gap-4">{allAttendees.map((person) => <div key={person.id} className="rounded-[26px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center gap-4"><Avatar person={person} size="md" /><div className="flex-1 min-w-0"><div className="font-black text-slate-950 dark:text-white">{person.nickName}</div><div className="text-xs text-slate-500 dark:text-slate-300 truncate">{person.organization} · {person.title}</div><div className="mt-2 text-[11px] text-slate-500 dark:text-slate-300">{person.checkedIn ? `签到时间 ${person.checkedInAt || '已记录'}` : '尚未签到'}</div></div><button onClick={() => toggleCheckin(person)} className={classNames('px-3 py-2 rounded-2xl text-xs font-black shrink-0', person.checkedIn ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950')}>{person.checkedIn ? '取消签到' : '手动签到'}</button></div>)}</div></SectionCard>}

            {activeTab === 'network' && <SectionCard title="好友通讯录与关系详情" subtitle="可查看共同标签，并进行确认或拒绝。" action={<HeartHandshake className="w-5 h-5 text-pink-500" />}><div className="space-y-4">{connections.map((connection) => { const from = getAttendeeById(connection.fromUserId, allAttendees); const to = getAttendeeById(connection.toUserId, allAttendees); return <div key={connection.id} className="rounded-[26px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"><div className="flex flex-col md:flex-row md:items-center gap-4"><div className="flex items-center gap-3 flex-1 min-w-0">{from && <Avatar person={from} size="sm" />}<ChevronRight className="w-4 h-4 text-slate-300" />{to && <Avatar person={to} size="sm" />}<div className="min-w-0"><div className="font-black text-slate-950 dark:text-white truncate">{from?.nickName || connection.fromUserId} → {to?.nickName || connection.toUserId}</div><div className="text-xs text-slate-500 dark:text-slate-300">创建时间 {connection.createdAt}</div></div></div><span className={classNames('px-2.5 py-1 rounded-full text-[11px] font-black shrink-0', statusTone(connection.status))}>{connection.status === 'confirmed' ? '已连接' : connection.status === 'pending' ? '待确认' : '已拒绝'}</span></div><div className="mt-3"><TagList tags={connection.matchedTags.length ? connection.matchedTags : commonTags(from || allAttendees[0], to || allAttendees[1] || allAttendees[0])} /></div><div className="mt-4 flex gap-2"><button onClick={() => updateConnectionStatus(connection.id, 'confirmed')} className="px-3 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-xs font-black">确认连接</button><button onClick={() => updateConnectionStatus(connection.id, 'declined')} className="px-3 py-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-300 text-xs font-black">拒绝</button></div></div>; })}</div></SectionCard>}

            {activeTab === 'portfolio' && <SectionCard title="作品资料与图像墙" subtitle="统一查看用户作品与展品图片。" action={<ImageIcon className="w-5 h-5 text-amber-500" />}><div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">{workCards.map((work) => <div key={work.id} className="rounded-[28px] overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"><div className="h-48 bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 dark:from-slate-800 dark:to-slate-900">{work.imageUrl ? <img src={work.imageUrl} alt={work.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl">🎨</div>}</div><div className="p-4"><div className="font-black text-slate-950 dark:text-white line-clamp-1">{work.title}</div><div className="mt-1 text-xs text-slate-500 dark:text-slate-300">{work.owner} · {work.role || '设计作品'}</div><div className="mt-3 text-sm text-slate-600 dark:text-slate-200 line-clamp-3">{work.description}</div></div></div>)}</div></SectionCard>}

            {activeTab === 'content' && <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.9fr] gap-6"><SectionCard title="提问审核" subtitle="通过或隐藏现场提问，状态会立即更新。" action={<Bell className="w-5 h-5 text-amber-500" />}><div className="space-y-4">{questions.map((item) => <div key={item.id} className="rounded-[26px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"><div className="flex items-start gap-3"><div className={classNames('w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0', item.userAvatarColor)}>{item.userAvatarEmoji}</div><div className="flex-1 min-w-0"><div className="flex items-center justify-between gap-2"><div><div className="font-black text-slate-950 dark:text-white">{item.userNick}</div><div className="text-xs text-slate-500 dark:text-slate-300">{item.createdAt} · {item.upvotes} 赞同</div></div><span className={classNames('px-2.5 py-1 rounded-full text-[11px] font-black', questionStatusTone(item.status))}>{item.status === 'approved' ? '已通过' : item.status === 'pending' ? '待审核' : '已隐藏'}</span></div><div className="mt-3 text-sm text-slate-600 dark:text-slate-200 leading-6">{item.content}</div><div className="mt-4 flex gap-2"><button onClick={() => updateQuestionStatus(item.id, 'approved')} className="px-3 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-xs font-black">通过</button><button onClick={() => updateQuestionStatus(item.id, 'hidden')} className="px-3 py-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black">隐藏</button></div></div></div></div>)}</div></SectionCard><SectionCard title="弹幕与现场互动" subtitle="实时内容流展示。" action={<Zap className="w-5 h-5 text-teal-500" />}><div className="space-y-3">{recentBullets.map((item) => <div key={item.id} className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-4 bg-gradient-to-r from-pink-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"><div className="flex items-center gap-3"><div className={classNames('w-9 h-9 rounded-2xl flex items-center justify-center text-white shrink-0', item.userAvatarColor)}>{item.userAvatarEmoji}</div><div className="flex-1"><div className="font-black text-slate-950 dark:text-white">{item.userNick}</div><div className="text-xs text-slate-500 dark:text-slate-300">{item.createdAt}</div></div><CircleDot className="w-4 h-4 text-emerald-500" /></div><div className="mt-2 text-sm text-slate-600 dark:text-slate-200">{item.content}</div></div>)}</div></SectionCard></div>}

            {activeTab === 'schedule' && <SectionCard title="议程管理" subtitle="直播状态和推荐状态都可以点击切换。" action={<CalendarDays className="w-5 h-5 text-violet-500" />}><div className="grid grid-cols-1 xl:grid-cols-2 gap-4">{sessions.map((session) => <div key={session.id} className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"><div className="p-5 bg-gradient-to-r from-pink-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"><div className="flex items-start justify-between gap-3"><div><div className="text-xs font-bold text-slate-500 dark:text-slate-300">{session.timeStr} · {session.location}</div><div className="mt-1 text-lg font-black text-slate-950 dark:text-white leading-snug">{session.title}</div></div><span className={classNames('px-2.5 py-1 rounded-full text-[11px] font-black', session.isLive ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300')}>{session.isLive ? '直播中' : '待开始'}</span></div></div><div className="p-5"><div className="flex items-center gap-3"><div className={classNames('w-12 h-12 rounded-2xl flex items-center justify-center text-white', session.speakerAvatarColor)}>{session.speakerAvatarEmoji}</div><div><div className="font-black text-slate-950 dark:text-white">{session.speakerName}</div><div className="text-xs text-slate-500 dark:text-slate-300">{session.speakerTitle}</div></div></div><div className="mt-4"><TagList tags={session.tags.slice(0, 4)} /></div><div className="mt-4 flex gap-2"><button onClick={() => toggleSessionLive(session.id)} className="px-3 py-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-300 text-xs font-black">{session.isLive ? '结束直播' : '设为直播'}</button><button onClick={() => toggleSessionSubscribe(session.id)} className="px-3 py-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black">{session.isSubscribed ? '取消推荐' : '设为推荐'}</button></div></div></div>)}</div></SectionCard>}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <SectionCard
                  title="会议总报告"
                  subtitle="包含核心指标、热度趋势、关键词词云、签到结构、议题排行、活跃用户、情绪分布和作品方向摘要。"
                  action={<div className="flex flex-wrap items-center gap-2"><button onClick={exportAdminSnapshot} className="px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black flex items-center gap-2"><Download className="w-4 h-4" />导出报告数据</button><BarChart3 className="w-5 h-5 text-violet-500" /></div>}
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      <MiniMetric label="会议参与人数" value={allAttendees.length} helper="当前注册 / 导入总人数 · 较昨日 ↑20%" icon={Users} accent="bg-gradient-to-br from-pink-500 to-purple-500" />
                      <MiniMetric label="会议签到率" value={fmtPercent((checkedInCount / Math.max(allAttendees.length, 1)) * 100)} helper="现场签到完成情况 · 较昨日 ↑8.3%" icon={QrCode} accent="bg-gradient-to-br from-teal-400 to-cyan-500" />
                      <MiniMetric label="互动总量" value={questions.length + bulletMessages.length + connections.length} helper="提问 + 弹幕 + 同频连接 · ↑32%" icon={MessageCircle} accent="bg-gradient-to-br from-violet-500 to-indigo-500" />
                      <MiniMetric label="作品浏览样本" value={workCards.length} helper="报告可引用图片模块 · ↑50%" icon={ImageIcon} accent="bg-gradient-to-br from-amber-400 to-orange-500" />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[1.12fr_0.88fr] gap-6">
                      <MeetingTrendChart />
                      <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-lg font-black text-slate-950 dark:text-white">会议关键词词云</h4>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">从用户标签、议程主题、作品方向与同频关系中提取热词。</p>
                          </div>
                          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-black text-violet-600 dark:text-violet-300">更多</span>
                        </div>
                        <div className="mt-5 rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 min-h-[270px]"><WordCloudPanel items={meetingWordCloud} /></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-6 gap-4">
                      <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 2xl:col-span-2">
                        <div className="flex items-center justify-between"><h4 className="text-lg font-black text-slate-950 dark:text-white">签到结构</h4><span className="text-xs font-bold text-emerald-600 dark:text-emerald-300">较昨日 ↑8.3%</span></div>
                        <div className="mt-5 flex items-center gap-5"><ReportDonut value={Math.round((checkedInCount / Math.max(allAttendees.length, 1)) * 100)} label="已签到" /><div className="flex-1 space-y-3"><ReportMiniBar label={`已签到 (${checkedInCount})`} value={Math.round((checkedInCount / Math.max(allAttendees.length, 1)) * 100)} color="#14b8a6" /><ReportMiniBar label={`未签到 (${Math.max(0, allAttendees.length - checkedInCount)})`} value={Math.round(((allAttendees.length - checkedInCount) / Math.max(allAttendees.length, 1)) * 100)} color="#8b5cf6" /><ReportMiniBar label="待审核" value={0} color="#f59e0b" /></div></div>
                      </div>

                      <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 2xl:col-span-2">
                        <div className="flex items-center justify-between"><h4 className="text-lg font-black text-slate-950 dark:text-white">参会角色占比</h4><span className="text-xs font-bold text-slate-500 dark:text-slate-300">共 {allAttendees.length} 人</span></div>
                        <div className="mt-5 space-y-4"><ReportMiniBar label="观众" value={50} color="#8b5cf6" /><ReportMiniBar label="嘉宾" value={33} color="#0ea5e9" /><ReportMiniBar label="主办方" value={17} color="#ec4899" /></div>
                      </div>

                      <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 2xl:col-span-2">
                        <div className="flex items-center justify-between"><h4 className="text-lg font-black text-slate-950 dark:text-white">高频议题排行</h4><span className="text-xs font-bold text-slate-500 dark:text-slate-300">TOP 5</span></div>
                        <div className="mt-4 space-y-3">{meetingWordCloud.slice(0, 5).map((item, index) => <div key={item.label} className="flex items-center gap-3"><span className={classNames('flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white', index === 0 ? 'bg-rose-500' : index === 1 ? 'bg-orange-500' : index === 2 ? 'bg-amber-500' : index === 3 ? 'bg-sky-500' : 'bg-violet-500')}>{index + 1}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3 text-sm"><span className="truncate font-bold text-slate-700 dark:text-slate-200">{item.label}</span><span className="font-black text-slate-950 dark:text-white">{item.value * 4 + 8}</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-teal-400" style={{ width: `${Math.max(18, Math.min(100, item.value * 18))}%` }} /></div></div></div>)}</div>
                      </div>

                      <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 2xl:col-span-2">
                        <div className="flex items-center justify-between"><h4 className="text-lg font-black text-slate-950 dark:text-white">活跃嘉宾 / 用户</h4><span className="text-xs font-bold text-violet-600 dark:text-violet-300">更多</span></div>
                        <div className="mt-4 space-y-3">{allAttendees.slice(0, 5).map((person, index) => <button key={person.id} onClick={() => { setSelectedUserId(person.id); setActiveTab('attendees'); }} className="w-full rounded-[20px] border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-left flex items-center gap-3"><Avatar person={person} size="sm" /><div className="min-w-0 flex-1"><div className="truncate text-sm font-black text-slate-950 dark:text-white">{person.nickName}</div><div className="text-xs text-slate-500 dark:text-slate-300">互动 {18 - index * 2}</div></div><ChevronRight className="w-4 h-4 text-slate-400" /></button>)}</div>
                      </div>

                      <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 2xl:col-span-2">
                        <div className="flex items-center justify-between"><h4 className="text-lg font-black text-slate-950 dark:text-white">互动情绪分布</h4><span className="text-xs font-bold text-slate-500 dark:text-slate-300">基于弹幕与提问</span></div>
                        <div className="mt-5 space-y-4"><ReportMiniBar label="积极 😊" value={68} color="#22c55e" /><ReportMiniBar label="中性 😐" value={22} color="#facc15" /><ReportMiniBar label="疑问 🤔" value={7} color="#8b5cf6" /><ReportMiniBar label="负面 😡" value={3} color="#ef4444" /></div>
                      </div>

                      <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 2xl:col-span-2">
                        <div className="flex items-center justify-between"><h4 className="text-lg font-black text-slate-950 dark:text-white">作品方向分布</h4><span className="text-xs font-bold text-slate-500 dark:text-slate-300">浏览样本统计</span></div>
                        <div className="mt-5 space-y-4"><ReportMiniBar label="交互装置" value={40} color="#8b5cf6" /><ReportMiniBar label="数字影像" value={28} color="#ec4899" /><ReportMiniBar label="空间艺术" value={16} color="#14b8a6" /><ReportMiniBar label="声音艺术" value={10} color="#0ea5e9" /><ReportMiniBar label="其他" value={6} color="#f59e0b" /></div>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="rounded-[34px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"><div className="p-6 md:p-7 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 text-white relative overflow-hidden"><div className="absolute -top-16 right-8 w-56 h-56 rounded-full bg-pink-500/20 blur-3xl" /><div className="absolute -bottom-20 left-10 w-64 h-64 rounded-full bg-teal-400/15 blur-3xl" /><div className="relative flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6"><div><div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/10 border border-white/10 text-[11px] font-black tracking-[0.18em] uppercase text-white/80"><Settings className="w-3.5 h-3.5" /> Interactive Admin Settings</div><h3 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-white">系统设置</h3><p className="mt-3 max-w-2xl text-sm md:text-base leading-7 text-white/86">输入框可编辑、开关可切换、角色人数可增减、素材可上传、报告模块可配置，并会保存到浏览器本地。</p></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-w-full xl:min-w-[560px]">{[['注册状态', adminSettings.openRegistration ? 'Open' : 'Closed'], ['后台路径', '/admin'], ['报告导出', adminSettings.exportFormat], ['部署环境', adminSettings.integrations.vercelHosting ? 'Vercel' : 'Offline']].map(([label, value]) => <div key={label} className="rounded-2xl bg-white/10 border border-white/10 p-3"><div className="text-[11px] font-bold text-white/70">{label}</div><div className="mt-1 text-lg font-black text-white truncate">{value}</div></div>)}</div></div></div></div>
                <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6"><SectionCard title="活动基础配置" subtitle="这些字段现在可以直接编辑。" action={<CalendarDays className="w-5 h-5 text-pink-500" />}><div className="space-y-5"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><label className="space-y-2"><span className="text-xs font-black text-slate-500 dark:text-slate-300">活动名称</span><input value={adminSettings.eventName} onChange={(e) => patchAdminSettings({ eventName: e.target.value }, '活动名称已更新')} className="w-full px-4 py-2.5 text-sm" /></label><label className="space-y-2"><span className="text-xs font-black text-slate-500 dark:text-slate-300">活动日期</span><input type="date" value={adminSettings.eventDate} onChange={(e) => patchAdminSettings({ eventDate: e.target.value }, '活动日期已更新')} className="w-full px-4 py-2.5 text-sm" /></label><label className="space-y-2"><span className="text-xs font-black text-slate-500 dark:text-slate-300">场馆</span><input value={adminSettings.venue} onChange={(e) => patchAdminSettings({ venue: e.target.value }, '场馆已更新')} className="w-full px-4 py-2.5 text-sm" /></label><label className="space-y-2"><span className="text-xs font-black text-slate-500 dark:text-slate-300">用户端域名</span><input value={adminSettings.userDomain} onChange={(e) => patchAdminSettings({ userDomain: e.target.value }, '用户端域名已更新')} className="w-full px-4 py-2.5 text-sm" /></label></div><div className="grid grid-cols-1 md:grid-cols-3 gap-3"><SettingRow title="开放注册" desc="允许用户进入注册流程" checked={adminSettings.openRegistration} onToggle={() => patchAdminSettings({ openRegistration: !adminSettings.openRegistration }, '注册开关已更新')} /><SettingRow title="现场签到" desc="开启二维码核销入口" checked={adminSettings.enableCheckin} onToggle={() => patchAdminSettings({ enableCheckin: !adminSettings.enableCheckin }, '签到入口已更新')} /><SettingRow title="报告生成" desc="允许用户导出个人报告" checked={adminSettings.enableReports} onToggle={() => patchAdminSettings({ enableReports: !adminSettings.enableReports }, '报告生成开关已更新')} /></div></div></SectionCard><SectionCard title="品牌与视觉系统" subtitle="Logo、主题色和图片素材都可以真实修改。" action={<Sparkles className="w-5 h-5 text-violet-500" />}><div className="space-y-5"><div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-pink-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-5"><div className="flex items-center gap-4"><div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-pink-500 via-purple-500 to-teal-400 flex items-center justify-center text-white text-2xl font-black shadow-lg">{adminSettings.logoLabel || 'ME'}</div><div className="flex-1 min-w-0"><div className="font-black text-slate-950 dark:text-white">欢迎ME 品牌资产</div><div className="mt-2 flex items-center gap-3"><input value={adminSettings.logoLabel} onChange={(e) => patchAdminSettings({ logoLabel: e.target.value.slice(0, 4).toUpperCase() }, 'Logo 文案已更新')} className="w-32 px-3 py-2 text-sm" /><span className="text-xs text-slate-500 dark:text-slate-300">最多 4 个字符</span></div></div></div></div><div><div className="text-xs font-black text-slate-500 dark:text-slate-300 mb-3">主题色</div><div className="grid grid-cols-5 gap-3">{adminSettings.themeColors.map((color, index) => <label key={`${color}-${index}`} className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 cursor-pointer"><input type="color" value={color} onChange={(e) => saveAdminSettings((prev) => { const nextColors = [...prev.themeColors]; nextColors[index] = e.target.value; return { ...prev, themeColors: nextColors }; }, '主题色已更新')} className="sr-only" /><div className="h-12 rounded-xl shadow-inner" style={{ backgroundColor: color }} /><div className="mt-2 text-[10px] font-bold text-center text-slate-500 dark:text-slate-300">{color}</div></label>)}</div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><label className="rounded-[24px] border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-5 text-center cursor-pointer hover:border-pink-300 transition">{adminSettings.coverImage ? <img src={adminSettings.coverImage} alt="活动封面图" className="h-24 w-full object-cover rounded-2xl mb-3" /> : <ImageIcon className="w-6 h-6 mx-auto text-pink-500" />}<div className="mt-2 text-sm font-black text-slate-950 dark:text-white">活动封面图</div><div className="mt-1 text-xs text-slate-500 dark:text-slate-300">点击上传 PNG / JPG</div><input type="file" accept="image/*" onChange={handleAssetUpload('coverImage')} className="hidden" /></label><label className="rounded-[24px] border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-5 text-center cursor-pointer hover:border-pink-300 transition">{adminSettings.reportBgImage ? <img src={adminSettings.reportBgImage} alt="报告长图背景" className="h-24 w-full object-cover rounded-2xl mb-3" /> : <ImageIcon className="w-6 h-6 mx-auto text-pink-500" />}<div className="mt-2 text-sm font-black text-slate-950 dark:text-white">报告长图背景</div><div className="mt-1 text-xs text-slate-500 dark:text-slate-300">点击上传 PNG / JPG</div><input type="file" accept="image/*" onChange={handleAssetUpload('reportBgImage')} className="hidden" /></label></div></div></SectionCard></div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6"><SectionCard title="报名与用户资料" subtitle="控制用户端注册流程、资料采集和可跳过项。" action={<Users className="w-5 h-5 text-teal-500" />}><div className="space-y-3"><SettingRow title="头像上传" desc="允许用户上传个人头像" checked={adminSettings.allowAvatar} onToggle={() => patchAdminSettings({ allowAvatar: !adminSettings.allowAvatar }, '头像上传设置已更新')} /><SettingRow title="作品资料" desc="注册时可上传设计作品，可跳过" checked={adminSettings.allowWorks} onToggle={() => patchAdminSettings({ allowWorks: !adminSettings.allowWorks }, '作品资料设置已更新')} /><SettingRow title="活动经历" desc="采集设计活动经历，可跳过" checked={adminSettings.allowEvents} onToggle={() => patchAdminSettings({ allowEvents: !adminSettings.allowEvents }, '活动经历设置已更新')} /><SettingRow title="手机号验证" desc="演示版可切换模拟验证状态" checked={adminSettings.phoneVerification} onToggle={() => patchAdminSettings({ phoneVerification: !adminSettings.phoneVerification }, '手机号验证设置已更新')} /></div></SectionCard><SectionCard title="权限与角色" subtitle="角色人数现在可以增减。" action={<ShieldCheck className="w-5 h-5 text-emerald-500" />}><div className="space-y-3"><RoleCounter label="超级管理员" desc="全部权限" value={adminSettings.roles.superAdmin} onChange={(value) => updateRoleCount('superAdmin', value)} /><RoleCounter label="内容审核员" desc="提问、弹幕、作品审核" value={adminSettings.roles.contentReviewer} onChange={(value) => updateRoleCount('contentReviewer', value)} /><RoleCounter label="现场工作人员" desc="签到核销、用户查询" value={adminSettings.roles.fieldStaff} onChange={(value) => updateRoleCount('fieldStaff', value)} /><RoleCounter label="报告查看者" desc="只读查看报告中心" value={adminSettings.roles.reportViewer} onChange={(value) => updateRoleCount('reportViewer', value)} /></div></SectionCard><SectionCard title="通知与自动化" subtitle="配置关键运营事件的提醒方式。" action={<Bell className="w-5 h-5 text-amber-500" />}><div className="space-y-3"><SettingRow title="新用户注册" desc="站内通知 + 邮件摘要" checked={adminSettings.notifications.newUser} onToggle={() => saveAdminSettings((prev) => ({ ...prev, notifications: { ...prev.notifications, newUser: !prev.notifications.newUser } }), '通知设置已更新')} /><SettingRow title="待审核提问" desc="实时提醒内容审核员" checked={adminSettings.notifications.pendingQuestion} onToggle={() => saveAdminSettings((prev) => ({ ...prev, notifications: { ...prev.notifications, pendingQuestion: !prev.notifications.pendingQuestion } }), '通知设置已更新')} /><SettingRow title="签到异常" desc="提醒现场工作人员" checked={adminSettings.notifications.abnormalCheckin} onToggle={() => saveAdminSettings((prev) => ({ ...prev, notifications: { ...prev.notifications, abnormalCheckin: !prev.notifications.abnormalCheckin } }), '通知设置已更新')} /><SettingRow title="报告生成完成" desc="通知用户与主办方" checked={adminSettings.notifications.reportDone} onToggle={() => saveAdminSettings((prev) => ({ ...prev, notifications: { ...prev.notifications, reportDone: !prev.notifications.reportDone } }), '通知设置已更新')} /></div></SectionCard></div>
                <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6"><SectionCard title="数据与第三方集成" subtitle="连接状态现在可以切换。" action={<Zap className="w-5 h-5 text-violet-500" />}><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[['supabaseDb', 'Supabase Database', '用户、报名、签到、关系数据'], ['supabaseStorage', 'Supabase Storage', '头像、作品、报告图片存储'], ['geminiApi', 'Gemini API', '报告摘要与内容生成'], ['vercelHosting', 'Vercel Hosting', '前台与后台网页部署']].map(([key, name, desc]) => { const active = adminSettings.integrations[key as keyof AdminSettingsState['integrations']]; return <div key={key} className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"><div className="flex items-start justify-between gap-3"><div><div className="font-black text-slate-950 dark:text-white">{name}</div><div className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">{desc}</div></div><ToggleSwitch checked={active} onChange={() => saveAdminSettings((prev) => ({ ...prev, integrations: { ...prev.integrations, [key]: !active } }), '集成状态已更新')} label={String(name)} /></div><div className="mt-4"><span className={classNames('px-2.5 py-1 rounded-full text-[11px] font-black', active ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-amber-500/10 text-amber-600 dark:text-amber-300')}>{active ? '运行中' : '待接入'}</span></div></div>; })}</div></SectionCard><SectionCard title="报告导出配置" subtitle="选择报告模块与导出格式。" action={<FileText className="w-5 h-5 text-pink-500" />}><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[['个人报告', 'personalReportModules', ['头像与身份信息', '设计方向标签', '作品图像模块', '成长曲线图', 'PNG 导出']], ['会议总报告', 'meetingReportModules', ['签到率与活跃趋势', '会议关键词词云', '议程热度排行', '用户结构分布', '图片摘要模块']]].map(([title, key, items]) => <div key={String(title)} className="rounded-[26px] border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5"><div className="text-lg font-black text-slate-950 dark:text-white">{title}</div><div className="mt-4 space-y-3">{(items as string[]).map((item) => { const listKey = key as 'personalReportModules' | 'meetingReportModules'; const checked = adminSettings[listKey].includes(item); return <button key={item} type="button" onClick={() => toggleListItem(listKey, item)} className="w-full flex items-center gap-2 text-left text-sm text-slate-600 dark:text-slate-200"><CheckCircle2 className={classNames('w-4 h-4 shrink-0', checked ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600')} /><span className={checked ? 'font-bold' : 'opacity-60'}>{item}</span></button>; })}</div></div>)}</div><div className="mt-5 flex flex-wrap items-center gap-3"><span className="text-sm font-black text-slate-500 dark:text-slate-300">导出格式</span>{(['PNG', 'PDF', 'Both'] as const).map((format) => <button key={format} type="button" onClick={() => patchAdminSettings({ exportFormat: format }, '导出格式已更新')} className={classNames('px-4 py-2 rounded-2xl text-xs font-black border', adminSettings.exportFormat === format ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 border-slate-200 dark:border-slate-800')}>{format}</button>)}</div></SectionCard></div>
                <SectionCard title="高级设置与安全区" subtitle="危险操作单独收纳，避免误操作。" action={<Lock className="w-5 h-5 text-rose-500" />}><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="rounded-[26px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"><div className="font-black text-slate-950 dark:text-white">导出运营快照</div><div className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">下载当前前端模拟数据。</div><button onClick={exportAdminSnapshot} className="mt-4 px-4 py-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black">导出 JSON</button></div><div className="rounded-[26px] border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/10 p-5"><div className="font-black text-rose-700 dark:text-rose-300">重置演示数据</div><div className="mt-2 text-sm leading-6 text-rose-600/80 dark:text-rose-200/80">清空本机浏览器缓存。</div><button onClick={resetLocalDemoData} className="mt-4 px-4 py-2 rounded-2xl bg-rose-600 text-white text-xs font-black">重置数据</button></div><div className="rounded-[26px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"><div className="font-black text-slate-950 dark:text-white">管理员访问控制</div><div className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">演示级开关，后续可接入真实登录。</div><div className="mt-4 flex items-center justify-between gap-3"><span className="text-xs font-black text-slate-500 dark:text-slate-300">要求管理员登录</span><ToggleSwitch checked={adminSettings.requireAdminLogin} onChange={() => patchAdminSettings({ requireAdminLogin: !adminSettings.requireAdminLogin }, '管理员登录开关已更新')} /></div><div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs font-black text-slate-500 dark:text-slate-300">报告水印</span><ToggleSwitch checked={adminSettings.watermarkReports} onChange={() => patchAdminSettings({ watermarkReports: !adminSettings.watermarkReports }, '报告水印设置已更新')} /></div></div></div><div className="mt-5 flex flex-wrap gap-3"><button onClick={() => { exportJSON(`welcome-me-admin-settings-${Date.now()}.json`, adminSettings); flashAdminNotice('系统设置已导出'); }} className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 text-xs font-black">导出系统设置</button><button onClick={() => { persistAdminSettings(DEFAULT_ADMIN_SETTINGS); setAdminSettings(DEFAULT_ADMIN_SETTINGS); flashAdminNotice('系统设置已恢复默认'); }} className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 text-xs font-black">恢复默认设置</button></div></SectionCard>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
