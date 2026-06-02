/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Download,
  Eye,
  FileText,
  Filter,
  HeartHandshake,
  IdCard,
  Image,
  LayoutDashboard,
  Lock,
  MessageCircle,
  Moon,
  Palette,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Tag,
  Users,
  X,
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

type CheckinFilter = 'all' | 'checked' | 'pending';

type QuestionFilter = 'all' | 'pending' | 'approved' | 'hidden';

const menuItems: { id: AdminTab; label: string; desc: string; icon: React.ElementType }[] = [
  { id: 'overview', label: '总览', desc: '核心数据与风险提醒', icon: LayoutDashboard },
  { id: 'attendees', label: '参会用户', desc: '资料、作品、活动经历', icon: Users },
  { id: 'checkin', label: '签到管理', desc: '通行证与核销状态', icon: QrCode },
  { id: 'network', label: '同频关系', desc: '好友通讯录与连接状态', icon: HeartHandshake },
  { id: 'portfolio', label: '作品资料', desc: '设计作品与展品收藏', icon: Image },
  { id: 'content', label: '互动内容', desc: '提问、弹幕、评论治理', icon: MessageCircle },
  { id: 'schedule', label: '议程管理', desc: '直播场次与报名关注', icon: CalendarDays },
  { id: 'reports', label: '报告中心', desc: '个人报告与导出状态', icon: FileText },
  { id: 'settings', label: '系统设置', desc: '权限、品牌与发布说明', icon: Settings }
];

const fmtPercent = (value: number) => `${Math.min(100, Math.max(0, Math.round(value)))}%`;

function classNames(...values: (string | false | null | undefined)[]) {
  return values.filter(Boolean).join(' ');
}

function getAttendeeNameById(id: string, people: Attendee[]) {
  return people.find((item) => item.id === id)?.nickName || id;
}

function getAttendeeById(id: string, people: Attendee[]) {
  return people.find((item) => item.id === id);
}

function commonTags(a: Attendee, b: Attendee) {
  const aTags = [...a.designDirections, ...a.interests, ...a.goals];
  const bTags = [...b.designDirections, ...b.interests, ...b.goals];
  return aTags.filter((tag) => bTags.includes(tag)).slice(0, 4);
}

