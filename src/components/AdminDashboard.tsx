/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
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
  TrendingUp,
  Users,
  Wand2,
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

const menuItems: { id: AdminTab; label: string; desc: string; icon: React.ElementType }[] = [
  { id: 'overview', label: '总览', desc: '核心数据与可视化大盘', icon: LayoutDashboard },
  { id: 'attendees', label: '参会用户', desc: '用户资料与详情查看', icon: Users },
  { id: 'checkin', label: '签到管理', desc: '签到状态与现场核销', icon: QrCode },
  { id: 'network', label: '同频关系', desc: '关系链路与通讯录', icon: HeartHandshake },
  { id: 'portfolio', label: '作品资料', desc: '设计作品与图像墙', icon: ImageIcon },
  { id: 'content', label: '互动内容', desc: '提问、弹幕、审核', icon: MessageCircle },
  { id: 'schedule', label: '议程管理', desc: '议程排期与直播状态', icon: CalendarDays },
  { id: 'reports', label: '报告中心', desc: '个人报告与导出', icon: FileText },
  { id: 'settings', label: '系统设置', desc: '品牌与后台配置', icon: Settings }
];

function classNames(...values: (string | false | null | undefined)[]) {
  return values.filter(Boolean).join(' ');
}

function fmtPercent(v: number) {
  return `${Math.round(v)}%`;
}

