import { firestore } from "./firebase-admin";
import type {
  Content,
  CreateContentInput,
  UpdateContentInput,
  User,
  UserProfile,
  MoodEntry,
  CombinedUser,
} from "@/types";

interface FirebaseAuthUser extends User {
  [key: string]: unknown;
}

export class FirebaseFirestoreService {
  private static db = firestore;

  /**
   * Content Management
   */

  // Get all content (from fixed document names)
  static async getContent(): Promise<Content[]> {
    try {
      const contentDocs = [
        "home_screen",
        "splash_screen",
        "signup_message",
        "login_message",
        "about_us",
        "help_support",
        "privacy_policy",
      ];

      const contentPromises = contentDocs.map((docName) =>
        this.db.collection("content").doc(docName).get()
      );

      const snapshots = await Promise.all(contentPromises);

      const contents: Content[] = [];
      snapshots.forEach((doc) => {
        if (doc.exists) {
          contents.push({
            ...doc.data(),
            // Use the internal id field, not the document name
          } as Content);
        }
      });

      // Sort by creation date
      return contents.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Error getting content:", error);
      throw error;
    }
  }

  // Get content by document name (not internal ID)
  static async getContentByDocName(docName: string): Promise<Content | null> {
    try {
      const doc = await this.db.collection("content").doc(docName).get();

      if (!doc.exists) {
        return null;
      }

      return {
        ...doc.data(),
      } as Content;
    } catch (error) {
      console.error("Error getting content by doc name:", error);
      throw error;
    }
  }

  // Get content by internal ID (searches through all documents)
  static async getContentById(id: string): Promise<Content | null> {
    try {
      const contentDocs = [
        "home_screen",
        "splash_screen",
        "signup_message",
        "login_message",
        "about_us",
        "help_support",
        "privacy_policy",
      ];

      for (const docName of contentDocs) {
        const doc = await this.db.collection("content").doc(docName).get();
        if (doc.exists) {
          const data = doc.data();
          if (data?.id === id) {
            return { ...data } as Content;
          }
        }
      }

      return null;
    } catch (error) {
      console.error("Error getting content by ID:", error);
      throw error;
    }
  }

  // Get content by type (for specific content types like home_screen, etc.)
  static async getContentByType(contentType: string): Promise<Content | null> {
    try {
      const snapshot = await this.db
        .collection("content")
        .where("type", "==", contentType)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Content;
    } catch (error) {
      console.error("Error getting content by type:", error);
      throw error;
    }
  }

  // Create new content (we don't create new docs, only update existing ones)
  static async createContent(
    contentData: CreateContentInput
  ): Promise<Content> {
    // Since we have fixed documents, we don't create new ones
    // This method is kept for compatibility but throws an error
    throw new Error(
      "Cannot create new content documents. Only predefined content types can be updated."
    );
  }

  // Update content by internal ID
  static async updateContent(
    id: string,
    updates: UpdateContentInput
  ): Promise<Content> {
    try {
      // Find which document contains this ID
      const contentDocs = [
        "home_screen",
        "splash_screen",
        "signup_message",
        "login_message",
        "about_us",
        "help_support",
        "privacy_policy",
      ];

      let targetDocName: string | null = null;

      for (const docName of contentDocs) {
        const doc = await this.db.collection("content").doc(docName).get();
        if (doc.exists && doc.data()?.id === id) {
          targetDocName = docName;
          break;
        }
      }

      if (!targetDocName) {
        throw new Error(`Content with ID ${id} not found`);
      }

      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await this.db.collection("content").doc(targetDocName).update(updateData);

      const doc = await this.db.collection("content").doc(targetDocName).get();

      return {
        ...doc.data(),
      } as Content;
    } catch (error) {
      console.error("Error updating content:", error);
      throw error;
    }
  }

  // Update content by document name
  static async updateContentByDocName(
    docName: string,
    updates: UpdateContentInput
  ): Promise<Content> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await this.db.collection("content").doc(docName).update(updateData);

