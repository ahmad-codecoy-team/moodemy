export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  uid?: string; // Add uid for consistency with Firebase Auth
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  disabled?: boolean; // Add disabled field from Auth
  emailVerified?: boolean; // Add emailVerified field from Auth
  role: UserRole;
  createdAt: string;
}

export interface RecentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  isActive: boolean;
}

export interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}