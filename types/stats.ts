export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalBanners: number;
  activeBanners: number;
  contentCount: number;
}

import type { LucideIcon } from 'lucide-react';

export interface StatCard {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  color: string;
  bg: string;
}