import { AdminLayout } from '@/components/admin-layout';
import { FirebaseFirestoreService } from '@/lib/firebase-firestore';
import { getServerSession } from '@/lib/session';
import { HelpSupportEditor } from './help-support-editor';

export default async function HelpPage() {
  // Verify user is authenticated and is admin
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized access');
  }

  // Fetch help support content from Firebase
  const helpContent = await FirebaseFirestoreService.getContentByDocName('help_support');
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
            <p className="text-muted-foreground">Manage your application's help page content</p>
          </div>
        </div>

        {/* Help Content Editor */}
        <HelpSupportEditor initialContent={helpContent} />

        {/* Stats Section */}
        {/* <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Founded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2024</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </AdminLayout>
  );
}
