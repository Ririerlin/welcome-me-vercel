/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Sparkles, MessageSquare, Vote, Activity, Zap } from 'lucide-react';
import { Question, Poll, BulletMessage } from '../types';

interface LiveScreenProps {
  questions: Question[];
  polls: Poll[];
  bulletMessages: BulletMessage[];
  activeSessionId: string;
  isSplit?: boolean;
}

export default function LiveScreen({
  questions,
  polls,
  bulletMessages,
  activeSessionId,
  isSplit
}: LiveScreenProps) {
  // Simulate active bullet messages cruising across the screen
  const approvedBullets = bulletMessages.filter(b => b.status === 'approved');
  const [tickerOffset, setTickerOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerOffset(prev => (prev + 1) % 400);
    }, 45);
    return () => clearInterval(timer);
  }, []);

  const activePoll = polls.find(p => p.sessionId === activeSessionId && p.isLive) || polls[0];
  const topQuestions = questions
    .filter(q => q.sessionId === activeSessionId && q.status === 'approved')
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 2);

  const totalPollVotes = activePoll ? activePoll.votes.reduce((a, b) => a + b, 0) : 0;

  return (
    <div className={`bg-slate-950 text-white rounded-[24px] border border-slate-800 shadow-2xl font-sans relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${isSplit ? 'h-[265px] p-4 py-3.5 space-y-2' : 'min-h-[460px] lg:h-[500px] p-5.5 space-y-4'}`}>
      
      {/* Dynamic ambient laser mesh background */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-500/10 via-pink-500/5 to-transparent pointer-events-none"></div>

      {/* Header marquee */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10 shrink-0">
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-pink-550 animate-pulse"></span>
          <span className="text-[10px] uppercase tracking-widest font-mono text-slate-450">会场 LED 实时上墙大屏幕 (Live Projector Wall)</span>
        </div>
        <div className="text-[10px] text-pink-400 font-bold bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded flex items-center">
          <Activity className="h-3 w-3 mr-1 animate-spin text-pink-400" />
          <span>会场脉冲实时同步中</span>
        </div>
      </div>

      {/* 1. Floating Bullet Screen simulation area (Scroll horizontal) */}
      <div className="h-10 border-b border-dashed border-white/5 relative z-10 flex items-center overflow-hidden shrink-0">
        <div 
          className="flex space-x-6 whitespace-nowrap text-xs text-slate-100 font-semibold absolute transition-transform"
          style={{ transform: `translateX(-${tickerOffset}px)` }}
        >
          {approvedBullets.length === 0 ? (
            <span className="text-slate-500 italic text-[11px]">【静音模式】等待第一条弹幕划过...发弹幕将在主屏滚动！</span>
          ) : (
            [...approvedBullets, ...approvedBullets].map((b, i) => (
              <span key={i} className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-teal-500/15 border border-pink-500/30 px-3 py-1 rounded-full shadow-lg">
                <span className="text-yellow-400 text-[10px]">{b.userAvatarEmoji}</span>
                <span className="text-pink-300 font-bold">{b.userNick}:</span>
                <span className="text-white font-normal">{b.content}</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* 2. Main Live Grid (Poll metrics + Upvoted questions) */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${isSplit ? 'gap-3 my-0.5 overflow-hidden' : 'gap-4 my-2'} relative z-10 flex-1`}>
        
        {/* Left pane: Active Poll live graph bar */}
        {activePoll ? (
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[8px] tracking-widest text-slate-400 font-extrabold flex items-center uppercase">
                <Vote className="h-3 w-3 text-pink-400 mr-1" /> 实时大投票 live graph
              </span>
              <h4 className="text-[11px] font-bold tracking-tight text-slate-100">{activePoll.question}</h4>
            </div>

            <div className="space-y-2.5 mt-2">
              {activePoll.options.map((option, idx) => {
                const votes = activePoll.votes[idx];
                const percent = totalPollVotes > 0 ? Math.round((votes / totalPollVotes) * 100) : 0;
                
                return (
                  <div key={idx} className="space-y-0.5 text-[10px] leading-snug">
                    <div className="flex justify-between text-slate-300">
                      <span className="truncate max-w-[190px]">{option}</span>
                      <span className="font-mono text-pink-400 font-bold">{percent}% ({votes}票)</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-pink-400 to-purple-500 h-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-center text-slate-550 text-xs">
            暂无进行中的全场投票
          </div>
        )}

        {/* Right pane: Top upvoted questions being spotlighted */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col justify-between space-y-2">
          <div className="space-y-0.5 border-b border-white/5 pb-1 flex items-center justify-between">
            <span className="text-[8px] tracking-widest text-slate-400 font-extrabold flex items-center uppercase">
              <MessageSquare className="h-3 w-3 text-purple-400 mr-1" /> 观众热烈追问 Q&A Spotlight
            </span>
            <span className="text-[8px] text-slate-500 font-mono">按举赞度更新置顶</span>
          </div>

          <div className={`space-y-2.5 flex-1 overflow-y-auto ${isSplit ? 'max-h-[85px]' : 'max-h-[140px]'} pr-1`}>
            {topQuestions.length === 0 ? (
              <div className="text-[11px] text-slate-550 text-center py-4 italic">暂无上墙提问。进入手机会场，举赞即可同步展出！</div>
            ) : (
              topQuestions.map(q => (
                <div key={q.id} className="bg-white/5 border border-white/10 p-2.5 rounded-xl space-y-1 text-[11px] leading-relaxed">
                  <div className="flex items-center justify-between text-[9px] text-slate-400">
                    <span className="font-bold flex items-center">
                      <span className="inline-block h-1 w-1 bg-pink-500 rounded-full mr-1"></span>
                      {q.userNick}
                    </span>
                    <span className="font-mono text-pink-400 font-extrabold">▲ {q.upvotes} 举赞推荐</span>
                  </div>
                  <p className="text-slate-100 font-normal leading-normal">{q.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Footer ticker info */}
      <div className="text-slate-400 text-[9px] font-mono border-t border-white/10 pt-2 flex justify-between items-center relative z-10 shrink-0">
        <span className="flex items-center"><Zap className="h-3 w-3 text-pink-400 mr-1 animate-bounce" /> 一碰破冰：靠近或贴一贴你身边具有 欢迎ME 标识的会伴，解锁多彩同频人脉！</span>
        <span>2026-05-25 09:41 周一</span>
      </div>

    </div>
  );
}
