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

export default function HomeScreenPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(
    "Welcome back to MoodyMe! Track your daily mood, discover patterns, and gain valuable insights into your emotional well-being. Start by logging your mood today and build a comprehensive history of your emotional state. Your journey to better mental health starts here!"
  );

  const handleSave = () => {
    console.log("Saving home screen content:", content);
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Home Screen</h1>
            <p className="text-muted-foreground">
              Manage the welcome message on home screen
            </p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>

        {/* Content Card */}
        <Card>
          <CardHeader>
            <CardTitle>Home Screen Message</CardTitle>
            <CardDescription>
              This message is displayed when users open the app home screen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter home screen message..."
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
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Preview:
                  </p>
                  <p className="text-sm mt-2">{content}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
