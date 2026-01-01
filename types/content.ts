export type ContentType = 
  | 'ABOUT_US'
  | 'HELP_SUPPORT' 
  | 'PRIVACY_POLICY'
  | 'HOME_SCREEN'
  | 'SPLASH_SCREEN'
  | 'SIGNUP_MESSAGE'
  | 'LOGIN_MESSAGE';

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentInput {
  type: ContentType;
  title: string;
  content: string;
  isActive?: boolean;
}

export interface UpdateContentInput {
  title?: string;
  content?: string;
  isActive?: boolean;
}

export const ContentTypeLabels: Record<ContentType, string> = {
  ABOUT_US: 'About Us',
  HELP_SUPPORT: 'Help & Support',
  PRIVACY_POLICY: 'Privacy Policy',
  HOME_SCREEN: 'Home Screen',
  SPLASH_SCREEN: 'Splash Screen',
  SIGNUP_MESSAGE: 'Signup Message',
  LOGIN_MESSAGE: 'Login Message',
};