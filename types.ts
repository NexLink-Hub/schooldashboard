
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  INSTITUTION_ADMIN = 'institution_admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent'
}

export enum SubscriptionTier {
  STARTER = 'Starter',
  PROFESSIONAL = 'Professional',
  ENTERPRISE = 'Enterprise'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  institutionId?: string;
  avatar?: string;
  // Academic Context (Varsity Level)
  studentNumber?: string;
  lecturerId?: string;
  faculty?: string;
  campus?: string;
  course?: string;
  className?: string; // e.g. "Lecture Group A"
  teachers?: string[]; // or "Lecturers"
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert';
  timestamp: Date;
}

export interface Institution {
  id: string;
  name: string;
  province: string;
  tier: SubscriptionTier;
  studentsCount: number;
  status: 'active' | 'suspended' | 'pending';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  isUrgent: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  unreadCount: number;
  isGroup: boolean;
  messages: Message[];
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'Sports' | 'Academic' | 'Admin' | 'Cultural';
  rsvps?: string[]; // IDs of users who RSVP'd
}
