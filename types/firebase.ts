// Firebase specific types

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
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
