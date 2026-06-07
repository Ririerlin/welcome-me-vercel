/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Attendee, Ticket, Session, Question, Poll, Exhibit, Connection, BulletMessage } from './types';

export const INITIAL_MY_PROFILE: Attendee = {
  id: 'me',
  nickName: '陆西奥',
  avatarColor: 'bg-pink-500',
  avatarEmoji: '🧙‍♂️',
  avatarImage: '/images/avatar-lucio.svg',
  organization: '明眸设计工作室',
  title: '资深体验探路师',
  industry: '智能出行/非线性交互',
  phone: '138-1234-5678',
  email: 'lucio.design@example.com',
  designDirections: ['体验探究', '人机交互', '算法辅助', '绿色可持续'],
  interests: ['人工智能交互', '实体硬软件共生', '社会创新设计', '新唯物主义'],
  goals: ['寻找项目技术合伙人', '发现前沿艺术灵感', '扩展华东设计学术圈'],
  privacyScope: 'public',
  personaCompletion: 75,
  checkedIn: false,
  nfcBound: false,
  mbti: 'ENFP - 灵感策动机 (感官魔法使)',
  designArchetype: '非线性体验感官幽灵',
  quote: '设计不是解题，而是优雅、有尊严地把清澈的水搅浑，然后再凝固它。',
  achievementBadge: '🏆 杯测十级重度黑咖续命神仙',
  colorTheme: 'pink'
};

