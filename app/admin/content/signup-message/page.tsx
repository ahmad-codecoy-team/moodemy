"use client";

import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function SignupMessagePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(
    "Thank you for joining MoodyMe! We're excited to help you track and understand your mood patterns. Let's get started by setting up your profile and logging your first mood entry. You're just a few steps away from gaining valuable insights into your emotional well-being."
  );

  const handleSave = () => {
    console.log("Saving signup message:", content);
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Signup Message
            </h1>
            <p className="text-muted-foreground">
              Manage the welcome message for new users
            </p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>

        {/* Content Card */}
        <Card>
          <CardHeader>
            <CardTitle>New User Welcome Message</CardTitle>
            <CardDescription>
              This message is displayed immediately after user signup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter signup welcome message..."
                  className="min-h-[200px]"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </>
            ) : (
              <div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {content}
                </p>
                <div className="bg-muted p-4 rounded-lg border-2 border-dashed">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Message Preview:
                  </p>
                  <div className="bg-background p-6 rounded">
                    <p className="text-sm font-semibold text-center mb-3">
                      👋 Welcome!
                    </p>
                    <p className="text-sm">{content}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