      const doc = await this.db.collection("content").doc(docName).get();

      return {
        ...doc.data(),
      } as Content;
    } catch (error) {
      console.error("Error updating content by doc name:", error);
      throw error;
    }
  }

  // Delete content (we don't delete docs, only deactivate them)
  static async deleteContent(id: string): Promise<void> {
    try {
      // Instead of deleting, we deactivate the content
      await this.updateContent(id, { isActive: false });
    } catch (error) {
      console.error("Error deactivating content:", error);
      throw error;
    }
  }

  /**
   * User Data Management (for additional user info beyond auth)
   */

  // Store user profile data
  static async createUserProfile(
    uid: string,
    profileData: UserProfile
  ): Promise<void> {
    try {
      await this.db
        .collection("users")
        .doc(uid)
        .set({
          ...profileData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  // Get user profile
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const doc = await this.db.collection("users").doc(uid).get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
      } as UserProfile;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  }

  // Update user profile
  static async updateUserProfile(
    uid: string,
    updates: Partial<UserProfile>
  ): Promise<void> {
    try {
      await this.db
        .collection("users")
        .doc(uid)
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        });
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Get all user profiles
  static async getAllUserProfiles(): Promise<UserProfile[]> {
    try {
      const snapshot = await this.db.collection("users").get();

      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as UserProfile)
      );
    } catch (error) {
      console.error("Error getting all user profiles:", error);
      throw error;
    }
  }

  /**
   * Combined User Data (Auth + Firestore)
   */

  // Get combined user data from both Auth and Firestore
  static async getCombinedUserData(authUsers: FirebaseAuthUser[]): Promise<CombinedUser[]> {
    try {
      // Get all user profiles from Firestore
      const userProfiles = await this.getAllUserProfiles();

      // Create a map for quick lookup
      const profilesMap = new Map(
        userProfiles.map((profile) => {
          // Use uid from profile data for mapping
          const uid = profile.uid || profile.id;
          return [uid, profile];
        })
      );

      // Combine auth data with Firestore data
      const combinedUsers = authUsers.map((authUser) => {
        const profile = profilesMap.get(authUser.uid);

        const result = {
          // Auth data (includes disabled status, etc.)
          uid: authUser.uid,
          email: authUser.email,
          disabled: authUser.disabled || false,
          emailVerified: authUser.emailVerified || false,

          // Auth custom claims
          role: authUser.role || "USER",

          // Firestore data (takes precedence for names)
          firstName: profile?.firstName || authUser.firstName || "",
          lastName: profile?.lastName || authUser.lastName || "",
          profileCreatedAt: profile?.createdAt || null,

          // Computed fields
          isActive: !(authUser.disabled || false),
          fullName: `${profile?.firstName || authUser.firstName || ""} ${
            profile?.lastName || authUser.lastName || ""
          }`.trim(),

          // Keep original auth data for reference
          authData: authUser,
          profileData: profile || null,
        };
        
        return result;
      });

      return combinedUsers;
    } catch (error) {
      console.error("Error getting combined user data:", error);
      throw error;
    }
  }

  /**
   * Moods Collection (for future use)
   */

  // Get user moods
  static async getUserMoods(uid: string): Promise<MoodEntry[]> {
    try {
      const snapshot = await this.db
        .collection("moods")
        .where("userId", "==", uid)
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MoodEntry[];
    } catch (error) {
      console.error("Error getting user moods:", error);
      throw error;
    }
  }

  // Create mood entry
  static async createMoodEntry(
    moodData: Omit<MoodEntry, "id">
  ): Promise<MoodEntry> {
    try {
      const docRef = await this.db.collection("moods").add({
        ...moodData,
        createdAt: new Date().toISOString(),
      });

      const doc = await docRef.get();

      return {
        id: doc.id,
        ...doc.data(),
      } as MoodEntry;
    } catch (error) {
      console.error("Error creating mood entry:", error);
      throw error;
    }
  }
}
