
import React from 'react';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  Megaphone, 
  Calendar, 
  ClipboardCheck, 
  CreditCard, 
  Settings,
  MessageSquare,
  CalendarDays
} from 'lucide-react';
import { NavItem, SubscriptionTier, UserRole } from './types';

export interface ExtendedNavItem extends NavItem {
  roles: UserRole[];
}

export const NAV_ITEMS: ExtendedNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT] },
  { id: 'institutions', label: 'Campuses', icon: <School size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN] },
  { id: 'users', label: 'Enrollment', icon: <Users size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN] },
  { id: 'announcements', label: 'Broadcasts', icon: <Megaphone size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN, UserRole.TEACHER] },
  { id: 'attendance', label: 'Lecture Register', icon: <ClipboardCheck size={20} />, roles: [UserRole.INSTITUTION_ADMIN, UserRole.TEACHER] },
  { id: 'timetable', label: 'Lecture Schedule', icon: <Calendar size={20} />, roles: [UserRole.INSTITUTION_ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
  { id: 'messaging', label: 'Comms', icon: <MessageSquare size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT] },
  { id: 'events', label: 'Campus Life', icon: <CalendarDays size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT] },
  { id: 'pricing', label: 'Institutional Billing', icon: <CreditCard size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN] },
  { id: 'settings', label: 'Preferences', icon: <Settings size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.INSTITUTION_ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
];

export const PRICING_TIERS = [
  {
    tier: SubscriptionTier.STARTER,
    price: 'R4,999',
    annual: 'R49,990',
    users: 500,
    features: ['Course Management', 'Exam Timetables', 'Lecture Attendance', '10GB Storage'],
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  {
    tier: SubscriptionTier.PROFESSIONAL,
    price: 'R12,999',
    annual: 'R129,990',
    users: 5000,
    features: ['All Starter Features', 'SMS Multi-factor', 'Faculty Portals', 'LMS Integration'],
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700'
  },
  {
    tier: SubscriptionTier.ENTERPRISE,
    price: 'R39,999',
    annual: 'R399,990',
    users: '25,000+',
    features: ['Full University Cluster', 'White-Label Branding', 'Research Analytics', 'Dedicated Node'],
    color: 'bg-purple-50 border-purple-200 text-purple-700'
  }
];

export const MOCK_INSTITUTIONS = [
  { id: '1', name: 'University of Cape Town', province: 'Western Cape', tier: SubscriptionTier.ENTERPRISE, studentsCount: 28000, status: 'active' },
  { id: '2', name: 'Sandton Tech Academy', province: 'Gauteng', tier: SubscriptionTier.PROFESSIONAL, studentsCount: 5500, status: 'active' },
  { id: '3', name: 'Durban University of Tech', province: 'KwaZulu-Natal', tier: SubscriptionTier.PROFESSIONAL, studentsCount: 15000, status: 'active' },
  { id: '4', name: 'Polokwane Medical School', province: 'Limpopo', tier: SubscriptionTier.STARTER, studentsCount: 1200, status: 'active' },
];
