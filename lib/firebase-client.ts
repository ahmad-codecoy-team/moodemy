// Firebase Client SDK for authentication
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase Client
const app = initializeApp(firebaseConfig);
export const clientAuth = getAuth(app);

export class FirebaseClientAuth {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
      const user = userCredential.user;
      
      // Get ID token for verification
      const idToken = await user.getIdToken();
      
      return {
        user,
        idToken,
      };
    } catch (error: any) {
      console.error('Firebase sign-in error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Sign out
   */
  static async signOut() {
    try {
      await signOut(clientAuth);
    } catch (error) {
      console.error('Firebase sign-out error:', error);
      throw error;
    }
  }

  /**
   * Get user-friendly error messages
   */
  private static getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return 'Authentication failed. Please try again';
    }
  }
}