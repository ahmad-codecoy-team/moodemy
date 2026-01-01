import { auth } from './firebase-admin';
import type { CreateUserInput, User } from '@/types';

export class FirebaseAuthService {
  /**
   * Create a new user with email and password
   */
  static async createUser(userData: CreateUserInput): Promise<User> {
    try {
      const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: `${userData.firstName} ${userData.lastName}`,
        disabled: false,
      });

      // Set custom claims for role-based access
      await auth.setCustomUserClaims(userRecord.uid, {
        role: userData.role || 'USER',
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      return {
        id: userRecord.uid,
        email: userRecord.email!,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isActive: !userRecord.disabled,
        role: userData.role || 'USER',
        createdAt: userRecord.metadata.creationTime,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Get user by UID
   */
  static async getUserById(uid: string): Promise<User | null> {
    try {
      const userRecord = await auth.getUser(uid);
      const customClaims = userRecord.customClaims || {};

      return {
        id: userRecord.uid,
        email: userRecord.email!,
        firstName: customClaims.firstName || '',
        lastName: customClaims.lastName || '',
        isActive: !userRecord.disabled,
        role: customClaims.role || 'USER',
        createdAt: userRecord.metadata.creationTime,
      };
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const userRecord = await auth.getUserByEmail(email);
      const customClaims = userRecord.customClaims || {};

      return {
        id: userRecord.uid,
        email: userRecord.email!,
        firstName: customClaims.firstName || '',
        lastName: customClaims.lastName || '',
        isActive: !userRecord.disabled,
        role: customClaims.role || 'USER',
        createdAt: userRecord.metadata.creationTime,
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  /**
   * Update user status (enable/disable)
   */
  static async updateUserStatus(uid: string, isActive: boolean): Promise<void> {
    try {
      await auth.updateUser(uid, {
        disabled: !isActive,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  /**
   * Verify ID token and get user claims
   */
  static async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw error;
    }
  }

  /**
   * Create custom token for user
   */
  static async createCustomToken(uid: string, additionalClaims?: object): Promise<string> {
    try {
      return await auth.createCustomToken(uid, additionalClaims);
    } catch (error) {
      console.error('Error creating custom token:', error);
      throw error;
    }
  }

  /**
   * Update user custom claims
   */
  static async updateUserCustomClaims(uid: string, customClaims: object): Promise<void> {
    try {
      await auth.setCustomUserClaims(uid, customClaims);
    } catch (error) {
      console.error('Error updating custom claims:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(uid: string): Promise<void> {
    try {
      await auth.deleteUser(uid);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * List all users with pagination
   */
  static async listUsers(maxResults: number = 100, pageToken?: string) {
    try {
      const listUsersResult = await auth.listUsers(maxResults, pageToken);
      
      const users: User[] = listUsersResult.users.map(userRecord => {
        const customClaims = userRecord.customClaims || {};
        
        return {
          id: userRecord.uid,
          email: userRecord.email || '',
          firstName: customClaims.firstName || '',
          lastName: customClaims.lastName || '',
          isActive: !userRecord.disabled,
          role: customClaims.role || 'USER',
          createdAt: userRecord.metadata.creationTime,
        };
      });

      return {
        users,
        pageToken: listUsersResult.pageToken,
      };
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  }
}