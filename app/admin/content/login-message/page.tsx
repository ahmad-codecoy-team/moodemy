import { AdminLayout } from "@/components/admin-layout";
import { FirebaseFirestoreService } from "@/lib/firebase-firestore";
import { getServerSession } from "@/lib/session";
import { LoginMessageEditor } from "./login-message-editor";

export default async function LoginMessagePage() {
  // Verify user is authenticated and is admin
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized access');
  }

  // Fetch login message content from Firebase
  const loginMessageContent = await FirebaseFirestoreService.getContentByDocName('login_message');

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Login Message Content</h1>
          <p className="text-muted-foreground">
            Manage the message displayed during user login
          </p>
        </div>

        {/* Login Message Editor */}
        <LoginMessageEditor initialContent={loginMessageContent} />
      </div>
    </AdminLayout>
  );
}
