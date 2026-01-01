"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import type { Content } from "@/types";
import { updateContentByDocName } from "../home-screen/actions";

interface SignupMessageEditorProps {
  initialContent: Content | null;
}

export function SignupMessageEditor({
  initialContent,
}: SignupMessageEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent?.content || "");
  const [title, setTitle] = useState(initialContent?.title || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!initialContent) return;

    setIsSaving(true);
    try {
      const result = await updateContentByDocName("signup_message", {
        title: initialContent.title, // Keep existing title
        content,
        isActive: initialContent.isActive,
      });

      if (result.success) {
        setIsEditing(false);
        router.refresh();
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
    setIsEditing(false);
  };

  if (!initialContent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Signup Message Content</CardTitle>
          <CardDescription>Signup message content not found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please initialize the content collection first by running the
            initialization script.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup Message Content</CardTitle>
        <CardDescription>
          Manage the message shown to users during the signup process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your signup message..."
                rows={5}
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
                Signup Flow Preview:
              </p>
              <div className="bg-white dark:bg-gray-900 p-4 rounded border">
                <div className="text-center space-y-2">
                  <h4 className="font-semibold text-sm">
                    {initialContent.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {initialContent.content}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Last updated:{" "}
                {new Date(initialContent.updatedAt).toLocaleString()}
              </div>
              <Button onClick={() => setIsEditing(true)}>Edit Message</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
