import { AdminLayout } from "@/components/admin-layout";
import { FirebaseFirestoreService } from "@/lib/firebase-firestore";
import { getServerSession } from "@/lib/session";
import { SplashScreenEditor } from "./splash-screen-editor";

export default async function SplashScreenPage() {
  // Verify user is authenticated and is admin
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized access');
  }

  // Fetch splash screen content from Firebase
  const splashScreenContent = await FirebaseFirestoreService.getContentByDocName('splash_screen');

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Splash Screen Content</h1>
          <p className="text-muted-foreground">
            Manage the content displayed on your app's splash screen
          </p>
        </div>

        {/* Splash Screen Editor */}
        <SplashScreenEditor initialContent={splashScreenContent} />

        {/* Info Cards */}
        {/* <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Display Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">3 seconds</div>
              <p className="text-xs text-muted-foreground">Time shown on app startup</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Active
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </AdminLayout>
  );
}
