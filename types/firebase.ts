// Firebase specific types

export interface UserProfile {
  id?: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  allowEmailSent?: boolean; // Optional since old users may not have this field
  createdAt: string;
}

export interface CombinedUser {
  // From Firebase Auth
  uid: string;
  email: string;
  disabled: boolean;
  emailVerified: boolean;
  
  // From Auth custom claims
  role?: string;
  
  // From Firestore users collection
  firstName: string;
  lastName: string;
  profileCreatedAt?: string;
  allowEmailSent: boolean; // Email permission from Firestore
  
  // Computed fields
  isActive: boolean; // derived from !disabled
  fullName: string;
  
  // Keep original auth data for reference
  authData?: any;
  profileData?: UserProfile | null;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: number; // 1-10 scale
  note?: string;
  tags?: string[];
  createdAt: string;
}

export interface FirebaseError {
  code: string;
  message: string;
}

export interface AuthTokenClaims {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}
