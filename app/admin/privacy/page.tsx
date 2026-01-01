import { AdminLayout } from '@/components/admin-layout';
import { FirebaseFirestoreService } from '@/lib/firebase-firestore';
import { getServerSession } from '@/lib/session';
import { PrivacyPolicyEditor } from './privacy-policy-editor';

export default async function PrivacyPage() {
  // Verify user is authenticated and is admin
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized access');
  }

  // Fetch privacy policy content from Firebase
  const privacyContent = await FirebaseFirestoreService.getContentByDocName('privacy_policy');
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground">Manage your privacy policy and data settings</p>
          </div>
        </div>

        {/* Privacy Content Editor */}
        <PrivacyPolicyEditor initialContent={privacyContent} />
      </div>
    </AdminLayout>
  );
}