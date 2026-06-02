/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Laptop, Monitor, Sun, Moon, Menu, X, Share2, Award, Users, MessageSquare 
} from 'lucide-react';

import { Attendee, Question, Session, Poll, Exhibit, Connection, BulletMessage } from './types';
import { 
  INITIAL_MY_PROFILE, 
  INITIAL_ATTENDEES, 
  INITIAL_SESSIONS, 
  INITIAL_QUESTIONS, 
  INITIAL_POLLS, 
  INITIAL_EXHIBITS, 
  INITIAL_CONNECTIONS, 
  INITIAL_BULLET_MESSAGES 
} from './data';

import PhoneSimulator from './components/PhoneSimulator';
import SaaSConsole from './components/SaaSConsole';
import LiveScreen from './components/LiveScreen';

export default function App() {
  // App state
  const [myProfile, setMyProfile] = useState<Attendee>(INITIAL_MY_PROFILE);
  const [attendees, setAttendees] = useState<Attendee[]>(INITIAL_ATTENDEES);
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [polls, setPolls] = useState<Poll[]>(INITIAL_POLLS);
  const [exhibits, setExhibits] = useState<Exhibit[]>(INITIAL_EXHIBITS);
  const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);
  const [bulletMessages, setBulletMessages] = useState<BulletMessage[]>(INITIAL_BULLET_MESSAGES);
  
  const [activeSessionId, setActiveSessionId] = useState<string>('sess_1');
  const [eventPhase, setEventPhase] = useState<'before' | 'during' | 'after'>('during');
  
  // Outer Shell settings
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [outerViewMode, setOuterViewMode] = useState<'split' | 'phone' | 'saas' | 'wall'>('split');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Synced states or hooks can be here if needed to react to shifts
  useEffect(() => {
    // If dark mode state changes, toggle 'dark' class on root html document
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#fff5f5]/60 via-[#f0fdfa]/70 to-[#faf5ff] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden transition-all duration-500 font-sans select-none items-center">
        {/* Apple macOS/iOS ambient colored blurs in background */}
        <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-pink-300/30 to-purple-300/10 blur-[130px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-teal-300/20 to-pink-200/30 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>

        {/* Top brand stamp */}
        <div className="w-full max-w-lg flex justify-between items-center relative z-20 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-gradient-to-r from-pink-400 to-teal-400 rounded-full animate-ping"></span>
            <span className="text-[10px] tracking-[0.2em] font-mono font-black text-slate-400 dark:text-slate-500 uppercase">
              CO-DESIGN COLLABORATIVE 2026
            </span>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full border border-pink-100 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 backdrop-blur-md shadow-xs text-slate-500 dark:text-slate-400 hover:scale-105 transition"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Floating Apple-Style Frosted Card with Rotating Fluid Light Border */}
        <div className="max-w-md w-full my-auto relative z-10 flex flex-col items-center">
          
          <div className="w-full p-[2.5px] rounded-[38px] bg-gradient-to-tr from-pink-400 via-teal-300 via-purple-300 to-pink-500 animate-gradient-flow shadow-[0_30px_70px_rgba(244,114,182,0.18)] dark:shadow-[0_30px_70px_rgba(139,92,246,0.12)]">
            
            <div className="apple-glass px-8 py-12 rounded-[36px] border border-white/60 dark:border-white/10 flex flex-col items-center text-center space-y-8">
              
              {/* Logo section */}
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center p-[2px] rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-teal-300">
                  <span className="bg-white dark:bg-slate-950 px-4 py-1 text-[10px] font-mono font-extrabold tracking-[0.25em] text-pink-500 dark:text-pink-400 rounded-full uppercase">
                    WElcoME APPLET
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-teal-400 bg-clip-text text-transparent">
                    WElcoME
                  </span>
                </h1>
              </div>

              {/* Slogan */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-black text-slate-850 dark:text-white tracking-tight leading-tight px-2">
                  “From me to we,<br />欢迎你的加入”
                </h2>
                <div className="w-10 h-[3px] bg-gradient-to-r from-pink-400 to-teal-300 mx-auto rounded-full"></div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium px-4 leading-relaxed">
                  解锁你的专属感官设计性格画。将个体的审美代码融入暖融、克制、极简的学者元自治圈，一碰同频，一触共创。
                </p>
              </div>

              {/* Enter Button */}
              <button
                onClick={() => setShowSplash(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-50 text-white dark:text-slate-950 font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 group mt-2"
                id="enter-applet-btn"
              >
                <span>开启同频之旅</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">✨ ➔</span>
              </button>

            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="w-full max-w-lg flex flex-col md:flex-row items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 font-mono border-t border-slate-200/50 dark:border-slate-800/50 pt-4 z-20 shrink-0">
          <span>CO-CREATION & SCHOLAR NETWORK PORTAL</span>
          <span className="mt-1 md:mt-0">© 2026 WELCOME ALLIANCE • DESIGNER GROUP</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Outer master Header bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 bg-gradient-to-tr from-pink-500 via-purple-500 to-teal-550 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-pink-500/15">
            ME
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-tight text-sm md:text-md uppercase">欢迎ME</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded font-black">
                SaaS Prototype V1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">线上线下触点融合 & 智能学者关系生成系统</p>
          </div>
        </div>

        {/* View mode toggle - desktop */}
        <div className="hidden lg:flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-950 p-1 border dark:border-slate-800 rounded-full text-xs">
          <button
            onClick={() => setOuterViewMode('split')}
            className={`px-3 py-1 rounded-full font-bold flex items-center space-x-1 transition ${
              outerViewMode === 'split' 
                ? 'bg-white dark:bg-slate-850 shadow-xs text-emerald-500' 
                : 'text-slate-500 hover:text-slate-705'
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>极速双屏连结体验馆</span>
          </button>

          <button
            onClick={() => setOuterViewMode('phone')}
            className={`px-3 py-1 rounded-full font-bold flex items-center space-x-1 transition ${
              outerViewMode === 'phone' 
                ? 'bg-white dark:bg-slate-850 shadow-xs text-emerald-500' 
                : 'text-slate-500 hover:text-slate-705'
            }`}
          >
            <span className="scale-90">📱</span>
            <span>小程序端 (Phone)</span>
          </button>

          <button
            onClick={() => setOuterViewMode('saas')}
            className={`px-3 py-1 rounded-full font-bold flex items-center space-x-1 transition ${
              outerViewMode === 'saas' 
                ? 'bg-white dark:bg-slate-850 shadow-xs text-emerald-500' 
                : 'text-slate-500 hover:text-slate-705'
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>主办方SaaS后台 (Console)</span>
          </button>

          <button
            onClick={() => setOuterViewMode('wall')}
            className={`px-3 py-1 rounded-full font-bold flex items-center space-x-1 transition ${
              outerViewMode === 'wall' 
                ? 'bg-white dark:bg-slate-850 shadow-xs text-emerald-500' 
                : 'text-slate-500 hover:text-slate-705'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>现场脉冲大幕 (LED Wall)</span>
          </button>
        </div>

        {/* Global Toolbar actions */}
        <div className="flex items-center space-x-4">
          
          {/* Light/Dark mode toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 transition"
            title="切换深海黑/春山白主调"
          >
            {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* Hamburger menu for mobile only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 transition"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile navigation side drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 space-y-1.5 relative z-40 animate-slideDown">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest px-2.5">切换极速沙盒视图</p>
          <button
            onClick={() => { setOuterViewMode('split'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              outerViewMode === 'split' ? 'bg-emerald-500/10 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span>✨</span>
            <span>推荐：极速双屏连结模式</span>
          </button>
          
          <button
            onClick={() => { setOuterViewMode('phone'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              outerViewMode === 'phone' ? 'bg-emerald-500/10 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span>📱</span>
            <span>小程序仿真端单独看</span>
          </button>

          <button
            onClick={() => { setOuterViewMode('saas'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              outerViewMode === 'saas' ? 'bg-emerald-500/10 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span>💻</span>
            <span>主办方SaaS后台单独看</span>
          </button>

          <button
            onClick={() => { setOuterViewMode('wall'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              outerViewMode === 'wall' ? 'bg-emerald-500/10 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span>📺</span>
            <span>会场LED大屏幕单独看</span>
          </button>
        </div>
      )}

      {/* Master Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-10 py-6 flex flex-col justify-start">
        
        {/* Helper guide ribbon representing interactive traits */}
        <div className="bg-gradient-to-r from-pink-500/10 via-teal-500/5 to-purple-500/10 p-3.5 rounded-2xl mb-5 border border-pink-205/30 text-xs text-slate-700 dark:text-slate-300 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm animate-fadeIn select-none">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4.5 w-4.5 text-pink-500 shrink-0 animate-pulse" />
            <p className="leading-relaxed font-medium">
              <strong>💡 马卡龙同频联动指南：</strong>
              在左侧「极客手机仿真端」扫码签到、选择彩色属性、触碰展品或发弹幕；右侧的「主办方 SaaS 后台」跟下方「投影墙」即刻联动，生成多彩足迹！
            </p>
          </div>
          <span className="text-[10px] bg-white dark:bg-slate-800 text-pink-600 font-bold px-3 py-1 rounded-full font-mono shrink-0 text-center border border-pink-100 dark:border-pink-950/20">
            马卡龙离线同步已开启
          </span>
        </div>

        {/* Master layout switch wrapper */}
        {(() => {
          // If outer viewport is small/mobile, default to responsive single stack instead of split to ensure extreme usability
          const isSplitView = outerViewMode === 'split';

          return (
            <div className={`grid grid-cols-1 ${isSplitView ? 'lg:grid-cols-12' : ''} gap-8 md:gap-10 items-stretch`}>
              
              {/* Box A: The Phone Simulator (Micro App) */}
              {(isSplitView || outerViewMode === 'phone') && (
                <div className={`${isSplitView ? 'lg:col-span-4' : 'w-full'} flex flex-col px-1.5`}>
                  <div className="text-center mb-1 lg:hidden">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest select-none">📱 手机端仿真视图</span>
                  </div>
                  <PhoneSimulator
                    myProfile={myProfile}
                    setMyProfile={setMyProfile}
                    attendees={attendees}
                    setAttendees={setAttendees}
                    sessions={sessions}
                    setSessions={setSessions}
                    questions={questions}
                    setQuestions={setQuestions}
                    polls={polls}
                    setPolls={setPolls}
                    exhibits={exhibits}
                    setExhibits={setExhibits}
                    connections={connections}
                    setConnections={setConnections}
                    bulletMessages={bulletMessages}
                    setBulletMessages={setBulletMessages}
                    activeSessionId={activeSessionId}
                    setActiveSessionId={setActiveSessionId}
                    eventPhase={eventPhase}
                    isDarkMode={isDarkMode}
                  />
                </div>
              )}

              {/* Box B: Dashboard Console / Live LED Screens */}
              {(isSplitView || outerViewMode === 'saas' || outerViewMode === 'wall') && (
                <div className={`${isSplitView ? 'lg:col-span-8' : 'w-full'} flex flex-col space-y-4`}>
                  
                  {/* SaaS Console content */}
                  {(isSplitView || outerViewMode === 'saas') && (
                    <SaaSConsole
                      myProfile={myProfile}
                      setMyProfile={setMyProfile}
                      attendees={attendees}
                      setAttendees={setAttendees}
                      sessions={sessions}
                      setSessions={setSessions}
                      questions={questions}
                      setQuestions={setQuestions}
                      polls={polls}
                      setPolls={setPolls}
                      exhibits={exhibits}
                      setExhibits={setExhibits}
                      connections={connections}
                      bulletMessages={bulletMessages}
                      setBulletMessages={setBulletMessages}
                      activeSessionId={activeSessionId}
                      setActiveSessionId={setActiveSessionId}
                      eventPhase={eventPhase}
                      setEventPhase={setEventPhase}
                      isDarkMode={isDarkMode}
                      isSplit={outerViewMode === 'split'}
                    />
                  )}

                  {/* Wall projector spotlight */}
                  {(isSplitView || outerViewMode === 'wall') && (
                    <LiveScreen
                      questions={questions}
                      polls={polls}
                      bulletMessages={bulletMessages}
                      activeSessionId={activeSessionId}
                      isSplit={outerViewMode === 'split'}
                    />
                  )}

                </div>
              )}

            </div>
          );
        })()}

      </main>

      {/* Footer copyright */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-3 text-center text-[10px] text-slate-400 font-mono select-none">
        <p>© 2026 欢迎ME (WelcomeME) SaaS & 小程序生态体系 • 版权所有</p>
      </footer>

    </div>
  );
}
