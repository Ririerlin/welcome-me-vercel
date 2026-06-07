/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, IdCard, QrCode, Vote, Award, MessageSquare, Users, 
  Settings, Home, Compass, Tag, Plus, Search, Share2, Map, 
  Cpu, Zap, Sparkles, Check, ExternalLink, X, Lock, Send, 
  MessageCircle, FileText, Heart, Bookmark, ChevronRight, RefreshCw, AlertCircle, Activity,
  ArrowLeftRight, Coffee, Calendar, Briefcase, BarChart3, Download
} from 'lucide-react';
import { Attendee, Ticket, Session, Question, Poll, Exhibit, Connection, BulletMessage } from '../types';

interface PhoneSimulatorProps {
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
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  bulletMessages: BulletMessage[];
  setBulletMessages: React.Dispatch<React.SetStateAction<BulletMessage[]>>;
  activeSessionId: string;
  setActiveSessionId: React.Dispatch<React.SetStateAction<string>>;
  eventPhase: 'before' | 'during' | 'after';
  isDarkMode: boolean;
}

const ANTHROPOMORPHIC_AVATARS = [
  { emoji: '🦊', label: '智慧狐', desc: '智慧探学狐 (思辨)' },
  { emoji: '🐼', label: '禅意熊', desc: '生态治愈熊猫 (自然)' },
  { emoji: '🦁', label: '创意狮', desc: '硬核狂飙金狮 (创新)' },
  { emoji: '🤖', label: '机械姬', desc: '智联感知姬 (物性)' },
  { emoji: '🦉', label: '智慧鸮', desc: '理性夜行神鸮 (批判)' },
  { emoji: '🐱', label: '赛博猫', desc: '灵感媒介妙妙猫 (乐趣)' },
  { emoji: '🦄', label: '未来兽', desc: '时空浪人独角兽 (推测)' },
  { emoji: '👾', label: '像素妖', desc: '硬核漏洞红发妖 (代码)' },
  { emoji: '🐸', label: '整活蛙', desc: '互动整活鸣蛙 (装置)' },
  { emoji: '🐨', label: '考拉松', desc: '无碳温顺树袋熊 (环保)' },
  { emoji: '🐯', label: '键盘虎', desc: '狂野代码猛虎 (效率)' },
  { emoji: '🧙‍♂️', label: '体验巫', desc: '感官魔法使 (美学)' }
];



const DESIGNER_AVATAR_OPTIONS = [
  { id: 'designer-avatar-01', name: '锋利平面设计师', imageUrl: '/images/avatars/designer-avatar-01.webp', colorClass: 'bg-rose-500', emoji: '✒️' },
  { id: 'designer-avatar-02', name: '梦幻插画师', imageUrl: '/images/avatars/designer-avatar-02.webp', colorClass: 'bg-violet-500', emoji: '🪻' },
  { id: 'designer-avatar-03', name: '精准字体设计师', imageUrl: '/images/avatars/designer-avatar-03.webp', colorClass: 'bg-slate-700', emoji: '🔠' },
  { id: 'designer-avatar-04', name: '时尚艺术总监', imageUrl: '/images/avatars/designer-avatar-04.webp', colorClass: 'bg-stone-700', emoji: '🌹' },
  { id: 'designer-avatar-05', name: '活力品牌设计师', imageUrl: '/images/avatars/designer-avatar-05.webp', colorClass: 'bg-blue-500', emoji: '🙂' },
  { id: 'designer-avatar-06', name: '可持续设计师', imageUrl: '/images/avatars/designer-avatar-06.webp', colorClass: 'bg-emerald-600', emoji: '🌿' },
  { id: 'designer-avatar-07', name: '复古视觉设计师', imageUrl: '/images/avatars/designer-avatar-07.webp', colorClass: 'bg-amber-700', emoji: '📷' },
  { id: 'designer-avatar-08', name: '未来动效设计师', imageUrl: '/images/avatars/designer-avatar-08.webp', colorClass: 'bg-indigo-600', emoji: '🌀' },
  { id: 'designer-avatar-09', name: '工业产品设计师', imageUrl: '/images/avatars/designer-avatar-09.webp', colorClass: 'bg-orange-500', emoji: '🧩' },
  { id: 'designer-avatar-10', name: '服务体验设计师', imageUrl: '/images/avatars/designer-avatar-10.webp', colorClass: 'bg-teal-600', emoji: '💚' },
  { id: 'designer-avatar-11', name: '建筑空间设计师', imageUrl: '/images/avatars/designer-avatar-11.webp', colorClass: 'bg-sky-700', emoji: '🏛️' },
  { id: 'designer-avatar-12', name: '包装策略设计师', imageUrl: '/images/avatars/designer-avatar-12.webp', colorClass: 'bg-green-700', emoji: '📦' }
];

const MBTI_OPTIONS = [
  { value: 'ENFP - 灵感策动机 (感官魔法使)', label: 'ENFP 魔法使' },
  { value: 'INTJ - 战略策划家 (冷酷架构师)', label: 'INTJ 架构师' },
  { value: 'INFJ - 愿景洞察者 (终极观察员)', label: 'INFJ 观察员' },
  { value: 'ENTP - 批判辩论者 (混沌整活客)', label: 'ENTP 整活客' },
  { value: 'ISTP - 技术实践师 (硬核动手党)', label: 'ISTP 动手党' },
  { value: 'INFP - 治愈系空想家 (浪漫听风者)', label: 'INFP 听风者' },
  { value: 'ENTJ - 宏图指令领袖 (先锋主理人)', label: 'ENTJ 领路人' },
  { value: 'ENFJ - 移情共鸣使者 (心智布道官)', label: 'ENFJ 布道官' },
  { value: 'INTP - 逻辑代码冥想者 (硅基思考怪)', label: 'INTP 思考怪' },
  { value: 'ISFP - 纯粹感性漫游者 (吟游美学家)', label: 'ISFP 漫游者' },
  { value: 'ESTP - 激进行动拓荒者 (感官狂欢师)', label: 'ESTP 狂欢师' },
  { value: 'ESTJ - 重度秩序护卫者 (规则构架主)', label: 'ESTJ 规则家' }
];

const ARCHETYPE_OPTIONS = [
  { value: '非线性体验感官幽灵', label: '非线性感官幽灵 (体验探究)' },
  { value: '多模态生成媒介狂徒', label: '多模态媒介狂徒 (人工智能)' },
  { value: '重度材质极物主义者', label: '重度材质细节控 (触觉质感)' },
  { value: '硅基生态算法德鲁伊', label: '算法德鲁伊 (绿色气候)' },
  { value: '深蓝批判逻辑思想家', label: '批判思想审判长 (代码哲学)' },
  { value: '情感自适应人格驯兽师', label: '情感硬件造物狂 (具身感应)' },
  { value: '推测未来纪元史官', label: '未来纪元史官 (社会创新)' },
  { value: '低碳生物可降解胶囊人', label: '生物可降解胶囊人 (生态再生)' },
  { value: '赛博非遗数字考古学家', label: '数字化非遗考古 (传统硬木)' },
  { value: '赛博朋克义肢造物主', label: '赛博朋克具身造物 (假肢感官)' }
];

