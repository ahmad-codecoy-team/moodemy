'use server';

import { revalidatePath } from 'next/cache';
import { FirebaseFirestoreService } from '@/lib/firebase-firestore';
import { getServerSession } from '@/lib/session';
import type { CreateContentInput, UpdateContentInput } from '@/types';

/**
 * Create new content (Not supported - only updates allowed)
 */
export async function createContent(contentData: CreateContentInput) {
  return {
    success: false,
    error: 'Cannot create new content documents. Only predefined content types can be updated.',
  };
}

/**
 * Update existing content
 */
export async function updateContent(contentId: string, updates: UpdateContentInput) {
  try {
    // Verify admin permissions
    const session = await getServerSession();
    if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Admin privileges required');
    }

    // Update content in Firebase
    const updatedContent = await FirebaseFirestoreService.updateContent(contentId, updates);

    // Revalidate pages
    revalidatePath('/admin/content');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Content updated successfully',
      content: updatedContent,
    };
  } catch (error) {
    console.error('Error updating content:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update content',
    };
  }
}

/**
 * Delete content
 */
export async function deleteContent(contentId: string) {
  try {
    // Verify admin permissions
    const session = await getServerSession();
    if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Admin privileges required');
    }

    // Delete content from Firebase
    await FirebaseFirestoreService.deleteContent(contentId);

    // Revalidate pages
    revalidatePath('/admin/content');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Content deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting content:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete content',
    };
  }
}