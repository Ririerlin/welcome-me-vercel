/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, Ticket, Award, MessageSquare, Cpu, ShieldAlert, Sparkles, 
  Settings, Check, X, FileText, ChevronRight, Activity, TrendingUp, BarChart, HardDrive, Search
} from 'lucide-react';
import { Attendee, Question, Session, Poll, Exhibit, Connection, BulletMessage } from '../types';

interface SaaSConsoleProps {
  myProfile: Attendee;
  setMyProfile: React.Dispatch<React.SetStateAction<Attendee>>;
  attendees: Attendee[];
  setAttendees: React.Dispatch<React.SetStateAction<Attendee[]>>;
  sessions: Session[];
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  polls: Poll[];
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>;
  exhibits: Exhibit[];
  setExhibits: React.Dispatch<React.SetStateAction<Exhibit[]>>;
  connections: Connection[];
  bulletMessages: BulletMessage[];
  setBulletMessages: React.Dispatch<React.SetStateAction<BulletMessage[]>>;
  activeSessionId: string;
  setActiveSessionId: React.Dispatch<React.SetStateAction<string>>;
  eventPhase: 'before' | 'during' | 'after';
  setEventPhase: React.Dispatch<React.SetStateAction<'before' | 'during' | 'after'>>;
  isDarkMode: boolean;
  isSplit?: boolean;
}

