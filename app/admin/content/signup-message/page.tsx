import { AdminLayout } from "@/components/admin-layout";
import { FirebaseFirestoreService } from "@/lib/firebase-firestore";
import { getServerSession } from "@/lib/session";
import { SignupMessageEditor } from "./signup-message-editor";

export default async function SignupMessagePage() {
  // Verify user is authenticated and is admin
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized access");
  }

  // Fetch signup message content from Firebase
  const signupMessageContent =
    await FirebaseFirestoreService.getContentByDocName("signup_message");

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Signup Message Content
          </h1>
          <p className="text-muted-foreground">
            Manage the message displayed during user signup
          </p>
        </div>

        {/* Signup Message Editor */}
        <SignupMessageEditor initialContent={signupMessageContent} />
      </div>
    </AdminLayout>
  );
}