export default function PhoneSimulator({
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
  setConnections,
  bulletMessages,
  setBulletMessages,
  activeSessionId,
  setActiveSessionId,
  eventPhase,
  isDarkMode
}: PhoneSimulatorProps) {
  // Mobile navigation compressed into 4 tabs for optimal UX
  const [activeTab, setActiveTab ] = useState<'home' | 'me' | 'co' | 'we'>('home');
  
  // Onboarding/On-demand authentication states (requested by user)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login input values
  const [loginSelectedId, setLoginSelectedId] = useState<'me' | 'user_1' | 'user_2'>('me');
  const [loginPhone, setLoginPhone] = useState('138-1234-5678');
  
  // Register input values
  const [regNick, setRegNick] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regTitle, setRegTitle] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regMbti, setRegMbti] = useState('INTJ - 战略策划家 (冷酷架构师)');
  const [regArchetype, setRegArchetype] = useState('非线性体验感官幽灵');
  const [regEmoji, setRegEmoji] = useState('🦊');
  const [regAvatarImage, setRegAvatarImage] = useState('');
  const [regActiveColor, setRegActiveColor] = useState('bg-indigo-500');
  const [regSelectedDirections, setRegSelectedDirections] = useState<string[]>(['体验探究', '人机交互']);
  const [regSelectedInterests, setRegSelectedInterests] = useState<string[]>(['人工智能交互', '实体硬软件共生']);
  const [regWorkTitle, setRegWorkTitle] = useState('');
  const [regWorkDesc, setRegWorkDesc] = useState('');
  const [regWorkImage, setRegWorkImage] = useState('');
  const [regEventName, setRegEventName] = useState('');
  const [regEventRole, setRegEventRole] = useState('');

  // States
  const [nfcTapping, setNfcTapping] = useState<boolean>(false);
  const [activeSessionTab, setActiveSessionTab] = useState<'sessions' | 'exhibits'>('sessions');
  const [selectedExId, setSelectedExId] = useState<string | null>(null);
  const [radarScanning, setRadarScanning] = useState<boolean>(true);
  
  // Inputs
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newBulletText, setNewBulletText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [surveyStep, setSurveyStep] = useState<number>(0);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [reportGeneratedAt, setReportGeneratedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedProfile = window.localStorage.getItem('welcomeMeProfile');
      const savedLoggedIn = window.localStorage.getItem('welcomeMeLoggedIn');
      const savedConnections = window.localStorage.getItem('welcomeMeConnections');
      if (savedProfile) {
        setMyProfile(JSON.parse(savedProfile));
      }
      if (savedConnections) {
        setConnections(JSON.parse(savedConnections));
      }
      if (savedLoggedIn === '1') {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.warn('读取本地档案失败', error);
    }
  }, [setMyProfile, setConnections]);

  useEffect(() => {
    try {
      if (isLoggedIn) {
        window.localStorage.setItem('welcomeMeProfile', JSON.stringify(myProfile));
      }
      window.localStorage.setItem('welcomeMeLoggedIn', isLoggedIn ? '1' : '0');
    } catch (error) {
      console.warn('写入本地档案失败', error);
    }
  }, [myProfile, isLoggedIn]);

  useEffect(() => {
    try {
      window.localStorage.setItem('welcomeMeConnections', JSON.stringify(connections));
    } catch (error) {
      console.warn('写入通讯录失败', error);
    }
  }, [connections]);

  const triggerToast = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3500);
  };

  const handleSwitchAccount = () => {
    setIsLoggedIn(false);
    setAuthMode('login');
    setActiveTab('home');
    setSelectedProfileAttendee(null);
    setActiveChatAttendee(null);
    try {
      window.localStorage.setItem('welcomeMeLoggedIn', '0');
    } catch (error) {
      console.warn('切换账号状态写入失败', error);
    }
    triggerToast('已返回登录页，可选择其他账号或重新注册');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthMode('login');
    setActiveTab('home');
    setSelectedProfileAttendee(null);
    setActiveChatAttendee(null);
    try {
      window.localStorage.removeItem('welcomeMeProfile');
      window.localStorage.setItem('welcomeMeLoggedIn', '0');
    } catch (error) {
      console.warn('退出登录清理失败', error);
    }
    triggerToast('已退出登录，当前设备不会继续自动进入账号');
  };

  const readImageAsDataUrl = (file: File, callback: (value: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      callback(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRegisterAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    readImageAsDataUrl(file, (result) => {
      setRegAvatarImage(result);
      triggerToast('头像已上传，可继续注册');
    });
  };

  const handleProfileAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    readImageAsDataUrl(file, (result) => {
      setMyProfile({ ...myProfile, avatarImage: result });
      triggerToast('头像已更新并保存在本机');
    });
  };

  const handleWorkImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setRegWorkImage(result);
      triggerToast('作品图片已添加，可继续完善或直接跳过');
    };
    reader.readAsDataURL(file);
  };

  // Social community, chat and meetup states
  const [weSubTab, setWeSubTab] = useState<'radar' | 'contacts' | 'community'>('radar');
  const [activeChatAttendee, setActiveChatAttendee] = useState<Attendee | null>(null);
  const [selectedProfileAttendee, setSelectedProfileAttendee] = useState<Attendee | null>(null);
  
  // Seed initial values for private chats with User 2 (Mia)
  const [chatLogs, setChatLogs] = useState<Record<string, {
    id: string;
    senderId: 'me' | string;
    content: string;
    createdAt: string;
    isMeetupInvite?: boolean;
    meetupDetails?: {
      timeSlot: string;
      agenda: string;
      status: 'pending' | 'accepted' | 'declined';
    }
  }[]>>({
    'user_2': [
      {
        id: 'msg_1',
        senderId: 'user_2',
        content: '嗨！陆老师！你在主旨讲堂吗？刚刚听到你对非线性体验的提问了，真是太有启发了。',
        createdAt: '10:10'
      },
      {
        id: 'msg_2',
        senderId: 'me',
        content: '嗨，米亚！是的，我还在会场。你的自适应感知模型也超级酷，感觉我们能合力脑暴些大点子！',
        createdAt: '10:15'
      },
      {
        id: 'msg_3',
        senderId: 'user_2',
        content: '太棒了！我们可以约时间具体探讨下。会场一楼的中庭茶歇区挺安静的，你茶歇时间方便吗？',
        createdAt: '10:18'
      }
    ]
  });

  // Custom text input for private chat
  const [privateMsgText, setPrivateMsgText] = useState<string>('');
  
  // Custom states for Meetup Scheduling inside chat
  const [meetupTimeSelection, setMeetupTimeSelection] = useState<string>('下午茶歇 15:40 - 16:10');
  const [meetupAgendaSelection, setMeetupAgendaSelection] = useState<string>('探讨具身控制和传感器感知细节');
  const [showMeetupModal, setShowMeetupModal] = useState<boolean>(false);

  // States for Community Join Status and Lounge chats
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  
  const [communityChats, setCommunityChats] = useState<Record<string, {
    id: string;
    userNick: string;
    avatarEmoji: string;
    avatarColor: string;
    text: string;
    createdAt: string;
  }[]>>({
    'comm-druids': [
      { id: 'cd_1', userNick: '季雨桐', avatarEmoji: '🦊', avatarColor: 'bg-amber-500', text: '大家试了那个土壤发电装置吗？光纤随着微生物供氧在呼吸闪亮！', createdAt: '10:50' },
      { id: 'cd_2', userNick: '陈青川', avatarEmoji: '🐼', avatarColor: 'bg-teal-500', text: '对！这应该写进咱们会后的「微气候公共生态介入」联合项目申请书！', createdAt: '10:52' }
    ],
    'comm-spectre': [
      { id: 'cs_1', userNick: '苏格 Dr.Su', avatarEmoji: '🦉', avatarColor: 'bg-rose-400', text: '气味采样陶罐能瞬间调出人体海马体的环境意识，感觉比纯屏幕刺激有灵性。', createdAt: '11:02' },
      { id: 'cs_2', userNick: '陈青川', avatarEmoji: '🐼', avatarColor: 'bg-teal-500', text: '新唯物主义讲究物质自说其话，气味确实是极佳的空气幽灵介质。', createdAt: '11:05' }
    ],
    'comm-wizards': [
      { id: 'cw_1', userNick: '米亚 Mia', avatarEmoji: '🤖', avatarColor: 'bg-indigo-500', text: '拿到AI Studio给的免费GPU接口跟十套开源感知板了，咱们怎么整活？', createdAt: '11:10' },
      { id: 'cw_2', userNick: '张赫轩 Mark', avatarEmoji: '🐯', avatarColor: 'bg-purple-600', text: '必须把XR增强实体给加上去，最好把我们的智能心脏律动声音挂到一楼！', createdAt: '11:12' }
    ],
    'comm-court': [
      { id: 'cc_1', userNick: '苏格 Dr.Su', avatarEmoji: '🦉', avatarColor: 'bg-rose-400', text: '本届最大的槽点：用算法同步人心相似度，这本身就是另外一种理性的数字冷血狂欢。', createdAt: '11:15' },
      { id: 'cc_2', userNick: '米亚 Mia', avatarEmoji: '🤖', avatarColor: 'bg-indigo-500', text: '哈哈哈苏教授一如既往地毒辣，不过这也激起了有趣的认知张力。', createdAt: '11:18' }
    ]
  });

  const [communityMsgInput, setCommunityMsgInput] = useState<string>('');

  const sendPrivateMessage = (content: string, isMeetupInvite = false) => {
    if (!activeChatAttendee) return;
    const destId = activeChatAttendee.id;
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      content: content,
      createdAt: '11:59 GMT+8',
      isMeetupInvite,
      meetupDetails: isMeetupInvite ? {
        timeSlot: meetupTimeSelection,
        agenda: meetupAgendaSelection,
        status: 'pending' as const
      } : undefined
    };

    const currentLogs = chatLogs[destId] || [];
    const updatedLogs = [...currentLogs, newMsg];
    setChatLogs(prev => ({
      ...prev,
      [destId]: updatedLogs
    }));

    if (isMeetupInvite) {
      triggerToast('☕ 已向对方发出茶歇与空闲约见信号...');
    }

    // Auto simulated recipient reply!
    setTimeout(() => {
      let replyContent = '';
      if (isMeetupInvite) {
        replyContent = `太棒了！我也很期待和你面对面碰头。那我定个闹钟，咱们在 「${meetupTimeSelection.split(' ')[0]}」去一楼中庭茶歇咖啡台共享手冲咖啡，顺便拿着深入聊聊：「${meetupAgendaSelection}」！🤝`;
      } else {
        replyContent = `【学者心灵共振】收到！你说的非常到点。我完全赞同咱们在设计思辨上进行非正统耦合。等会儿在茶歇咱们碰杯详谈！☕`;
      }

      // Add their reply
      const replyMsg = {
        id: `msg_${Date.now() + 1}`,
        senderId: destId,
        content: replyContent,
        createdAt: '12:00 GMT+8',
        isMeetupInvite: isMeetupInvite,
        meetupDetails: isMeetupInvite ? {
          timeSlot: meetupTimeSelection,
          agenda: meetupAgendaSelection,
          status: 'accepted' as const
        } : undefined
      };

      // update the logs with accepted status on the original invite
      setChatLogs(prev => {
        const logs = prev[destId] || [];
        const list = logs.map(m => {
          if (m.isMeetupInvite && m.meetupDetails) {
            return {
              ...m,
              meetupDetails: {
                ...m.meetupDetails,
                status: 'accepted' as const
              }
            };
          }
          return m;
        });
        return {
          ...prev,
          [destId]: [...list, replyMsg]
        };
      });

      triggerToast(`🎉 【${activeChatAttendee.nickName}】已感应您的心灵呼唤，确认了您的茶歇约见！`);
    }, 2500);
  };

  // Predefined Macaron-themed tag options
  const tagCategories = {
    designDirections: ['体验探究', '人机交互', '算法辅助', '绿色可持续', '新美学思辨', '空间治愈', '批判性写作', '实体硬软件共生'],
    interests: ['人工智能交互', '实体硬软件共生', '社会创新设计', '新唯物主义', '低碳材质', '算法艺术', '生态共振', '实时计算机视觉'],
    goals: ['寻找项目技术合伙人', '发现前沿艺术灵感', '扩展华东设计学术圈', '推广自己工作室', '招募资深设计实习生', '寻求投资和商业合伙']
  };

  // Helper check connections
  const getConnectionState = (otherId: string) => {
    return connections.find(c => 
      (c.fromUserId === 'me' && c.toUserId === otherId) || 
      (c.fromUserId === otherId && c.toUserId === 'me')
    );
  };

  // Calculate matching score
  const calculateMatchScore = (other: Attendee) => {
    const myTags = [...myProfile.designDirections, ...myProfile.interests, ...myProfile.goals];
    const otherTags = [...other.designDirections, ...other.interests, ...other.goals];
    const commons = myTags.filter(t => otherTags.includes(t));
    const base = 45;
    const add = commons.length * 15;
    return Math.min(99, base + add);
  };

  // Turn auto scanning off after a short time or keep it active
  useEffect(() => {
    if (activeTab === 'we') {
      setRadarScanning(true);
      const timer = setTimeout(() => setRadarScanning(false), 2400);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const countApprovedQuestions = questions.filter(q => q.sessionId === activeSessionId && q.status === 'approved').length;

  const myBulletCount = bulletMessages.filter((b) => b.userNick === myProfile.nickName).length;
  const myFavoritedExhibits = exhibits.filter((e) => e.isLikedByUser || e.isFavoritedByUser).length;
  const confirmedConnections = connections.filter((c) => c.status === 'confirmed').length;
  const activeConnections = connections.filter((c) => c.fromUserId === 'me' || c.toUserId === 'me').length;
  const myContactCards = connections
    .filter((conn) => conn.fromUserId === 'me' || conn.toUserId === 'me')
    .map((conn) => {
      const otherId = conn.fromUserId === 'me' ? conn.toUserId : conn.fromUserId;
      const attendee = attendees.find((item) => item.id === otherId);
      return attendee ? { connection: conn, attendee } : null;
    })
    .filter((item): item is { connection: Connection; attendee: Attendee } => Boolean(item));
  const confirmedContactCards = myContactCards.filter((item) => item.connection.status === 'confirmed');
  const pendingContactCards = myContactCards.filter((item) => item.connection.status === 'pending');
  const mySessionBookmarks = sessions.filter((s) => s.isSubscribed).length;

  const focusDirectionValues = myProfile.designDirections.slice(0, 4).map((item, index) => ({
    label: item,
    value: Math.max(58, Math.min(96, myProfile.personaCompletion - 4 + index * 8))
  }));

  const reportMetrics = [
    {
      label: '参会完成度',
      value: Math.min(98, myProfile.personaCompletion + 12),
      accent: 'from-pink-500 to-purple-500'
    },
    {
      label: '同行连接度',
      value: Math.min(95, 52 + activeConnections * 12),
      accent: 'from-teal-400 to-cyan-500'
    },
    {
      label: '互动活跃度',
      value: Math.min(96, 46 + myBulletCount * 10 + myFavoritedExhibits * 6),
      accent: 'from-amber-400 to-orange-500'
    }
  ];

  const reportTimeline = [
    { time: myProfile.checkedInAt || '09:12', title: '完成现场签到', detail: '通行证与身份卡完成核销，同步激活个人行为记录。' },
    { time: '10:20', title: '进入主旨会场', detail: `已关注 ${sessions[0]?.title || '主旨议程'}，系统记录你的高兴趣主题。` },
    { time: '11:05', title: '互动参与', detail: `已产生 ${myBulletCount} 条互动记录，并关注 ${myFavoritedExhibits} 个展品灵感。` },
    { time: '14:30', title: '建立同频连接', detail: `当前已建立 ${activeConnections} 个连接线索，正在生成会后合作建议。` }
  ];

  const reportHighlights = [
    {
      title: '人物画像',
      value: myProfile.mbti || '跨界体验策展人',
      note: myProfile.designArchetype || '具身智能观察者',
      color: 'bg-pink-500/10 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300'
    },
    {
      title: '现场角色',
      value: myProfile.title || '参会学者',
      note: myProfile.organization || '欢迎ME 大会',
      color: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300'
    },
    {
      title: '合作倾向',
      value: myProfile.goals?.[0] || '寻找合作伙伴',
      note: `推荐优先对接 ${attendees[1]?.nickName || '同频嘉宾'}` ,
      color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300'
    }
  ];

  const downloadPersonalReport = () => {
    const timeLabel = reportGeneratedAt || new Date().toLocaleString('zh-CN', { hour12: false });
    const chartRows = focusDirectionValues.map(item => `
      <div style="margin:12px 0">
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#42526b;margin-bottom:6px"><span>${item.label}</span><span>${item.value}%</span></div>
        <div style="height:10px;border-radius:999px;background:#e8ecf5;overflow:hidden">
          <div style="width:${item.value}%;height:100%;border-radius:999px;background:linear-gradient(90deg,#f43f5e,#8b5cf6,#14b8a6)"></div>
        </div>
      </div>`).join('');

    const timelineRows = reportTimeline.map(item => `
      <div style="display:flex;gap:14px;margin:14px 0;padding:14px;border-radius:18px;background:#fff;border:1px solid #e9edf6">
        <div style="min-width:64px;font-weight:800;color:#8b5cf6">${item.time}</div>
        <div><div style="font-weight:800;color:#1f2937;margin-bottom:4px">${item.title}</div><div style="font-size:13px;color:#667085;line-height:1.6">${item.detail}</div></div>
      </div>`).join('');

    const statCards = reportMetrics.map(item => `
      <div style="flex:1;min-width:150px;padding:18px;border-radius:22px;background:#fff;border:1px solid #e9edf6">
        <div style="font-size:12px;color:#667085;margin-bottom:10px">${item.label}</div>
        <div style="font-size:30px;font-weight:900;color:#111827;margin-bottom:10px">${item.value}<span style="font-size:16px">%</span></div>
        <div style="height:10px;border-radius:999px;background:#edf1f7;overflow:hidden"><div style="width:${item.value}%;height:100%;background:linear-gradient(90deg,#f43f5e,#8b5cf6,#14b8a6)"></div></div>
      </div>`).join('');

    const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${myProfile.nickName}-欢迎ME大会个人报告</title>
<style>
body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:linear-gradient(180deg,#f4f6fb,#eef4ff);color:#111827;}
.wrap{max-width:880px;margin:0 auto;padding:28px;}
.hero{background:linear-gradient(135deg,#0f172a,#1e1b4b 55%,#312e81);color:#fff;border-radius:32px;padding:28px;overflow:hidden;position:relative;box-shadow:0 20px 60px rgba(15,23,42,.18);}
.hero:before{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:999px;background:radial-gradient(circle,rgba(236,72,153,.35),transparent 68%);}
.hero:after{content:'';position:absolute;left:-50px;bottom:-70px;width:220px;height:220px;border-radius:999px;background:radial-gradient(circle,rgba(45,212,191,.26),transparent 66%);}
.badge{display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,.1);font-size:12px;font-weight:700;margin-right:8px;}
.grid{display:grid;grid-template-columns:1.1fr .9fr;gap:18px;margin-top:18px;}
.card{background:rgba(255,255,255,.92);border:1px solid #e9edf6;border-radius:28px;padding:22px;box-shadow:0 16px 40px rgba(15,23,42,.06);}
.photo{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px;}
.shot{padding:18px;border-radius:22px;background:linear-gradient(135deg,#faf5ff,#eff6ff);min-height:110px;border:1px solid #e8ecf5;}
.small{font-size:12px;color:#667085;}
.h1{font-size:34px;font-weight:900;line-height:1.15;margin:10px 0 6px;}
.h2{font-size:18px;font-weight:900;margin:0 0 12px;}
@media (max-width:760px){.grid{grid-template-columns:1fr}.wrap{padding:16px}.h1{font-size:28px}}
</style>
</head>
<body>
<div class="wrap">
  <section class="hero">
    <div class="badge">欢迎ME · 个人报告</div><div class="badge">生成时间 ${timeLabel}</div>
    <div style="display:flex;align-items:center;gap:16px;margin-top:16px">
      <div style="width:86px;height:86px;border-radius:28px;background:linear-gradient(135deg,#ec4899,#8b5cf6,#14b8a6);display:flex;align-items:center;justify-content:center;font-size:42px;box-shadow:0 12px 30px rgba(0,0,0,.2)">${myProfile.avatarEmoji}</div>
      <div>
        <div class="small" style="color:#cbd5e1">${myProfile.organization}</div>
        <div class="h1">${myProfile.nickName} 的大会个人报告</div>
        <div class="small" style="color:#e2e8f0">${myProfile.title} · ${myProfile.designArchetype || ''}</div>
      </div>
    </div>
  </section>

  <section class="card" style="margin-top:18px">
    <div class="h2">核心指标总览</div>
    <div style="display:flex;gap:14px;flex-wrap:wrap">${statCards}</div>
  </section>

  <section class="grid">
    <div class="card">
      <div class="h2">关注主题图谱</div>
      ${chartRows}
      <div class="photo">
        <div class="shot"><div style="font-size:26px">🎤</div><div style="font-weight:800;margin-top:8px">主旨议程关注</div><div class="small">已收藏 ${mySessionBookmarks} 场议程，偏好主题为 ${myProfile.designDirections.slice(0,2).join(' / ')}</div></div>
        <div class="shot"><div style="font-size:26px">🖼️</div><div style="font-weight:800;margin-top:8px">展品灵感记录</div><div class="small">已记录 ${myFavoritedExhibits} 个展品灵感，用于会后灵感板回顾</div></div>
      </div>
    </div>
    <div class="card">
      <div class="h2">关系与行为摘要</div>
      <div style="display:grid;gap:12px">
        <div style="padding:16px;border-radius:20px;background:#f8fafc"><div class="small">当前连接线索</div><div style="font-size:28px;font-weight:900;color:#0f172a">${activeConnections}<span style="font-size:16px;color:#64748b"> 位</span></div></div>
        <div style="padding:16px;border-radius:20px;background:#f8fafc"><div class="small">内容互动记录</div><div style="font-size:28px;font-weight:900;color:#0f172a">${myBulletCount}<span style="font-size:16px;color:#64748b"> 条</span></div></div>
        <div style="padding:16px;border-radius:20px;background:#f8fafc"><div class="small">推荐认识的人</div><div style="font-size:18px;font-weight:900;color:#0f172a">${attendees[1]?.nickName || '米亚 Mia'}</div><div class="small">共同关注：${(myProfile.interests || []).slice(0,2).join(' / ')}</div></div>
      </div>
    </div>
  </section>

  <section class="card" style="margin-top:18px">
    <div class="h2">大会足迹时间线</div>
    ${timelineRows}
  </section>
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `welcome-me-report-${myProfile.nickName || 'guest'}.html`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast('📄 已生成可下载的图文个人报告 HTML 文件');
  };

  const generateVisualReport = () => {
    const now = new Date().toLocaleString('zh-CN', { hour12: false });
    setReportGeneratedAt(now);
    triggerToast('✨ 个人报告已更新');
  };

  const getDesignWorks = (person: Attendee) => {
    if (person.designWorks?.length) return person.designWorks;
    return [
      {
        id: `${person.id}-work-1`,
        title: person.id === 'me' ? '感官通行证体验系统' : `${person.nickName} 的代表项目`,
        description: person.id === 'me'
          ? '围绕参会者入场、互动、连接与会后回顾构建的体验原型。'
          : `与「${person.designDirections[0] || '体验设计'}」相关的阶段性作品。`,
        year: '2026',
        role: person.title || '项目参与者'
      },
      {
        id: `${person.id}-work-2`,
        title: `${person.interests[0] || '跨界设计'} 研究草图`,
        description: '基于现场观察与用户行为整理出的设计研究片段。',
        year: '2025',
        role: '研究与概念设计'
      }
    ];
  };

  const getDesignEvents = (person: Attendee) => {
    if (person.designEvents?.length) return person.designEvents;
    return [
      {
        id: `${person.id}-event-1`,
        name: '跨界设计与人性体验峰会',
        role: person.group === 'Guest' ? '特邀分享嘉宾' : '参会学者',
        year: '2026',
        location: '上海'
      },
      {
        id: `${person.id}-event-2`,
        name: `${person.designDirections[0] || '体验设计'} 主题工作坊`,
        role: '项目共创者',
        year: '2025',
        location: '线上 / 线下'
      }
    ];
  };

  const downloadPersonalReportPng = () => {
    const canvas = document.createElement('canvas');
    const width = 1080;
    const height = 1920;
    const scale = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);

    const roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };
    const fillRound = (x: number, y: number, w: number, h: number, r: number, fill: string | CanvasGradient) => {
      roundedRect(x, y, w, h, r);
      ctx.fillStyle = fill;
      ctx.fill();
    };
    const drawText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number, font: string, color: string, maxLines = 2) => {
      ctx.font = font;
      ctx.fillStyle = color;
      const words = String(text).split('');
      let line = '';
      let lines = 0;
      for (let i = 0; i < words.length; i += 1) {
        const test = line + words[i];
        if (ctx.measureText(test).width > maxWidth && i > 0) {
          ctx.fillText(line, x, y + lines * lineHeight);
          line = words[i];
          lines += 1;
          if (lines >= maxLines - 1) break;
        } else {
          line = test;
        }
      }
      if (line && lines < maxLines) ctx.fillText(line, x, y + lines * lineHeight);
    };

    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#eef2ff');
    bg.addColorStop(0.45, '#fdf2f8');
    bg.addColorStop(1, '#ecfeff');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const hero = ctx.createLinearGradient(70, 70, 1010, 390);
    hero.addColorStop(0, '#0f172a');
    hero.addColorStop(0.55, '#312e81');
    hero.addColorStop(1, '#be185d');
    fillRound(70, 70, 940, 360, 54, hero);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.arc(890, 90, 160, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(170, 410, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    fillRound(110, 110, 210, 44, 22, 'rgba(255,255,255,0.16)');
    ctx.fillStyle = '#e0f2fe';
    ctx.font = '700 22px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('欢迎ME · 个人报告', 135, 140);

    fillRound(110, 190, 140, 140, 36, 'rgba(255,255,255,0.14)');
    ctx.font = '72px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(myProfile.avatarEmoji || '👤', 142, 284);
    ctx.font = '900 54px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${myProfile.nickName || '参会者'} 的大会报告`, 290, 230);
    ctx.font = '500 27px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    drawText(`${myProfile.organization || '欢迎ME'} · ${myProfile.title || '参会者'}`, 292, 280, 610, 34, '500 27px -apple-system, BlinkMacSystemFont, sans-serif', '#cbd5e1', 2);
    ctx.font = '600 22px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#fbcfe8';
    ctx.fillText(`生成时间 ${reportGeneratedAt || new Date().toLocaleString('zh-CN', { hour12: false })}`, 292, 345);

    let y = 480;
    const cardW = 292;
    reportMetrics.forEach((item, index) => {
      const x = 70 + index * (cardW + 32);
      fillRound(x, y, cardW, 190, 36, 'rgba(255,255,255,0.92)');
      ctx.fillStyle = '#64748b';
      ctx.font = '700 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(item.label, x + 28, y + 46);
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 56px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(`${item.value}%`, x + 28, y + 108);
      fillRound(x + 28, y + 135, cardW - 56, 18, 9, '#e2e8f0');
      const bar = ctx.createLinearGradient(x + 28, 0, x + cardW - 28, 0);
      bar.addColorStop(0, '#ec4899');
      bar.addColorStop(0.55, '#8b5cf6');
      bar.addColorStop(1, '#14b8a6');
      fillRound(x + 28, y + 135, (cardW - 56) * item.value / 100, 18, 9, bar);
    });

    y = 735;
    fillRound(70, y, 940, 350, 42, 'rgba(255,255,255,0.92)');
    ctx.font = '900 32px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#111827';
    ctx.fillText('关注主题图谱', 110, y + 58);
    focusDirectionValues.forEach((item, idx) => {
      const rowY = y + 105 + idx * 58;
      ctx.font = '700 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText(item.label, 110, rowY);
      ctx.fillStyle = '#7c3aed';
      ctx.font = '800 22px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(`${item.value}%`, 900, rowY);
      fillRound(110, rowY + 18, 820, 18, 9, '#e2e8f0');
      const bar = ctx.createLinearGradient(110, 0, 930, 0);
      bar.addColorStop(0, '#ec4899');
      bar.addColorStop(0.6, '#8b5cf6');
      bar.addColorStop(1, '#14b8a6');
      fillRound(110, rowY + 18, 820 * item.value / 100, 18, 9, bar);
    });

    y = 1140;
    fillRound(70, y, 940, 470, 42, 'rgba(255,255,255,0.92)');
    ctx.font = '900 32px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#111827';
    ctx.fillText('大会足迹', 110, y + 58);
    reportTimeline.forEach((item, idx) => {
      const rowY = y + 105 + idx * 82;
      ctx.fillStyle = '#8b5cf6';
      ctx.font = '900 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(item.time, 110, rowY);
      ctx.fillStyle = '#111827';
      ctx.font = '800 25px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(item.title, 235, rowY);
      drawText(item.detail, 235, rowY + 34, 680, 28, '500 21px -apple-system, BlinkMacSystemFont, sans-serif', '#64748b', 2);
    });

    y = 1660;
    fillRound(70, y, 940, 180, 42, '#0f172a');
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 30px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('推荐下一步', 110, y + 55);
    ctx.fillStyle = '#cbd5e1';
    drawText(`优先关注「${myProfile.designDirections[0] || '体验设计'}」相关议程，并与 ${attendees[1]?.nickName || '同频嘉宾'} 建立会后交流。`, 110, y + 100, 830, 34, '600 25px -apple-system, BlinkMacSystemFont, sans-serif', '#cbd5e1', 2);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `welcome-me-report-${myProfile.nickName || 'guest'}.png`;
      link.click();
      URL.revokeObjectURL(url);
      triggerToast('已导出 PNG 长图报告');
    }, 'image/png');
  };

  return (
    <div className="phone-frame relative mx-auto w-screen md:w-full max-w-none md:max-w-[360px] min-h-[100dvh] md:min-h-[620px] h-[100dvh] md:h-[760px] max-h-none md:max-h-[820px] shrink-0 p-0 md:p-[3px] bg-transparent md:bg-gradient-to-tr md:from-pink-400 md:via-teal-300 md:via-purple-400 md:to-pink-500 rounded-none md:rounded-[58px] shadow-none md:shadow-[0_25px_60px_rgba(244,114,182,0.15)] dark:shadow-none md:dark:shadow-[0_25px_60px_rgba(139,92,246,0.15)] transition-all duration-500 md:hover:scale-[1.01] md:hover:shadow-[0_30px_75px_rgba(244,114,182,0.25)]">
      
      {/* Animated Stream light overlay inside borders */}
      <div className="pointer-events-none absolute inset-0 hidden md:block bg-gradient-to-r from-pink-500/10 via-teal-300/5 to-purple-500/10 animate-pulse rounded-[58px]"></div>

      {/* Main Glass Simulator Body */}
      <div className="relative w-full h-full rounded-none md:rounded-[55px] bg-white dark:bg-slate-950 md:bg-white/80 md:dark:bg-slate-950/80 md:backdrop-blur-2xl border-0 md:border border-white/40 dark:border-slate-800/40 flex flex-col overflow-hidden select-none font-sans transition-all duration-300">
      
      {/* Toast Notification with Macaron Pink glow */}
      {showNotification && (
        <div className="absolute top-16 left-4 right-4 z-50 bg-slate-950/95 dark:bg-slate-900/95 border-b-2 border-pink-400 text-white py-2.5 px-3.5 rounded-2xl shadow-xl flex items-center space-x-2.5 text-xs animate-slideDown">
          <Sparkles className="h-4 w-4 text-pink-400 shrink-0 animate-bounce" />
          <span className="flex-1 font-medium leading-tight">{showNotification}</span>
        </div>
      )}

      {/* Camera Hole */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-50 hidden md:flex items-center justify-center">
        <div className="w-14 h-1 bg-slate-800 rounded-full mb-1"></div>
        <div className="w-2.5 h-2.5 bg-slate-800 border-2 border-slate-950 rounded-full ml-3 mb-1"></div>
      </div>

      {/* Top Banner Bar */}
      <div className="hidden md:flex pt-8 pb-3 px-5 bg-gradient-to-r from-pink-50 via-teal-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800 items-center justify-between shrink-0">
        <div className="flex items-center space-x-1">
          <span className="text-xs text-slate-500 font-mono font-bold">09:41</span>
          {!isLoggedIn ? (
            <span className="text-[9px] bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-bold px-1.5 py-0.5 rounded-full scale-90">UNLOCKED</span>
          ) : (
            <span className="text-[9px] bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 border border-pink-200 dark:border-pink-800 font-bold px-1.5 py-0.5 rounded-full scale-90">欢迎ME</span>
          )}
        </div>
        
        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[185px] text-center flex items-center justify-center space-x-1">
          {!isLoggedIn ? (
            <span className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400">
              <Lock className="h-3 w-3 animate-pulse shrink-0" />
              <span>学者通行证注册</span>
            </span>
          ) : (
            <>
              {activeTab === 'home' && '会场首页'}
              {activeTab === 'me' && '我的'}
              {activeTab === 'co' && '互动'}
              {activeTab === 'we' && '同频同行'}
            </>
          )}
        </div>

        <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-white/80 dark:bg-slate-900/60 shadow-xs border border-slate-200/40 dark:border-slate-800/40">
          <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse"></div>
          <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Main Column Client Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-8 space-y-4 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 scrollbar-none">
        
        {!isLoggedIn ? (
          <div className="space-y-4 animate-fadeIn py-1">
            {/* Login visual cover: image-led first impression */}
            <div className="relative h-44 rounded-[30px] overflow-hidden bg-slate-950 shadow-[0_18px_45px_rgba(31,35,51,0.16)]">
              <img
                src="/images/event-cover.svg"
                alt="欢迎ME活动会场海报"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/18 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[9px] font-black tracking-[0.22em] opacity-80">WELCOME ME 2026</p>
                <h2 className="text-lg font-black leading-tight mt-1 text-white">从 me 到 we 的现场共创</h2>
                <p className="text-[10px] text-white/80 mt-1">登录后查看通行证、议程、展品与同频推荐</p>
              </div>
            </div>

            {/* Immersive Welcome Glass card */}
            <div className="p-5 rounded-[28px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-teal-500/5 border border-indigo-200/80 dark:border-indigo-900/50 text-center select-none space-y-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>
              
              <div className="relative mx-auto w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-pink-500 to-teal-500 flex items-center justify-center text-2xl shadow-lg ring-4 ring-white/50 dark:ring-slate-900/50 animate-pulse">
                {authMode === 'login' ? '🔮' : regEmoji}
              </div>
              
              <div>
                <h3 className="text-[15px] font-black tracking-tight text-slate-900 dark:text-white">ME • 智能学者会卡</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">跨界设计与人性体验峰会 2026</p>
              </div>

              {/* Segmented Control */}
              <div className="flex p-0.5 bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-1.5 text-[10px] font-black rounded-xl transition-all ${authMode === 'login' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  学者便捷登入
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-1.5 text-[10px] font-black rounded-xl transition-all ${authMode === 'register' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  注册新学者名片
                </button>
              </div>
            </div>

            {/* Login Flow */}
            {authMode === 'login' ? (
              <div className="space-y-4 animate-fadeIn text-[11px]">
                <div className="bg-white dark:bg-slate-900/90 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-bold">VIP 随会学者即席验证入会 (点击选择身份)</label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginSelectedId('me');
                          setLoginPhone('138-1234-5678');
                        }}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${loginSelectedId === 'me' ? 'bg-pink-500/10 dark:bg-pink-950/40 border-pink-400 dark:border-pink-500 shadow-xs ring-1 ring-pink-400' : 'bg-slate-50/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700'}`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">🔮</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-black block text-slate-800 dark:text-white">陆西奥 (当前预置)</span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 block truncate font-medium">明眸设计 • 资深体验探路师</span>
                          </div>
                          {loginSelectedId === 'me' && <Check className="h-4 w-4 text-pink-500 shrink-0 bg-pink-100 dark:bg-pink-950/40 p-0.5 rounded-full" />}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLoginSelectedId('user_1');
                          setLoginPhone('139-2222-3333');
                        }}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${loginSelectedId === 'user_1' ? 'bg-teal-500/10 dark:bg-teal-950/40 border-teal-400 dark:border-teal-500 shadow-xs ring-1 ring-teal-400' : 'bg-slate-50/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700'}`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">👨‍💻</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-black block text-slate-800 dark:text-white">陈青川</span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 block truncate font-medium">冰轮实验室 • AI算法总师</span>
                          </div>
                          {loginSelectedId === 'user_1' && <Check className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 bg-teal-100 dark:bg-teal-950/40 p-0.5 rounded-full" />}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLoginSelectedId('user_2');
                          setLoginPhone('156-8888-9999');
                        }}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${loginSelectedId === 'user_2' ? 'bg-purple-500/10 dark:bg-purple-950/30 border-purple-400 dark:border-purple-500 shadow-xs ring-1 ring-purple-400' : 'bg-slate-50/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700'}`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">👩‍🎨</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-black block text-slate-800 dark:text-white">沈凌之</span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 block truncate font-medium">林泉研究院 • 媒介学者</span>
                          </div>
                          {loginSelectedId === 'user_2' && <Check className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 bg-purple-100 dark:bg-purple-950/40 p-0.5 rounded-full" />}
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-[9px] font-black text-slate-500 dark:text-slate-400 block uppercase font-bold">验证学者手机号码 (自动关联名片)</label>
                    <input
                      type="text"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="例：138-1234-5678"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-slate-900 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    let selectedUser = myProfile;
                    if (loginSelectedId === 'user_1') {
                      selectedUser = attendees.find(a => a.id === 'user_1') || attendees[0];
                    } else if (loginSelectedId === 'user_2') {
                      selectedUser = attendees.find(a => a.id === 'user_2') || attendees[0];
                    }
                    
                    setMyProfile({
                      ...selectedUser,
                      phone: loginPhone
                    });
                    
                    setIsLoggedIn(true);
                    triggerToast(`🎉 智能对接成功！当前连接学者: ${selectedUser.nickName}`);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-2xl text-center active:scale-95 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center justify-center space-x-2 border border-indigo-500/30 tracking-wide font-sans"
                >
                  <Zap className="h-4 w-4 text-amber-300 animate-pulse shrink-0" />
                  <span>一键登录</span>
                </button>
              </div>
            ) : (
              /* Register Flow */
              <div className="space-y-3.5 animate-fadeIn pb-4 text-[11px]">
                <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-3xl border border-white/60 dark:border-white/10 space-y-3">
                  
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 block uppercase">学者姓名 / Nickname *</label>
                    <input
                      type="text"
                      value={regNick}
                      onChange={(e) => setRegNick(e.target.value)}
                      placeholder="例：苏子昂"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-xl px-3 py-1.8 focus:outline-none focus:border-indigo-400 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Organization field */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 block uppercase">研究组织 / Studio *</label>
                    <input
                      type="text"
                      value={regOrg}
                      onChange={(e) => setRegOrg(e.target.value)}
                      placeholder="例：林泉多模态媒体室"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl px-3 py-1.8 focus:outline-none focus:border-indigo-400 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Title field */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 block uppercase">学者领域职称 / Title *</label>
                    <input
                      type="text"
                      value={regTitle}
                      onChange={(e) => setRegTitle(e.target.value)}
                      placeholder="例：数智交互体验探索家"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl px-3 py-1.8 focus:outline-none focus:border-indigo-400 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 block uppercase">学者手机 / Phone</label>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="例：138-0000-0000"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl px-3 py-1.8 focus:outline-none focus:border-indigo-400 font-mono text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 block uppercase font-bold text-left w-full">拟人化形象精选 (Click to swap)</label>
                    
                    {/* Character Card Live Preview */}
                    <div className="flex items-center space-x-3 bg-slate-55/70 dark:bg-slate-950/40 p-2.5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <div className={`w-13 h-13 rounded-2xl ${regActiveColor} text-white flex items-center justify-center text-2.5xl shadow-md transition-all select-none overflow-hidden shrink-0`}>
                        {regAvatarImage ? (
                          <img src={regAvatarImage} alt="头像预览" className="w-full h-full object-cover" />
                        ) : (
                          regEmoji
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-[10px] font-black text-slate-900 dark:text-white flex items-center space-x-1">
                          <span>{regAvatarImage ? (DESIGNER_AVATAR_OPTIONS.find(a => a.imageUrl === regAvatarImage)?.name || '已选择头像') : (ANTHROPOMORPHIC_AVATARS.find(a => a.emoji === regEmoji)?.label || '学者形象')}</span>
                          <span className="text-[8px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded font-normal font-mono select-none">PREVIEW</span>
                        </div>
                        <div className="text-[9px] text-slate-400 truncate mt-0.5">
                          {regAvatarImage ? '已使用你的十二款设计师头像之一，也可上传自己的头像' : (ANTHROPOMORPHIC_AVATARS.find(a => a.emoji === regEmoji)?.desc || '专属高能灵魂拟态')}
                        </div>
                        <label className="mt-2 inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[9px] font-black text-indigo-600 dark:text-indigo-300 cursor-pointer active:scale-95 transition">
                          上传头像
                          <input type="file" accept="image/*" onChange={handleRegisterAvatarUpload} hidden />
                        </label>
                      </div>
                    </div>

                    {/* Designer Avatar Photo Select Grid */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between px-0.5">
                        <span className="text-[9px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-wider">选择头像照片</span>
                        <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">12款</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border dark:border-slate-800">
                        {DESIGNER_AVATAR_OPTIONS.map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setRegAvatarImage(item.imageUrl);
                              setRegEmoji(item.emoji);
                              setRegActiveColor(item.colorClass);
                              triggerToast(`已选择头像：${item.name}`);
                            }}
                            title={item.name}
                            className={`relative h-16 rounded-2xl overflow-hidden border transition-all active:scale-95 ${
                              regAvatarImage === item.imageUrl
                                ? 'border-indigo-400 ring-2 ring-indigo-300 shadow-lg scale-[1.03]'
                                : 'border-white/70 dark:border-slate-800 opacity-85 hover:opacity-100 hover:scale-[1.02]'
                            }`}
                          >
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            {regAvatarImage === item.imageUrl && (
                              <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[9px] shadow">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Emoji Select Grid */}
                    <div className="grid grid-cols-6 gap-1 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border dark:border-slate-800">
                      {ANTHROPOMORPHIC_AVATARS.map(item => (
                        <button
                          key={item.emoji}
                          type="button"
                          onClick={() => { setRegEmoji(item.emoji); setRegAvatarImage(''); }}
                          title={`${item.label}: ${item.desc}`}
                          className={`w-7.5 h-7.5 flex items-center justify-center text-sm rounded-lg transition-all ${
                            regEmoji === item.emoji 
                              ? 'bg-white dark:bg-slate-800 scale-110 shadow-sm border border-slate-200 dark:border-slate-705 z-10' 
                              : 'opacity-55 hover:opacity-100 hover:scale-105'
                          }`}
                        >
                          {item.emoji}
                        </button>
                      ))}
                    </div>

                    {/* Theme color row */}
                    <div className="flex justify-between items-center bg-slate-50/55 dark:bg-slate-950 p-1.5 rounded-2xl border dark:border-slate-800">
                      <span className="text-[9px] text-slate-455 font-bold ml-1 select-none">专属磁极色底纹：</span>
                      <div className="flex space-x-1.5 mr-1">
                        {[
                          { name: 'bg-pink-500', color: '#f43f5e' },
                          { name: 'bg-teal-500', color: '#14b8a6' },
                          { name: 'bg-indigo-500', color: '#6366f1' },
                          { name: 'bg-purple-500', color: '#a855f7' }
                        ].map(col => (
                          <button
                            key={col.name}
                            type="button"
                            onClick={() => setRegActiveColor(col.name)}
                            className={`w-3 h-3 rounded-full border transition-all ${regActiveColor === col.name ? 'border-indigo-400 dark:border-white scale-120' : 'border-transparent opacity-60'}`}
                            style={{ backgroundColor: col.color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Character MBTI Archetype selector */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 block uppercase font-bold text-left">MBTI 认知特性</label>
                      <select
                        value={regMbti}
                        onChange={(e) => setRegMbti(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl px-2 py-1 text-[10px] focus:outline-none text-slate-700 dark:text-slate-200"
                      >
                        {MBTI_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 block uppercase font-bold text-left">学者设计原质</label>
                      <select
                        value={regArchetype}
                        onChange={(e) => setRegArchetype(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl px-2 py-1 text-[10px] focus:outline-none text-slate-700 dark:text-slate-200"
                      >
                        {ARCHETYPE_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tag customization directions */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 block uppercase leading-none">
                      选择研究方向 (极速限选2个)
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {tagCategories.designDirections.slice(0, 5).map(dir => {
                        const isSel = regSelectedDirections.includes(dir);
                        return (
                          <button
                            key={dir}
                            type="button"
                            onClick={() => {
                              if (isSel) {
                                setRegSelectedDirections(regSelectedDirections.filter(d => d !== dir));
                              } else if (regSelectedDirections.length < 2) {
                                setRegSelectedDirections([...regSelectedDirections, dir]);
                              } else {
                                triggerToast('🔒 对齐设计方向数量限 2 个');
                              }
                            }}
                            className={`p-1 px-1.8 text-[8.5px] font-bold rounded-lg border transition-all ${isSel ? 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-955/20 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-800 text-slate-500'}`}
                          >
                            {dir}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional portfolio step */}
                  <div className="rounded-[24px] bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <label className="text-[9px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest block">设计作品与经历（可跳过）</label>
                        <p className="text-[9px] text-slate-500 dark:text-slate-300 mt-1">完善后，他人点开你的主页会看到更多作品与活动经历。</p>
                      </div>
                      <span className="shrink-0 text-[8px] px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 font-black">可选</span>
                    </div>

                    <label className="block rounded-2xl border border-dashed border-indigo-300/70 dark:border-indigo-700 bg-indigo-50/60 dark:bg-indigo-950/20 p-3 text-center cursor-pointer active:scale-[0.98] transition">
                      {regWorkImage ? (
                        <img src={regWorkImage} alt="作品预览" className="w-full h-28 object-cover rounded-xl mb-2" />
                      ) : (
                        <div className="h-24 rounded-xl bg-white/80 dark:bg-slate-900 flex flex-col items-center justify-center text-slate-500 dark:text-slate-300">
                          <FileText className="h-5 w-5 mb-1" />
                          <span className="text-[10px] font-bold">上传一张作品图</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleWorkImageUpload} hidden />
                    </label>

                    <input
                      type="text"
                      value={regWorkTitle}
                      onChange={(e) => setRegWorkTitle(e.target.value)}
                      placeholder="作品标题，例如：城市微气候交互装置"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2.5 text-[11px] focus:outline-none focus:border-indigo-400 text-slate-800 dark:text-slate-100"
                    />
                    <textarea
                      value={regWorkDesc}
                      onChange={(e) => setRegWorkDesc(e.target.value)}
                      placeholder="一句话介绍作品。也可以不填，直接跳过。"
                      className="w-full min-h-[72px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2.5 text-[11px] focus:outline-none focus:border-indigo-400 text-slate-800 dark:text-slate-100 resize-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={regEventName}
                        onChange={(e) => setRegEventName(e.target.value)}
                        placeholder="参加过的活动"
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2.5 text-[11px] focus:outline-none focus:border-indigo-400 text-slate-800 dark:text-slate-100"
                      />
                      <input
                        type="text"
                        value={regEventRole}
                        onChange={(e) => setRegEventRole(e.target.value)}
                        placeholder="角色/奖项"
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2.5 text-[11px] focus:outline-none focus:border-indigo-400 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    const finalNick = regNick.trim() || '特邀设计学者';
                    const finalOrg = regOrg.trim() || '跨界多模态设计室';
                    const finalTitle = regTitle.trim() || '数字感官探索家';
                    const finalPhone = regPhone.trim() || '138-0000-5678';
                    const newId = `user_${Date.now()}`;
                    
                    const newAttendee: Attendee = {
                      id: newId,
                      nickName: finalNick,
                      avatarColor: regActiveColor,
                      avatarEmoji: regEmoji,
                      avatarImage: regAvatarImage || undefined,
                      organization: finalOrg,
                      title: finalTitle,
                      industry: '智能出行与人性体验',
                      phone: finalPhone,
                      designDirections: regSelectedDirections,
                      interests: regSelectedInterests,
                      goals: ['寻找项目技术合伙人', '发现前沿艺术灵感'],
                      designWorks: regWorkTitle.trim() || regWorkDesc.trim() || regWorkImage ? [
                        {
                          id: `work_${Date.now()}`,
                          title: regWorkTitle.trim() || '我的设计作品',
                          description: regWorkDesc.trim() || '这个用户还没有填写作品说明。',
                          imageUrl: regWorkImage || undefined,
                          year: '2026',
                          role: '创作者'
                        }
                      ] : [],
                      designEvents: regEventName.trim() || regEventRole.trim() ? [
                        {
                          id: `event_${Date.now()}`,
                          name: regEventName.trim() || '设计相关活动',
                          role: regEventRole.trim() || '参与者',
                          year: '2026',
                          location: '未填写'
                        }
                      ] : [],
                      privacyScope: 'public',
                      personaCompletion: 80,
                      checkedIn: false,
                      nfcBound: false,
                      mbti: regMbti,
                      designArchetype: regArchetype,
                      quote: '设计即是对纯粹物质世界的数字解构。',
                      achievementBadge: '🏅 智能星海微光合唱团认证',
                      colorTheme: 'purple'
                    };
                    
                    setAttendees([...attendees, newAttendee]);
                    setMyProfile(newAttendee);
                    setIsLoggedIn(true);
                    triggerToast(`🎨 专属学者名片已成功铸造！欢迎您入场：${finalNick}`);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-2xl text-center active:scale-95 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center justify-center space-x-2 border border-indigo-500/30 tracking-wide font-sans"
                >
                  <Sparkles className="h-4 w-4 text-pink-300 animate-spin shrink-0" style={{ animationDuration: '3s' }} />
                  <span>完成注册并进入会场</span>
                </button>
              </div>
            )}
            
            <div className="text-center text-[8px] text-slate-400 dark:text-slate-500 font-mono tracking-wide py-2 select-none">
              🔒 信息仅用于本次活动体验
            </div>
          </div>
        ) : (
          <>
            {/* Dynamic event phase block - highly visualized with bright Macaron accents - borderless */}
            <div className="bg-gradient-to-r from-pink-500/10 via-teal-500/10 to-purple-500/10 rounded-2xl p-3.5 flex items-center justify-between text-[11px] hover:shadow-[0_8px_20px_rgba(244,114,182,0.05)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-70"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="font-bold text-slate-600 dark:text-slate-400 tracking-wide">跨界体验峰会 2026</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-bold bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 px-2.5 py-1 rounded-full shadow-xs select-none">
                  {eventPhase === 'before' ? '📅 预加热中' : eventPhase === 'during' ? '🎙️ 进行中' : '🏁 已闭幕'}
                </span>
              </div>
            </div>

        {/* -------------------- TAB 1: HOME & PASSPORT -------------------- */}
        {activeTab === 'home' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Event poster hero: makes home page feel like a finished mini program */}
            <div className="relative h-44 rounded-[30px] overflow-hidden bg-slate-950 shadow-[0_18px_45px_rgba(31,35,51,0.16)]">
              <img
                src="/images/event-cover.svg"
                alt="跨界设计与人性体验峰会活动海报"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/18 to-transparent" />
              <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[9px] font-black tracking-widest">WELCOME ME 2026</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black">进行中</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-xl font-black leading-tight text-white">跨界设计与人性体验峰会</h2>
                <p className="text-[10px] text-white/85 mt-1">上海当代艺术创意园 · A1馆 · 今日 09:30-18:00</p>
              </div>
            </div>

            {/* Greet & Stats ring - borderless */}
            <div className="flex items-center justify-between bg-white/90 dark:bg-slate-900/90 p-4 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_32px_rgba(244,114,182,0.06)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-350 cursor-pointer">
              <div className="space-y-1">
                <p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest leading-none">WELCOME BACK</p>
                <h2 className="text-md font-extrabold tracking-tight">你好，{myProfile.nickName || '参会者'} 🔮</h2>
                <span className="text-[10px] text-slate-400 block">您是本次大会第 <strong className="font-bold text-rose-500">#042</strong> 位打卡创作者</span>
              </div>
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0 select-none">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="#f1f5f9" strokeWidth="4" fill="transparent" className="dark:stroke-slate-800" />
                  <circle cx="24" cy="24" r="20" stroke="#0ea5e9" strokeWidth="4" fill="transparent" strokeDasharray={`${2 * Math.PI * 20}`} strokeDashoffset={`${2 * Math.PI * 20 * (1 - myProfile.personaCompletion / 100)}`} className="text-teal-400 stroke-teal-400 transition-all duration-500" />
                </svg>
                <span className="absolute text-[9px] font-black font-mono text-teal-600 dark:text-teal-400">{myProfile.personaCompletion}%</span>
              </div>
            </div>

            {/* Simulated Live NFC Pass & Ticket QR Card (Original 'i' merged seamlessly here) - borderless */}
            <div className="bg-gradient-to-tr from-pink-100/60 via-teal-100/25 via-purple-150/45 to-orange-100/35 dark:from-pink-950/20 dark:via-purple-950/10 dark:to-slate-905 rounded-[32px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.015)] hover:shadow-[0_20px_50px_rgba(244,114,182,0.08)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-350 relative overflow-hidden group cursor-pointer">
              <div className="absolute right-0 top-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black text-[8px] px-4 py-1.5 rounded-bl-2xl tracking-widest uppercase">
                VIP 特权入场券
              </div>

              <div className="border-b border-dashed border-slate-200/60 dark:border-slate-800/60 pb-3 mt-1.5">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 tracking-tight">2026 跨界设计与人性体验峰会</h4>
                <div className="flex justify-between items-center text-[9px] text-slate-400 mt-1">
                  <span>上海当代艺术创意园 • A1馆</span>
                  <span className="text-purple-600 font-bold">2026-05-25</span>
                </div>
              </div>

              {/* QR Code Graphic or dynamic verified stamp */}
              <div className="py-2 flex flex-col items-center space-y-2.5">
                <div className="relative p-3.5 bg-white rounded-3xl shadow-inner flex items-center justify-center hover:scale-108 active:scale-95 transition-all duration-300">
                  <QrCode className={`h-28 w-28 text-slate-900 transition-all duration-300 ${myProfile.checkedIn ? 'opacity-20' : 'opacity-100'}`} />
                  
                  {/* Dynamic stamp feedback - borderless */}
                  {myProfile.checkedIn && (
                    <div className="absolute inset-x-2 inset-y-2 bg-white/95 dark:bg-slate-950/95 rounded-2xl flex flex-col items-center justify-center text-rose-500 dark:text-rose-400 text-xs font-black select-none">
                      <div className="h-11 w-11 bg-rose-50 text-rose-550 rounded-full flex items-center justify-center text-xs font-black animate-scaleIn select-none transform rotate-[-12deg] shadow-md shadow-rose-500/5">
                        PASSED
                      </div>
                      <span className="mt-1.5 font-extrabold text-[10px]">核销通行证已解锁</span>
                      <span className="text-[8px] font-mono text-slate-400 font-normal">核销时间: {myProfile.checkedInAt || '09:12'}</span>
                    </div>
                  )}
                </div>
                <span className="font-mono text-[9px] text-slate-400 tracking-wide select-all">凭证ID: ME-2026-VIP-8891</span>
              </div>

              {/* Action buttons with custom scale feedback */}
              {!myProfile.checkedIn ? (
                <button 
                  onClick={() => {
                    const now = new Date();
                    const formattedTime = now.toTimeString().split(' ')[0].substring(0, 5);
                    setMyProfile({ ...myProfile, checkedIn: true, checkedInAt: formattedTime });
                    triggerToast('🎟️ 电子通签核销成功！物理伴盖已同步，快去绑定 NFC 设备！');
                  }}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 active:scale-95 text-white font-bold text-xs py-3 rounded-2xl shadow-lg shadow-pink-500/10 transition-all text-center cursor-pointer"
                >
                  【模拟到场】扫描签到位核销通证
                </button>
              ) : (
                <div className="text-center text-[10px] text-teal-600 dark:text-teal-400 bg-teal-500/10 py-2.5 rounded-2xl font-bold select-none shadow-xs">
                  🎉 已核签入场，前排 VIP 座席专属权益已开启
                </div>
              )}
            </div>

            {/* Quick dashboard features - highly visualized cards */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <button 
                onClick={() => { setActiveTab('me'); setSurveyStep(0); }} 
                className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-2.5 rounded-2xl border border-white/60 dark:border-white/10 hover:border-pink-300 dark:hover:border-pink-500 hover:scale-[1.03] active:scale-[0.97] transition-all flex flex-col items-center space-y-1 block shadow-xs"
              >
                <div className="p-1.5 bg-pink-100 dark:bg-pink-950/40 rounded-xl text-pink-600 dark:text-pink-400">
                  <IdCard className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-600 dark:text-slate-400">我的肖像</span>
              </button>
              
              <button 
                onClick={() => { setActiveTab('co'); setActiveSessionTab('sessions'); }} 
                className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-2.5 rounded-2xl border border-white/60 dark:border-white/10 hover:border-teal-300 dark:hover:border-teal-500 hover:scale-[1.03] active:scale-[0.97] transition-all flex flex-col items-center space-y-1 block shadow-xs"
              >
                <div className="p-1.5 bg-teal-100 dark:bg-teal-950/40 rounded-xl text-teal-600 dark:text-teal-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-600 dark:text-slate-400">主场发言</span>
              </button>

              <button 
                onClick={() => { setActiveTab('co'); setActiveSessionTab('exhibits'); }} 
                className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-2.5 rounded-2xl border border-white/60 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500 hover:scale-[1.03] active:scale-[0.97] transition-all flex flex-col items-center space-y-1 block shadow-xs"
              >
                <div className="p-1.5 bg-purple-100 dark:bg-purple-950/40 rounded-xl text-purple-600 dark:text-purple-400">
                  <Award className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-600 dark:text-slate-400">实地展品</span>
              </button>
            </div>

            {/* Quick timeline schedules */}
            <div className="space-y-2 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/60 dark:border-white/10">
              <div className="flex items-center justify-between border-b dark:border-slate-850 pb-2">
                <h4 className="text-[11px] font-black text-slate-500 flex items-center space-x-1.5 uppercase tracking-wider">
                  <Compass className="h-3 w-3 text-pink-500 animate-spin" />
                  <span>此时段热门议程 (点击联动)</span>
                </h4>
                <button onClick={() => { setActiveTab('co'); setActiveSessionTab('sessions'); }} className="text-[10px] text-pink-500 font-bold hover:underline">查看全议程 →</button>
              </div>

              <div className="space-y-2 pt-1">
                {sessions.slice(0, 2).map(s => (
                  <div 
                    key={s.id}
                    onClick={() => {
                      setActiveSessionId(s.id);
                      setActiveTab('co');
                      setActiveSessionTab('sessions');
                      triggerToast(`已联动切换主论坛关注场次，进入共创板块！🐳`);
                    }}
                    className={`border rounded-xl p-2.5 cursor-pointer hover:scale-[1.01] hover:shadow-xs transition duration-200 flex items-center justify-between ${
                      s.isLive 
                        ? 'bg-gradient-to-r from-pink-500/5 to-purple-500/5 border-pink-200/50' 
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-150 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center space-x-1.5 mb-1 text-[9px]">
                        <span className="bg-pink-100 dark:bg-pink-950/50 text-pink-600 px-1.5 py-0.5 rounded font-mono font-bold">{s.timeStr}</span>
                        {s.isLive && <span className="text-[9px] font-bold text-rose-500 animate-pulse">● LIVE</span>}
                      </div>
                      <h5 className="font-bold text-[11px] leading-snug truncate text-slate-700 dark:text-slate-200">{s.title}</h5>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">👉</span>
                  </div>
                ))}
              </div>
            </div>

            {/* A1 venue map image */}
            <div className="overflow-hidden rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm">
              <img src="/images/map-a1.svg" alt="A1馆场馆导览图" className="w-full h-36 object-cover" />
            </div>

            {/* Architectural Map & Climate state (Info Visualization Instead of raw descriptions) - borderless */}
            <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 dark:from-slate-900/50 dark:to-slate-950/50 rounded-2xl p-3.5 flex items-center justify-between hover:scale-[1.03] duration-300 transition-all cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950/60 flex items-center justify-center text-teal-600">
                  <Map className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-[11px] font-extrabold text-slate-900 dark:text-slate-200">A馆现场微气候传感器</h5>
                  <p className="text-[9px] text-slate-400 font-medium">今日天气舒适，适合逛展与交流</p>
                </div>
              </div>
              <div className="text-right font-mono shrink-0 select-none">
                <span className="text-[10px] bg-teal-500 text-white font-black px-2.5 py-1 rounded-full shadow-md shadow-teal-500/10">23.2°C • 51%</span>
              </div>
            </div>

          </div>
        )}

        {/* -------------------- TAB 2: PERSONAL PORTRAIT & NFC BINDING -------------------- */}
        {activeTab === 'me' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Header Portrait presentation card - Organic bubble glass with no borders */}
            <div className="bg-gradient-to-tr from-pink-100/60 via-teal-50/50 via-purple-100/50 to-pink-100/40 dark:from-slate-900/90 dark:via-purple-950/20 dark:to-slate-905 rounded-[32px] p-5 text-center relative overflow-hidden shadow-[0_12px_36px_rgba(244,114,182,0.05)] hover:shadow-[0_20px_50px_rgba(244,114,182,0.12)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-500 ease-out group cursor-pointer">
              
              {/* Fun animated floating spots of light */}
              <div className="absolute top-0 left-2 w-10 h-10 rounded-full bg-pink-400/20 blur-md animate-pulse"></div>
              <div className="absolute bottom-2 right-4 w-14 h-14 rounded-full bg-teal-400/15 blur-lg animate-pulse" style={{ animationDelay: '1.2s' }}></div>
              <div className="absolute top-1/2 left-3/4 w-8 h-8 rounded-full bg-purple-400/10 blur-sm animate-pulse" style={{ animationDelay: '0.6s' }}></div>

              <div className="relative z-10">
                <div className={`w-16 h-16 ${myProfile.avatarColor} text-white rounded-full mx-auto flex items-center justify-center text-4xl shadow-xl border-4 border-white dark:border-slate-900 transform group-hover:rotate-6 group-hover:scale-105 active:scale-95 transition-all duration-500 ease-out select-none overflow-hidden`}>
                  {myProfile.avatarImage ? (
                    <img src={myProfile.avatarImage} alt={myProfile.nickName} className="w-full h-full object-cover" />
                  ) : (
                    myProfile.avatarEmoji
                  )}
                </div>
                
                <h3 className="text-sm font-black mt-3 text-slate-900 dark:text-white tracking-tight flex items-center justify-center space-x-1">
                  <span>{myProfile.nickName}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{myProfile.organization || '组织/工作室'} • {myProfile.title || '设计学者'}</p>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <label className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-[9px] font-black text-indigo-600 dark:text-indigo-300 cursor-pointer active:scale-95 transition shadow-sm">
                    更换头像
                    <input type="file" accept="image/*" onChange={handleProfileAvatarUpload} hidden />
                  </label>
                  <button
                    type="button"
                    onClick={handleSwitchAccount}
                    className="px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-[9px] font-black text-slate-700 dark:text-slate-200 active:scale-95 transition shadow-sm"
                  >
                    切换账号
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-[9px] font-black text-rose-600 dark:text-rose-300 active:scale-95 transition shadow-sm"
                  >
                    退出
                  </button>
                </div>
                
                {/* Whimsical properties visualizers */}
                <div className="mt-3.5 text-center space-y-2">
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {myProfile.mbti && (
                      <span className="inline-block bg-purple-500/10 text-purple-600 dark:text-purple-450 text-[9px] font-black px-3 py-1 rounded-full shadow-xs transform hover:scale-105 transition-transform">
                        🧬 {myProfile.mbti}
                      </span>
                    )}
                    {myProfile.designArchetype && (
                      <span className="inline-block bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[9px] font-black px-3 py-1 rounded-full shadow-xs transform hover:scale-105 transition-transform">
                        🎨 {myProfile.designArchetype}
                      </span>
                    )}
                  </div>

                  {myProfile.achievementBadge && (
                    <div className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-450 text-[10px] font-extrabold py-1.5 px-3.5 rounded-2xl inline-block text-center select-none shadow-xs hover:rotate-1 transition-transform">
                      🏆 {myProfile.achievementBadge}
                    </div>
                  )}

                  {myProfile.quote && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 italic px-4 font-bold tracking-tight leading-relaxed">
                      “ {myProfile.quote} ”
                    </p>
                  )}
                </div>

                {/* Completion percentage indicator - borderless bar */}
                <div className="mt-4 flex items-center justify-between bg-white/70 dark:bg-slate-950/60 p-2 px-3 rounded-2xl text-[10px] shadow-inner">
                  <span className="font-extrabold text-[9px] text-pink-600 tracking-wide uppercase">智库匹配权重状态</span>
                  <span className="font-mono text-xs font-black text-teal-600 dark:text-teal-400">{myProfile.personaCompletion}% 完成度</span>
                </div>
              </div>
            </div>

            {/* Profile editor panel or tags configure step */}
            {surveyStep === 0 ? (
              <div className="bg-white/95 dark:bg-slate-900/95 rounded-[28px] p-5 space-y-4 shadow-[0_4px_24px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_36px_rgba(244,114,182,0.05)] transition-all duration-300">
                <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850/40 pb-2.5">
                  <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">我的智能名片信息</span>
                  <button 
                    onClick={() => {
                      setSurveyStep(1);
                      triggerToast('标签矩阵编辑模式已开启！马卡龙趣味组支持交互多选。');
                    }}
                    className="text-[10px] bg-pink-500 hover:bg-pink-600 text-white font-bold px-3 py-1 rounded-full active:scale-95 transition-all shadow-sm transform hover:scale-105"
                  >
                    配置个性标签 →
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1.5 tracking-wider">目前学者昵称与代表组织</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <input 
                        type="text" 
                        value={myProfile.nickName}
                        onChange={(e) => setMyProfile({ ...myProfile, nickName: e.target.value })}
                        placeholder="学者昵称/姓名" 
                        className="p-2.5 px-3 bg-slate-50/80 dark:bg-slate-950 rounded-2xl text-xs focus:bg-pink-500/5 focus:ring-1 focus:ring-pink-400 outline-none font-bold transition-all"
                      />
                      <input 
                        type="text" 
                        value={myProfile.organization}
                        onChange={(e) => setMyProfile({ ...myProfile, organization: e.target.value })}
                        placeholder="代表组织" 
                        className="p-2.5 px-3 bg-slate-50/80 dark:bg-slate-950 rounded-2xl text-xs focus:bg-pink-500/5 focus:ring-1 focus:ring-pink-400 outline-none font-bold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1.5 tracking-wider">主要业务与跨界探索方向</label>
                    <input 
                      type="text" 
                      value={myProfile.industry}
                      onChange={(e) => setMyProfile({ ...myProfile, industry: e.target.value })}
                      placeholder="例如：数字交互研究/非线性策展人" 
                      className="w-full p-2.5 px-4 bg-slate-50/80 dark:bg-slate-950 rounded-2xl text-xs focus:bg-pink-500/5 focus:ring-1 focus:ring-pink-400 outline-none font-bold transition-all"
                    />
                  </div>

                  {/* Designer Avatar Photo Library */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5 px-0.5">
                      <label className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">头像照片库（点击选择）</label>
                      <span className="text-[8px] font-black text-pink-500 bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded-full">12款设计师形象</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border dark:border-slate-800">
                      {DESIGNER_AVATAR_OPTIONS.map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setMyProfile({ ...myProfile, avatarImage: item.imageUrl, avatarEmoji: item.emoji, avatarColor: item.colorClass });
                            triggerToast(`已更换头像：${item.name}`);
                          }}
                          title={item.name}
                          className={`relative h-16 rounded-2xl overflow-hidden border transition-all active:scale-95 ${
                            myProfile.avatarImage === item.imageUrl
                              ? 'border-pink-400 ring-2 ring-pink-300 shadow-lg scale-[1.03]'
                              : 'border-white/70 dark:border-slate-800 opacity-85 hover:opacity-100 hover:scale-[1.02]'
                          }`}
                        >
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          {myProfile.avatarImage === item.imageUrl && (
                            <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[9px] shadow">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Anthropomorphic Avatar */}
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1.5 px-0.5 tracking-wider">表情备选形象 (Click to swap)</label>
                    <div className="grid grid-cols-6 gap-1.5 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border dark:border-slate-800">
                      {ANTHROPOMORPHIC_AVATARS.map(item => (
                        <button
                          key={item.emoji}
                          type="button"
                          onClick={() => {
                            setMyProfile({ ...myProfile, avatarEmoji: item.emoji, avatarImage: undefined });
                            triggerToast(`已切换为表情形象：${item.label}`);
                          }}
                          title={`${item.label}: ${item.desc}`}
                          className={`w-7.5 h-7.5 flex items-center justify-center text-sm rounded-lg transition-all ${
                            myProfile.avatarEmoji === item.emoji 
                              ? 'bg-white dark:bg-slate-800 scale-110 shadow-sm border border-slate-200 dark:border-slate-705 z-10'  
                              : 'opacity-55 hover:opacity-100 hover:scale-105'
                          }`}
                        >
                          {item.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Character MBTI & Archetype selector inside Edit Profile */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1 px-1 tracking-wider">MBTI 认知特性</label>
                      <select
                        value={myProfile.mbti}
                        onChange={(e) => setMyProfile({ ...myProfile, mbti: e.target.value })}
                        className="w-full p-2 px-3 bg-slate-50/80 dark:bg-slate-950 rounded-2xl text-[10px] outline-none font-bold text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800"
                      >
                        {MBTI_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1 px-1 tracking-wider">学者设计原质</label>
                      <select
                        value={myProfile.designArchetype}
                        onChange={(e) => setMyProfile({ ...myProfile, designArchetype: e.target.value })}
                        className="w-full p-2 px-3 bg-slate-50/80 dark:bg-slate-950 rounded-2xl text-[10px] outline-none font-bold text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800"
                      >
                        {ARCHETYPE_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* High visual tag clouds grouped under color styles */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">目前挂载的核心标签（雷达计算中）</span>
                    <div className="space-y-2.5 text-[10px] bg-slate-50/50 dark:bg-slate-950/50 p-3 rounded-2xl">
                      <div className="flex flex-wrap gap-1 items-center">
                        <span className="text-pink-500 font-extrabold mr-1.5 shrink-0">探究方向:</span>
                        {myProfile.designDirections.map(d => (
                          <span key={d} className="inline-block bg-pink-550/10 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full font-bold text-[9px] shadow-xs">{d}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1 items-center">
                        <span className="text-teal-550 font-extrabold mr-1.5 shrink-0">技术兴趣:</span>
                        {myProfile.interests.map(i => (
                          <span key={i} className="inline-block bg-teal-555/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full font-bold text-[9px] shadow-xs">{i}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Privacy settings with animated colored active bubbles */}
                  <div className="pt-1">
                    <label className="block text-[9px] text-slate-455 uppercase font-bold tracking-wider mb-2">同频推荐与圈层可见度</label>
                    <div className="grid grid-cols-3 gap-1.5 px-0.5 mt-1 text-center text-[9px]">
                      <button 
                        onClick={() => { setMyProfile({ ...myProfile, privacyScope: 'public' }); triggerToast('已设置全场公开显示，任何智能检测仪均可发现您的设计气味'); }}
                        className={`p-2 py-2.5 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 cursor-pointer ${myProfile.privacyScope === 'public' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md shadow-pink-500/20 scale-102' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:bg-slate-100'}`}
                      >
                        双向公开
                      </button>
                      <button 
                        onClick={() => { setMyProfile({ ...myProfile, privacyScope: 'matching-only' }); triggerToast('已调优至极密极速匹配：仅允许同频度超过70%的人发现您'); }}
                        className={`p-2 py-2.5 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 cursor-pointer ${myProfile.privacyScope === 'matching-only' ? 'bg-gradient-to-r from-teal-400 to-emerald-450 text-white shadow-md shadow-teal-400/20 scale-102' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:bg-slate-100'}`}
                      >
                        仅和拍可见
                      </button>
                      <button 
                        onClick={() => { setMyProfile({ ...myProfile, privacyScope: 'private' }); triggerToast('隐私策略提升：已开启隐退潜水模式'); }}
                        className={`p-2 py-2.5 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 cursor-pointer ${myProfile.privacyScope === 'private' ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/20 scale-102' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:bg-slate-100'}`}
                      >
                        完全潜水
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // STEP 1: Manage Tags - Clean Border-free configuration Matrix
              <div className="bg-white/95 dark:bg-slate-900/95 rounded-[28px] p-5 space-y-4 shadow-[0_4px_24px_rgba(0,0,0,0.015)] animate-slideUp">
                <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850/40 pb-2.5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">编辑性格标签矩阵</span>
                  <button 
                    onClick={() => {
                      setSurveyStep(0); 
                      const hasDetails = myProfile.nickName && myProfile.organization && myProfile.industry;
                      const hasDirections = myProfile.designDirections.length > 0;
                      const hasInterests = myProfile.interests.length > 0;
                      const hasGoals = myProfile.goals.length > 0;
                      let rate = 50;
                      if (hasDetails) rate += 20;
                      if (hasDirections) rate += 15;
                      if (hasInterests) rate += 10;
                      if (hasGoals) rate += 5;
                      setMyProfile({...myProfile, personaCompletion: rate});
                      triggerToast('✨ 保存成功！您的学者属性已重新编织入 SaaS 匹配服务器组。');
                    }}
                    className="text-[10px] bg-gradient-to-r from-teal-400 to-emerald-400 text-white font-black px-4 py-1.5 rounded-full shadow-md active:scale-95 transition-all transform hover:scale-105"
                  >
                    保存参会卡 ✓
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  {/* tag categories */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse mr-1"></span>
                      <span>跨界设计研究方向 (可多选)</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tagCategories.designDirections.map(d => {
                        const active = myProfile.designDirections.includes(d);
                        return (
                          <button
                            key={d}
                            onClick={() => {
                              const next = active 
                                ? myProfile.designDirections.filter(item => item !== d)
                                : [...myProfile.designDirections, d];
                              setMyProfile({ ...myProfile, designDirections: next });
                            }}
                            className={`text-[9px] font-bold px-3 py-1.5 rounded-full transition-all duration-200 transform active:scale-95 cursor-pointer ${active ? 'bg-pink-500 text-white shadow-md shadow-pink-500/15' : 'bg-slate-50/80 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mr-1"></span>
                      <span>技术兴趣与议题偏好 (可多选)</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tagCategories.interests.map(i => {
                        const active = myProfile.interests.includes(i);
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              const next = active 
                                ? myProfile.interests.filter(item => item !== i)
                                : [...myProfile.interests, i];
                              setMyProfile({ ...myProfile, interests: next });
                            }}
                            className={`text-[9px] font-bold px-3 py-1.5 rounded-full transition-all duration-200 transform active:scale-95 cursor-pointer ${active ? 'bg-teal-500 text-white shadow-md shadow-teal-500/15' : 'bg-slate-50/80 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}
                          >
                            {i}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Personal Report Generator */}
            <div className="bg-gradient-to-br from-white via-pink-50/45 to-teal-50/45 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-[32px] p-4.5 space-y-3.5 border border-white/70 dark:border-slate-800/80 shadow-[0_18px_45px_rgba(15,23,42,0.06)] text-slate-800 dark:text-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-2 select-none">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-pink-500/15">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900 dark:text-white leading-none">我的大会报告</h4>
                    <span className="text-[9px] text-slate-500 dark:text-slate-300">根据你的签到、收藏、互动和连接生成。</span>
                  </div>
                </div>
                {reportGeneratedAt && (
                  <span className="shrink-0 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-[9px] font-black">
                    已生成
                  </span>
                )}
              </div>

              {!myProfile.checkedIn ? (
                <p className="text-[10px] text-slate-500 dark:text-slate-300 italic bg-white/75 dark:bg-slate-900/70 p-3 rounded-2xl leading-normal select-none border border-slate-200/80 dark:border-slate-800">
                  完成签到后即可生成你的大会报告。
                </p>
              ) : (
                <div className="space-y-3.5">
                  <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-4.5">
                    <div className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-pink-500/20 blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-8 w-32 h-32 rounded-full bg-teal-400/20 blur-2xl"></div>
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-15 h-15 ${myProfile.avatarColor} rounded-[22px] flex items-center justify-center text-3xl shadow-xl shrink-0 border border-white/15 overflow-hidden`}>
                          {myProfile.avatarImage ? (
                            <img src={myProfile.avatarImage} alt={myProfile.nickName} className="w-full h-full object-cover" />
                          ) : (
                            myProfile.avatarEmoji
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.24em] text-white/65 font-black">个人报告</p>
                          <h5 className="text-lg font-black tracking-tight truncate">{myProfile.nickName} 的大会个人报告</h5>
                          <p className="text-[10px] text-white/75 mt-1 leading-relaxed">{myProfile.organization} · {myProfile.title}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className="px-2 py-1 rounded-full bg-white/10 text-[9px] font-bold">{myProfile.mbti || 'AI 体验创作者'}</span>
                            <span className="px-2 py-1 rounded-full bg-white/10 text-[9px] font-bold">{myProfile.designArchetype || '具身智能观察者'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-col items-end text-right shrink-0">
                        <span className="text-[9px] text-white/60">生成时间</span>
                        <span className="text-[10px] font-bold text-white/90">{reportGeneratedAt || '点击下方按钮生成'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {reportMetrics.map((item) => (
                        <div key={item.label} className="rounded-2xl bg-white/7 border border-white/10 p-3 backdrop-blur-sm">
                          <span className="block text-[9px] text-white/65 font-bold">{item.label}</span>
                          <span className="text-xl font-black tracking-tight">{item.value}<span className="text-[11px] font-bold ml-0.5">%</span></span>
                          <div className="h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${item.accent}`} style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {reportHighlights.map((item) => (
                      <div key={item.title} className="rounded-3xl bg-white/85 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-3.5 shadow-sm">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-[9px] font-black ${item.color}`}>{item.title}</span>
                        <div className="mt-2 text-[12px] font-black text-slate-900 dark:text-white leading-snug">{item.value}</div>
                        <div className="mt-1 text-[10px] leading-relaxed text-slate-500 dark:text-slate-300">{item.note}</div>
                      </div>
                    ))}
                    <div className="rounded-3xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-teal-500/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-pink-200/70 dark:border-slate-800 p-3.5 shadow-sm">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-[9px] font-black bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-100">图像快照</span>
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="rounded-2xl bg-white/80 dark:bg-slate-800 p-2 text-center">
                          <div className="text-lg">🎤</div>
                          <div className="text-[9px] font-bold text-slate-700 dark:text-slate-100 mt-1">主旨现场</div>
                        </div>
                        <div className="rounded-2xl bg-white/80 dark:bg-slate-800 p-2 text-center">
                          <div className="text-lg">🖼️</div>
                          <div className="text-[9px] font-bold text-slate-700 dark:text-slate-100 mt-1">展品灵感</div>
                        </div>
                        <div className="rounded-2xl bg-white/80 dark:bg-slate-800 p-2 text-center">
                          <div className="text-lg">🤝</div>
                          <div className="text-[9px] font-bold text-slate-700 dark:text-slate-100 mt-1">连接瞬间</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-[28px] bg-white/90 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white">关注主题图表</h5>
                        <span className="text-[9px] text-slate-500 dark:text-slate-300">根据你的兴趣自动整理</span>
                      </div>
                      <div className="space-y-3">
                        {focusDirectionValues.map((item) => (
                          <div key={item.label}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-100">{item.label}</span>
                              <span className="text-[10px] font-black text-purple-600 dark:text-purple-300">{item.value}%</span>
                            </div>
                            <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-teal-400" style={{ width: `${item.value}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[28px] bg-white/90 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white">大会足迹时间线</h5>
                        <span className="text-[9px] text-slate-500 dark:text-slate-300">你的参会记录</span>
                      </div>
                      <div className="space-y-3">
                        {reportTimeline.map((item) => (
                          <div key={`${item.time}-${item.title}`} className="flex items-start gap-3 rounded-2xl bg-slate-50/85 dark:bg-slate-950/80 p-3 border border-slate-200/70 dark:border-slate-800">
                            <div className="w-15 shrink-0 text-[10px] font-black text-purple-600 dark:text-purple-300">{item.time}</div>
                            <div className="min-w-0">
                              <div className="text-[11px] font-black text-slate-900 dark:text-white">{item.title}</div>
                              <div className="mt-1 text-[10px] leading-relaxed text-slate-500 dark:text-slate-300">{item.detail}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-3xl bg-white/90 dark:bg-slate-900/85 p-3 border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
                      <div className="text-[9px] text-slate-500 dark:text-slate-300 font-bold">已收藏议程</div>
                      <div className="text-lg font-black text-slate-900 dark:text-white mt-1">{mySessionBookmarks}</div>
                    </div>
                    <div className="rounded-3xl bg-white/90 dark:bg-slate-900/85 p-3 border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
                      <div className="text-[9px] text-slate-500 dark:text-slate-300 font-bold">展品共鸣</div>
                      <div className="text-lg font-black text-slate-900 dark:text-white mt-1">{myFavoritedExhibits}</div>
                    </div>
                    <div className="rounded-3xl bg-white/90 dark:bg-slate-900/85 p-3 border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
                      <div className="text-[9px] text-slate-500 dark:text-slate-300 font-bold">同频连接</div>
                      <div className="text-lg font-black text-slate-900 dark:text-white mt-1">{activeConnections}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    <button 
                      onClick={generateVisualReport}
                      className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-black text-[11px] py-3 px-3 rounded-2xl text-center active:scale-95 transition-all shadow-lg shadow-pink-500/15 cursor-pointer"
                    >
                      生成我的报告
                    </button>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button 
                        onClick={downloadPersonalReportPng}
                        className="w-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black text-[11px] py-3 px-3 rounded-2xl text-center active:scale-95 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Download className="h-4 w-4" />
                        导出 PNG 长图
                      </button>
                      <button 
                        onClick={downloadPersonalReport}
                        className="w-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 hover:bg-slate-200 hover:dark:bg-slate-700 font-black text-[11px] py-3 px-3 rounded-2xl text-center active:scale-95 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Download className="h-4 w-4" />
                        下载 HTML
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Interactive Holographic NFC Device Binding - Border-free token card with pulsing indicator */}
            <div className={`p-5 rounded-[32px] transition-all duration-500 relative overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.012)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.035)] ${myProfile.nfcBound ? 'bg-gradient-to-tr from-teal-500/10 via-purple-500/5 to-teal-500/5 dark:from-slate-900/90 dark:via-teal-950/20' : 'bg-white/95 dark:bg-slate-900/95'}`}>
              
              {/* Special Animated Ring Wave Visualizer State */}
              {nfcTapping && (
                <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center space-y-4.5 z-20 animate-fadeIn">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-pink-400 animate-ping opacity-60"></div>
                    <div className="absolute inset-2 rounded-full border border-teal-400 animate-ping opacity-80" style={{ animationDelay: '0.4s' }}></div>
                    <div className="absolute inset-5 rounded-full border border-purple-400 animate-ping opacity-45" style={{ animationDelay: '0.8s' }}></div>
                    <Cpu className="h-9 w-9 text-teal-400 animate-spin" />
                  </div>
                  <span className="text-[10px] text-teal-400 font-black uppercase tracking-widest animate-pulse font-mono">写入物理学者识别芯片 (贴近天线)...</span>
                </div>
              )}

              <div className="flex items-center space-x-2 mb-2">
                <Cpu className={`h-4 w-4 ${myProfile.nfcBound ? 'text-teal-500 animate-bounce' : 'text-slate-400'}`} />
                <h4 className="text-xs font-black">NFC「物理挂载会伴」配对</h4>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed mb-3.5">
                入座签到席获取物理纪念挂卡。贴合感应配对后，在展区触碰艺术展品发光环，即刻点缀、漂流您的学者共鸣到场内的投影屏与全场智库。
              </p>

              {myProfile.nfcBound ? (
                <div className="space-y-3 animate-scaleIn">
                  <div className="bg-gradient-to-r from-teal-500/5 to-purple-500/5 p-3 rounded-2xl flex items-center justify-between text-[10px] shadow-inner">
                    <span className="font-mono text-teal-600 dark:text-teal-300 font-bold">UID: 04:A2:7D:C2:90:5E:8F</span>
                    <span className="text-teal-600 dark:text-teal-400 flex items-center font-bold">✓ 物理会伴已绑定</span>
                  </div>
                  <button 
                    onClick={() => {
                      setMyProfile({...myProfile, nfcBound: false, nfcUid: undefined});
                      triggerToast('NFC 物理挂件已解绑清空！');
                    }}
                    className="w-full text-[9px] text-rose-500 hover:text-rose-600 font-bold py-1.5 text-center bg-rose-50 dark:bg-rose-950/10 rounded-xl transition-all active:scale-95 cursor-pointer"
                  >
                    解绑并清空硬件映射
                  </button>
                </div>
              ) : (
                <button
                  disabled={nfcTapping || !myProfile.checkedIn}
                  onClick={() => {
                    setNfcTapping(true);
                    setTimeout(() => {
                      setMyProfile({
                        ...myProfile,
                        nfcBound: true,
                        nfcUid: '04:A2:7D:C2:90:5E:8F'
                      });
                      setNfcTapping(false);
                      triggerToast('🎉 物理挂载成功！你持有的物理感应挂件已于后台绑定，走近艺术馆藏感应区贴合打卡吧！');
                    }, 2200);
                  }}
                  className={`w-full text-xs font-black py-3 rounded-2xl transition-all scale-100 hover:scale-102 active:scale-95 duration-300 shadow-md text-center flex items-center justify-center space-x-2 cursor-pointer ${
                    !myProfile.checkedIn 
                      ? 'bg-slate-50 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none' 
                      : 'bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-505 hover:opacity-90 text-white shadow-teal-500/10'
                  }`}
                >
                  <Zap className="h-3 w-3 animate-bounce" />
                  <span>{!myProfile.checkedIn ? '请先完成签到' : '绑定你的现场通行卡'}</span>
                </button>
              )}
            </div>

          </div>
        )}

        {/* -------------------- TAB 3: CO-CREATING SANDBOX & EXHIBITIONS -------------------- */}
        {activeTab === 'co' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Top Toggle buttons - highly refined under Macaron tabs - borderless */}
            <div className="grid grid-cols-2 bg-slate-105 dark:bg-slate-900/60 p-1 rounded-2xl shadow-inner">
              <button 
                onClick={() => { setActiveSessionTab('sessions'); setSelectedExId(null); }}
                className={`py-2 text-center text-[11px] font-extrabold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] duration-300 cursor-pointer ${
                  activeSessionTab === 'sessions' 
                    ? 'bg-white dark:bg-slate-800 text-pink-500 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                🎙️ 论坛提问与微投
              </button>
              <button 
                onClick={() => { setActiveSessionTab('exhibits'); }}
                className={`py-2 text-center text-[11px] font-extrabold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] duration-300 cursor-pointer ${
                  activeSessionTab === 'exhibits' 
                    ? 'bg-white dark:bg-slate-800 text-pink-500 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                🖼️ 物理展区共鸣评论
              </button>
            </div>

            {activeSessionTab === 'sessions' ? (
              <div className="space-y-3.5">
                
                {/* Active topic bar */}
                <div className="bg-slate-950 text-white rounded-2xl p-4 shadow-md space-y-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-radial-gradient from-teal-500/10 to-transparent pointer-events-none"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] bg-white/10 text-teal-300 px-2 py-0.5 rounded-full uppercase font-bold tracking-widest">
                      当前讲堂关联 (实时直连)
                    </span>
                    <span className="text-[8px] text-pink-400 font-bold flex items-center">
                      <span className="h-1.5 w-1.5 bg-pink-400 rounded-full animate-pulse mr-1"></span>
                      大屏直连通道已激活
                    </span>
                  </div>

                  <h3 className="text-xs font-bold leading-snug">{currentSession.title}</h3>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[9px] text-slate-300">
                    <div className="flex items-center space-x-1">
                      <span className="h-4 w-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">{currentSession.speakerAvatarEmoji}</span>
                      <span>讲者: {currentSession.speakerName}</span>
                    </div>
                    <select 
                      value={activeSessionId}
                      onChange={(e) => {
                        setActiveSessionId(e.target.value);
                        triggerToast(`已切换场次。当前互动及提问关联移至：${sessions.find(s=>s.id === e.target.value)?.title.slice(0, 14)}...`);
                      }}
                      className="bg-slate-950 text-[9px] text-pink-300 border border-pink-450/40 rounded px-1.5 py-0.5 font-bold"
                    >
                      {sessions.map(s => (
                        <option key={s.id} value={s.id}>{s.timeStr.slice(0,5)} • {s.speakerName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Poll visual - highly styled with pastel progress pill - borderless */}
                {polls.filter(p => p.sessionId === activeSessionId).map(p => {
                  const totalVotes = p.votes.reduce((a, b) => a + b, 0);
                  const votedAny = p.userVotedIndex !== null;

                  return (
                    <div key={p.id} className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 space-y-4 shadow-[0_4px_24px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_32px_rgba(244,114,182,0.04)] transition-all">
                      <div className="flex items-center space-x-1.5">
                        <Vote className="h-4 w-4 text-pink-500" />
                        <span className="text-xs font-black text-slate-805 dark:text-slate-100">正在发起的现场微投票</span>
                      </div>
                      <h4 className="text-[11px] font-bold leading-tight text-slate-600 dark:text-slate-350">{p.question}</h4>

                      <div className="space-y-2.5">
                        {p.options.map((opt, idx) => {
                          const isVoted = p.userVotedIndex === idx;
                          const voteCount = p.votes[idx];
                          const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

                          return (
                            <button
                              key={idx}
                              disabled={votedAny || !myProfile.checkedIn}
                              onClick={() => {
                                const updatedPolls = polls.map(item => {
                                  if (item.id === p.id) {
                                    const nextVotes = [...item.votes];
                                    nextVotes[idx] += 1;
                                    return { ...item, userVotedIndex: idx, votes: nextVotes };
                                  }
                                  return item;
                                });
                                setPolls(updatedPolls);
                                triggerToast('🗳️ 投票成功！数据实时上传，可在“会场LED投影墙”看板观察占比！');
                              }}
                              className={`w-full text-left p-3 rounded-xl relative overflow-hidden transition-all duration-300 flex items-center justify-between cursor-pointer ${
                                isVoted
                                  ? 'bg-gradient-to-r from-pink-100/50 to-purple-100/50 text-pink-700 font-extrabold'
                                  : votedAny ? 'text-slate-400 bg-slate-50/50'
                                  : 'hover:bg-gradient-to-r hover:from-pink-50 hover:to-teal-50 bg-slate-50/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:scale-[1.01] active:scale-[0.99]'
                              }`}
                            >
                              {votedAny && (
                                <div className="absolute left-0 top-0 bottom-0 bg-pink-500/10 transition-all duration-550" style={{ width: `${percent}%` }}></div>
                              )}
                              <span className="relative z-10 text-[11px] font-bold">{opt}</span>
                              {votedAny && (
                                <span className="relative z-10 font-mono text-[10px] text-pink-600 dark:text-pink-400 font-bold">
                                  {percent}% ({voteCount}票)
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Live Bullet message pipeline input - borderless */}
                <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-4 space-y-2 shadow-[0_4px_24px_rgba(0,0,0,0.015)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-slate-650 flex items-center">
                      <Sparkles className="h-3 w-3 text-pink-500 mr-1" /> 发送实时弹幕 (公开漂流)
                    </span>
                  </div>
                  <div className="flex space-x-1.5">
                    <input 
                      type="text"
                      disabled={!myProfile.checkedIn}
                      value={newBulletText}
                      onChange={(e) => setNewBulletText(e.target.value)}
                      placeholder={!myProfile.checkedIn ? "请先在「大堂」扫码签到" : "发射一条弹幕到大屏幕漂流..."}
                      className="flex-1 bg-slate-50 dark:bg-slate-955 text-xs p-2.5 px-3.5 rounded-xl focus:bg-pink-50/20 focus:outline-none transition-all duration-300"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (!newBulletText.trim()) return;
                          const nextMsg: BulletMessage = {
                            id: `bullet_${Date.now()}`,
                            content: newBulletText,
                            userNick: myProfile.nickName,
                            userAvatarColor: myProfile.avatarColor,
                            userAvatarEmoji: myProfile.avatarEmoji,
                            status: 'pending',
                            createdAt: new Date().toTimeString().split(' ')[0].substring(0, 5)
                          };
                          setBulletMessages([nextMsg, ...bulletMessages]);
                          setNewBulletText('');
                          triggerToast('💥 弹幕已捕获！进入会馆“人工审核池”，审核过审后上墙！');
                        }
                      }}
                    />
                    <button 
                      disabled={!newBulletText.trim() || !myProfile.checkedIn}
                      onClick={() => {
                        const nextMsg: BulletMessage = {
                          id: `bullet_${Date.now()}`,
                          content: newBulletText,
                          userNick: myProfile.nickName,
                          userAvatarColor: myProfile.avatarColor,
                          userAvatarEmoji: myProfile.avatarEmoji,
                          status: 'pending',
                          createdAt: new Date().toTimeString().split(' ')[0].substring(0, 5)
                        };
                        setBulletMessages([nextMsg, ...bulletMessages]);
                        setNewBulletText('');
                        triggerToast('💥 弹幕已捕获！进入会馆“人工审核池”，审核过审后上墙！');
                      }}
                      className="p-1.5 bg-pink-500 text-white hover:bg-pink-600 rounded-xl transition-all disabled:opacity-30 active:scale-95"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Post question box - borderless */}
                <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-4 space-y-2 shadow-[0_4px_24px_rgba(0,0,0,0.015)]">
                  <span className="text-[11px] font-black text-slate-600 block">向当前演讲提问</span>
                  <textarea
                    disabled={!myProfile.checkedIn}
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder={!myProfile.checkedIn ? "请先完成扫码核销哦" : "打卡写下您的疑问、技术观察，或对讲者的直接追问..."}
                    rows={2}
                    className="w-full bg-slate-50 dark:bg-slate-955 text-xs p-3 rounded-xl focus:bg-pink-50/20 focus:outline-none resize-none leading-normal transition-all duration-300"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                      <input 
                        type="checkbox" 
                        id="anon-check"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded text-pink-500 scale-90"
                      />
                      <label htmlFor="anon-check">匿名提问人</label>
                    </div>
                    <button
                      disabled={!newQuestionText.trim() || !myProfile.checkedIn}
                      onClick={() => {
                        const newQ: Question = {
                          id: `q_${Date.now()}`,
                          sessionId: activeSessionId,
                          userNick: isAnonymous ? '匿名观众' : myProfile.nickName,
                          userAvatarColor: isAnonymous ? 'bg-gray-450' : myProfile.avatarColor,
                          userAvatarEmoji: isAnonymous ? '👤' : myProfile.avatarEmoji,
                          content: newQuestionText,
                          upvotes: 0,
                          status: 'pending',
                          createdAt: new Date().toTimeString().split(' ')[0].substring(0, 5),
                          isAnswered: false,
                        };
                        setQuestions([newQ, ...questions]);
                        setNewQuestionText('');
                        triggerToast('🙋‍♂️ 提问已成功投出至导播端。等候点亮至幻灯屏！');
                      }}
                      className="bg-purple-600 hover:bg-purple-750 text-white font-bold text-[10px] px-4 py-1.5 rounded-xl active:scale-95 transition-all shadow-md"
                    >
                      投递学术追问
                    </button>
                  </div>

                  {/* Visual upvotes list of previous questions */}
                  <div className="space-y-2 pt-2 border-t dark:border-slate-850">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">会场观众提问共鸣席 ({countApprovedQuestions})</span>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {questions.filter(q => q.sessionId === activeSessionId && q.status === 'approved').length === 0 ? (
                        <div className="text-[9px] text-slate-400 text-center py-2 italic bg-slate-50 dark:bg-slate-900 rounded-xl">暂无过审提问，写下第一句破冰疑惑！</div>
                      ) : (
                        questions.filter(q => q.sessionId === activeSessionId && q.status === 'approved').map(q => (
                          <div key={q.id} className="bg-slate-50/70 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 hover:border-pink-200 transition-all text-[11px] leading-relaxed space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-slate-500 flex items-center space-x-1">
                                <span className="text-[9px]">{q.userAvatarEmoji}</span>
                                <span>{q.userNick}</span>
                              </span>
                              <button
                                onClick={() => {
                                  const updated = questions.map(item => {
                                    if (item.id === q.id) {
                                      return { ...item, upvotes: item.upvotes + 1 };
                                    }
                                    return item;
                                  });
                                  setQuestions(updated);
                                  triggerToast('▲ 点赞举赞成功！本问答在讲席大屏上排名置顶！');
                                }}
                                className="text-[9px] bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 font-bold px-2 py-0.5 rounded-full hover:scale-105 active:scale-95 flex items-center shrink-0"
                              >
                                ▲ {q.upvotes} 举赞
                              </button>
                            </div>
                            <p className="text-slate-600 dark:text-slate-350">{q.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              // SUB-TAB: Physical Exhibits list with Macaron grid visual
              <div className="space-y-3.5 animate-slideUp">
                {selectedExId === null ? (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-teal-500/10 p-3.5 rounded-2xl text-[10px] text-teal-700 dark:text-teal-400 leading-relaxed flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-teal-500 shrink-0 animate-pulse" />
                      <span><strong>感应共鸣挑战：</strong> 携带您实体持有的感应微芯片 UID，走近作品即可在后台记录并策展，快去实体探馆吧！</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {exhibits.map(ex => (
                        <div 
                          key={ex.id}
                          onClick={() => setSelectedExId(ex.id)}
                          className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-3 cursor-pointer hover:shadow-[0_12px_32px_rgba(244,114,182,0.04)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center space-x-3 shadow-[0_4px_24px_rgba(0,0,0,0.012)]"
                        >
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative select-none">
                            <img src={ex.imageUrl} alt={ex.name} referrerPolicy="no-referrer" className="w-[102%] h-[102%] object-cover" />
                            <span className="absolute bottom-0 inset-x-0 bg-slate-950/70 text-[7px] text-white py-0.5 rounded-b text-center tracking-tight truncate">{ex.zone}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs truncate text-slate-900 dark:text-slate-100 leading-tight">{ex.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">作者 / 主研: {ex.artist}</p>
                            <div className="flex items-center justify-between text-[10px] text-pink-500 font-bold mt-1.5 pt-1.5 border-t border-dashed border-slate-100 dark:border-slate-800">
                              <span className="text-slate-400 font-normal">共鸣数: <strong className="font-bold font-mono text-slate-600 dark:text-slate-350">{ex.likes}</strong></span>
                              <span>触碰打卡并点评 →</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Select Exhibit Detail View
                  (() => {
                    const ex = exhibits.find(e => e.id === selectedExId)!;
                    return (
                      <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 space-y-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.02)] animate-scaleIn">
                        <button 
                          onClick={() => setSelectedExId(null)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <span>← 返回实地馆藏一览</span>
                        </button>

                        <div className="h-32 rounded-2xl overflow-hidden relative select-none">
                          <img src={ex.imageUrl} alt={ex.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 text-[8px] bg-pink-550 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{ex.zone}</span>
                        </div>

                        <div>
                          <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">{ex.name}</h3>
                          <span className="text-[10px] text-slate-400">主研学者: {ex.artist}</span>
                        </div>

                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-55 dark:bg-slate-955 p-3 rounded-2xl text-slate-805 dark:text-slate-305">
                          {ex.description}
                        </p>

                        {/* Interactive resonance block */}
                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <button
                            onClick={() => {
                              const updated = exhibits.map(e => {
                                  if (e.id === ex.id) {
                                      const liked = !e.isLikedByUser;
                                      return { ...e, isLikedByUser: liked, likes: liked ? e.likes + 1 : e.likes - 1 };
                                  }
                                  return e;
                              });
                              setExhibits(updated);
                              triggerToast(ex.isLikedByUser ? '已取消点赞共鸣' : '❤️ 灵感共鸣！该作的灵魂标识已锁定在您的会后报告中！');
                            }}
                            className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all duration-300 hover:scale-102 active:scale-95 cursor-pointer ${
                              ex.isLikedByUser 
                                ? 'bg-pink-500 text-white shadow-md shadow-pink-550/10' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-pink-50/50'
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${ex.isLikedByUser ? 'fill-current animate-bounce' : ''}`} />
                            <span className="text-[10px]">共鸣 ({ex.likes})</span>
                          </button>

                          <button
                            onClick={() => {
                              const updated = exhibits.map(e => {
                                if (e.id === ex.id) {
                                  const fav = !e.isFavoritedByUser;
                                  return { ...e, isFavoritedByUser: fav, favorites: fav ? e.favorites + 1 : e.favorites - 1 };
                                }
                                return e;
                              });
                              setExhibits(updated);
                              triggerToast(ex.isFavoritedByUser ? '已取消灵感收藏' : '💾 已存置学术策展灵感夹！');
                            }}
                            className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all duration-300 hover:scale-102 active:scale-95 cursor-pointer ${
                              ex.isFavoritedByUser 
                                ? 'bg-teal-500 text-white shadow-md shadow-teal-555/10 border border-teal-400/20' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-50/50 border border-slate-200/50 dark:border-slate-800/40'
                            }`}
                          >
                            <Bookmark className={`h-4 w-4 ${ex.isFavoritedByUser ? 'fill-current' : ''}`} />
                            <span className="text-[10px]">策选 ({ex.favorites})</span>
                          </button>
                        </div>

                        {/* Comment section */}
                        <div className="space-y-2 border-t border-slate-150 dark:border-slate-850 pt-3">
                          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 block uppercase">馆友现场共鸣评述 ({ex.comments.length})</span>
                          
                          <div className="space-y-1.5 max-h-32 overflow-y-auto">
                            {ex.comments.map(c => (
                              <div key={c.id} className="bg-slate-55 dark:bg-slate-955/60 p-2.5 rounded-2xl text-[10px] leading-normal font-medium text-slate-705 dark:text-slate-305 border border-slate-150 dark:border-slate-850">
                                <span className="font-bold text-slate-400 block text-[9px]">{c.userNick} • {c.createdAt}</span>
                                <p className="mt-0.5">{c.text}</p>
                              </div>
                            ))}
                          </div>

                          <div className="flex space-x-1 pt-1.5">
                            <input 
                              type="text"
                              disabled={!myProfile.checkedIn}
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder={!myProfile.checkedIn ? "请先完成核签入场" : "写下你的见解..."}
                              className="flex-1 bg-slate-50 dark:bg-slate-950 text-[11px] p-2 px-3.5 rounded-2xl focus:outline-none border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
                            />
                            <button
                              disabled={!commentText.trim() || !myProfile.checkedIn}
                              onClick={() => {
                                const newC = {
                                  id: `comment_${Date.now()}`,
                                  userNick: myProfile.nickName,
                                  avatarEmoji: myProfile.avatarEmoji,
                                  avatarColor: myProfile.avatarColor,
                                  text: commentText,
                                  createdAt: new Date().toTimeString().split(' ')[0].substring(0, 5)
                                };
                                const updated = exhibits.map(e => {
                                  if (e.id === ex.id) {
                                    return { ...e, comments: [...e.comments, newC] };
                                  }
                                  return e;
                                });
                                setExhibits(updated);
                                setCommentText('');
                                triggerToast('💬 共鸣评述发布成功！在大屏幕实时上墙！');
                              }}
                              className="px-4 bg-slate-900 dark:bg-slate-100 dark:text-slate-950 text-white font-extrabold text-[10px] rounded-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-slate-850"
                            >
                              发布
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })()
                )}
              </div>
            )}

          </div>
        )}

        {/* -------------------- TAB 4: CONCORDANT MATCHING & LIVING REPORT -------------------- */}
        {activeTab === 'we' && (
          <div className="space-y-4 animate-fadeIn text-slate-800 dark:text-slate-100">
            {/* Top Sub Tabs for "Mirror Twins" vs "Alumni Communities" */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-2xl border dark:border-slate-800 shadow-inner select-none shrink-0">
              <button
                type="button"
                onClick={() => setWeSubTab('radar')}
                className={`py-2 text-center text-[10px] font-black rounded-xl transition cursor-pointer ${
                  weSubTab === 'radar' 
                    ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow-sm font-black' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
                }`}
              >
                发现同行
              </button>
              <button
                type="button"
                onClick={() => setWeSubTab('contacts')}
                className={`py-2 text-center text-[10px] font-black rounded-xl transition cursor-pointer relative ${
                  weSubTab === 'contacts' 
                    ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow-sm font-black' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
                }`}
              >
                通讯录
                {myContactCards.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-pink-500 text-white text-[8px] flex items-center justify-center font-black">
                    {myContactCards.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setWeSubTab('community')}
                className={`py-2 text-center text-[10px] font-black rounded-xl transition cursor-pointer relative ${
                  weSubTab === 'community' 
                    ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow-sm font-black' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
                }`}
              >
                兴趣小组
              </button>
            </div>

            {weSubTab === 'radar' ? (
              <>
                        {/* Top sonar radar scanner - Mirror twin spectrum visualization */}
            <div className="bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.015)] backdrop-blur-md">
              <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 to-transparent pointer-events-none"></div>
              
              {radarScanning ? (
                <div className="py-2 flex flex-col items-center space-y-3.5 w-full">
                  {/* Symmetrical Dual Mirror Orbit Waves Animation */}
                  <div className="relative w-full h-16 flex items-center justify-center">
                    {/* Mirror axis center line */}
                    <div className="absolute top-0 bottom-0 w-[1.5px] bg-dashed border-l border-indigo-400 dark:border-purple-500 opacity-60 z-10"></div>
                    
                    {/* Left Aura (Self) */}
                    <div className="absolute left-[15%] w-10 h-10 rounded-full border border-indigo-500/40 flex items-center justify-center bg-indigo-500/10 animate-pulse shadow-md">
                      <div className="absolute inset-x-0 inset-y-0 rounded-full border border-dashed border-indigo-400 animate-spin"></div>
                      <span className="text-xs">🔮</span>
                    </div>

                    {/* Symmetrical connecting light arc */}
                    <div className="absolute inset-x-[32%] h-[1.5px] bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 opacity-80 animate-pulse">
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping mx-auto" style={{ animationDuration: '1.2s' }}></div>
                    </div>

                    {/* Right Aura (Mirror Twin) */}
                    <div className="absolute right-[15%] w-10 h-10 rounded-full border border-pink-500/40 flex items-center justify-center bg-pink-500/10 animate-pulse shadow-md">
                      <div className="absolute inset-x-0 inset-y-0 rounded-full border border-dashed border-pink-400 animate-spin" style={{ animationDirection: 'reverse' }}></div>
                      <span className="text-xs">🧬</span>
                    </div>

                    {/* Shimmer reflection ring */}
                    <div className="absolute w-44 h-12 border border-purple-400/30 rounded-full animate-ping opacity-25" style={{ animationDuration: '2.5s' }}></div>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-extrabold animate-pulse">
                    正在为你查找可能聊得来的参会者...
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5 select-none w-full">
                  <div className="flex items-center justify-center space-x-1.5 bg-indigo-100/80 dark:bg-purple-950/40 px-3.5 py-1.5 rounded-2xl border border-indigo-200/50 dark:border-indigo-900/50 w-fit mx-auto shadow-xs">
                    <Sparkles className="h-3 w-3 text-pink-500 animate-bounce" />
                    <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">
                      已找到 {attendees.length} 位可能同频的人
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold px-2">
                    根据你的关注主题、兴趣标签和参会目标，优先推荐可能适合交流的人。
                  </p>
                </div>
              )}
            </div>

            {/* List of matched attendees */}
            <div className="space-y-3">
              {attendees.map(other => {
                const matchVal = calculateMatchScore(other);
                const conn = getConnectionState(other.id);
                
                // shared tags
                const myTags = [...myProfile.designDirections, ...myProfile.interests, ...myProfile.goals];
                const otherTags = [...other.designDirections, ...other.interests, ...other.goals];
                const commonTags = myTags.filter(t => otherTags.includes(t));

                return (
                  <div 
                    key={other.id}
                    className={`bg-white dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden hover:scale-[1.01] hover:border-pink-300 dark:hover:border-purple-800 hover:shadow-[0_12px_32px_rgba(244,114,182,0.06)] active:scale-[0.99] transition-all duration-300 ${
                      conn?.status === 'confirmed' 
                        ? 'bg-gradient-to-br from-teal-50/50 to-emerald-50/10 dark:from-teal-950/20 dark:to-emerald-950/10 border-teal-300 dark:border-teal-900 font-medium' 
                        : 'font-medium'
                    }`}
                  >
                    {/* Visual Symmetrical Mirror percentage badge */}
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-pink-500 via-purple-600 to-indigo-600 border-l border-b border-pink-400/20 dark:border-purple-400/30 text-white text-[9px] px-3.5 py-1.5 rounded-bl-2xl font-black font-mono flex items-center space-x-1 shadow-xs">
                      <ArrowLeftRight className="h-2.5 w-2.5 text-pink-200 mr-0.5" />
                      <span>匹配度: {matchVal}%</span>
                    </div>

                    <div className="flex items-start space-x-3 pr-20 select-none">
                      <div className={`h-11 w-11 ${other.avatarColor} text-white rounded-full flex items-center justify-center text-xl shadow-inner select-none shrink-0 border border-white/20`}>
                        {other.avatarEmoji}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <h4 className="font-bold text-xs truncate max-w-24 text-slate-900 dark:text-white leading-tight">{other.nickName}</h4>
                          {other.group === 'Guest' && (
                            <span className="text-[7px] bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase scale-90 shrink-0 select-none">特邀嘉宾</span>
                          )}
                        </div>
                        <p className="text-[9px] text-slate-505 dark:text-slate-400 font-semibold leading-none truncate">{other.organization} • {other.title}</p>
                        
                        {/* Whimsical properties in radar list */}
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {other.mbti && (
                            <span className="text-[8px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/40 font-bold px-1.5 py-0.5 rounded shrink-0">
                              🧬 {other.mbti.split(' - ')[0]}
                            </span>
                          )}
                          {other.designArchetype && (
                            <span className="text-[8px] bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-200/50 dark:border-pink-800/40 font-bold px-1.5 py-0.5 rounded shrink-0">
                              🎨 {other.designArchetype}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {other.achievementBadge && (
                      <div className="text-[9.5px] bg-yellow-500/10 text-yellow-850 dark:text-yellow-400 border border-yellow-250/45 dark:border-yellow-900/30 py-1.5 px-3 rounded-xl font-bold select-none leading-relaxed">
                        {other.achievementBadge}
                      </div>
                    )}

                    {other.quote && (
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed pl-2 border-l border-slate-200">
                        “ {other.quote} ”
                      </p>
                    )}

                    {/* Symmetrical AI Mirror Icebreaker Card */}
                    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 p-3.5 rounded-2xl text-[10px] leading-relaxed text-slate-705 dark:text-slate-305 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] relative overflow-hidden">
                      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none"></div>
                      
                      <span className="text-[9.5px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest block mb-1.5 flex items-center select-none font-sans">
                        <Sparkles className="h-3 w-3 mr-1 text-pink-500 animate-pulse" />
                        智能推荐理由
                      </span>
                      <p className="font-semibold text-slate-650 dark:text-slate-300">
                        你和「{other.nickName}」都关注「{other.designDirections[0] || '体验设计'}」。可以先查看对方主页，再决定是否发起交流。
                      </p>
                    </div>

                    {/* Shared overlap tags */}
                    <div className="space-y-1.5 select-none">
                      <span className="text-[9px] text-slate-505 dark:text-slate-400 font-extrabold block">共同兴趣</span>
                      <div className="flex flex-wrap gap-1">
                        {commonTags.slice(0, 3).map(t => (
                          <span key={t} className="text-[8px] bg-purple-55 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/45 px-2.5 py-0.5 rounded-full font-black shadow-xs">{t}</span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedProfileAttendee(other)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-black py-2.5 rounded-2xl text-[10px] active:scale-95 transition cursor-pointer"
                    >
                      查看主页、作品和经历
                    </button>

                    {/* Action Button Segment with Clear Border & Visible High Contrast */}
                    <div className="pt-2 text-[11px]">
                      {conn ? (
                        conn.status === 'confirmed' ? (
                          <div className="space-y-1.5 w-full">
                            <div className="w-full flex items-center justify-between bg-teal-50 dark:bg-teal-950/30 p-2.5 rounded-2xl border-2 border-teal-500/60 dark:border-teal-700 shadow-sm">
                              <span className="text-teal-850 dark:text-teal-400 font-extrabold flex items-center select-none text-[10.5px]">
                                <Check className="h-4 w-4 mr-1 bg-teal-100 dark:bg-teal-900 border border-teal-400 dark:border-teal-700 rounded-full text-teal-600 dark:text-teal-400 p-0.5" />
                                已交换联系方式
                              </span>
                              <span className="bg-white dark:bg-slate-950 border border-teal-300 dark:border-slate-850 px-2.5 py-0.8 rounded-xl font-mono text-[10px] font-black text-slate-900 dark:text-teal-350 select-all shadow-xs">
                                📞 {other.phone}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setActiveChatAttendee(other);
                                triggerToast(`💬 正在连接与【${other.nickName}】的心智频段，私聊已开启...`);
                              }}
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] py-2.5 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center space-x-1 shadow-md shadow-indigo-650/15 active:scale-[0.98]"
                            >
                              <MessageSquare className="h-3 w-3 shrink-0" />
                              <span>与 {other.nickName} 私聊</span>
                            </button>
                          </div>
                        ) : (
                          <div className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-955 p-2.5 rounded-2xl border-2 border-purple-300 dark:border-purple-800 shadow-sm">
                            <span className="text-purple-700 dark:text-purple-400 font-black animate-pulse text-[10px] select-none pl-1 flex items-center">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5 animate-pulse"></span>
                              等待对方确认...
                            </span>
                            <button 
                              onClick={() => {
                                const updated = connections.map(c => {
                                  if (c.id === conn.id) return { ...c, status: 'confirmed' as const };
                                  return c;
                                });
                                setConnections(updated);
                                triggerToast(`🎉 已与【${other.nickName}】交换联系方式`);
                              }}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[9.5px] px-3.5 py-1.8 rounded-xl active:scale-95 transition-all shadow-md shadow-indigo-600/10 border border-indigo-500 cursor-pointer"
                            >
                              确认连接
                            </button>
                          </div>
                        )
                      ) : (
                        <button
                          disabled={!myProfile.checkedIn}
                          onClick={() => {
                            const newC: Connection = {
                              id: `conn_${Date.now()}`,
                              fromUserId: 'me',
                              toUserId: other.id,
                              matchedTags: commonTags,
                              status: 'pending',
                              createdAt: '11:59'
                            };
                            setConnections([...connections, newC]);
                            setWeSubTab('contacts');
                            triggerToast(`已发送联系请求，已加入「我的通讯录」待确认列表。`);
                          }}
                          className={`w-full font-black py-3 rounded-xl text-center text-[10.5px] transition-all duration-300 active:scale-95 cursor-pointer border-2 ${
                            !myProfile.checkedIn
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-300 dark:border-slate-700 cursor-not-allowed'
                              : 'bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-750 hover:to-pink-750 text-white shadow-md shadow-pink-500/15 border-pink-500/40 hover:border-pink-600'
                          }`}
                        >
                          {!myProfile.checkedIn ? '签到后可发起联系' : '请求交换联系方式'}
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Report moved to My tab */}
            <div className="bg-white/90 dark:bg-slate-900/85 rounded-[28px] p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-pink-500/15">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[12px] font-black text-slate-900 dark:text-white">我的大会报告已移到「我的」</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-300 leading-relaxed">这里专注展示同行推荐。你的报告、收藏和个人数据都在底部「我的」里查看。</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('me')}
                className="w-full rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-3 text-[11px] font-black active:scale-95 transition"
              >
                去看我的个人报告
              </button>
            </div>

            </>
            ) : weSubTab === 'contacts' ? (
              <div className="space-y-4 animate-fadeIn text-slate-800 dark:text-slate-100">
                <div className="rounded-[28px] p-4 bg-gradient-to-br from-white via-indigo-50/45 to-teal-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">我的通讯录</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-300 leading-relaxed mt-1">
                        已请求或已交换联系方式的同行都会保存在这里，方便之后查看主页、作品和继续聊天。
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-lg font-black text-indigo-600 dark:text-indigo-300 leading-none">{myContactCards.length}</div>
                      <div className="text-[8px] text-slate-400 dark:text-slate-500 font-bold mt-1">联系人</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-2xl bg-white/80 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 p-2.5">
                      <div className="text-[9px] text-slate-500 dark:text-slate-300 font-bold">已连接</div>
                      <div className="text-base font-black text-teal-600 dark:text-teal-300">{confirmedContactCards.length}</div>
                    </div>
                    <div className="rounded-2xl bg-white/80 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 p-2.5">
                      <div className="text-[9px] text-slate-500 dark:text-slate-300 font-bold">待确认</div>
                      <div className="text-base font-black text-purple-600 dark:text-purple-300">{pendingContactCards.length}</div>
                    </div>
                    <div className="rounded-2xl bg-white/80 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 p-2.5">
                      <div className="text-[9px] text-slate-500 dark:text-slate-300 font-bold">推荐</div>
                      <div className="text-base font-black text-pink-600 dark:text-pink-300">{Math.max(0, attendees.length - myContactCards.length)}</div>
                    </div>
                  </div>
                </div>

                {myContactCards.length === 0 ? (
                  <div className="rounded-[28px] bg-white/90 dark:bg-slate-900/90 border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                      <Users className="h-7 w-7" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-slate-900 dark:text-white">还没有联系人</h5>
                      <p className="text-[10px] text-slate-500 dark:text-slate-300 leading-relaxed mt-1">去「发现同行」里请求交换联系方式，之后就能在这里统一查看。</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWeSubTab('radar')}
                      className="w-full rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-3 text-[11px] font-black active:scale-95 transition"
                    >
                      去发现同行
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myContactCards.map(({ connection, attendee }) => {
                      const commonTags = connection.matchedTags.length > 0 ? connection.matchedTags : myProfile.interests.filter((tag) => attendee.interests.includes(tag));
                      const isConfirmed = connection.status === 'confirmed';
                      return (
                        <div key={connection.id} className="rounded-[28px] bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm space-y-3">
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => setSelectedProfileAttendee(attendee)}
                              className={`h-13 w-13 ${attendee.avatarColor} text-white rounded-2xl overflow-hidden flex items-center justify-center text-2xl shadow-inner shrink-0 border border-white/20 active:scale-95 transition`}
                            >
                              {attendee.avatarImage ? <img src={attendee.avatarImage} alt={attendee.nickName} className="w-full h-full object-cover" /> : attendee.avatarEmoji}
                            </button>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h5 className="text-[12px] font-black text-slate-900 dark:text-white truncate max-w-28">{attendee.nickName}</h5>
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${isConfirmed ? 'bg-teal-500/10 text-teal-600 dark:text-teal-300' : 'bg-purple-500/10 text-purple-600 dark:text-purple-300'}`}>
                                  {isConfirmed ? '已连接' : '待确认'}
                                </span>
                              </div>
                              <p className="text-[9px] text-slate-500 dark:text-slate-300 leading-relaxed mt-0.5 truncate">{attendee.organization} · {attendee.title}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {commonTags.slice(0, 3).map((tag) => (
                                  <span key={tag} className="text-[8px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 px-2 py-0.5 font-bold">{tag}</span>
                                ))}
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold">匹配度</div>
                              <div className="text-sm font-black text-pink-600 dark:text-pink-300">{calculateMatchScore(attendee)}%</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedProfileAttendee(attendee)}
                              className="rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 py-2.5 text-[9.5px] font-black active:scale-95 transition"
                            >
                              看主页
                            </button>
                            <button
                              type="button"
                              disabled={!isConfirmed}
                              onClick={() => {
                                setActiveChatAttendee(attendee);
                                triggerToast(`正在打开与 ${attendee.nickName} 的聊天`);
                              }}
                              className={`rounded-2xl py-2.5 text-[9.5px] font-black active:scale-95 transition ${isConfirmed ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
                            >
                              发消息
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = connections.map((item) => item.id === connection.id ? { ...item, status: 'confirmed' as const } : item);
                                setConnections(updated);
                                triggerToast(`已与 ${attendee.nickName} 交换联系方式`);
                              }}
                              className="rounded-2xl bg-teal-500/10 text-teal-700 dark:text-teal-300 py-2.5 text-[9.5px] font-black active:scale-95 transition"
                            >
                              {isConfirmed ? '已保存' : '确认'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn text-slate-800 dark:text-slate-100">
                {/* Community Header Banner */}
                <div className="bg-gradient-to-tr from-purple-500/10 via-indigo-500/10 to-teal-500/5 p-4 rounded-[24px] border border-indigo-200/40 dark:border-indigo-900/45 text-slate-800 dark:text-slate-100 select-none space-y-1.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center space-x-1.5 select-none">
                    <span>会后兴趣小组</span>
                    <span className="text-[7.5px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded-full scale-90 uppercase animate-pulse shrink-0">推荐</span>
                  </h4>
                  <p className="text-[10px] text-slate-505 dark:text-slate-400 leading-relaxed font-semibold pr-1 text-left">
                    根据你的兴趣标签推荐会后小组。加入后可以继续交流、查看资源和发起合作。
                  </p>
                </div>

                {/* Communities Cards Stack */}
                <div className="space-y-4">
                  {[
                    {
                      id: 'comm-druids',
                      name: '自然算法生态秘境',
                      engName: 'Druids Eco-Nexus',
                      color: 'from-emerald-500/10 via-teal-500/5 to-slate-50/50 dark:from-emerald-950/20 dark:via-slate-900/10 dark:to-slate-950/60',
                      borderColor: 'border-emerald-300 dark:border-emerald-800/40',
                      badgeColor: 'bg-emerald-505/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                      sparkleText: '🌱 专注于生命计算、土壤微生物能源转化与有机气候共创。',
                      mbti: 'INFJ / INFP 推荐人群',
                      agenda: '$25,000 元余系列基金共创立项',
                      members: ['陈青川 Panda 🐼', '季雨桐 Fox 🦊'],
                      desc: '回归土地与生机逻辑。本组会后立项书获得清华创意实验室学术联署，目前正在招募空气介质物理反馈件与微电极传感器拼装师。',
                    },
                    {
                      id: 'comm-spectre',
                      name: '非线性体验感官幽灵阵线',
                      engName: 'Spectre Sensory Syndicate',
                      color: 'from-indigo-500/10 via-purple-500/5 to-slate-50/50 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-slate-950/60',
                      borderColor: 'border-indigo-300 dark:border-indigo-800/40',
                      badgeColor: 'bg-indigo-505/10 text-indigo-650 dark:text-indigo-400 border border-indigo-500/20',
                      sparkleText: '🔮 探索气味、温湿度调节与迷宫具身交互。',
                      mbti: 'ENFP / ISFP / INFP 推荐人群',
                      agenda: '会后联合项目与作品展示机会',
                      members: ['苏格 Dr.Su 🦉', '陈青川 Panda 🐼'],
                      desc: '致力于数字技术在物理感官上的非线性溢出。组委会将在静安艺术中心媒体室免费提供4周的联合学者驻留工位。',
                    },
                    {
                      id: 'comm-wizards',
                      name: '多模态媒介狂徒沙龙',
                      engName: 'Multimodal AI Wizards',
                      color: 'from-pink-505/10 via-rose-500/5 to-slate-50/50 dark:from-pink-950/20 dark:via-purple-950/10 dark:to-slate-950/60',
                      borderColor: 'border-pink-300 dark:border-pink-800/40',
                      badgeColor: 'bg-pink-505/10 text-pink-600 dark:text-pink-400 border border-pink-500/20',
                      sparkleText: '🧠 具身感知、情感反馈硬件与 XR 穿戴设备研发。',
                      mbti: 'ENTP / INTJ 推荐人群',
                      agenda: 'AI Studio 长期高能 GPU 限免接口与设备赞助',
                      members: ['米亚 Mia 🤖', '张赫轩 Mark 🐯'],
                      desc: '让交互硬件充溢情感。由 Google AI Studio 生态及上海微校集成电路提供赞助支持，已预配置十组智能物联网调试套件。',
                    },
                    {
                      id: 'comm-court',
                      name: '硬核深蓝批判哲学法庭',
                      engName: 'Critical Logic Court',
                      color: 'from-slate-500/10 via-slate-700/10 to-slate-50/50 dark:from-slate-900/30 dark:via-slate-950/40 dark:to-slate-950/60',
                      borderColor: 'border-slate-350 dark:border-slate-800',
                      badgeColor: 'bg-slate-205 text-slate-705 dark:bg-slate-900 dark:text-slate-400 border border-slate-300 dark:border-slate-800',
                      sparkleText: '⚖️ 探讨算法社会考古学、系统霸权批判、人类非核心设计。',
                      mbti: 'INTJ / INTP 推荐人群',
                      agenda: '联刊出版《设计批判之刃》白皮书',
                      members: ['苏格 Dr.Su 🦉', '米亚 Mia 🤖'],
                      desc: '用冰寒的底层逻辑拆穿一切伪善的同构神话。对接各大高校与期刊提供后峰会学术发表席位与论文共创支持。',
                    }
                  ].map(comm => {
                    const isJoined = joinedCommunities.includes(comm.id);
                    return (
                      <div 
                        key={comm.id}
                        className={`bg-gradient-to-br ${comm.color} border-2 ${comm.borderColor} rounded-[28px] p-4.5 space-y-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] relative overflow-hidden`}
                      >
                        {/* Decorative background radial light */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 dark:bg-black/5 rounded-full blur-2xl pointer-events-none"></div>

                        {/* Card Title */}
                        <div className="flex justify-between items-start select-none relative z-10">
                          <div>
                            <span className={`text-[7px] font-black uppercase tracking-wider px-1.8 py-0.5 rounded-md ${comm.badgeColor}`}>
                              {comm.mbti}
                            </span>
                            <h5 className="font-extrabold text-[11.5px] text-slate-900 dark:text-white mt-1 leading-none">{comm.name}</h5>
                            <p className="text-[7.5px] font-mono font-bold text-slate-400 leading-none mt-0.5">{comm.engName}</p>
                          </div>
                          
                          {isJoined ? (
                            <span className="bg-teal-500 text-white font-black text-[8px] px-2 py-0.8 rounded-xl border border-teal-400 shadow-xs uppercase select-none flex items-center animate-bounce shrink-0">
                              已加入
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setJoinedCommunities([...joinedCommunities, comm.id]);
                                triggerToast(`🤝 契约结成！您已加入「${comm.name}」群组，衍生扶持窗口激活成功！`);
                              }}
                              className="px-3 py-1.2 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-black text-[8.5px] rounded-xl active:scale-95 transition cursor-pointer select-none shrink-0 shadow-sm"
                            >
                              加入小组
                            </button>
                          )}
                        </div>

                        {/* Context summary */}
                        <div className="p-3 bg-white/70 dark:bg-slate-950/80 border border-slate-150 dark:border-slate-850 rounded-2xl text-[9px] text-slate-650 dark:text-slate-350 leading-relaxed font-semibold relative z-10">
                          <p className="text-slate-800 dark:text-slate-100 font-extrabold pb-1 flex items-center">
                            <Sparkles className="h-3 w-3 mr-1 text-pink-500" />
                            <span>研究范式：{comm.sparkleText}</span>
                          </p>
                          <p className="text-[8.5px] text-slate-455 dark:text-slate-400 mt-1 pl-1.5 border-l border-indigo-400 dark:border-indigo-600 leading-normal select-text font-normal font-sans">
                            {comm.desc}
                          </p>
                        </div>

                        {isJoined ? (
                          /* Interactive Chat Lobby & Derivative Claims Options */
                          <div className="space-y-3.5 pt-1 relative z-10 animate-fadeIn">
                            {/* Claim Benefits Section */}
                            <div className="bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/25 p-3 rounded-2xl space-y-2 text-left">
                              <span className="text-[8px] font-black text-teal-600 dark:text-teal-400 block tracking-widest uppercase select-none">
                                🎁 学术与服务衍生红利认领
                              </span>
                              
                              <div className="grid grid-cols-1 gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => triggerToast(`💾 【已推荐立项】共创申请资格校验通过！已向组委会推送：CO-CLAIM-2026-${comm.id.toUpperCase()}-${Date.now().toString().slice(-4)}`)}
                                  className="w-full py-1.8 bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-850 hover:bg-slate-100 font-black text-[8.5px] text-teal-700 dark:text-teal-400 rounded-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-1 shadow-xs"
                                >
                                  <Briefcase className="h-3 w-3 shrink-0" />
                                  <span>免费申领提案契合及专属席位支持</span>
                                </button>
                                
                                <div className="flex text-[7px] text-slate-400 justify-between items-center px-1 font-bold select-none leading-none">
                                  <span>同盟成员：{comm.members.length + 1} 位学者</span>
                                  <span>状态：契约签署终身托管</span>
                                </div>
                              </div>
                            </div>

                            {/* Lounge Chat Hub (社内小群聊对敲) */}
                            <div className="bg-slate-900/95 dark:bg-slate-950 p-3 rounded-2.5xl space-y-3 border border-slate-800 shadow-xl">
                              <div className="text-[7.5px] font-black text-slate-400 tracking-wider uppercase pb-1.5 border-b border-slate-800 select-none text-left flex items-center justify-between">
                                <span className="flex items-center text-teal-350 font-sans">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></span>
                                  本盟共创对流沙龙 (Live discussion)
                                </span>
                                <span className="scale-90 text-[7px] text-slate-500">双轴保护</span>
                              </div>

                              <div className="space-y-2.5 max-h-[140px] overflow-y-auto scrollbar-none pr-0.5">
                                {(communityChats[comm.id] || []).map(chat => (
                                  <div key={chat.id} className="flex flex-col text-left space-y-0.5 shrink-0 animate-fadeInPlus">
                                    <div className="flex items-center space-x-1 select-none">
                                      <span className={`w-3 h-3 rounded-full ${chat.avatarColor} text-white flex items-center justify-center text-[7px] shrink-0 font-black`}>
                                        {chat.avatarEmoji}
                                      </span>
                                      <span className="text-[8px] font-black text-slate-300">{chat.userNick}</span>
                                      <span className="text-[6.5px] text-slate-550 font-mono ml-auto">{chat.createdAt}</span>
                                    </div>
                                    <div className="bg-slate-800 text-slate-150 rounded-r-xl rounded-bl-xl p-2.5 text-[9.5px] font-medium leading-relaxed border border-slate-750 select-text">
                                      {chat.text}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Lounge Text Form */}
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!communityMsgInput.trim()) return;
                                  const newChatObj = {
                                    id: `cd_${Date.now()}`,
                                    userNick: '我 (体验巫)',
                                    avatarEmoji: myProfile.avatarEmoji,
                                    avatarColor: myProfile.avatarColor,
                                    text: communityMsgInput.trim(),
                                    createdAt: '12:01 GMT+8'
                                  };
                                  setCommunityChats({
                                    ...communityChats,
                                    [comm.id]: [...(communityChats[comm.id] || []), newChatObj]
                                  });
                                  setCommunityMsgInput('');
                                  triggerToast(`💬 观点对敲发射成功！【${comm.name}】智库盟友已安全接收。`);
                                }}
                                className="flex items-center space-x-1 border-t border-slate-800 pt-2 shrink-0"
                              >
                                <input
                                  value={communityMsgInput}
                                  onChange={(e) => setCommunityMsgInput(e.target.value)}
                                  placeholder="参与后续共创课题讨论与脑思风暴..."
                                  className="flex-1 h-8 px-2.5 bg-slate-800 border border-slate-750 rounded-lg outline-none text-[8.5px] text-white focus:border-indigo-500 font-semibold"
                                />
                                <button
                                  type="submit"
                                  className="h-8 w-8 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center cursor-pointer active:scale-95 transition"
                                >
                                  <Send className="h-3 w-3" />
                                </button>
                              </form>
                            </div>
                          </div>
                        ) : (
                          /* Locked Preview instructions */
                          <div className="p-2.5 bg-slate-100/50 dark:bg-slate-900/30 rounded-xl text-[8px] font-bold text-slate-455 text-left border border-dashed border-slate-300 dark:border-slate-800/85 select-none leading-normal">
                            🔒 同频学术衍生锁定中。申领大门仅对智商与灵魂共振的「{comm.mbti}」镜友开放。解锁本契约签署后即可同步开启上述衍生扶持功能并激活高频学术讨论沙龙。
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
          </>
        )}

        {/* -------------------- PRIVATE CHAT OVERLAY -------------------- */}
        {isLoggedIn && activeChatAttendee && (
          <div className="absolute inset-x-0 bottom-0 top-[65px] bg-slate-50 dark:bg-slate-950 z-40 flex flex-col overflow-hidden animate-slideUp">
            {/* Chat Header */}
            <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 select-none shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveChatAttendee(null)}
                  className="p-1 px-2 mb-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px] flex items-center space-x-1 border border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  <span>返回</span>
                </button>
                <div className="flex items-center space-x-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800">
                  <span className={`w-7.5 h-7.5 rounded-full ${activeChatAttendee.avatarColor} text-white flex items-center justify-center text-sm shadow-inner shrink-0`}>
                    {activeChatAttendee.avatarEmoji}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight truncate max-w-28">{activeChatAttendee.nickName}</h4>
                    <p className="text-[7.5px] text-slate-455 dark:text-slate-500 truncate max-w-[120px]">{activeChatAttendee.organization}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-wider scale-95 shrink-0 select-none">
                ⚙️ 对焦完毕
              </div>
            </div>

            {/* Meetup scheduler selection popover if toggled */}
            {showMeetupModal && (
              <div className="absolute inset-x-0 bottom-0 top-0 bg-slate-950/60 backdrop-blur-xs z-50 flex flex-col justify-end text-slate-800 dark:text-slate-100">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-t-[32px] border-t border-slate-150 dark:border-slate-850 space-y-4 animate-slideUp">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center">
                      <span className="text-md mr-1.5 font-mono">☕</span> 发起会中茶叙约见提案
                    </h4>
                    <button 
                      onClick={() => setShowMeetupModal(false)}
                      className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-505 dark:text-slate-400 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="space-y-3.5 text-left">
                    {/* Time Slots */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-405 dark:text-slate-500 block uppercase tracking-wider">选择期望约见的空闲时间 / TIME SLOT</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          '上午茶歇 10:30 - 11:00',
                          '午后脑暴 12:30 - 13:30',
                          '下午茶叙 15:40 - 16:10',
                          '会后自由沙龙 17:30+'
                        ].map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setMeetupTimeSelection(slot)}
                            className={`p-2 rounded-xl text-left text-[9px] font-bold border transition duration-200 cursor-pointer ${
                              meetupTimeSelection === slot 
                                ? 'border-pink-500 bg-pink-50/50 dark:border-pink-500/50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400' 
                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Meetup Agenda */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-405 dark:text-slate-500 block uppercase tracking-wider">设定脑暴主题 / MEETING AGENDA</label>
                      <div className="space-y-1">
                        {[
                          '探讨具身控制和传感器感知细节',
                          '脑暴物性与生态微气候项目机会',
                          '探讨会后艺术联署与研究成果孵化',
                          '喝杯手冲，闲扯和灵魂吐槽学术黑话'
                        ].map(agenda => (
                          <button
                            key={agenda}
                            type="button"
                            onClick={() => setMeetupAgendaSelection(agenda)}
                            className={`w-full p-2.5 rounded-xl text-left text-[9px] font-semibold border transition duration-200 flex items-center space-x-1.5 cursor-pointer ${
                              meetupAgendaSelection === agenda 
                                ? 'border-indigo-505 bg-indigo-50/50 dark:border-indigo-505/50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400' 
                                : 'border-slate-150 dark:border-slate-850 hover:bg-slate-55 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span>☕</span>
                            <span className="truncate">{agenda}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        sendPrivateMessage(`【☕ 约见茶叙邀请】\n时段：${meetupTimeSelection}\n主题：${meetupAgendaSelection}`, true);
                        setShowMeetupModal(false);
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.8 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all text-center cursor-pointer"
                    >
                      🚀 发送茶叙约见波频信号
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-none flex flex-col justify-end">
              <div className="text-center text-[7.5px] text-slate-400 py-1 font-mono tracking-wider shrink-0 select-none">
                🛡️ 镜影私聊已解锁，学者极智通道搭建完毕
              </div>

              <div className="flex-1 space-y-3 flex flex-col justify-end overflow-y-auto pr-0.5">
                {(chatLogs[activeChatAttendee.id] || []).map(msg => {
                  const isMe = msg.senderId === 'me';
                  return (
                    <div key={msg.id} className={`flex items-start ${isMe ? 'justify-end' : 'justify-start'} space-x-1.5 shrink-0`}>
                      {!isMe && (
                        <span className={`w-7 h-7 rounded-full ${activeChatAttendee.avatarColor} text-white flex items-center justify-center text-xs shadow-inner shrink-0 select-none`}>
                          {activeChatAttendee.avatarEmoji}
                        </span>
                      )}

                      <div className="max-w-[82%] flex flex-col space-y-0.5">
                        {msg.isMeetupInvite && msg.meetupDetails ? (
                          /* Meetup Invitation Bubble */
                          <div className="bg-gradient-to-tr from-pink-50 to-purple-50 dark:from-slate-900 dark:to-purple-950/20 border-2 border-pink-400/50 p-3 rounded-2xl shadow-sm text-left space-y-2">
                            <span className="text-[8px] font-black text-pink-600 dark:text-pink-400 tracking-wider block uppercase select-none">
                              ☕ 茶叙约见提案 • PRE-MEETING
                            </span>
                            <div className="space-y-0.5 text-slate-700 dark:text-slate-350 text-[10px]">
                              <p className="flex items-center font-bold">
                                <Calendar className="h-3 w-3 mr-1 text-pink-500 shrink-0" />
                                <span>时段：{msg.meetupDetails.timeSlot}</span>
                              </p>
                              <p className="flex items-center font-bold">
                                <Coffee className="h-3 w-3 mr-1 text-purple-500 shrink-0" />
                                <span className="truncate">主题：{msg.meetupDetails.agenda}</span>
                              </p>
                            </div>

                            <div className="pt-1 select-none">
                              {msg.meetupDetails.status === 'accepted' ? (
                                <span className="inline-flex items-center bg-teal-500/10 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400 px-2 py-0.5 rounded-lg text-[8px] font-black border border-teal-500/20">
                                  ✓ 对流成功：一楼茶歇碰头
                                </span>
                              ) : (
                                <span className="inline-flex items-center bg-amber-500/10 text-amber-650 dark:bg-amber-950/30 dark:text-amber-400 px-2 py-0.5 rounded-lg text-[8px] font-black border border-amber-500/20 animate-pulse">
                                  等待对方回复...
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* Standard bubble */
                          <div className={`p-2.5 rounded-2xl text-[10.5px] leading-relaxed text-left whitespace-pre-wrap ${
                            isMe 
                              ? 'bg-slate-900 dark:bg-indigo-650 text-white rounded-tr-none font-medium' 
                              : 'bg-white dark:bg-slate-900 border border-slate-201 dark:border-slate-800 text-slate-800 dark:text-slate-150 rounded-tl-none font-semibold'
                          }`}>
                            {msg.content}
                          </div>
                        )}
                        <span className="text-[7px] text-slate-400 dark:text-slate-550 block font-mono text-right select-none">
                          {msg.createdAt}
                        </span>
                      </div>

                      {isMe && (
                        <span className={`w-7 h-7 rounded-full ${myProfile.avatarColor} text-white flex items-center justify-center text-xs shadow-inner shrink-0 select-none`}>
                          {myProfile.avatarEmoji}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Message Action Bar */}
            <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-1.5 shrink-0">
              <button
                onClick={() => {
                  setMeetupTimeSelection('下午茶歇 15:40 - 16:10');
                  setMeetupAgendaSelection('探讨具身控制和传感器感知细节');
                  setShowMeetupModal(true);
                }}
                className="h-9 px-2.5 bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 rounded-xl flex items-center justify-center space-x-1 border border-pink-400/20 cursor-pointer active:scale-95 transition text-[10px] font-black"
              >
                <Coffee className="h-3 w-3" />
                <span>约见</span>
              </button>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!privateMsgText.trim()) return;
                  sendPrivateMessage(privateMsgText.trim());
                  setPrivateMsgText('');
                }}
                className="flex-1 flex items-center space-x-1"
              >
                <input
                  value={privateMsgText}
                  onChange={(e) => setPrivateMsgText(e.target.value)}
                  placeholder="说点什么碰撞一下思考..."
                  className="flex-1 h-9 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-[10px] focus:border-indigo-400 font-bold"
                />
                <button
                  type="submit"
                  className="h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition"
                >
                  <Send className="h-3 w-3" />
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* -------------------- ATTENDEE PROFILE DETAIL -------------------- */}
      {selectedProfileAttendee && (
        <div className="absolute inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-end animate-fadeIn">
          <div className="w-full max-h-[88%] overflow-y-auto bg-white dark:bg-slate-950 rounded-t-[34px] border-t border-white/50 dark:border-slate-800 shadow-[0_-20px_60px_rgba(15,23,42,0.28)] p-4.5 space-y-4 animate-slideUp">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest">个人主页</span>
              <button
                type="button"
                onClick={() => setSelectedProfileAttendee(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-300 flex items-center justify-center active:scale-95 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-4.5">
              <div className="absolute -top-12 -right-10 w-36 h-36 rounded-full bg-pink-500/20 blur-2xl"></div>
              <div className="absolute -bottom-12 -left-10 w-36 h-36 rounded-full bg-teal-400/20 blur-2xl"></div>
              <div className="relative flex items-start gap-3">
                <div className={`w-16 h-16 ${selectedProfileAttendee.avatarColor} rounded-[24px] overflow-hidden flex items-center justify-center text-3xl shadow-xl shrink-0 border border-white/15`}>
                  {selectedProfileAttendee.avatarImage ? (
                    <img src={selectedProfileAttendee.avatarImage} alt={selectedProfileAttendee.nickName} className="w-full h-full object-cover" />
                  ) : (
                    selectedProfileAttendee.avatarEmoji
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-black tracking-tight truncate">{selectedProfileAttendee.nickName}</h3>
                  <p className="text-[10px] text-white/75 leading-relaxed mt-1">{selectedProfileAttendee.organization} · {selectedProfileAttendee.title}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedProfileAttendee.designDirections.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 rounded-full bg-white/10 text-[9px] font-bold">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800">
                <div className="text-lg font-black text-slate-900 dark:text-white">{calculateMatchScore(selectedProfileAttendee)}%</div>
                <div className="text-[9px] text-slate-500 dark:text-slate-300 font-bold">匹配度</div>
              </div>
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800">
                <div className="text-lg font-black text-slate-900 dark:text-white">{getDesignWorks(selectedProfileAttendee).length}</div>
                <div className="text-[9px] text-slate-500 dark:text-slate-300 font-bold">作品</div>
              </div>
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800">
                <div className="text-lg font-black text-slate-900 dark:text-white">{getDesignEvents(selectedProfileAttendee).length}</div>
                <div className="text-[9px] text-slate-500 dark:text-slate-300 font-bold">经历</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">设计作品</h4>
              {getDesignWorks(selectedProfileAttendee).map((work, index) => (
                <div key={work.id} className="rounded-[26px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  {work.imageUrl ? (
                    <img src={work.imageUrl} alt={work.title} className="w-full h-32 object-cover" />
                  ) : (
                    <div className={`h-32 bg-gradient-to-br ${index % 2 === 0 ? 'from-pink-100 via-purple-100 to-teal-100 dark:from-pink-950/30 dark:via-purple-950/30 dark:to-teal-950/30' : 'from-indigo-100 via-sky-100 to-emerald-100 dark:from-indigo-950/30 dark:via-sky-950/30 dark:to-emerald-950/30'} flex items-center justify-center`}>
                      <span className="text-3xl">{index % 2 === 0 ? '🖼️' : '✨'}</span>
                    </div>
                  )}
                  <div className="p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-[12px] font-black text-slate-900 dark:text-white leading-snug">{work.title}</h5>
                      <span className="shrink-0 text-[9px] px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 font-bold">{work.year || '2026'}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-300 leading-relaxed mt-2">{work.description}</p>
                    {work.role && <p className="text-[9px] text-purple-600 dark:text-purple-300 font-bold mt-2">角色：{work.role}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">设计活动经历</h4>
              {getDesignEvents(selectedProfileAttendee).map(event => (
                <div key={event.id} className="flex items-start gap-3 rounded-[22px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-950 flex items-center justify-center text-lg border border-slate-200 dark:border-slate-800 shrink-0">🎟️</div>
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-black text-slate-900 dark:text-white">{event.name}</h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-300 mt-1">{event.role} · {event.year || '2026'}{event.location ? ` · ${event.location}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5 pb-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedProfileAttendee(null);
                  setActiveChatAttendee(selectedProfileAttendee);
                }}
                className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-3 text-[11px] font-black active:scale-95 transition"
              >
                私聊交流
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedProfileAttendee(null);
                  triggerToast('已保存到你的关注列表');
                }}
                className="rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-3 text-[11px] font-black active:scale-95 transition border border-slate-200 dark:border-slate-800"
              >
                先收藏
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- PHONE NAVIGATION TABS (OPTIMIZED TO 4 TABS) -------------------- */}
      {isLoggedIn ? (
        <div className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 px-3 pt-2.5 pb-5.5 flex items-center justify-around shrink-0 relative z-30 select-none shadow-[0_-8px_24px_rgba(0,0,0,0.012)] animate-slideUp">
          
          {/* Tab 1: Lobby & Pass */}
          <button 
            onClick={() => { setActiveTab('home'); }} 
            className={`flex flex-col items-center space-y-1 cursor-pointer flex-1 transition-all duration-300 transform ${
              activeTab === 'home' ? 'text-pink-500 scale-110 font-black -translate-y-0.5' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            <Home className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[9px] font-bold tracking-tight scale-90">首页</span>
          </button>

          {/* Tab 2: Concordant network & living report */}
          <button 
            onClick={() => { setActiveTab('we'); }} 
            className={`flex flex-col items-center space-y-1 cursor-pointer flex-1 transition-all duration-300 transform ${
              activeTab === 'we' ? 'text-pink-500 scale-110 font-black -translate-y-0.5' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            <Users className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[9px] font-bold tracking-tight scale-90">同行</span>
          </button>

          {/* Tab 3: Sandbox Interaction */}
          <button 
            onClick={() => { setActiveTab('co'); }} 
            className={`flex flex-col items-center space-y-1 cursor-pointer flex-1 transition-all duration-300 transform ${
              activeTab === 'co' ? 'text-pink-500 scale-110 font-black -translate-y-0.5' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[9px] font-bold tracking-tight scale-90">互动</span>
          </button>

          {/* Tab 4: ME Image Card */}
          <button 
            onClick={() => { setActiveTab('me'); }} 
            className={`flex flex-col items-center space-y-1 cursor-pointer flex-1 transition-all duration-300 transform ${
              activeTab === 'me' ? 'text-pink-500 scale-110 font-black -translate-y-0.5' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            <IdCard className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[9px] font-bold tracking-tight scale-90">我的</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 px-4 pt-4 pb-5.5 flex items-center justify-center shrink-0 relative z-30 select-none">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wider flex items-center space-x-1.5 font-bold animate-pulse">
            <Lock className="h-3 w-3 text-indigo-400" />
            <span>完成登录后启用底部导航</span>
          </span>
        </div>
      )}

      {/* Home Button Indicator */}
      <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-slate-900/15 dark:bg-white/10 rounded-full z-40"></div>

      </div>
    </div>
  );
}