export const INITIAL_ATTENDEES: Attendee[] = [
  {
    id: 'user_1',
    nickName: '陈青川',
    avatarColor: 'bg-teal-500',
    avatarEmoji: '🐼',
    avatarImage: '/images/avatar-qingchuan.svg',
    organization: '青屿空间研究所',
    title: '创始人 / 微气候原野治理者',
    industry: '绿色微公共建筑与流体力学',
    phone: '139-8888-9999',
    email: 'qingchuan@qiyu.space',
    designDirections: ['空间治愈', '绿色可持续', '微气候介入'],
    interests: ['低碳材质', '城市多孔空间', '新唯物主义'],
    goals: ['展示绿色公共作品', '寻找华东场地合作方'],
    privacyScope: 'public',
    personaCompletion: 100,
    checkedIn: true,
    checkedInAt: '09:05',
    nfcBound: true,
    nfcUid: '04:A1:8B:22:90:5E:80',
    group: 'Guest',
    mbti: 'INFJ - 愿景洞察者 (微气候大德鲁伊)',
    designArchetype: '微气候自然空间隐士',
    quote: '在硬冷的水泥盒子里打洞，直到把银河系的漫天繁星都给引进来。',
    achievementBadge: '🌿 赤脚在森林狂飙的苔藓标本猎手',
    colorTheme: 'teal'
  },
  {
    id: 'user_2',
    nickName: '米亚 Mia',
    avatarColor: 'bg-indigo-500',
    avatarEmoji: '🤖',
    avatarImage: '/images/avatar-mia.svg',
    organization: 'NEO智能实验室',
    title: '智能硬件产品主理 / 拆弹师',
    industry: '具身自适应终端 & 机械美学',
    phone: '135-6666-8888',
    email: 'mia.wang@neolab.io',
    designDirections: ['体验探究', '人机交互', '实体硬软件共生'],
    interests: ['人工智能交互', '实体硬软件共生', '边缘计算硬件'],
    goals: ['寻找前沿艺术家合作', '寻找材料工程设计师'],
    privacyScope: 'public',
    personaCompletion: 90,
    checkedIn: true,
    checkedInAt: '08:50',
    nfcBound: true,
    nfcUid: '04:77:FD:A2:90:5E:81',
    group: 'Attendee',
    mbti: 'ISTP - 技术实践师 (赛博鲁班传人)',
    designArchetype: '情感自适应人格驯兽师',
    quote: '万物皆可嵌入。电子产品如果没有灵魂，我就给它焊一节保暖的南孚电池。',
    achievementBadge: '⚡ 单手手搓八核自感性印刷电路板狂暴战士',
    colorTheme: 'purple'
  },
  {
    id: 'user_3',
    nickName: '苏格 Dr.Su',
    avatarColor: 'bg-rose-450',
    avatarEmoji: '🦉',
    avatarImage: '/images/avatar-suge.svg',
    organization: '同济大学创意设计学院',
    title: '助理教授 / 批判艺术审判官',
    industry: '数字艺术、算法社会与代码考古',
    phone: '186-2222-3333',
    email: 'suge@tongji.edu.cn',
    designDirections: ['新美学思辨', '算法辅助', '批判性写作'],
    interests: ['人工智能交互', '算法艺术', '社会创新设计'],
    goals: ['为年底艺术双年展选拔参会展品', '招募交互设计实习生'],
    privacyScope: 'public',
    personaCompletion: 95,
    checkedIn: true,
    checkedInAt: '09:12',
    nfcBound: false,
    group: 'Guest',
    mbti: 'INTJ - 战略策划家 (学术毒舌长)',
    designArchetype: '深蓝批判逻辑思想家',
    quote: '人类的绝大多所谓创新，只不过是在古希腊垃圾堆里贴个 AI 大语言模型的漂亮标签。',
    achievementBadge: '🎓 连熬三天毕展答辩依然发量葱郁的物理神话',
    colorTheme: 'pink'
  },
  {
    id: 'user_4',
    nickName: '季雨桐',
    avatarColor: 'bg-amber-500',
    avatarEmoji: '🦊',
    avatarImage: '/images/avatar-yutong.svg',
    organization: '溯源自然学校',
    title: '体验策划总监 / 植物间谍',
    industry: '深层生态、多重温湿与泥土脑电波',
    phone: '177-3333-5555',
    email: 'yutong.ji@suyuan.eco',
    designDirections: ['空间治愈', '体验探究', '绿色可持续'],
    interests: ['社会创新设计', '绿色可持续', '生态共振'],
    goals: ['寻找跨界交互开发者', '合作自然艺术线下微型展'],
    privacyScope: 'public',
    personaCompletion: 85,
    checkedIn: true,
    checkedInAt: '09:30',
    nfcBound: false,
    group: 'Attendee',
    mbti: 'INFP - 治愈系空想家 (浪漫听风者)',
    designArchetype: '低碳生物可降解胶囊人',
    quote: '泥土与岩石其实一直都在呼吸，只是人们戴上了精致耳塞，假装听不见。',
    achievementBadge: '🌱 闭眼3秒即可精准分辨大豆油墨 and 松脂纸浆的奇女子',
    colorTheme: 'yellow'
  },
  {
    id: 'user_5',
    nickName: '张赫轩 Mark',
    avatarColor: 'bg-purple-600',
    avatarEmoji: '🐯',
    avatarImage: '/images/avatar-mark.svg',
    organization: '未见数字媒体公司',
    title: '硬核创意技术官 / 漏洞生成器',
    industry: 'XR异度增强实体空间',
    phone: '189-9999-0000',
    email: 'mark.zhang@notyet.digital',
    designDirections: ['人机交互', '实体硬软件共生', '算法辅助'],
    interests: ['算法艺术', 'AI驱动装置', '实时计算机视觉'],
    goals: ['寻找策展人与商业活动合作', '扩展硬核数字创意朋友圈'],
    privacyScope: 'matching-only',
    personaCompletion: 80,
    checkedIn: true,
    checkedInAt: '09:22',
    nfcBound: true,
    nfcUid: '04:CF:CC:11:90:5E:82',
    group: 'Attendee',
    mbti: 'ENTP - 批判辩论者 (混沌魔术手)',
    designArchetype: '多模态生成媒介狂徒',
    quote: '肉身和虚拟其实都是假象。唯一真实的，只有我在生产环境偷偷埋入的那个彩蛋。',
    achievementBadge: '🥊 疯狂调优3D渲染甩飞并砸碎三台4K显示屏的猛男',
    colorTheme: 'purple'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'ticket_001',
    ticketType: 'VIP',
    price: 1200,
    benefits: ['享前排专属座位', '包含会后嘉宾闭门海鲜交流沙龙', '赠全套定制 NFC 会伴挂件礼盒', '主论坛PPT及学术报告回看权益'],
    code: 'ME-2026-VIP-8891',
    status: 'unused',
  },
  {
    id: 'ticket_002',
    ticketType: 'Regular',
    price: 399,
    benefits: ['享主展区及主会场入场资格', '现场互动提问与投票权益', '赠送精美欢迎ME定制帆布袋', '同频推荐及关系生成小程序激活'],
    code: 'ME-2026-REG-7429',
    status: 'unused',
  }
];

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'sess_1',
    title: '上午主旨发言: 具身智能、微气候空间与新唯物主义自然观',
    speakerName: '陈青川 & 季雨桐',
    speakerTitle: '青屿空间研究所创始人 / 溯源自然学校策划总监',
    speakerAvatarColor: 'bg-gradient-to-tr from-blue-500 to-emerald-500',
    speakerAvatarEmoji: '🍀',
    location: '主报告厅 (1楼 A厅)',
    timeStr: '09:30 - 11:00',
    tags: ['空间治愈', '微气候介入', '新唯物主义', '低碳环保'],
    description: '本次主旨发言深度结合建筑学与深层生态学，拆解近十个跨越陆地与水面界限的微空间设计，展示如何利用自然风道、多孔植物构造以及现场传感器，赋予参会者与空间自适应呼吸的独特肉身感知契机。',
    slideUrl: 'https://welcome.me/resources/slides/keynote01.pdf',
    likesCount: 145,
    isSubscribed: true,
    isLive: true,
  },
  {
    id: 'sess_2',
    title: '跨界对谈: 算法美学时代，人机界面应当走向显性还是消隐？',
    speakerName: '米亚 Mia & 苏格',
    speakerTitle: 'NEO智能产品专家 / 同济大学创意设计学院副教授',
    speakerAvatarColor: 'bg-gradient-to-tr from-purple-500 to-rose-500',
    speakerAvatarEmoji: '🔮',
    location: '多功能厅 (2楼 B厅)',
    timeStr: '11:15 - 12:30',
    tags: ['人工智能交互', '实体硬软件共生', '新美学思辨', '算法控制'],
    description: 'AI Agent已逐渐成为无形界面。我们是在用像素和屏幕对抗自然意识，还是应该通过质感、声学、振动、甚至是气体气味，让技术以一种优雅的、低干扰的方式完全消隐在生活本身的表面？',
    slideUrl: 'https://welcome.me/resources/slides/keynote02.pdf',
    likesCount: 98,
    isSubscribed: false,
    isLive: false,
  },
  {
    id: 'sess_3',
    title: '实操工坊: 从微型情绪装置到空间关系场的多维共振实验',
    speakerName: '张赫轩 Mark',
    speakerTitle: '未见数字创意技术总监',
    speakerAvatarColor: 'bg-gradient-to-tr from-amber-500 to-rose-500',
    speakerAvatarEmoji: '🎙️',
    location: '新媒介原型实验室 (3楼 302)',
    timeStr: '14:00 - 16:30',
    tags: ['人机交互', '算法辅助', '互动装置', '物理网络'],
    description: '通过现场演示树莓派、NFC感应与快速计算机视觉（Camera Tracking），我们将物理摊位和现场参与者的ME参会卡连成一个即时演奏宏大交响乐的微型城市像素装置原型。限额35人参与。',
    likesCount: 64,
    isSubscribed: false,
    isLive: false,
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q_1',
    sessionId: 'sess_1',
    userNick: '张赫轩 Mark',
    userAvatarColor: 'bg-rose-500',
    userAvatarEmoji: '🥊',
    content: '在微气候设计中，湿度的调节完全依赖绿色苔藓植物，面对上海黄梅天这种极高外界湿度，系统的自修复与气味净化机制该如何不产生霉变风险？',
    upvotes: 42,
    status: 'approved',
    createdAt: '09:42',
    isAnswered: true
  },
  {
    id: 'q_2',
    sessionId: 'sess_1',
    userNick: '米亚 Mia',
    userAvatarColor: 'bg-indigo-500',
    userAvatarEmoji: '🧩',
    content: '陈老师提到的多孔材料微型廊道，其感知数据是否会跟现场NFC挂件有更实时的物理连接？比如，当我身上挂着挂件靠近它，它能否感知出我是重度过敏患者，而开启主动负离子净化路径？',
    upvotes: 28,
    status: 'approved',
    createdAt: '09:55',
    isAnswered: false
  },
  {
    id: 'q_3',
    sessionId: 'sess_1',
    userNick: '匿名观众',
    userAvatarColor: 'bg-gray-400',
    userAvatarEmoji: '👤',
    content: '关于深层生态，人类过度设计这种干预，本身是不是就是非自然、带有支配性特质的展现？如何优雅地在“不做多余设计”与“解决现场问题”之间画一条克制的线？',
    upvotes: 19,
    status: 'approved',
    createdAt: '10:05',
    isAnswered: false
  },
  {
    id: 'q_4',
    sessionId: 'sess_2',
    userNick: '陈青川',
    userAvatarColor: 'bg-blue-500',
    userAvatarEmoji: '🏕️',
    content: '米亚老师谈到的低干扰消隐设计，在发生重大网络延迟或者系统异常时（比如NFC服务器卡顿或网线断连），如何通过优雅的实体物理材质变形来告知用户异常？',
    upvotes: 12,
    status: 'pending',
    createdAt: '11:20',
    isAnswered: false
  }
];

