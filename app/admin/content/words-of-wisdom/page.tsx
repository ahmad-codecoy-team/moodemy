import { AdminLayout } from "@/components/admin-layout";
import { FirebaseFirestoreService } from "@/lib/firebase-firestore";
import { getServerSession } from "@/lib/session";
import { WordsOfWisdomEditor } from "./words-of-wisdom-editor";

export default async function WordsOfWisdomPage() {
  // Verify user is authenticated and is admin
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized access");
  }

  // Fetch words of wisdom content from Firebase
  const wordsOfWisdomContent =
    await FirebaseFirestoreService.getContentByDocName("words_of_wisdom");

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Words of Wisdom</h1>
          <p className="text-muted-foreground">
            Manage inspirational quotes and wisdom displayed in your app
          </p>
        </div>

        {/* Words of Wisdom Editor */}
        <WordsOfWisdomEditor initialContent={wordsOfWisdomContent} />
      </div>
    </AdminLayout>
  );
}
