import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FirebaseFirestoreService } from "@/lib/firebase-firestore";
import { getServerSession } from "@/lib/session";
import { HomeScreenEditor } from "./home-screen-editor";

export default async function HomeScreenPage() {
  // Verify user is authenticated and is admin
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized access');
  }

  // Fetch home screen content from Firebase
  const homeScreenContent = await FirebaseFirestoreService.getContentByDocName('home_screen');

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Home Screen Content</h1>
          <p className="text-muted-foreground">
            Manage the content displayed on your app's home screen
          </p>
        </div>

        {/* Home Screen Editor */}
        <HomeScreenEditor initialContent={homeScreenContent} />
      </div>
    </AdminLayout>
  );
}
