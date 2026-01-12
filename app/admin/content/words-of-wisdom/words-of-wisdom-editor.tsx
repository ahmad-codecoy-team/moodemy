'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import type { Content } from "@/types";

interface WordsOfWisdomEditorProps {
  initialContent: Content | null;
}

export function WordsOfWisdomEditor({ initialContent }: WordsOfWisdomEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent?.content || "");
  const [title, setTitle] = useState(initialContent?.title || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!initialContent) return;
    
    setIsSaving(true);
    try {
      // Import the server action
      const { updateContentByDocName } = await import('../home-screen/actions');
      
      const result = await updateContentByDocName('words_of_wisdom', {
        title,
        content,
        isActive: initialContent.isActive,
      });

      if (result.success) {
        setIsEditing(false);
        router.refresh(); // Refresh to get updated data
      } else {
        console.error("Update failed:", result.error);
      }
    } catch (error) {
      console.error("Error saving content:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(initialContent?.content || "");
    setTitle(initialContent?.title || "");
    setIsEditing(false);
  };

  if (!initialContent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Words of Wisdom Content</CardTitle>
          <CardDescription>Words of wisdom content not found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please initialize the content collection first by running the initialization script.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Words of Wisdom Content</CardTitle>
        <CardDescription>
          Manage inspirational quotes and wisdom shared with your users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your words of wisdom..."
                rows={6}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg">{initialContent.title}</h4>
              <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                {initialContent.content}
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                App Preview:
              </p>
              <div className="bg-white dark:bg-gray-900 p-4 rounded border text-center">
                <h4 className="font-semibold text-sm">{initialContent.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 italic">{initialContent.content}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date(initialContent.updatedAt).toLocaleString()}
              </div>
              <Button onClick={() => setIsEditing(true)}>
                Edit Content
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