function getAttendeeNameById(id: string, people: Attendee[]) {
  return people.find((item) => item.id === id)?.nickName || id;
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

function statusText(status: Connection['status']) {
  if (status === 'confirmed') return '已连接';
  if (status === 'pending') return '待确认';
  return '已拒绝';
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
  const map = {
    sm: 'w-10 h-10 text-base rounded-2xl',
    md: 'w-12 h-12 text-lg rounded-[18px]',
    lg: 'w-16 h-16 text-2xl rounded-[22px]'
  };
  return person.avatarImage ? (
    <img src={person.avatarImage} alt={person.nickName} className={classNames(map[size], 'object-cover border border-white/60 dark:border-slate-800 shadow-sm')} />
  ) : (
    <div className={classNames(map[size], person.avatarColor, 'text-white flex items-center justify-center shadow-sm shrink-0')}>
      {person.avatarEmoji}
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold">
          {tag}
        </span>
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
          <Icon className="w-4.5 h-4.5" />
        </div>
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
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      {[20, 40, 60, 80].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(148,163,184,0.18)" strokeWidth="1" strokeDasharray="2 3" />
      ))}
      <polygon points={area} fill="url(#areaFill)" />
      <polyline points={points} fill="none" stroke="url(#lineStroke)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => {
        const cx = (i / Math.max(values.length - 1, 1)) * 100;
        const cy = 100 - (v / max) * 82;
        return <circle key={i} cx={cx} cy={cy} r="2.2" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" />;
      })}
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
        <circle cx="50" cy="50" r="42" stroke="rgba(148,163,184,0.16)" strokeWidth="9" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="url(#donutGradient)"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
        <defs>
          <linearGradient id="donutGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="55%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-black text-slate-950 dark:text-white">{clamped}%</div>
        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">资料完整度</div>
      </div>
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

  const allAttendees = useMemo(() => [myProfile, ...attendees], [myProfile, attendees]);
  const selectedUser = selectedUserId ? allAttendees.find((item) => item.id === selectedUserId) || null : null;

  const checkedInCount = allAttendees.filter((person) => person.checkedIn).length;
  const avgCompletion = Math.round(allAttendees.reduce((sum, person) => sum + person.personaCompletion, 0) / Math.max(allAttendees.length, 1));
  const workCards = useMemo(() => {
    const userWorks = allAttendees.flatMap((person) => (person.designWorks || []).map((work) => ({ ...work, owner: person.nickName, ownerId: person.id })));
    if (userWorks.length) return userWorks;
    return exhibits.slice(0, 8).map((exhibit) => ({
      id: exhibit.id,
      title: exhibit.name,
      description: exhibit.description,
      imageUrl: exhibit.imageUrl,
      role: exhibit.zone,
      year: '2026',
      owner: exhibit.artist,
      ownerId: allAttendees[0]?.id || 'me'
    }));
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
    allAttendees.forEach((person) => {
      person.designDirections.forEach((tag) => map.set(tag, (map.get(tag) || 0) + 1));
    });
    return Array.from(map.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [allAttendees]);

  const phaseValues = [58, 72, 66, 82, 77, 91, 86];
  const recentQuestions = questions.slice(0, 3);
  const recentBullets = bulletMessages.slice(0, 4);
  const topSessions = [...sessions].sort((a, b) => b.likesCount - a.likesCount);
  const activeExhibits = exhibits.slice(0, 4);

  const updateAttendee = (id: string, patch: Partial<Attendee>) => {
    if (id === myProfile.id) {
      setMyProfile((prev) => ({ ...prev, ...patch }));
    } else {
      setAttendees((prev) => prev.map((person) => (person.id === id ? { ...person, ...patch } : person)));
    }
  };

  const toggleCheckin = (person: Attendee) => {
    updateAttendee(person.id, {
      checkedIn: !person.checkedIn,
      checkedInAt: !person.checkedIn ? new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }) : undefined
    });
  };

  const updateConnectionStatus = (id: string, status: Connection['status']) => {
    setConnections((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const updateQuestionStatus = (id: string, status: Question['status']) => {
    setQuestions((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const exportAdminSnapshot = () => {
    const snapshot = {
      generatedAt: new Date().toISOString(),
      summary: {
        users: allAttendees.length,
        checkedIn: checkedInCount,
        reportsReady: stats.reportReadyCount,
        works: workCards.length
      },
      attendees: allAttendees,
      sessions,
      questions,
      connections,
      exhibits
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `welcome-me-admin-snapshot-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl sticky top-0 h-screen">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-teal-400 flex items-center justify-center text-white font-black shadow-lg">ME</div>
              <div>
                <div className="text-lg font-black tracking-tight text-slate-950 dark:text-white">欢迎ME 服务后台</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Organizer Console</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={classNames(
                    'w-full text-left rounded-[22px] border transition px-3 py-3 flex items-center gap-3',
                    active
                      ? 'border-pink-200 dark:border-pink-500/20 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-teal-500/10 shadow-sm'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-900'
                  )}
                >
                  <div className={classNames('w-10 h-10 rounded-2xl flex items-center justify-center shrink-0', active ? 'bg-white dark:bg-slate-900 text-pink-600 shadow-sm' : 'bg-slate-100 dark:bg-slate-900 text-slate-500')}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-black text-slate-900 dark:text-white">{item.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <button onClick={exportAdminSnapshot} className="w-full px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> 导出运营快照
            </button>
            <a href="/" className="block text-center text-xs font-bold text-slate-500 hover:text-pink-600">返回用户端</a>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 bg-[#f6f7fb]/88 dark:bg-slate-950/88 backdrop-blur-xl border-b border-slate-200/75 dark:border-slate-800">
            <div className="px-4 md:px-8 py-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-black text-slate-400 dark:text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                  admin workspace / {menuItems.find((item) => item.id === activeTab)?.label}
                </div>
                <h2 className="mt-1 text-2xl md:text-3xl font-black tracking-tight text-slate-950 dark:text-white">{menuItems.find((item) => item.id === activeTab)?.label}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">用更接近产品化后台的方式管理用户、内容、作品、报告与活动。</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <CircleDot className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Live Ready
                </div>
                <button
                  onClick={() => setIsDarkMode((prev) => !prev)}
                  className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDarkMode ? '浅色模式' : '夜间模式'}
                </button>
                <a href="/" className="px-3 py-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black flex items-center gap-2">
                  打开用户端 <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="lg:hidden px-4 pb-4 overflow-x-auto flex gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={classNames('shrink-0 px-3 py-2 rounded-2xl text-xs font-black border', activeTab === item.id ? 'bg-slate-950 text-white border-slate-950' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500')}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </header>

          <section className="p-4 md:p-8 space-y-6">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
                  <div className="relative overflow-hidden rounded-[34px] border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 md:p-7 shadow-xl">
                    <div className="absolute -top-12 -right-8 w-44 h-44 rounded-full bg-pink-500/25 blur-3xl" />
                    <div className="absolute -bottom-12 left-0 w-56 h-56 rounded-full bg-teal-400/18 blur-3xl" />
                    <div className="relative grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-6 items-center">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/10 text-[11px] font-black tracking-[0.22em] uppercase text-white/80">
                          <Sparkles className="w-3.5 h-3.5" /> 现场总控面板
                        </div>
                        <h3 className="mt-4 text-3xl md:text-4xl font-black tracking-tight leading-tight">让后台也像一个成熟产品，而不是 Demo 页面</h3>
                        <p className="mt-3 text-sm leading-7 text-white/70 max-w-xl">这一版强化了服务端视觉层次：加入数据可视化、图像模块、作品墙、用户资料卡与运营状态卡，让主办方网页和前台小程序在风格上保持统一。</p>
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                            <div className="text-[11px] text-white/60 font-bold">注册用户</div>
                            <div className="mt-1 text-2xl font-black">{allAttendees.length}</div>
                          </div>
                          <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                            <div className="text-[11px] text-white/60 font-bold">签到率</div>
                            <div className="mt-1 text-2xl font-black">{fmtPercent((checkedInCount / Math.max(allAttendees.length, 1)) * 100)}</div>
                          </div>
                          <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                            <div className="text-[11px] text-white/60 font-bold">作品总数</div>
                            <div className="mt-1 text-2xl font-black">{workCards.length}</div>
                          </div>
                          <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                            <div className="text-[11px] text-white/60 font-bold">报告可生成</div>
                            <div className="mt-1 text-2xl font-black">{stats.reportReadyCount}</div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[30px] bg-white/8 border border-white/10 p-4 md:p-5 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-xs uppercase tracking-[0.18em] font-black text-white/50">Visual Board</div>
                            <div className="text-xl font-black">活动封面与热度趋势</div>
                          </div>
                          <TrendingUp className="w-5 h-5 text-pink-300" />
                        </div>
                        <div className="rounded-[24px] overflow-hidden h-44 bg-slate-800 border border-white/10">
                          {workCards[0]?.imageUrl ? (
                            <img src={workCards[0].imageUrl} alt={workCards[0].title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-teal-400/30 flex items-center justify-center text-6xl">🎉</div>
                          )}
                        </div>
                        <div className="mt-4">
                          <SimpleAreaChart values={phaseValues} />
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-2xl bg-white/10 py-2 text-xs font-bold">访问热度 ↑</div>
                          <div className="rounded-2xl bg-white/10 py-2 text-xs font-bold">互动提问 ↑</div>
                          <div className="rounded-2xl bg-white/10 py-2 text-xs font-bold">作品浏览 ↑</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <MiniMetric label="待审核提问" value={stats.pendingQuestions} helper="建议优先处理高热度问题" icon={Bell} accent="bg-gradient-to-br from-amber-400 to-orange-500" />
                    <MiniMetric label="同频已连接" value={stats.confirmedConnections} helper="用于关系沉淀与通讯录" icon={HeartHandshake} accent="bg-gradient-to-br from-emerald-400 to-teal-500" />
                    <MiniMetric label="平均资料完整度" value={fmtPercent(avgCompletion)} helper="个人报告与匹配质量核心指标" icon={Wand2} accent="bg-gradient-to-br from-pink-500 to-violet-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
                  <MiniMetric label="注册用户" value={allAttendees.length} helper="含当前用户与预置嘉宾" icon={Users} accent="bg-gradient-to-br from-pink-500 to-purple-500" />
                  <MiniMetric label="已签到" value={checkedInCount} helper={`${fmtPercent((checkedInCount / Math.max(allAttendees.length, 1)) * 100)} 签到率`} icon={QrCode} accent="bg-gradient-to-br from-teal-400 to-cyan-500" />
                  <MiniMetric label="设计作品" value={workCards.length} helper="用户上传 + 展品资料" icon={ImageIcon} accent="bg-gradient-to-br from-amber-400 to-orange-500" />
                  <MiniMetric label="互动内容" value={questions.length + bulletMessages.length} helper={`${stats.approvedQuestions} 条内容已通过`} icon={MessageCircle} accent="bg-gradient-to-br from-indigo-500 to-violet-500" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.92fr] gap-6">
                  <SectionCard title="用户方向分布" subtitle="帮助主办方判断议程与内容结构是否平衡。" action={<BarChart3 className="w-5 h-5 text-pink-500" />}>
                    <div className="space-y-4">
                      {distribution.map((item) => {
                        const pct = (item.value / Math.max(allAttendees.length, 1)) * 100;
                        return (
                          <div key={item.label}>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="font-bold text-slate-700 dark:text-slate-200">{item.label}</span>
                              <span className="font-black text-slate-950 dark:text-white">{item.value} 人</span>
                            </div>
                            <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-teal-400" style={{ width: `${Math.max(12, pct)}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </SectionCard>

                  <SectionCard title="现场健康度" subtitle="签到、提问、关注与活跃度的综合视觉展示。" action={<Activity className="w-5 h-5 text-teal-500" />}>
                    <div className="grid grid-cols-[160px_1fr] gap-6 items-center">
                      <div className="flex justify-center"><DonutChart value={Math.round((checkedInCount / Math.max(allAttendees.length, 1)) * 100)} /></div>
                      <div className="space-y-4">
                        {[
                          { label: '签到完成', value: (checkedInCount / Math.max(allAttendees.length, 1)) * 100 },
                          { label: '报告可生成', value: (stats.reportReadyCount / Math.max(allAttendees.length, 1)) * 100 },
                          { label: '提问审核通过', value: (stats.approvedQuestions / Math.max(questions.length, 1)) * 100 },
                          { label: '议程关注度', value: (sessions.filter((s) => s.isSubscribed).length / Math.max(sessions.length, 1)) * 100 }
                        ].map((row) => (
                          <div key={row.label}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span className="font-bold text-slate-700 dark:text-slate-200">{row.label}</span>
                              <span className="font-black text-slate-950 dark:text-white">{fmtPercent(row.value)}</span>
                            </div>
                            <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-slate-900 via-violet-500 to-teal-400" style={{ width: `${Math.max(10, row.value)}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SectionCard>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6">
                  <SectionCard title="嘉宾与用户照片墙" subtitle="让后台更有‘人’的感觉，也能快速看到关键用户。" action={<Users className="w-5 h-5 text-purple-500" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {allAttendees.slice(0, 4).map((person) => (
                        <button key={person.id} onClick={() => { setSelectedUserId(person.id); setActiveTab('attendees'); }} className="text-left rounded-[26px] p-4 border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-pink-300 dark:hover:border-pink-500/30 transition">
                          <div className="flex items-center gap-3">
                            <Avatar person={person} size="lg" />
                            <div className="min-w-0">
                              <div className="font-black text-slate-950 dark:text-white truncate">{person.nickName}</div>
                              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">{person.organization}</div>
                              <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">{person.designArchetype || person.title}</div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className={classNames('px-2.5 py-1 rounded-full text-[11px] font-black', completionTone(person.personaCompletion))}>{person.personaCompletion}% 完整度</span>
                            <span className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1">查看详情 <ArrowRight className="w-3.5 h-3.5" /></span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="作品图像模块" subtitle="把用户作品和展品图片直接呈现在后台首页，提升观感与判断效率。" action={<ImageIcon className="w-5 h-5 text-amber-500" />}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {workCards.slice(0, 4).map((work) => (
                        <div key={work.id} className="rounded-[22px] overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                          <div className="h-28 bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 dark:from-slate-800 dark:to-slate-900">
                            {work.imageUrl ? <img src={work.imageUrl} alt={work.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🖼️</div>}
                          </div>
                          <div className="p-3">
                            <div className="text-sm font-black text-slate-950 dark:text-white line-clamp-1">{work.title}</div>
                            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{work.owner}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6">
                  <SectionCard title="互动内容快览" subtitle="快速查看现场提问和弹幕状态。" action={<MessageCircle className="w-5 h-5 text-indigo-500" />}>
                    <div className="space-y-3">
                      {recentQuestions.map((item) => (
                        <div key={item.id} className="rounded-[24px] p-4 border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={classNames('w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0', item.userAvatarColor)}>{item.userAvatarEmoji}</div>
                              <div className="min-w-0">
                                <div className="font-black text-slate-950 dark:text-white truncate">{item.userNick}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{item.createdAt} · {item.upvotes} 赞同</div>
                              </div>
                            </div>
                            <span className={classNames('px-2.5 py-1 rounded-full text-[11px] font-black', questionStatusTone(item.status))}>{item.status === 'approved' ? '已通过' : item.status === 'pending' ? '待审核' : '已隐藏'}</span>
                          </div>
                          <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-6">{item.content}</div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="现场动态流" subtitle="将弱结构信息也做得更直观，增强后台‘活着’的感觉。" action={<Zap className="w-5 h-5 text-teal-500" />}>
                    <div className="space-y-3">
                      {recentBullets.map((item) => (
                        <div key={item.id} className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-4 bg-gradient-to-r from-pink-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                          <div className="flex items-center gap-3">
                            <div className={classNames('w-9 h-9 rounded-2xl flex items-center justify-center text-white shrink-0', item.userAvatarColor)}>{item.userAvatarEmoji}</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-black text-slate-950 dark:text-white">{item.userNick}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{item.createdAt}</div>
                            </div>
                            <CircleDot className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.content}</div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              </>
            )}

            {activeTab === 'attendees' && (
              <div className="grid grid-cols-1 2xl:grid-cols-[1.05fr_0.95fr] gap-6">
                <SectionCard title="参会用户资料" subtitle="支持搜索、浏览与查看详细个人信息。" action={<div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索姓名 / 机构 / 方向" className="pl-9 pr-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm" /></div>}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAttendees.map((person) => (
                      <button key={person.id} onClick={() => setSelectedUserId(person.id)} className={classNames('text-left rounded-[26px] border p-4 transition', selectedUserId === person.id ? 'border-pink-300 dark:border-pink-500/30 bg-pink-50/60 dark:bg-slate-950' : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700')}>
                        <div className="flex items-start gap-3">
                          <Avatar person={person} size="lg" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-black text-slate-950 dark:text-white truncate">{person.nickName}</div>
                              <span className={classNames('px-2 py-1 rounded-full text-[11px] font-black', completionTone(person.personaCompletion))}>{person.personaCompletion}%</span>
                            </div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">{person.organization} · {person.title}</div>
                            <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{person.quote || person.industry}</div>
                            <div className="mt-3 flex items-center justify-between">
                              <TagList tags={person.designDirections.slice(0, 2)} />
                              <span className={classNames('text-[11px] font-black px-2.5 py-1 rounded-full', person.checkedIn ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300')}>{person.checkedIn ? '已签到' : '未签到'}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="用户详情" subtitle="查看头像、设计方向、作品、活动经历等更完整的信息。" action={<Eye className="w-5 h-5 text-pink-500" />}>
                  {selectedUser ? (
                    <div className="space-y-5">
                      <div className="rounded-[30px] border border-slate-200/80 dark:border-slate-800 p-5 bg-gradient-to-br from-pink-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <Avatar person={selectedUser} size="lg" />
                          <div className="flex-1 min-w-0">
                            <div className="text-2xl font-black text-slate-950 dark:text-white">{selectedUser.nickName}</div>
                            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedUser.organization} · {selectedUser.title}</div>
                            <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-6">{selectedUser.quote || selectedUser.designArchetype || selectedUser.industry}</div>
                          </div>
                          <div className="shrink-0"><DonutChart value={selectedUser.personaCompletion} /></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950">
                          <div className="text-sm font-black text-slate-950 dark:text-white">设计方向</div>
                          <div className="mt-3"><TagList tags={selectedUser.designDirections} /></div>
                        </div>
                        <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950">
                          <div className="text-sm font-black text-slate-950 dark:text-white">兴趣与目标</div>
                          <div className="mt-3"><TagList tags={[...selectedUser.interests.slice(0, 2), ...selectedUser.goals.slice(0, 2)]} /></div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950">
                        <div className="text-sm font-black text-slate-950 dark:text-white">设计作品</div>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(selectedUser.designWorks && selectedUser.designWorks.length ? selectedUser.designWorks : workCards.slice(0, 2)).map((work) => {
                            const item: any = work;
                            return (
                              <div key={item.id} className="rounded-[20px] overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                                <div className="h-32 bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 dark:from-slate-800 dark:to-slate-900">
                                  {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🖼️</div>}
                                </div>
                                <div className="p-3">
                                  <div className="font-black text-slate-950 dark:text-white">{item.title}</div>
                                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950">
                        <div className="text-sm font-black text-slate-950 dark:text-white">设计活动经历</div>
                        <div className="mt-3 space-y-3">
                          {(selectedUser.designEvents && selectedUser.designEvents.length ? selectedUser.designEvents : [{ id: 'fallback', name: '未来设计共创营', role: selectedUser.title, year: '2026', location: '上海' }]).map((event) => (
                            <div key={event.id} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 flex items-center justify-between gap-3">
                              <div>
                                <div className="font-black text-slate-950 dark:text-white">{event.name}</div>
                                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{event.year || '2026'} · {event.location || '活动现场'} · {event.role}</div>
                              </div>
                              <CalendarDays className="w-4 h-4 text-slate-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                      <Users className="w-10 h-10 mx-auto mb-3 opacity-60" />
                      请选择左侧一个用户，查看更完整的设计信息与作品内容。
                    </div>
                  )}
                </SectionCard>
              </div>
            )}

            {activeTab === 'checkin' && (
              <SectionCard title="签到管理" subtitle="查看签到状态，并支持现场手动核销。" action={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <MiniMetric label="总人数" value={allAttendees.length} helper="含嘉宾与普通参会者" icon={Users} accent="bg-gradient-to-br from-slate-900 to-slate-700" />
                  <MiniMetric label="已签到" value={checkedInCount} helper="现场已完成入场" icon={QrCode} accent="bg-gradient-to-br from-emerald-400 to-teal-500" />
                  <MiniMetric label="未签到" value={allAttendees.length - checkedInCount} helper="可在现场继续跟进" icon={Lock} accent="bg-gradient-to-br from-amber-400 to-orange-500" />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {allAttendees.map((person) => (
                    <div key={person.id} className="rounded-[26px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center gap-4">
                      <Avatar person={person} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-slate-950 dark:text-white">{person.nickName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{person.organization} · {person.title}</div>
                        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">{person.checkedIn ? `签到时间 ${person.checkedInAt || '已记录'}` : '尚未签到'}</div>
                      </div>
                      <button onClick={() => toggleCheckin(person)} className={classNames('px-3 py-2 rounded-2xl text-xs font-black shrink-0', person.checkedIn ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950')}>
                        {person.checkedIn ? '取消签到' : '手动签到'}
                      </button>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {activeTab === 'network' && (
              <div className="grid grid-cols-1 xl:grid-cols-[0.78fr_1.22fr] gap-6">
                <SectionCard title="同频关系漏斗" subtitle="从推荐到建立连接，形成更清晰的社交转化漏斗。" action={<HeartHandshake className="w-5 h-5 text-pink-500" />}>
                  <div className="space-y-4">
                    {[
                      { label: '推荐曝光', value: attendees.length, color: 'from-slate-900 to-slate-700' },
                      { label: '待确认', value: connections.filter((item) => item.status === 'pending').length, color: 'from-amber-400 to-orange-500' },
                      { label: '已连接', value: connections.filter((item) => item.status === 'confirmed').length, color: 'from-emerald-400 to-teal-500' },
                      { label: '已拒绝', value: connections.filter((item) => item.status === 'declined').length, color: 'from-rose-500 to-pink-500' }
                    ].map((row, idx) => (
                      <div key={row.label} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{row.label}</span>
                          <span className="font-black text-slate-950 dark:text-white">{row.value}</span>
                        </div>
                        <div className="h-12 rounded-[18px] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className={classNames('h-full rounded-[18px] bg-gradient-to-r flex items-center px-4 text-white font-black', row.color)} style={{ width: `${Math.max(20, 100 - idx * 16)}%` }}>{row.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="好友通讯录与关系详情" subtitle="可查看两人的共同标签，并进行确认或拒绝。" action={<Users className="w-5 h-5 text-teal-500" />}>
                  <div className="space-y-4">
                    {connections.map((connection) => {
                      const from = getAttendeeById(connection.fromUserId, allAttendees);
                      const to = getAttendeeById(connection.toUserId, allAttendees);
                      return (
                        <div key={connection.id} className="rounded-[26px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {from ? <Avatar person={from} size="sm" /> : null}
                              <ChevronRight className="w-4 h-4 text-slate-300" />
                              {to ? <Avatar person={to} size="sm" /> : null}
                              <div className="min-w-0">
                                <div className="font-black text-slate-950 dark:text-white truncate">{getAttendeeNameById(connection.fromUserId, allAttendees)} → {getAttendeeNameById(connection.toUserId, allAttendees)}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">创建时间 {connection.createdAt}</div>
                              </div>
                            </div>
                            <span className={classNames('px-2.5 py-1 rounded-full text-[11px] font-black shrink-0', statusTone(connection.status))}>{statusText(connection.status)}</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <TagList tags={connection.matchedTags.length ? connection.matchedTags : commonTags(from || allAttendees[0], to || allAttendees[1] || allAttendees[0])} />
                          </div>
                          <div className="mt-4 flex gap-2">
                            <button onClick={() => updateConnectionStatus(connection.id, 'confirmed')} className="px-3 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-xs font-black">确认连接</button>
                            <button onClick={() => updateConnectionStatus(connection.id, 'declined')} className="px-3 py-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-300 text-xs font-black">拒绝</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <SectionCard title="作品资料与图像墙" subtitle="统一查看用户作品与展品图片，让后台更直观。" action={<ImageIcon className="w-5 h-5 text-amber-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {workCards.map((work) => (
                    <div key={work.id} className="rounded-[28px] overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                      <div className="h-48 bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 dark:from-slate-800 dark:to-slate-900">
                        {work.imageUrl ? <img src={work.imageUrl} alt={work.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl">🎨</div>}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-black text-slate-950 dark:text-white line-clamp-1">{work.title}</div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{work.owner} · {work.role || '设计作品'}</div>
                          </div>
                          <Sparkles className="w-4.5 h-4.5 text-pink-500 shrink-0" />
                        </div>
                        <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{work.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {activeTab === 'content' && (
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.9fr] gap-6">
                <SectionCard title="提问审核" subtitle="让审核界面不只是列表，而是更清晰的内容卡片。" action={<Bell className="w-5 h-5 text-amber-500" />}>
                  <div className="space-y-4">
                    {questions.map((item) => (
                      <div key={item.id} className="rounded-[26px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                        <div className="flex items-start gap-3">
                          <div className={classNames('w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0', item.userAvatarColor)}>{item.userAvatarEmoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <div className="font-black text-slate-950 dark:text-white">{item.userNick}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{item.createdAt} · {item.upvotes} 赞同</div>
                              </div>
                              <span className={classNames('px-2.5 py-1 rounded-full text-[11px] font-black', questionStatusTone(item.status))}>{item.status === 'approved' ? '已通过' : item.status === 'pending' ? '待审核' : '已隐藏'}</span>
                            </div>
                            <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-6">{item.content}</div>
                            <div className="mt-4 flex gap-2">
                              <button onClick={() => updateQuestionStatus(item.id, 'approved')} className="px-3 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-xs font-black">通过</button>
                              <button onClick={() => updateQuestionStatus(item.id, 'hidden')} className="px-3 py-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black">隐藏</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="弹幕与现场互动" subtitle="把弱结构内容做成流式信息展示。" action={<Zap className="w-5 h-5 text-teal-500" />}>
                  <div className="space-y-3">
                    {bulletMessages.map((item) => (
                      <div key={item.id} className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-4 bg-gradient-to-r from-pink-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                        <div className="flex items-center gap-3">
                          <div className={classNames('w-9 h-9 rounded-2xl flex items-center justify-center text-white shrink-0', item.userAvatarColor)}>{item.userAvatarEmoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-slate-950 dark:text-white">{item.userNick}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{item.createdAt}</div>
                          </div>
                          <CircleDot className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.content}</div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            )}

            {activeTab === 'schedule' && (
              <SectionCard title="议程管理" subtitle="更像卡片化的真实活动后台，而不是单纯表格。" action={<CalendarDays className="w-5 h-5 text-violet-500" />}>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {topSessions.map((session) => (
                    <div key={session.id} className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                      <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-pink-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{session.timeStr} · {session.location}</div>
                            <div className="mt-1 text-lg font-black text-slate-950 dark:text-white leading-snug">{session.title}</div>
                          </div>
                          <span className={classNames('px-2.5 py-1 rounded-full text-[11px] font-black', session.isLive ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300')}>{session.isLive ? '直播中' : '待开始'}</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3">
                          <div className={classNames('w-12 h-12 rounded-2xl flex items-center justify-center text-white', session.speakerAvatarColor)}>{session.speakerAvatarEmoji}</div>
                          <div>
                            <div className="font-black text-slate-950 dark:text-white">{session.speakerName}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{session.speakerTitle}</div>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2"><TagList tags={session.tags.slice(0, 4)} /></div>
                        <div className="mt-4 flex items-center justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">热度 {session.likesCount}</span>
                          <span className="text-slate-500 dark:text-slate-400">关注 {session.isSubscribed ? '已推荐' : '普通'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {activeTab === 'reports' && (
              <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
                <SectionCard title="报告中心概览" subtitle="面向用户的个人报告，应当更像成品而不是后台说明。" action={<FileText className="w-5 h-5 text-pink-500" />}>
                  <div className="space-y-4">
                    <div className="rounded-[28px] bg-gradient-to-br from-pink-500 via-purple-500 to-teal-400 text-white p-5">
                      <div className="text-xs uppercase tracking-[0.2em] font-black text-white/70">Report Pipeline</div>
                      <div className="mt-2 text-3xl font-black">{stats.reportReadyCount} 份可生成</div>
                      <div className="mt-2 text-sm text-white/80">满足签到 + 资料完整度条件的用户可直接生成完整长图页，并支持一键导出 PNG。</div>
                    </div>
                    {allAttendees.slice(0, 5).map((person) => (
                      <div key={person.id} className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center gap-3">
                        <Avatar person={person} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-slate-950 dark:text-white">{person.nickName}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{person.designArchetype || person.title}</div>
                        </div>
                        <span className={classNames('px-2.5 py-1 rounded-full text-[11px] font-black', person.checkedIn && person.personaCompletion >= 70 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300')}>{person.checkedIn && person.personaCompletion >= 70 ? '可生成' : '待完善'}</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="报告成品感参考结构" subtitle="这里强调最终用户会看到的体验：图像、数据图表、关键词标签、社交关系与作品摘要。" action={<Download className="w-5 h-5 text-teal-500" />}>
                  <div className="rounded-[30px] border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
                    <div className="h-40 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 text-white p-6 flex items-end justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] font-black text-white/60">Personal Report</div>
                        <div className="mt-2 text-2xl font-black">设计者个人报告长图页</div>
                      </div>
                      <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-3xl">🪪</div>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-[22px] border border-slate-200/80 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950">
                        <div className="font-black text-slate-950 dark:text-white">视觉模块</div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {workCards.slice(0, 3).map((work) => (
                            <div key={work.id} className="rounded-2xl overflow-hidden h-20 bg-slate-200 dark:bg-slate-800">
                              {work.imageUrl ? <img src={work.imageUrl} alt={work.title} className="w-full h-full object-cover" /> : null}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-[22px] border border-slate-200/80 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950">
                        <div className="font-black text-slate-950 dark:text-white">数据图表</div>
                        <SimpleAreaChart values={[40, 52, 61, 74, 68, 82]} />
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <SectionCard title="品牌与视觉" subtitle="后台与小程序共享一套粉紫青品牌系统。" action={<Sparkles className="w-5 h-5 text-pink-500" />}>
                  <div className="space-y-3">
                    <div className="rounded-[22px] bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-4">主色：粉紫青渐变，用于按钮、图表与重点模块。</div>
                    <div className="rounded-[22px] bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-4">卡片：大圆角 + 柔和阴影，保持更成熟的 SaaS 风格。</div>
                    <div className="rounded-[22px] bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-4">图像：优先展示用户作品、活动封面、展品图片。</div>
                  </div>
                </SectionCard>
                <SectionCard title="后台说明" subtitle="当前版本适合路演、答辩与产品演示。" action={<ShieldCheck className="w-5 h-5 text-teal-500" />}>
                  <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-7">
                    <p>访问路径：<span className="font-black text-slate-950 dark:text-white">/admin</span></p>
                    <p>当前是前端模拟版，适合展示信息架构与交互流程。</p>
                    <p>后续若接 Supabase / Firebase，即可变成真实可用后台。</p>
                  </div>
                </SectionCard>
                <SectionCard title="后续升级建议" subtitle="如果还要继续精修，可以往这里迭代。" action={<Zap className="w-5 h-5 text-violet-500" />}>
                  <div className="space-y-3">
                    {['接入真实数据库与图片存储', '增加管理员登录与权限层级', '个人报告一键导出 PNG / PDF', '增加实时签到数据与内容审核通知'].map((text) => (
                      <div key={text} className="rounded-[22px] border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-emerald-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{text}</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
