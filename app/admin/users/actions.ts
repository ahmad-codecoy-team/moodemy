'use server';

import { revalidatePath } from 'next/cache';
import { FirebaseAuthService } from '@/lib/firebase-auth';
import { getServerSession } from '@/lib/session';
import type { UpdateUserInput } from '@/types';

/**
 * Update user status (activate/deactivate)
 */
export async function updateUserStatus(userId: string, isActive: boolean) {
  try {
    // Verify admin permissions
    const session = await getServerSession();
    if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Admin privileges required');
    }

    // Update user status in Firebase
    await FirebaseAuthService.updateUserStatus(userId, isActive);

    // Revalidate the users page to show updated data
    revalidatePath('/admin/users');
    revalidatePath('/admin'); // Also revalidate dashboard

    return {
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    };
  } catch (error) {
    console.error('Error updating user status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user status',
    };
  }
}

/**
 * Update user information (first name, last name, etc.)
 */
export async function updateUserInfo(userId: string, updates: UpdateUserInput) {
  try {
    // Verify admin permissions
    const session = await getServerSession();
    if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Admin privileges required');
    }

    // Get current user data
    const currentUser = await FirebaseAuthService.getUserById(userId);
    if (!currentUser) {
      throw new Error('User not found');
    }

    // Update custom claims with new information
    const customClaims = {
      role: currentUser.role,
      firstName: updates.firstName || currentUser.firstName,
      lastName: updates.lastName || currentUser.lastName,
    };

    await FirebaseAuthService.updateUserCustomClaims(userId, customClaims);

    // Update user status if provided
    if (typeof updates.isActive === 'boolean') {
      await FirebaseAuthService.updateUserStatus(userId, updates.isActive);
    }

    // Revalidate pages
    revalidatePath('/admin/users');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'User information updated successfully',
    };
  } catch (error) {
    console.error('Error updating user info:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user information',
    };
  }
}

/**
 * Delete user (permanently remove from Firebase)
 */
export async function deleteUser(userId: string) {
  try {
    // Verify admin permissions
    const session = await getServerSession();
    if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Admin privileges required');
    }

    // Prevent admin from deleting themselves
    if (session.user.id === userId) {
      throw new Error('You cannot delete your own account');
    }

    // Delete user from Firebase
    await FirebaseAuthService.deleteUser(userId);

    // Revalidate pages
    revalidatePath('/admin/users');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user',
    };
  }
}

/**
 * Create new admin user
 */
export async function createAdminUser(userData: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) {
  try {
    // Verify admin permissions
    const session = await getServerSession();
    if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Admin privileges required');
    }

    // Create new admin user
    const newUser = await FirebaseAuthService.createUser({
      ...userData,
      role: 'ADMIN',
    });

    // Revalidate pages
    revalidatePath('/admin/users');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Admin user created successfully',
      user: newUser,
    };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create admin user',
    };
  }
}