export const INITIAL_POLLS: Poll[] = [
  {
    id: 'p_1',
    sessionId: 'sess_1',
    question: '你最希望哪个空间设计流派来拯救你每日拥堵且高压的通勤时光？',
    options: [
      '呼吸式多孔生态植物廊道 (微气候流派)',
      '声学消噪质地自适应纯享车厢 (声学减压学派)',
      '机械动态光影变化冥想仓 (算法新感知流派)',
      '粗糙木料与水汽微喷雾微营地 (东方物性学派)'
    ],
    votes: [54, 32, 41, 19],
    userVotedIndex: null,
    isLive: true,
  },
  {
    id: 'p_2',
    sessionId: 'sess_2',
    question: '你认为未来的AI代理人（AI Agent），应当像幽灵一样全消隐还是偶尔蹦出来皮一下？',
    options: [
      '完全无形：日常零操作，全靠潜意识具身物理空间感应。',
      '实体寄居：有一个手持或者佩戴的精美交互物理伴侣硬件。',
      '幽默数字人：有显性屏幕，但只在关键决策时提供情感抚慰。'
    ],
    votes: [38, 77, 24],
    userVotedIndex: null,
    isLive: false,
  }
];

export const INITIAL_EXHIBITS: Exhibit[] = [
  {
    id: 'ex_1',
    name: '《气味地理学: 上海五种水系的气味微缩采样》',
    artist: '季雨桐 / 溯源自然实验室',
    zone: 'A区 - 概念设计',
    tags: ['深层生态学', '触觉与气味', '物理采样', '微气候体验'],
    imageUrl: '/images/exhibit-eco.svg',
    description: '通过在上海黄浦江、淀山湖、吴淞口、张家浜以及苏州河这五处具有历史代表性的地表水源进行生物微泥土、水汽采样，装入由自控微温控陶烧成的多孔呼吸罐中。观众用鼻子轻嗅，能唤醒脑部极深的陆地记忆，展现人对于江河本原的深刻本能共鸣。',
    likes: 84,
    favorites: 39,
    isLikedByUser: false,
    isFavoritedByUser: false,
    comments: [
      {
        id: 'c_1',
        userNick: '陈青川',
        avatarEmoji: '🏕️',
        avatarColor: 'bg-blue-500',
        text: '苏州河水样的那一罐，能敏锐闻到淡淡的香樟叶腐质气息，与工业废止年代过后的绿廊生境极为契合，这正是气味介入城市记忆的迷人之作！',
        createdAt: '10:15'
      },
      {
        id: 'c_2',
        userNick: '苏格 Dr.Su',
        avatarEmoji: '🐳',
        avatarColor: 'bg-purple-500',
        text: '气味本身就是一种“微型幽灵形式”的信息流动，比依靠屏幕和视觉要更能打动感性身体。极其赞赏！',
        createdAt: '10:45'
      }
    ]
  },
  {
    id: 'ex_2',
    name: '《物元偶联: 多点触碰式心率自回归弹奏悬浮声磬》',
    artist: '张赫轩 Mark / NEO智能探针组',
    zone: 'C区 - 跨界交互',
    tags: ['人工智能交互', '实体硬软件共生', '算法艺术', '心率物理共振'],
    imageUrl: '/images/exhibit-sound.svg',
    description: '观众将指尖搭在特制铜磬上的光学心率探针上，仪器能瞬时通过心跳变异率（HRV），运算并指令带有电磁活塞的琴槌，轻击敲打周围八个古汉磬。当两名观众同时坐下，系统会自动根据两人标签的心率相似度和“同频同理概率”，谱出一支融洽或极度焦灼的无调性弦乐协奏，用于促进面对面的对视、笑意或理解。',
    likes: 121,
    favorites: 65,
    isLikedByUser: false,
    isFavoritedByUser: false,
    comments: [
      {
        id: 'c_3',
        userNick: '米亚 Mia',
        avatarEmoji: '🧩',
        avatarColor: 'bg-indigo-500',
        text: '试玩了一下，我的心率和苏教授的几乎完全对不上，但系统基于这一反差生成了一段非常解构主义的敲击乐，太有互动张力了！',
        createdAt: '11:40'
      }
    ]
  },
  {
    id: 'ex_3',
    name: '《算法森林: 受污染土壤微生物活性的光纤映射》',
    artist: '溯源自然实验室 x 智能美学系',
    zone: 'B区 - 人性体验',
    tags: ['低碳环保', '算法辅助', '微生物电极', '多模态映射'],
    imageUrl: '/images/exhibit-ai.svg',
    description: '将受到重金属污染土壤与自组织菌群发电装置（Microbial Fuel Cell）串联联组，微生物的活性微弱电信号被转化为高频变色光纤的明暗频率。观众靠近能够看到彩色光纤束在土壤切面上犹如流动神经网络一般闪烁吐纳，向城市文明传达污染大地的微弱呻吟。',
    likes: 56,
    favorites: 22,
    isLikedByUser: false,
    isFavoritedByUser: false,
    comments: []
  }
];