export default function SaaSConsole({
  myProfile,
  setMyProfile,
  attendees,
  setAttendees,
  sessions,
  setSessions,
  questions,
  setQuestions,
  polls,
  setPolls,
  exhibits,
  setExhibits,
  connections,
  bulletMessages,
  setBulletMessages,
  activeSessionId,
  setActiveSessionId,
  eventPhase,
  setEventPhase,
  isDarkMode,
  isSplit
}: SaaSConsoleProps) {
  // SaaS console tab navigation
  const [activeConsoleTab, setActiveConsoleTab] = useState<'dashboard' | 'config' | 'crm' | 'audit' | 'sponsor' | 'reports'>('dashboard');
  
  // Custom states inside SaaS console
  const [themeMode, setThemeMode] = useState<'emerald' | 'purple' | 'blue'>('emerald');
  const [matchingWeight, setMatchingWeight] = useState<{ direction: number; interest: number; goal: number }>({
    direction: 50,
    interest: 35,
    goal: 15
  });

  const [searchCRMQ, setSearchCRMQ] = useState('');
  const [selectedAttendeeId, setSelectedAttendeeId] = useState<string | null>('me');
  const [selectedReportType, setSelectedReportType] = useState<'organizer' | 'sponsor' | 'ai'>('organizer');
  
  // Quick toggle and triggers for mock actions
  const triggerApproveQuestion = (qId: string) => {
    const updated = questions.map(q => q.id === qId ? { ...q, status: 'approved' as const } : q);
    setQuestions(updated);
  };

  const triggerRejectQuestion = (qId: string) => {
    const updated = questions.map(q => q.id === qId ? { ...q, status: 'hidden' as const } : q);
    setQuestions(updated);
  };

  const triggerAnswerQuestion = (qId: string) => {
    const updated = questions.map(q => q.id === qId ? { ...q, isAnswered: true } : q);
    setQuestions(updated);
  };

  const triggerApproveBullet = (bId: string) => {
    const updated = bulletMessages.map(b => b.id === bId ? { ...b, status: 'approved' as const } : b);
    setBulletMessages(updated);
  };

  const triggerRejectBullet = (bId: string) => {
    const updated = bulletMessages.map(b => b.id === bId ? { ...b, status: 'hidden' as const } : b);
    setBulletMessages(updated);
  };

  // Compute stats dynamically from state
  const totalRegistrations = attendees.length + 1; // 5 mock + me
  const totalCheckedIn = (myProfile.checkedIn ? 1 : 0) + attendees.filter(a => a.checkedIn).length;
  const checkInRate = Math.round((totalCheckedIn / totalRegistrations) * 100);

  const totalInteractions = 
    questions.length + 
    polls.reduce((acc, p) => acc + p.votes.reduce((vA, vB) => vA + vB, 0), 0) + 
    exhibits.reduce((acc, e) => acc + e.likes + e.favorites + e.comments.length, 0);

  const totalConfirmedRelations = connections.filter(c => c.status === 'confirmed').length;

  return (
    <div className={`flex-1 flex flex-col p-[2.5px] bg-gradient-to-tr from-pink-400 via-teal-300 via-purple-300 to-pink-500 animate-gradient-flow rounded-[28px] shadow-[0_20px_50px_rgba(244,114,182,0.12)] font-sans transition-all duration-300 ${isSplit ? 'h-[480px]' : 'min-h-[725px] lg:h-[760px]'}`}>
      
      <div className="flex-1 flex flex-col apple-glass rounded-[26px] overflow-hidden border border-white/60 dark:border-slate-850/40 relative">
        
        {/* Top Banner / Translucent iOS status bar */}
        <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border-b border-pink-100/40 dark:border-slate-800/40 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between text-slate-900 dark:text-slate-100 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-950/50 rounded-xl">
              <Sparkles className="h-4.5 w-4.5 text-pink-500 dark:text-pink-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                欢迎ME • 主办方 SaaS 控制后台
              </h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">跨界体验峰会 2026 • 智能学者关系网络与同频雷达中控</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center space-x-1.5 bg-pink-50/50 dark:bg-pink-950/20 px-2.5 py-1 rounded-full border border-pink-205/30 dark:border-pink-900/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold font-mono">NFC 基站服务: 在线</span>
            </div>

            <div className="flex items-center bg-white/40 dark:bg-slate-900/40 p-1 px-2.5 rounded-xl border border-pink-100 dark:border-slate-800">
              <span className="text-slate-505 dark:text-slate-400 text-[10px] font-bold">会议阶段:</span>
              <select
                value={eventPhase}
                onChange={(e) => setEventPhase(e.target.value as 'before' | 'during' | 'after')}
                className="bg-transparent text-pink-500 dark:text-pink-400 font-extrabold ml-1 cursor-pointer focus:outline-none focus:ring-0 text-[11px]"
              >
                <option value="before" className="dark:bg-slate-900 text-slate-900">会前 (Before)</option>
                <option value="during" className="dark:bg-slate-900 text-slate-900">会中 (Live)</option>
                <option value="after" className="dark:bg-slate-900 text-slate-900">会后 (Closed)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main SaaS panel menu bar tabs as pure Macaron elegant segments */}
        <div className="bg-white/30 dark:bg-slate-900/10 border-b border-pink-100/30 dark:border-slate-800/30 px-2 py-1.5 flex flex-wrap gap-1 shrink-0 select-none">
          {[
            { id: 'dashboard', label: '工作台概览', icon: Activity },
            { id: 'config', label: '触点视觉配置', icon: Settings },
            { id: 'crm', label: '参会画像CRM', icon: Users },
            { id: 'audit', label: '互动大屏中控', icon: MessageSquare },
            { id: 'sponsor', label: '赞助/合作热度', icon: Award },
            { id: 'reports', label: 'AI复盘与数据报告', icon: FileText }
          ].map(item => {
            const Active = activeConsoleTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveConsoleTab(item.id as any)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-black rounded-xl transition-all duration-300 cursor-pointer ${
                  Active 
                    ? 'bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-teal-500/10 text-pink-600 dark:text-pink-400 shadow-xs border border-pink-150 dark:border-pink-900/30' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-white/40 dark:hover:bg-slate-800/40'
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      {/* Dynamic Content Body Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* TAB 1: DASHBOARD */}
        {activeConsoleTab === 'dashboard' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Realtime Metric grid cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                  <span className="text-xs font-semibold">登记参会人数</span>
                  <Users className="h-4.5 w-4.5" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-2xl font-black tracking-tight">{totalRegistrations}</h3>
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center">
                    <TrendingUp className="h-3 w-3 mr-0.5" /> +100% 满额
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">目前华东设计师特邀组到会率极高</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                  <span className="text-xs font-semibold">入场签到核销率</span>
                  <Ticket className="h-4.5 w-4.5" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-2xl font-black tracking-tight">{checkInRate}%</h3>
                  <span className="text-[10px] text-emerald-500 font-mono font-bold">({totalCheckedIn}/{totalRegistrations})</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${checkInRate}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400">高峰期(08:50 - 09:30) 运行极其畅通</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                  <span className="text-xs font-semibold">会中实时共鸣点击</span>
                  <Award className="h-4.5 w-4.5" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-2xl font-black tracking-tight">{totalInteractions}</h3>
                  <span className="text-[10px] text-slate-400 font-normal">次物理打卡与评论</span>
                </div>
                <p className="text-[10px] text-slate-400">人均交互点位：{Math.round(totalInteractions/totalRegistrations)} 次 / 人</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                  <span className="text-xs font-semibold">双向连接指数 WE Index</span>
                  <Sparkles className="h-4.5 w-4.5 text-purple-500" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-2xl font-black tracking-tight">{totalConfirmedRelations}</h3>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                    解封名片关系对
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">网络连接密度：{Math.round((totalConfirmedRelations/totalRegistrations)*15)}% 已破冰</p>
              </div>
            </div>

            {/* Middle double column: Pulse alert monitor & Live event agenda tracking */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Box 1: Pulse sensor tag metrics */}
              <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-4 md:col-span-2 space-y-3">
                <div className="flex items-center justify-between border-b dark:border-slate-800 pb-2">
                  <h4 className="text-xs font-bold flex items-center space-x-1.5">
                    <Activity className="h-4 w-4 text-emerald-500" />
                    <span>会场最强实时共振标签 (AI 热词捕获)</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 text-mono">更新于刚刚 09:41</span>
                </div>

                {/* Tag dynamic bar chart simulation */}
                <div className="space-y-2.5">
                  {[
                    { tag: '体验探究 (Empathy Exploration)', count: 18, color: 'bg-emerald-500', percent: 85 },
                    { tag: '人工智能交互 (AI interaction)', count: 15, color: 'bg-blue-500', percent: 70 },
                    { tag: '绿色可持续 (Sustainable Space)', count: 12, color: 'bg-teal-500', percent: 60 },
                    { tag: '实体硬软件共生 (Physical Symbiosis)', count: 11, color: 'bg-indigo-500', percent: 55 },
                    { tag: '新唯物主义美学 (New Materialism)', count: 9, color: 'bg-purple-500', percent: 45 }
                  ].map(stat => (
                    <div key={stat.tag} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{stat.tag}</span>
                        <span className="font-mono text-slate-400 font-bold">{stat.count} 同道</span>
                      </div>
                      <div className="w-full bg-slate-50 dark:bg-slate-850 h-2.5 rounded-lg overflow-hidden">
                        <div className={`h-full ${stat.color} transition-all duration-305`} style={{ width: `${stat.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Physical hardware hub status & warnings */}
              <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b dark:border-slate-800 pb-1.5 mb-2">
                    <h4 className="text-xs font-bold flex items-center space-x-1">
                      <Cpu className="h-4 w-4 text-indigo-505" />
                      <span>现场物理 NFC 节点</span>
                    </h4>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-bold font-mono">200Hz 正常</span>
                  </div>

                  <div className="space-y-2 text-[11px] leading-snug">
                    <div className="flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-950 rounded border dark:border-slate-800">
                      <span>🎟️ 签到台 NFC 盒-A</span>
                      <span className="text-emerald-500 font-bold flex items-center">● 在线</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-950 rounded border dark:border-slate-800">
                      <span>🏺 展品《气味地理》感知点</span>
                      <span className="text-emerald-500 font-bold flex items-center">● 在线</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-950 rounded border dark:border-slate-800">
                      <span>🎹 展品《悬浮声磬》感应核</span>
                      <span className="text-emerald-500 font-bold flex items-center">● 在线</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-505/20 text-amber-800 dark:text-amber-400 p-2.5 rounded-xl text-[10px] space-y-0.5 mt-3">
                  <span className="font-bold block flex items-center">
                    <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                    安全与导控提示：
                  </span>
                  <p className="leading-normal font-normal">若华东会场由于重型展具阻断导致现场 WiFi 产生异常，基带芯片将自动开启“不限流本地离线排队安全序列”。数据核销不会丢失。</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: CONFIGURATION */}
        {activeConsoleTab === 'config' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold border-b dark:border-slate-850 pb-2 uppercase tracking-wider select-none">
                小程序端及签到台 UI 视觉配置
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">峰会大会名称 (可在手机端即时生效)</label>
                    <input 
                      type="text" 
                      value="2026 跨界设计与人性体验峰会 (Cross-bound & Human Experience)"
                      disabled
                      className="w-full bg-slate-100 p-2 border dark:border-slate-800 rounded dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">大会视觉品牌主视觉色调</label>
                    <div className="flex space-x-2">
                      {[
                        { id: 'emerald', label: '春山碧绿 (Emerald)', color: 'bg-emerald-500' },
                        { id: 'purple', label: '星海迷幻 (Purple)', color: 'bg-purple-600' },
                        { id: 'blue', label: '科海深蓝 (Blue)', color: 'bg-blue-600' }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setThemeMode(item.id as any)}
                          className={`p-2 border rounded-xl flex items-center space-x-1.5 font-bold transition ${
                            themeMode === item.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-205 dark:border-slate-800'
                          }`}
                        >
                          <span className={`h-3 w-3 rounded-full ${item.color}`}></span>
                          <span className="text-[10px]">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border dark:border-slate-850 space-y-1">
                    <span className="font-bold underline text-[10px]">🎨 主视觉配置小说明:</span>
                    <p className="text-[10px] leading-relaxed text-slate-400">目前选定的方案代表华东文人绿色治愈的草野气息，小程序顶部导航栏微色彩。会中大屏亦会自适应渲染相应的极简渐变渲染色盘。</p>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border dark:border-slate-850">
                  <h4 className="font-bold text-xs flex items-center space-x-1.5 text-slate-800 dark:text-slate-100">
                    <Sparkles className="h-4.5 w-4.5 text-purple-600 animate-pulse" />
                    <span>AI 推荐策略模型参数权重配置 (和拍计算引擎)</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal">匹配相似性采用欧几里得距离与余弦相似混合矩阵。您可以手动调整三种属性权比：</p>
                  
                  <div className="space-y-3.5 text-xs pt-2">
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-bold text-[10px]">
                        <span>设计方向匹配权重 (Direct match):</span>
                        <span className="font-mono text-emerald-600 font-bold">{matchingWeight.direction}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="80" 
                        value={matchingWeight.direction} 
                        onChange={(e) => setMatchingWeight({ ...matchingWeight, direction: parseInt(e.target.value) })}
                        className="w-full accent-emerald-500 bg-slate-250 rounded-lg height-2"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between font-bold text-[10px]">
                        <span>学术兴趣&话题对应度 (Interest overlap):</span>
                        <span className="font-mono text-blue-500 font-bold">{matchingWeight.interest}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="80" 
                        value={matchingWeight.interest} 
                        onChange={(e) => setMatchingWeight({ ...matchingWeight, interest: parseInt(e.target.value) })}
                        className="w-full accent-blue-500 bg-slate-250 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between font-bold text-[10px]">
                        <span>参会目标共谋倾向 (Goal alignment):</span>
                        <span className="font-mono text-purple-600 font-bold">{matchingWeight.goal}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="50" 
                        value={matchingWeight.goal} 
                        onChange={(e) => setMatchingWeight({ ...matchingWeight, goal: parseInt(e.target.value) })}
                        className="w-full accent-purple-500 bg-slate-250 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CRM (Attendees List) */}
        {activeConsoleTab === 'crm' && (() => {
          const selectedAttendee = selectedAttendeeId === 'me'
            ? myProfile
            : attendees.find(a => a.id === selectedAttendeeId) || myProfile;

          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fadeIn">
              
              {/* Left Column: Comprehensive Creator Directory */}
              <div className="lg:col-span-2 bg-white/40 dark:bg-slate-900/20 border border-white/60 dark:border-slate-800/40 p-5 rounded-3xl space-y-4 shadow-sm">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100/30 dark:border-slate-800/30 pb-3">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1">
                      <span>参会者 CRM 画像档案库</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">点击任何行，右侧即可装载高定感官属性名片</p>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={searchCRMQ}
                      onChange={(e) => setSearchCRMQ(e.target.value)}
                      placeholder="搜索姓名、机构、手机号..." 
                      className="text-xs border border-pink-100/50 dark:border-slate-800 bg-white/50 dark:bg-slate-950 p-1.5 px-3 pl-8 rounded-xl focus:outline-none focus:border-pink-300 w-48 transition-all"
                    />
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Table list */}
                <div className="overflow-x-auto pr-1">
                  <table className="w-full text-left text-xs text-slate-650 dark:text-slate-300">
                    <thead className="bg-pink-50/30 dark:bg-slate-950/40 font-bold text-slate-500 text-[10px] uppercase border-b border-slate-200/50 dark:border-slate-800 select-none">
                      <tr>
                        <th className="p-3">参会创作者</th>
                        <th className="p-3">组织机构 & 职称</th>
                        <th className="p-3">核心探索方向 / 标签</th>
                        <th className="p-3">票证与物理挂饰</th>
                        <th className="p-3 text-right">物理入会</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                      
                      {/* My Profile Row */}
                      <tr 
                        onClick={() => setSelectedAttendeeId('me')}
                        className={`cursor-pointer transition-all hover:bg-pink-500/5 ${
                          selectedAttendeeId === 'me' 
                            ? 'bg-gradient-to-r from-pink-500/5 via-transparent to-transparent border-l-4 border-pink-400 font-bold' 
                            : ''
                        }`}
                      >
                        <td className="p-3 flex items-center space-x-2.5">
                          <span className={`h-8 w-8 ${myProfile.avatarColor} text-white rounded-full flex items-center justify-center text-lg shadow-inner shrink-0`}>
                            {myProfile.avatarEmoji}
                          </span>
                          <div>
                            <span className="font-bold text-pink-600 dark:text-pink-400 block">{myProfile.nickName} (我)</span>
                            <span className="text-[10px] font-mono text-slate-450">{myProfile.phone || '尚未绑定'}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-slate-800 dark:text-slate-200 block">{myProfile.organization}</span>
                          <span className="text-[10px] text-slate-400">{myProfile.title}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {myProfile.designDirections.map(d => (
                              <span key={d} className="text-[8px] bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold px-1.5 py-0.5 rounded">{d}</span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-[10px] font-mono block text-purple-600 dark:text-purple-400 font-bold">VIP 特邀出票</span>
                          <span className="text-[8px] bg-white/60 dark:bg-slate-850 px-1.5 py-0.5 rounded font-bold">
                            NFC配挂: {myProfile.nfcBound ? '✓ 已绑定' : '✗ 待发'}
                          </span>
                        </td>
                        <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                          {myProfile.checkedIn ? (
                            <span className="inline-block bg-teal-500/10 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400 text-[10px] px-2 py-0.5 rounded-full font-bold font-mono">
                              ✓ 已入会
                            </span>
                          ) : (
                            <button 
                              onClick={() => setMyProfile({ ...myProfile, checkedIn: true, checkedInAt: '09:42' })}
                              className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-[9px] px-2 py-1 rounded-lg transition shadow-xs cursor-pointer"
                            >
                              极速签
                            </button>
                          )}
                        </td>
                      </tr>

                      {/* Attendee Rows */}
                      {attendees
                        .filter(a => {
                          if (!searchCRMQ) return true;
                          const q = searchCRMQ.toLowerCase();
                          return a.nickName.toLowerCase().includes(q) || 
                                 a.organization.toLowerCase().includes(q) || 
                                 (a.phone && a.phone.includes(q));
                        })
                        .map(a => (
                          <tr 
                            key={a.id} 
                            onClick={() => setSelectedAttendeeId(a.id)}
                            className={`cursor-pointer transition-all hover:bg-pink-500/5 ${
                              selectedAttendeeId === a.id 
                                ? 'bg-gradient-to-r from-pink-500/5 via-transparent to-transparent border-l-4 border-pink-450 font-bold' 
                                : ''
                            }`}
                          >
                            <td className="p-3 flex items-center space-x-2.5">
                              <span className={`h-8 w-8 ${a.avatarColor} text-white rounded-full flex items-center justify-center text-lg shadow-inner shrink-0`}>
                                {a.avatarEmoji}
                              </span>
                              <div>
                                <span className="font-bold block text-slate-850 dark:text-slate-100">{a.nickName}</span>
                                <span className="text-[10px] font-mono text-slate-400">{a.phone || '13*-****-****'}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="font-medium block text-slate-800 dark:text-slate-200">{a.organization}</span>
                              <span className="text-[10px] text-slate-400">{a.title}</span>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {a.designDirections.map(d => (
                                  <span key={d} className="text-[8px] bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold px-1.5 py-0.5 rounded">{d}</span>
                                ))}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="text-[10px] block text-slate-505 font-bold">{a.group || 'Attendee'}</span>
                              <span className="text-[8px] bg-white/60 dark:bg-slate-850 text-slate-450 px-1.5 py-0.5 rounded font-bold inline-block">
                                NFC挂: {a.nfcBound ? '✓ 已绑定' : '✗ 待发'}
                              </span>
                            </td>
                            <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                              {a.checkedIn ? (
                                <span className="inline-block bg-teal-500/10 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400 text-[10px] px-2 py-0.5 rounded-full font-bold font-mono">
                                  ✓ 已入会
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    const updated = attendees.map(item => item.id === a.id ? { ...item, checkedIn: true, checkedInAt: '09:41' } : item);
                                    setAttendees(updated);
                                  }}
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[9px] px-2 py-1 rounded-lg transition shadow-xs cursor-pointer"
                                >
                                  核销签
                                </button>
                              )}
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Premium High-End Sensory Badge Card with Macaron Theme */}
              <div className="bg-gradient-to-tr from-pink-400/90 via-purple-400/80 to-teal-300/90 rounded-[32px] p-[2.5px] shadow-lg shadow-pink-500/5 select-none animate-fadeIn">
                <div className="apple-glass rounded-[30px] p-6 flex flex-col items-center text-slate-800 dark:text-slate-100 relative min-h-[480px]">
                  
                  {/* Glowing background mesh fields inside credentials holder */}
                  <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-pink-300/20 blur-xl"></div>
                  <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full bg-teal-300/20 blur-xl"></div>

                  <span className="text-[8px] tracking-[0.3em] font-mono font-black text-pink-500 dark:text-pink-400 uppercase border border-pink-100 dark:border-pink-900 bg-white dark:bg-slate-900 px-3 py-1 rounded-full mb-6 shadow-xs">
                    SENSIO CREDENTIALS • 2026
                  </span>

                  {/* Intertwining Avatar Circle with colorful dynamic glow ring */}
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-tr from-white to-pink-50 dark:from-slate-800 dark:to-slate-900 border-4 border-white dark:border-slate-800 flex items-center justify-center text-4xl shadow-md relative group hover:scale-105 transition-all duration-300`}>
                    <span>{selectedAttendee.avatarEmoji}</span>
                    <span className="absolute -bottom-1.5 -right-1.5 text-[8px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider scale-95 border border-white dark:border-slate-850 shadow-xs">
                      {selectedAttendee.group === 'Guest' ? '特邀嘉宾' : selectedAttendee.group === 'VIP' ? '贵宾 VIP' : '学者/创客'}
                    </span>
                  </div>

                  {/* Identity text labels */}
                  <div className="text-center mt-5 space-y-1">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-center space-x-1.5">
                      <span>{selectedAttendee.nickName}</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold block">
                      {selectedAttendee.phone ? `绑卡号码：${selectedAttendee.phone}` : '物理硬件未同步'}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-350 font-bold">{selectedAttendee.organization}</p>
                    <p className="text-[10px] text-pink-500 dark:text-pink-400 font-extrabold uppercase tracking-widest">{selectedAttendee.title}</p>
                  </div>

                  {/* Character Properties details panel */}
                  <div className="w-full mt-6 space-y-4 border-y border-pink-100/40 dark:border-slate-800/40 py-5">
                    
                    {/* MBTI DNA */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-widest block">🧬 MBTI 性格微生态 (Cognitive DNA)</span>
                      <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black px-3 py-1 rounded-xl border border-purple-500/10 inline-block">
                        {selectedAttendee.mbti || 'INFJ - 治愈系苔藓听风者'}
                      </div>
                    </div>

                    {/* Creative Archetype */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-widest block">🎨 创作本色原型 (Design Persona)</span>
                      <div className="bg-pink-500/10 text-pink-600 dark:text-pink-300 text-[10px] font-black px-3 py-1 rounded-xl border border-pink-500/10 inline-block">
                        {selectedAttendee.designArchetype || '有机流体自适应感感官者'}
                      </div>
                    </div>

                    {/* Fun Badge labels */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-widest block">🏆 勋章标记 (Sensory Badge)</span>
                      <div className="bg-yellow-500/10 text-yellow-750 dark:text-yellow-405 text-[10px] font-medium p-2 rounded-xl border border-yellow-500/20 leading-snug">
                        {selectedAttendee.achievementBadge || '☕ 连熬三场答辩亦发量充盈的物理神话'}
                      </div>
                    </div>

                  </div>

                  {/* Custom Slogan speech bubble */}
                  {selectedAttendee.quote && (
                    <div className="bg-white/40 dark:bg-slate-900/30 p-4 rounded-2xl border border-pink-100/30 dark:border-slate-850/30 text-[10.5px] italic text-slate-500 dark:text-slate-400 font-medium text-center relative w-full mt-5 leading-relaxed">
                      “ {selectedAttendee.quote} ”
                    </div>
                  )}

                  {/* Simulating NFC hook inside CRM */}
                  {selectedAttendee.id !== 'me' && (
                    <div className="w-full mt-5 bg-gradient-to-r from-pink-500/5 via-purple-505/5 to-teal-500/5 p-3 rounded-2xl border border-white/60 dark:border-slate-805 text-center space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-450 dark:text-slate-400">
                        <span>同频对味雷达矩阵:</span>
                        <span className="font-mono text-pink-500 font-black">94% Overlap</span>
                      </div>
                      <button
                        onClick={() => alert(`已为 '${myProfile.nickName}' 与 '${selectedAttendee.nickName}' 发送配对震动！请在左边手机雷达中解封此名片。`)}
                        className="w-full bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-slate-800 font-black text-[10px] py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                      >
                        ⚡ 模拟 NFC 通拍碰触
                      </button>
                    </div>
                  )}

                </div>
              </div>

            </div>
          );
        })()}

        {/* TAB 4: LIVE SCREEN & AUDIT MODERATION POOL */}
        {activeConsoleTab === 'audit' && (
          <div className="space-y-4 animate-fadeIn">
            
            <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-2xl text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
              <strong>📢 主持及导播现场中控提示：</strong> 
              参会者通过手机端小程序提交的「向讲者提问」和「实时弹幕」会默认注入以下待审桶。审批通过点亮后，才会展现场内 LED 主屏上！
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Question approve list */}
              <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b dark:border-slate-850 pb-2.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 font-sans">1. 提问审核池 (讲师台精选 Q&A)</h4>
                  <span className="text-[9px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold">
                    待决 {questions.filter(q => q.status === 'pending').length} 
                  </span>
                </div>

                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {questions.map(q => (
                    <div 
                      key={q.id}
                      className={`p-3 rounded-xl border text-[11px] space-y-2 ${
                        q.status === 'approved' 
                          ? 'bg-emerald-500/5 border-emerald-500/25' 
                          : q.status === 'hidden'
                            ? 'bg-gray-100 dark:bg-slate-950 border-transparent opacity-60'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-1.5 text-slate-450 text-[10px]">
                          <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] ${q.userAvatarColor}`}>
                            {q.userAvatarEmoji}
                          </span>
                          <span className="font-bold text-slate-600 dark:text-slate-350">{q.userNick}</span>
                          <span>•</span>
                          <span className="text-[9px] font-semibold text-slate-500">{sessions.find(s => s.id === q.sessionId)?.speakerName} 场</span>
                        </div>
                        <span className="font-mono text-[9px] text-slate-400">举赞 △ {q.upvotes}</span>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">{q.content}</p>

                      <div className="flex items-center justify-between border-t dark:border-slate-850/60 pt-2 text-[10px]">
                        <span className="text-slate-400 flex items-center">
                          状态：
                          <span className={`font-bold ml-1 ${
                            q.status === 'approved' 
                              ? 'text-emerald-500' 
                              : q.status === 'hidden'
                                ? 'text-slate-500'
                                : 'text-amber-500 animate-pulse'
                          }`}>
                            {q.status === 'approved' ? '已上墙公开' : q.status === 'hidden' ? '未予显示' : '等待核准'}
                          </span>
                        </span>

                        <div className="flex space-x-1">
                          {q.status !== 'approved' && (
                            <button
                              onClick={() => triggerApproveQuestion(q.id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-1 px-2.5 rounded text-[9px]"
                            >
                              批准上墙
                            </button>
                          )}
                          {q.status === 'approved' && !q.isAnswered && (
                            <button
                              onClick={() => triggerAnswerQuestion(q.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-1 px-2.5 rounded text-[9px]"
                            >
                              标记已回答
                            </button>
                          )}
                          {q.status !== 'hidden' && (
                            <button
                              onClick={() => triggerRejectQuestion(q.id)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-850 dark:text-slate-400 font-bold p-1 px-2 rounded text-[9px]"
                            >
                              下墙/隐藏
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bullet show approve list */}
              <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b dark:border-slate-850 pb-2.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
                    <span>2. 会中弹幕过滤流 (Bullet Stream)</span>
                  </h4>
                  <span className="text-[9px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                    待审 {bulletMessages.filter(b => b.status === 'pending').length} 
                  </span>
                </div>

                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {bulletMessages.map(b => (
                    <div 
                      key={b.id}
                      className={`p-2.5 rounded-xl border text-[11px] space-y-1.5 ${
                        b.status === 'approved' 
                          ? 'bg-gradient-to-tr from-rose-500/5 to-transparent border-rose-500/15'
                          : b.status === 'hidden'
                            ? 'bg-gray-100 dark:bg-slate-950 border-transparent opacity-60'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500 text-[10px]">{b.userNick} 发送:</span>
                        <span className="font-mono text-[9px] text-slate-400">{b.createdAt}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-white/50 dark:bg-slate-900 p-1.5 rounded">{b.content}</p>

                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="text-[9px] text-slate-400">
                          安全检测: <span className="text-emerald-500">无高敏感词</span>
                        </span>

                        <div className="flex space-x-1">
                          {b.status !== 'approved' && (
                            <button
                              onClick={() => triggerApproveBullet(b.id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-1 px-2 rounded text-[9px]"
                            >
                              核准通过
                            </button>
                          )}
                          {b.status !== 'hidden' && (
                            <button
                              onClick={() => triggerRejectBullet(b.id)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-850 dark:text-slate-450 font-bold p-1 px-1.5 rounded text-[9px]"
                            >
                              拦截
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: EXHIBITION value and Resonance Report */}
        {activeConsoleTab === 'sponsor' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-2xl space-y-4">
              <div className="border-b dark:border-slate-850 pb-2.5 flex items-center justify-between select-none">
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  赞助商及合作方物理展品「共鸣热度数据」
                </h3>
                <span className="text-[10px] text-slate-400">SaaS 后台自动计算实时 ROI 排榜 & 用户深层反馈分析</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {exhibits.map((ex, index) => {
                  const clickCount = ex.likes + ex.favorites;
                  return (
                    <div 
                      key={ex.id} 
                      className="border dark:border-slate-800 rounded-2xl p-3 bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4"
                    >
                      {/* Ranking micro-column */}
                      <div className="text-center font-mono font-black text-slate-400 text-sm md:w-12 shrink-0 border-r dark:border-slate-800 pr-2">
                        NO. {index + 1}
                      </div>

                      {/* Cover & Artist */}
                      <div className="flex items-center space-x-3 md:w-1/3 shrink-0">
                        <img src={ex.imageUrl} alt={ex.name} referrerPolicy="no-referrer" className="h-14 w-14 rounded-lg object-cover border dark:border-slate-800" />
                        <div className="space-y-0.5 truncate">
                          <h4 className="font-bold text-xs truncate text-slate-800 dark:text-slate-250">{ex.name}</h4>
                          <p className="text-[10px] text-slate-400 truncate">{ex.artist}</p>
                          <span className="inline-block text-[8px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-bold">{ex.zone}</span>
                        </div>
                      </div>

                      {/* Performance Bar */}
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className="text-slate-450">物理 NFC 吸附 + 扫码量 (灵感共鸣)</span>
                          <span className="font-bold text-rose-500">{clickCount} 次共振</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-900 h-2.5 rounded-lg overflow-hidden">
                          <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${Math.min(100, (clickCount / 200) * 100)}%` }}></div>
                        </div>
                      </div>

                      {/* Specific user comments list summaries */}
                      <div className="md:w-1/4 shrink-0 bg-white dark:bg-slate-900 border dark:border-slate-850 p-2.5 rounded-xl text-[10px]">
                        <span className="font-bold block text-[9px] text-slate-400 uppercase tracking-widest border-b dark:border-slate-850 pb-0.5 mb-1">
                          展商专属线索/短评 ({ex.comments.length})
                        </span>
                        {ex.comments.length === 0 ? (
                          <span className="text-slate-400 italic">暂无评论</span>
                        ) : (
                          <p className="text-slate-600 dark:text-slate-350 italic truncate">
                            “{ex.comments[ex.comments.length - 1].text}”
                          </p>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: REPORTS & AI OUTCOMES EXPORT */}
        {activeConsoleTab === 'reports' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-2xl space-y-4 min-h-[400px]">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b dark:border-slate-800 pb-3 gap-2">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider select-none">
                    大会会后复盘总结与 AI 数据报告中心
                  </h3>
                  <p className="text-[10px] text-slate-400">将现场人流漏斗、共鸣足迹、人际网络密度转化为可证明的高级商业资产报告</p>
                </div>

                <div className="flex space-x-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border dark:border-slate-800 shrink-0">
                  <button
                    onClick={() => setSelectedReportType('organizer')}
                    className={`text-[10px] font-bold p-1 border rounded px-3 transition ${
                      selectedReportType === 'organizer' ? 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800' : 'text-slate-450 border-transparent'
                    }`}
                  >
                    主办方复盘
                  </button>
                  <button
                    onClick={() => setSelectedReportType('sponsor')}
                    className={`text-[10px] font-bold p-1 border rounded px-3 transition ${
                      selectedReportType === 'sponsor' ? 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800' : 'text-slate-450 border-transparent'
                    }`}
                  >
                    展商评估ROI
                  </button>
                  <button
                    onClick={() => setSelectedReportType('ai')}
                    className={`text-[10px] font-bold p-1 border rounded px-3 transition ${
                      selectedReportType === 'ai' ? 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800' : 'text-slate-450 border-transparent'
                    }`}
                  >
                    AI 算法精准度
                  </button>
                </div>
              </div>

              {/* Show selected textual report summary template */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border dark:border-slate-850 space-y-3 font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-350 overflow-y-auto max-h-[460px]">
                
                {selectedReportType === 'organizer' && (
                  <div className="space-y-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold block border-b dark:border-slate-800 pb-1 text-xs">=== 2026 跨界设计与人性体验峰会 • 主办方闭幕复盘总结 ===</span>
                    <p>【基本状况汇总】</p>
                    <p>• 大会状态: 已归档 2026-05-25T02:21</p>
                    <p>• 签到状态: 已核销 {totalCheckedIn} 人 / 独占登记 {totalRegistrations} 人 (签到率: {checkInRate}%)</p>
                    <p>• 参创标签总数: 系统累计提取 341 枚个性标签。用户参会卡完善率达 {Math.round(attendees.reduce((a, b) => a + b.personaCompletion, 0) / attendees.length)}%</p>
                    <p>• 互动全效指数: 物理触碰及发声累计引发了 {totalInteractions} 次交互事件，平均单个观众活跃时长为 240 分钟。</p>
                    
                    <p className="pt-2">【AI 洞察点与学术建议】</p>
                    <p>1. 本次大会中，关于<strong>「人工智能交互」与「新唯物主义」</strong>的结合，在提问区触发了极其激烈的论点争鸣。主会场高赞问题主要集中在“在零界面隐性智能时代，设计如何体现深层生态学的克制性”。</p>
                    <p>2. 会中人脉交换（从 ME 到 WE）效率极高，华东区创作者倾向于在午后茶歇通过近场 NFC 触碰解封名片。累计已产生关系对：{connections.length} 组。</p>
                    <p>3. 建议下一届大会在“物理交互装置与脑接口”及“零塑自然微会场”方面增加更重型的学术展台。</p>
                  </div>
                )}

                {selectedReportType === 'sponsor' && (
                  <div className="space-y-2">
                    <span className="text-rose-605 dark:text-rose-400 font-bold block border-b dark:border-slate-8s pb-1 text-xs">=== 赞助商及学术画廊 • 展品共鸣与潜在商业线索评估报告 ===</span>
                    <p>【赞助成果量化分析】</p>
                    <p>• 本期累计展示先验概念物理作品: {exhibits.length} 件</p>
                    <p>• 主展区 NFC 感应一碰触发量: {exhibits.reduce((acc, e) => acc + e.likes, 0)} 次共鸣点赞</p>
                    <p>• 用户收藏/归入灵感本总量: {exhibits.reduce((acc, e) => acc + e.favorites, 0)} 次</p>

                    <p className="pt-2">【展品具体热度排名榜】</p>
                    {exhibits.map((ex, i) => (
                      <p key={ex.id}>
                        NO.{i+1} 《{ex.name}》 | 共震 {ex.likes + ex.favorites} 次 (评论 {ex.comments.length} 条)
                      </p>
                    ))}

                    <p className="pt-2">【观众群落兴趣特写】</p>
                    <p>• 体验该展区的核心人群多具有：<strong>“{myProfile.designDirections.slice(0, 3).join('、')}”</strong> 等画像属性。这是一批具有极重研究倾向、高客单、寻求核心软体自适应项目合伙的资深行业决策人。</p>
                    <p>• 累计产生授权后续定向触达的商业种子线索：12 条。</p>
                  </div>
                )}

                {selectedReportType === 'ai' && (
                  <div className="space-y-2">
                    <span className="text-purple-600 dark:text-purple-400 font-bold block border-b dark:border-slate-800 pb-1 text-xs">=== AI 同频相似度推荐引擎精度及有效性监控 ===</span>
                    <p>【和拍引擎测试参数】</p>
                    <p>• 标签权重设置: 方向 {matchingWeight.direction}% | 学术话题 {matchingWeight.interest}% | 连接意愿 {matchingWeight.goal}%</p>
                    <p>• 推荐覆盖指数(Reach Rate): 100%</p>
                    <p>• 会中同好和拍卡片点击率(Click-Through-Rate): 42.5%</p>
                    <p>• 破冰话术复制率(Icebreaker Copying): 24.8%</p>
                    <p>• 关系双向解密率(Confirmed Swap Rate): {Math.round((totalConfirmedRelations / totalRegistrations) * 100)}%</p>

                    <p className="pt-2">【回归模型健康评定】</p>
                    <p>基于首周数据判定，由方向匹配所生成的破冰请求中，通过率高达80%。这说明在“跨界设计会展”场景中，“共同探索方向”是极强的高效破冰动机，而“企业和资本目标”的推荐点击意愿较低，通常会被主动关闭。算法将在下一场次静默下沉目标权比至 10%。</p>
                  </div>
                )}

              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => alert('报告导出模块运行中！CSV 实体打包已发送至您的注册企业邮箱。💼')}
                  className="bg-slate-900 border border-slate-800 text-white dark:bg-slate-100 dark:text-slate-950 dark:border-slate-200 text-xs font-bold py-2 px-4 rounded-xl flex items-center space-x-1.5"
                >
                  <HardDrive className="h-4 w-4" />
                  <span>导出本段分析报告为 Excel/CSV 包</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      </div>
    </div>
  );
}
