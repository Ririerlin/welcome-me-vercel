/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

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
import AdminDashboard from './components/AdminDashboard';

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
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

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

  if (isAdminRoute) {
    return (
      <AdminDashboard
        myProfile={myProfile}
        setMyProfile={setMyProfile}
        attendees={attendees}
        setAttendees={setAttendees}
        sessions={sessions}
        setSessions={setSessions}
        questions={questions}
        setQuestions={setQuestions}
        polls={polls}
        exhibits={exhibits}
        setExhibits={setExhibits}
        connections={connections}
        setConnections={setConnections}
        bulletMessages={bulletMessages}
        setBulletMessages={setBulletMessages}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    );
  }

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
      <header className="hidden md:flex bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 bg-gradient-to-tr from-pink-500 via-purple-500 to-teal-550 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-pink-500/15">
            ME
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-tight text-sm md:text-md uppercase">欢迎ME</span>
              <span className="text-[10px] bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/25 px-1.5 py-0.5 rounded font-black">
                Phone Experience
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">欢迎ME 小程序独立展示页</p>
          </div>
        </div>

        {/* Global Toolbar actions */}
        <div className="flex items-center">
          
          {/* Light/Dark mode toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 transition"
            title="切换深海黑/春山白主调"
          >
            {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
        </div>
      </header>

      {/* Master Content Area */}
      <main className="phone-only-shell flex-1 w-full mx-auto px-0 md:px-10 py-0 md:py-8 flex flex-col items-center justify-center">
        <div className="w-full flex justify-center items-center">
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

      </main>

      {/* Footer copyright */}
      <footer className="hidden md:block bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-3 text-center text-[10px] text-slate-400 font-mono select-none">
        <p>© 2026 欢迎ME (WelcomeME) SaaS & 小程序生态体系 • 版权所有</p>
      </footer>

    </div>
  );
}