function matchScore(a: Attendee, b: Attendee) {
  return Math.min(98, 48 + commonTags(a, b).length * 13 + (b.checkedIn ? 8 : 0));
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
  const [checkinFilter, setCheckinFilter] = useState<CheckinFilter>('all');
  const [questionFilter, setQuestionFilter] = useState<QuestionFilter>('all');

  const allAttendees = useMemo(() => [myProfile, ...attendees], [myProfile, attendees]);
  const selectedUser = selectedUserId ? getAttendeeById(selectedUserId, allAttendees) : null;

  const filteredAttendees = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return allAttendees.filter((person) => {
      const haystack = [person.nickName, person.organization, person.title, person.industry, person.phone, person.email, ...person.designDirections, ...person.interests].join(' ').toLowerCase();
      return !keyword || haystack.includes(keyword);
    });
  }, [allAttendees, query]);

  const checkedInCount = allAttendees.filter((person) => person.checkedIn).length;
  const uploadedWorksCount = allAttendees.reduce((sum, person) => sum + (person.designWorks?.length || 0), 0);
  const designEventsCount = allAttendees.reduce((sum, person) => sum + (person.designEvents?.length || 0), 0);
  const confirmedConnections = connections.filter((item) => item.status === 'confirmed').length;
  const pendingConnections = connections.filter((item) => item.status === 'pending').length;
  const reportReadyCount = allAttendees.filter((person) => person.checkedIn && person.personaCompletion >= 70).length;
  const averageCompletion = allAttendees.length ? allAttendees.reduce((sum, person) => sum + person.personaCompletion, 0) / allAttendees.length : 0;
  const approvedQuestions = questions.filter((item) => item.status === 'approved').length;
  const pendingQuestions = questions.filter((item) => item.status === 'pending').length;
  const hiddenQuestions = questions.filter((item) => item.status === 'hidden').length;
  const liveSessions = sessions.filter((item) => item.isLive).length;
  const subscribedSessions = sessions.filter((item) => item.isSubscribed).length;

  const directionDistribution = useMemo(() => {
    const map = new Map<string, number>();
    allAttendees.forEach((person) => {
      person.designDirections.forEach((tag) => map.set(tag, (map.get(tag) || 0) + 1));
    });
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [allAttendees]);

  const workCards = useMemo(() => {
    const works = allAttendees.flatMap((person) =>
      (person.designWorks || []).map((work) => ({ ...work, owner: person }))
    );
    const fallbackWorks = exhibits.slice(0, 6).map((item) => ({
      id: item.id,
      title: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
      role: item.zone,
      year: '2026',
      owner: allAttendees.find((person) => person.nickName === item.artist) || allAttendees[0]
    }));
    return works.length ? works : fallbackWorks;
  }, [allAttendees, exhibits]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((item) => questionFilter === 'all' || item.status === questionFilter);
  }, [questions, questionFilter]);

  const checkinUsers = useMemo(() => {
    return allAttendees.filter((person) => {
      if (checkinFilter === 'checked') return person.checkedIn;
      if (checkinFilter === 'pending') return !person.checkedIn;
      return true;
    });
  }, [allAttendees, checkinFilter]);

  const updateAttendee = (id: string, patch: Partial<Attendee>) => {
    if (id === myProfile.id) {
      setMyProfile((prev) => ({ ...prev, ...patch }));
      return;
    }
    setAttendees((prev) => prev.map((person) => (person.id === id ? { ...person, ...patch } : person)));
  };

  const toggleCheckIn = (person: Attendee) => {
    const now = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
    updateAttendee(person.id, {
      checkedIn: !person.checkedIn,
      checkedInAt: !person.checkedIn ? now : undefined
    });
  };

  const updateConnectionStatus = (id: string, status: Connection['status']) => {
    setConnections((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const updateQuestionStatus = (id: string, status: Question['status']) => {
    setQuestions((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const toggleSessionLive = (id: string) => {
    setSessions((prev) => prev.map((item) => (item.id === id ? { ...item, isLive: !item.isLive } : item)));
  };

  const toggleSessionSubscribe = (id: string) => {
    setSessions((prev) => prev.map((item) => (item.id === id ? { ...item, isSubscribed: !item.isSubscribed } : item)));
  };

  const toggleExhibitFeature = (id: string) => {
    setExhibits((prev) => prev.map((item) => (item.id === id ? { ...item, isFavoritedByUser: !item.isFavoritedByUser } : item)));
  };

  const exportAdminSnapshot = () => {
    const snapshot = {
      generatedAt: new Date().toISOString(),
      summary: {
        attendees: allAttendees.length,
        checkedIn: checkedInCount,
        works: uploadedWorksCount,
        connections: connections.length,
        reports: reportReadyCount,
        questions: questions.length
      },
      attendees: allAttendees,
      connections,
      sessions,
      questions,
      bulletMessages
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `welcome-me-admin-snapshot-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const statCards = [
    { label: '注册用户', value: allAttendees.length, helper: '含当前用户与预置嘉宾', icon: Users, accent: 'from-pink-500 to-purple-500' },
    { label: '已签到', value: checkedInCount, helper: `${fmtPercent((checkedInCount / Math.max(1, allAttendees.length)) * 100)} 签到率`, icon: QrCode, accent: 'from-teal-400 to-cyan-500' },
    { label: '设计作品', value: uploadedWorksCount || workCards.length, helper: '用户上传 + 展品资料', icon: Image, accent: 'from-amber-400 to-orange-500' },
    { label: '同频关系', value: connections.length, helper: `${confirmedConnections} 已确认 / ${pendingConnections} 待确认`, icon: HeartHandshake, accent: 'from-indigo-500 to-violet-500' },
    { label: '互动内容', value: questions.length + bulletMessages.length, helper: `${pendingQuestions} 条提问待审核`, icon: MessageCircle, accent: 'from-rose-500 to-pink-500' },
    { label: '报告完成', value: reportReadyCount, helper: `平均完整度 ${fmtPercent(averageCompletion)}`, icon: FileText, accent: 'from-slate-800 to-slate-600' }
  ];

  return (
    <div className="admin-shell min-h-screen bg-[#f6f7fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white/92 dark:bg-slate-950/92 backdrop-blur-xl sticky top-0 h-screen">
          <div className="p-6 border-b border-slate-100 dark:border-slate-850">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-teal-400 text-white flex items-center justify-center font-black shadow-lg shadow-pink-500/15">ME</div>
              <div>
                <h1 className="text-lg font-black tracking-tight">欢迎ME 控制台</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">主办方服务端后台</p>
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
                    'w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all border',
                    active
                      ? 'bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-teal-500/10 border-pink-200 dark:border-pink-500/30 text-slate-950 dark:text-white shadow-sm'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300'
                  )}
                >
                  <span className={classNames('w-9 h-9 rounded-2xl flex items-center justify-center shrink-0', active ? 'bg-white dark:bg-slate-900 text-pink-600 shadow-sm' : 'bg-slate-100 dark:bg-slate-900 text-slate-500')}>
                    <Icon className="w-4.5 h-4.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black">{item.label}</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.desc}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-850 space-y-3">
            <button onClick={exportAdminSnapshot} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black active:scale-[0.98] transition">
              <Download className="w-4 h-4" />
              导出运营快照
            </button>
            <a href="/" className="block text-center text-xs font-bold text-slate-500 hover:text-pink-600">返回用户端小程序</a>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 bg-[#f6f7fb]/88 dark:bg-slate-950/88 backdrop-blur-xl border-b border-slate-200/75 dark:border-slate-800">
            <div className="px-4 md:px-8 py-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                  Admin Workspace / {menuItems.find((item) => item.id === activeTab)?.label}
                </div>
                <h2 className="mt-1 text-2xl md:text-3xl font-black tracking-tight text-slate-950 dark:text-white">{menuItems.find((item) => item.id === activeTab)?.label}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">信息架构覆盖用户、签到、关系、作品、互动、报告与系统设置。</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <CircleDot className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  Vercel Production Ready
                </div>
                <button
                  onClick={() => setIsDarkMode((prev) => !prev)}
                  className="px-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-200 font-bold text-xs flex items-center gap-2"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDarkMode ? '浅色模式' : '夜间模式'}
                </button>
                <a href="/" className="px-3 py-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs flex items-center gap-2">
                  打开用户端
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:hidden px-4 pb-4 overflow-x-auto flex gap-2">
              {menuItems.map((item) => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={classNames('shrink-0 px-3 py-2 rounded-2xl text-xs font-black border', activeTab === item.id ? 'bg-slate-950 text-white border-slate-950' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500')}>
                  {item.label}
                </button>
              ))}
            </div>
          </header>

          <section className="p-4 md:p-8 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div key={card.label} className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm relative overflow-hidden">
                        <div className={`absolute right-0 top-0 w-36 h-36 bg-gradient-to-tr ${card.accent} opacity-10 blur-2xl`}></div>
                        <div className="relative flex items-start justify-between">
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{card.label}</p>
                            <div className="mt-2 text-4xl font-black tracking-tight text-slate-950 dark:text-white">{card.value}</div>
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{card.helper}</p>
                          </div>
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.accent} text-white flex items-center justify-center shadow-lg shadow-slate-900/10`}>
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
                  <div className="rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="font-black text-lg">用户兴趣分布</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">用于判断内容策划与分组推荐是否平衡。</p>
                      </div>
                      <BarChart3 className="w-5 h-5 text-pink-500" />
                    </div>
                    <div className="space-y-4">
                      {directionDistribution.map((item) => {
                        const pct = (item.value / Math.max(1, allAttendees.length)) * 100;
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
                  </div>

                  <div className="rounded-[32px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 shadow-xl shadow-slate-900/10 overflow-hidden relative">
                    <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-pink-500/25 blur-3xl"></div>
                    <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-teal-400/20 blur-3xl"></div>
                    <div className="relative">
                      <p className="text-xs uppercase tracking-[0.22em] text-white/55 font-black">Today Operations</p>
                      <h3 className="mt-2 text-2xl font-black tracking-tight">现场运营健康度</h3>
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">签到率</span>
                          <span className="font-black">{fmtPercent((checkedInCount / Math.max(1, allAttendees.length)) * 100)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-gradient-to-r from-teal-300 to-pink-400" style={{ width: `${(checkedInCount / Math.max(1, allAttendees.length)) * 100}%` }} /></div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="rounded-2xl bg-white/8 p-4 border border-white/10">
                            <p className="text-white/55 text-xs">待审核提问</p>
                            <p className="text-2xl font-black mt-1">{pendingQuestions}</p>
                          </div>
                          <div className="rounded-2xl bg-white/8 p-4 border border-white/10">
                            <p className="text-white/55 text-xs">直播议程</p>
                            <p className="text-2xl font-black mt-1">{liveSessions}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-black text-lg">运营待办</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">帮助主办方按优先级处理现场事项。</p>
                    </div>
                    <Bell className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <TaskCard title="审核待处理提问" value={pendingQuestions} desc="进入互动内容，优先处理即将直播场次的问题。" tone="pink" onClick={() => setActiveTab('content')} />
                    <TaskCard title="确认待处理关系" value={pendingConnections} desc="进入同频关系，确认关键嘉宾交换联系方式请求。" tone="purple" onClick={() => setActiveTab('network')} />
                    <TaskCard title="完善用户资料" value={allAttendees.filter((person) => person.personaCompletion < 80).length} desc="提醒未完善作品与经历的用户补充资料。" tone="teal" onClick={() => setActiveTab('attendees')} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendees' && (
              <AdminPanel title="参会用户管理" subtitle="用于查看用户资料、作品、活动经历和注册完整度。" action={<SearchBox value={query} onChange={setQuery} />}>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                        <th className="py-3 pr-4">用户</th>
                        <th className="py-3 pr-4">机构 / 职位</th>
                        <th className="py-3 pr-4">标签</th>
                        <th className="py-3 pr-4">完整度</th>
                        <th className="py-3 pr-4">状态</th>
                        <th className="py-3 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendees.map((person) => (
                        <tr key={person.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-950/60 transition">
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <Avatar person={person} size="md" />
                              <div>
                                <div className="font-black text-slate-950 dark:text-white">{person.nickName}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{person.phone || '未填写手机号'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <div className="font-bold text-slate-700 dark:text-slate-200">{person.organization}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{person.title}</div>
                          </td>
                          <td className="py-4 pr-4">
                            <TagList tags={[...person.designDirections, ...person.interests].slice(0, 3)} />
                          </td>
                          <td className="py-4 pr-4 min-w-36">
                            <Progress value={person.personaCompletion} />
                          </td>
                          <td className="py-4 pr-4">
                            <StatusPill status={person.checkedIn ? 'checked' : 'pending'} label={person.checkedIn ? '已签到' : '未签到'} />
                          </td>
                          <td className="py-4 text-right">
                            <button onClick={() => setSelectedUserId(person.id)} className="px-3 py-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black inline-flex items-center gap-1.5">
                              查看详情
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AdminPanel>
            )}

            {activeTab === 'checkin' && (
              <AdminPanel title="签到管理" subtitle="核销通行证、查看签到状态，并可为现场工作人员手动修正。" action={<Segmented value={checkinFilter} onChange={setCheckinFilter} options={[{ value: 'all', label: '全部' }, { value: 'checked', label: '已签到' }, { value: 'pending', label: '未签到' }]} />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                  <MetricMini label="总人数" value={allAttendees.length} icon={Users} />
                  <MetricMini label="已签到" value={checkedInCount} icon={CheckCircle2} />
                  <MetricMini label="未签到" value={allAttendees.length - checkedInCount} icon={Lock} />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  {checkinUsers.map((person) => (
                    <div key={person.id} className="rounded-[26px] bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-4 flex items-center gap-4">
                      <Avatar person={person} />
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-slate-950 dark:text-white truncate">{person.nickName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{person.organization} · {person.title}</div>
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{person.checkedIn ? `签到时间 ${person.checkedInAt || '已记录'}` : '尚未完成现场签到'}</div>
                      </div>
                      <button onClick={() => toggleCheckIn(person)} className={classNames('px-3 py-2 rounded-2xl text-xs font-black shrink-0', person.checkedIn ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950')}>
                        {person.checkedIn ? '设为未签到' : '手动签到'}
                      </button>
                    </div>
                  ))}
                </div>
              </AdminPanel>
            )}

            {activeTab === 'network' && (
              <AdminPanel title="同频关系管理" subtitle="管理通讯录、待确认连接与用户之间的共同兴趣。">
                <div className="grid grid-cols-1 xl:grid-cols-[0.75fr_1.25fr] gap-5">
                  <div className="rounded-[28px] bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-teal-500/10 border border-pink-200/70 dark:border-slate-800 p-5">
                    <h3 className="text-lg font-black">连接漏斗</h3>
                    <div className="mt-5 space-y-3">
                      <FunnelRow label="推荐曝光" value={attendees.length} color="bg-slate-900 dark:bg-white" />
                      <FunnelRow label="待确认" value={pendingConnections} color="bg-amber-500" />
                      <FunnelRow label="已连接" value={confirmedConnections} color="bg-emerald-500" />
                      <FunnelRow label="已拒绝" value={connections.filter((item) => item.status === 'declined').length} color="bg-rose-500" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {connections.map((item) => {
                      const from = getAttendeeById(item.fromUserId, allAttendees);
                      const to = getAttendeeById(item.toUserId, allAttendees);
                      return (
                        <div key={item.id} className="rounded-[26px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {from && <Avatar person={from} size="sm" />}
                              <ChevronRight className="w-4 h-4 text-slate-300" />
                              {to && <Avatar person={to} size="sm" />}
                              <div className="min-w-0">
                                <div className="font-black text-slate-950 dark:text-white truncate">{getAttendeeNameById(item.fromUserId, allAttendees)} → {getAttendeeNameById(item.toUserId, allAttendees)}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">创建时间 {item.createdAt} · {item.matchedTags.length || 0} 个共同标签</div>
                              </div>
                            </div>
                            <StatusPill status={item.status} label={item.status === 'confirmed' ? '已连接' : item.status === 'pending' ? '待确认' : '已拒绝'} />
                          </div>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                            <TagList tags={item.matchedTags.length ? item.matchedTags : ['体验探究', '人工智能交互']} />
                            <div className="flex gap-2">
                              <button onClick={() => updateConnectionStatus(item.id, 'confirmed')} className="px-3 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-xs font-black">确认</button>
                              <button onClick={() => updateConnectionStatus(item.id, 'declined')} className="px-3 py-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-300 text-xs font-black">拒绝</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AdminPanel>
            )}

            {activeTab === 'portfolio' && (
              <AdminPanel title="作品资料管理" subtitle="统一查看用户上传作品、活动经历与现场展品资料。">
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {workCards.map((work) => (
                    <div key={`${work.owner.id}-${work.id}`} className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                      <div className="h-40 bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
                        {work.imageUrl ? <img src={work.imageUrl} alt={work.title} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-5xl">🎨</div>}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-black text-slate-950 dark:text-white leading-snug">{work.title}</h3>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{work.owner.nickName} · {work.role || work.owner.title}</p>
                          </div>
                          <button onClick={() => toggleExhibitFeature(work.id)} className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500"><Sparkles className="w-4 h-4" /></button>
                        </div>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">{work.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AdminPanel>
            )}

            {activeTab === 'content' && (
              <AdminPanel title="互动内容管理" subtitle="审核现场提问、弹幕与评论，保持现场内容安全和高质量。" action={<Segmented value={questionFilter} onChange={setQuestionFilter} options={[{ value: 'all', label: '全部' }, { value: 'pending', label: '待审' }, { value: 'approved', label: '已通过' }, { value: 'hidden', label: '隐藏' }]} />}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
                  <MetricMini label="已通过提问" value={approvedQuestions} icon={CheckCircle2} />
                  <MetricMini label="待审核" value={pendingQuestions} icon={Bell} />
                  <MetricMini label="已隐藏" value={hiddenQuestions} icon={X} />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.8fr] gap-5">
                  <div className="space-y-3">
                    {filteredQuestions.map((item) => (
                      <div key={item.id} className="rounded-[26px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <span className={`w-9 h-9 rounded-full ${item.userAvatarColor} text-white flex items-center justify-center shrink-0`}>{item.userAvatarEmoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-black text-slate-950 dark:text-white">{item.userNick}</div>
                              <StatusPill status={item.status} label={item.status === 'approved' ? '已通过' : item.status === 'pending' ? '待审核' : '隐藏'} />
                            </div>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.content}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button onClick={() => updateQuestionStatus(item.id, 'approved')} className="px-3 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-xs font-black">通过</button>
                              <button onClick={() => updateQuestionStatus(item.id, 'hidden')} className="px-3 py-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-300 text-xs font-black">隐藏</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-[28px] bg-slate-950 text-white p-5 h-fit">
                    <h3 className="font-black flex items-center gap-2"><Zap className="w-4 h-4 text-pink-400" /> 实时弹幕</h3>
                    <div className="mt-4 space-y-3 max-h-[480px] overflow-y-auto pr-1">
                      {bulletMessages.slice(0, 10).map((item) => (
                        <div key={item.id} className="rounded-2xl bg-white/8 border border-white/10 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-black">{item.userAvatarEmoji} {item.userNick}</span>
                            <span className="text-[10px] text-white/45">{item.createdAt}</span>
                          </div>
                          <p className="mt-1 text-sm text-white/75 leading-relaxed">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AdminPanel>
            )}

            {activeTab === 'schedule' && (
              <AdminPanel title="议程管理" subtitle="查看会议、直播状态与用户关注情况。">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-5">
                  <MetricMini label="议程总数" value={sessions.length} icon={CalendarDays} />
                  <MetricMini label="直播中" value={liveSessions} icon={Activity} />
                  <MetricMini label="被关注" value={subscribedSessions} icon={BookOpen} />
                </div>
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        <div className={`w-13 h-13 rounded-2xl ${session.speakerAvatarColor} text-white flex items-center justify-center text-xl shrink-0`}>{session.speakerAvatarEmoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-600 dark:text-slate-300">{session.timeStr}</span>
                            {session.isLive && <span className="px-2 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-300 text-xs font-black">LIVE</span>}
                          </div>
                          <h3 className="font-black text-lg text-slate-950 dark:text-white leading-snug">{session.title}</h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{session.speakerName} · {session.location}</p>
                          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{session.description}</p>
                          <div className="mt-3"><TagList tags={session.tags} /></div>
                        </div>
                        <div className="flex lg:flex-col gap-2 shrink-0">
                          <button onClick={() => toggleSessionLive(session.id)} className="px-3 py-2 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-300 text-xs font-black">{session.isLive ? '结束直播' : '设为直播'}</button>
                          <button onClick={() => toggleSessionSubscribe(session.id)} className="px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 text-xs font-black">{session.isSubscribed ? '取消关注' : '设为推荐'}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AdminPanel>
            )}

            {activeTab === 'reports' && (
              <AdminPanel title="报告中心" subtitle="查看用户报告生成条件、资料完整度和导出状态。">
                <div className="grid grid-cols-1 xl:grid-cols-[0.8fr_1.2fr] gap-5">
                  <div className="rounded-[32px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 relative overflow-hidden">
                    <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-pink-500/25 blur-3xl"></div>
                    <div className="relative">
                      <p className="text-xs text-white/60 font-black uppercase tracking-[0.24em]">Report Readiness</p>
                      <h3 className="mt-2 text-3xl font-black tracking-tight">{reportReadyCount} / {allAttendees.length}</h3>
                      <p className="mt-2 text-white/70 text-sm leading-relaxed">已满足生成个性化长图报告的用户数量。</p>
                      <div className="mt-6 h-3 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-teal-300" style={{ width: `${(reportReadyCount / Math.max(1, allAttendees.length)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {allAttendees.map((person) => (
                      <div key={person.id} className="rounded-[26px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 flex items-center gap-4 shadow-sm">
                        <Avatar person={person} />
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-slate-950 dark:text-white">{person.nickName}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{person.checkedIn ? '已签到，可生成报告' : '未签到，报告暂未解锁'}</div>
                          <div className="mt-2"><Progress value={person.personaCompletion} /></div>
                        </div>
                        <button onClick={() => setSelectedUserId(person.id)} className="px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black">查看</button>
                      </div>
                    ))}
                  </div>
                </div>
              </AdminPanel>
            )}

            {activeTab === 'settings' && (
              <AdminPanel title="系统设置" subtitle="第一版后台为前端控制台，适合演示、现场运营和产品验证。">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  <SettingCard icon={ShieldCheck} title="后台访问路径" value="/admin" desc="用户端仍然是 /，主办方打开 /admin 即可进入控制台。" />
                  <SettingCard icon={Palette} title="视觉系统" value="统一品牌色" desc="沿用粉紫、青绿、浅灰和大圆角卡片，与小程序端一致。" />
                  <SettingCard icon={Lock} title="权限说明" value="演示模式" desc="当前没有账号权限拦截。正式上线前建议增加管理员登录。" />
                </div>
                <div className="mt-5 rounded-[28px] bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-5">
                  <h3 className="font-black text-slate-950 dark:text-white mb-2">后续接真实服务端时建议</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <p>1. 使用数据库保存用户、作品、签到、通讯录和报告记录。</p>
                    <p>2. 使用对象存储保存头像、作品图和 PNG 长图报告。</p>
                    <p>3. 给 /admin 增加管理员登录和角色权限。</p>
                    <p>4. 把现在的前端模拟数据迁移为 API 接口数据。</p>
                  </div>
                </div>
              </AdminPanel>
            )}
          </section>
        </main>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-slate-950/45 backdrop-blur-sm" onClick={() => setSelectedUserId(null)}>
          <div className="w-full max-w-xl bg-white dark:bg-slate-950 h-full overflow-y-auto shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="sticky top-0 z-10 bg-white/92 dark:bg-slate-950/92 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-black text-slate-400">User Detail</p>
                <h3 className="text-xl font-black text-slate-950 dark:text-white">用户详情</h3>
              </div>
              <button onClick={() => setSelectedUserId(null)} className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 space-y-5">
              <div className="rounded-[32px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-pink-500/25 blur-3xl"></div>
                <div className="relative flex items-start gap-4">
                  <Avatar person={selectedUser} size="lg" />
                  <div className="min-w-0">
                    <h2 className="text-2xl font-black tracking-tight">{selectedUser.nickName}</h2>
                    <p className="mt-1 text-white/70 text-sm">{selectedUser.organization} · {selectedUser.title}</p>
                    <p className="mt-3 text-sm text-white/80 leading-relaxed">{selectedUser.quote || '这个用户暂未填写个人介绍。'}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-bold">完整度 {selectedUser.personaCompletion}%</span>
                      <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-bold">{selectedUser.checkedIn ? '已签到' : '未签到'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <DetailSection title="设计方向与兴趣">
                <TagList tags={[...selectedUser.designDirections, ...selectedUser.interests, ...selectedUser.goals]} />
              </DetailSection>

              <DetailSection title="设计作品">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(selectedUser.designWorks?.length ? selectedUser.designWorks : [{ id: 'fallback', title: '暂未上传作品', description: '用户尚未补充作品资料。', imageUrl: undefined, role: selectedUser.title }]).map((work) => (
                    <div key={work.id} className="rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="h-28 bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-3xl">
                        {work.imageUrl ? <img src={work.imageUrl} alt={work.title} className="w-full h-full object-cover" /> : '🎨'}
                      </div>
                      <div className="p-3">
                        <h4 className="font-black text-sm text-slate-950 dark:text-white">{work.title}</h4>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{work.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DetailSection>

              <DetailSection title="参加过的设计活动">
                <div className="space-y-2">
                  {(selectedUser.designEvents?.length ? selectedUser.designEvents : [{ id: 'fallback-event', name: '暂未填写活动经历', role: '可在用户端注册资料中补充', year: '—', location: '—' }]).map((event) => (
                    <div key={event.id} className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-black text-slate-950 dark:text-white text-sm">{event.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{event.role}</div>
                      </div>
                      <span className="text-xs font-black text-slate-400 shrink-0">{event.year || '—'}</span>
                    </div>
                  ))}
                </div>
              </DetailSection>

              <DetailSection title="运营动作">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => toggleCheckIn(selectedUser)} className="py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black">{selectedUser.checkedIn ? '取消签到' : '手动签到'}</button>
                  <button onClick={() => setActiveTab('network')} className="py-3 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-300 text-xs font-black">查看关系</button>
                </div>
              </DetailSection>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminPanel({ title, subtitle, action, children }: { title: string; subtitle: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-[34px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden animate-fadeIn">
      <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        {action}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </div>
  );
}

function TaskCard({ title, value, desc, tone, onClick }: { title: string; value: number; desc: string; tone: 'pink' | 'purple' | 'teal'; onClick: () => void }) {
  const toneMap = {
    pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-300 border-pink-200 dark:border-pink-500/25',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-500/25',
    teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-300 border-teal-200 dark:border-teal-500/25'
  };
  return (
    <button onClick={onClick} className={`text-left rounded-[26px] p-4 border ${toneMap[tone]} active:scale-[0.99] transition`}>
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 font-black text-sm">{title}</div>
      <p className="mt-2 text-xs leading-relaxed opacity-80">{desc}</p>
    </button>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative w-full md:w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="搜索姓名、机构、标签"
        className="w-full pl-10 pr-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:border-pink-300"
      />
    </div>
  );
}

function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (value: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
      {options.map((option) => (
        <button key={option.value} onClick={() => onChange(option.value)} className={classNames('px-3 py-2 rounded-xl text-xs font-black transition', value === option.value ? 'bg-white dark:bg-slate-800 text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white')}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Avatar({ person, size = 'md' }: { person: Attendee; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-20 h-20 text-4xl rounded-[28px]' : size === 'sm' ? 'w-10 h-10 text-lg rounded-2xl' : 'w-12 h-12 text-xl rounded-2xl';
  return (
    <div className={`${sizeClass} ${person.avatarColor} text-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-white/30`}>
      {person.avatarImage ? <img src={person.avatarImage} alt={person.nickName} className="w-full h-full object-cover" /> : person.avatarEmoji}
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.slice(0, 8).map((tag) => (
        <span key={tag} className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold">
          {tag}
        </span>
      ))}
    </div>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
        <span>资料完整度</span>
        <span>{fmtPercent(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-teal-400" style={{ width: `${Math.min(100, Math.max(4, value))}%` }} />
      </div>
    </div>
  );
}

function StatusPill({ status, label }: { status: string; label: string }) {
  const tone = status === 'checked' || status === 'confirmed' || status === 'approved'
    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
    : status === 'pending'
      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300'
      : 'bg-slate-500/10 text-slate-500 dark:text-slate-300';
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black ${tone}`}>{label}</span>;
}

function MetricMini({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="rounded-[26px] bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-4 flex items-center gap-4">
      <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 text-pink-600 flex items-center justify-center shadow-sm">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-black text-slate-950 dark:text-white">{value}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">{label}</div>
      </div>
    </div>
  );
}

function FunnelRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-2">
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/70 dark:bg-slate-800 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, 24 + value * 12)}%` }} />
      </div>
    </div>
  );
}

function SettingCard({ icon: Icon, title, value, desc }: { icon: React.ElementType; title: string; value: string; desc: string }) {
  return (
    <div className="rounded-[28px] bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-5">
      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 text-pink-600 flex items-center justify-center shadow-sm mb-4"><Icon className="w-5 h-5" /></div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{title}</p>
      <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">{value}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
      <h4 className="font-black text-slate-950 dark:text-white mb-3">{title}</h4>
      {children}
    </section>
  );
}
