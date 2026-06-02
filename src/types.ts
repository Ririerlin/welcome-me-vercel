/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Attendee {
  id: string;
  nickName: string;
  avatarColor: string; // Tailwind bg color class
  avatarEmoji: string;
  organization: string;
  title: string;
  industry: string;
  phone?: string;
  email?: string;
  designDirections: string[];
  interests: string[];
  goals: string[];
  privacyScope: 'public' | 'matching-only' | 'private';
  personaCompletion: number; // percentage eg. 80
  checkedIn: boolean;
  checkedInAt?: string;
  nfcBound: boolean;
  nfcUid?: string;
  group?: string; // eg. 'VIP', 'Guest', 'Attendee', 'Press'
  // Whimsical designer personas attributes
  mbti?: string; 
  designArchetype?: string; // eg. '胶囊AI朋克游民'
  quote?: string; // eg. '不搞设计的代码工不是好策展人'
  achievementBadge?: string; // eg. '☕ 咖啡因驱动仙人'
  colorTheme?: string; // e.g. 'pink' | 'teal' | 'purple' | 'yellow'
}

export interface Ticket {
  id: string;
  ticketType: 'VIP' | 'Regular' | 'Media' | 'Student';
  price: number;
  benefits: string[];
  code: string;
  status: 'unused' | 'checked-in' | 'cancelled' | 'refunded';
  holderId?: string;
}

export interface Session {
  id: string;
  title: string;
  speakerName: string;
  speakerTitle: string;
  speakerAvatarColor: string;
  speakerAvatarEmoji: string;
  location: string;
  timeStr: string; // e.g., "10:00 - 11:30"
  tags: string[];
  description: string;
  slideUrl?: string;
  likesCount: number;
  isSubscribed: boolean;
  isLive: boolean;
}

export interface Question {
  id: string;
  sessionId: string;
  userNick: string;
  userAvatarColor: string;
  userAvatarEmoji: string;
  content: string;
  upvotes: number;
  status: 'pending' | 'approved' | 'hidden';
  createdAt: string;
  isAnswered: boolean;
}

export interface Poll {
  id: string;
  sessionId: string;
  question: string;
  options: string[];
  votes: number[];
  userVotedIndex: number | null; // null if not voted yet
  isLive: boolean;
}

export interface Exhibit {
  id: string;
  name: string;
  artist: string;
  zone: 'A区 - 概念设计' | 'B区 - 人性体验' | 'C区 - 跨界交互' | 'D区 - 算法艺术';
  tags: string[];
  imageUrl: string;
  description: string;
  likes: number;
  favorites: number;
  isLikedByUser: boolean;
  isFavoritedByUser: boolean;
  comments: {
    id: string;
    userNick: string;
    avatarEmoji: string;
    avatarColor: string;
    text: string;
    createdAt: string;
  }[];
}

export interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  matchedTags: string[];
  status: 'pending' | 'confirmed' | 'declined';
  notes?: string;
  group?: string;
  createdAt: string;
}

export interface BulletMessage {
  id: string;
  content: string;
  userNick: string;
  userAvatarColor: string;
  userAvatarEmoji: string;
  status: 'pending' | 'approved' | 'hidden';
  createdAt: string;
}