export const INITIAL_CONNECTIONS: Connection[] = [
  {
    id: 'conn_1',
    fromUserId: 'user_1', // 陈青川
    toUserId: 'me',
    matchedTags: ['绿色可持续', '新唯物主义', '体验探究'],
    status: 'pending',
    createdAt: '10:20'
  },
  {
    id: 'conn_2',
    fromUserId: 'me',
    toUserId: 'user_2', // Mia
    matchedTags: ['体验探究', '人机交互', '实体硬软件共生', '人工智能交互'],
    status: 'confirmed',
    notes: '聊得非常投机！中午可约在1楼中庭茶歇咖啡角，进一步交流物联网自适应传感器底盘原型细节。',
    group: '潜在合作伙伴',
    createdAt: '09:40'
  }
];

export const INITIAL_BULLET_MESSAGES: BulletMessage[] = [
  {
    id: 'b_1',
    content: '陈老师分享的那张微气候苔藓陶罐图片，太震撼了！简直是会呼吸的雕塑！',
    userNick: '米亚 Mia',
    userAvatarColor: 'bg-indigo-500',
    userAvatarEmoji: '🧩',
    status: 'approved',
    createdAt: '09:35'
  },
  {
    id: 'b_2',
    content: '新唯物主义怎么和设计结合？终于听到有深度的理论融合了！狂喜！',
    userNick: '苏格 Dr.Su',
    userAvatarColor: 'bg-purple-500',
    userAvatarEmoji: '🐳',
    status: 'approved',
    createdAt: '09:41'
  },
  {
    id: 'b_3',
    content: '求主旨大讲座PPT！会否在最后资料包发出共享？',
    userNick: '季雨桐',
    userAvatarColor: 'bg-amber-500',
    userAvatarEmoji: '🌱',
    status: 'approved',
    createdAt: '09:50'
  },
  {
    id: 'b_4',
    content: '打卡！NFC会伴挂件太好看了，磨砂手感爱了爱了！',
    userNick: '陆西奥',
    userAvatarColor: 'bg-emerald-500',
    userAvatarEmoji: '🔮',
    status: 'approved',
    createdAt: '09:15'
  }
];
