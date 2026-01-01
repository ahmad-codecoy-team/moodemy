'use server';

import { revalidatePath } from 'next/cache';
import { FirebaseFirestoreService } from '@/lib/firebase-firestore';
import { getServerSession } from '@/lib/session';
import type { UpdateContentInput } from '@/types';

/**
 * Update content by document name (for specific content pages like home_screen)
 */
export async function updateContentByDocName(docName: string, updates: UpdateContentInput) {
  try {
    // Verify admin permissions
    const session = await getServerSession();
    if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Admin privileges required');
    }

    // Update content in Firebase
    const updatedContent = await FirebaseFirestoreService.updateContentByDocName(docName, updates);

    // Revalidate pages
    revalidatePath(`/admin/content/${docName.replace('_', '-')}`);
    revalidatePath('/admin/content');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Content updated successfully',
      content: updatedContent,
    };
  } catch (error) {
    console.error('Error updating content by doc name:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update content',
    };
  }
}