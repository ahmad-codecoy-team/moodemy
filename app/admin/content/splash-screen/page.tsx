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

export default function SplashScreenPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(
    "Understand Your Mood, Improve Your Life. Welcome to MoodyMe - Your Personal Mood Tracking Companion. Track daily moods, discover patterns, and gain insights into your emotional well-being."
  );

  const handleSave = () => {
    console.log("Saving splash screen content:", content);
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Splash Screen</h1>
            <p className="text-muted-foreground">
              Manage the splash screen welcome message
            </p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>

        {/* Content Card */}
        <Card>
          <CardHeader>
            <CardTitle>Splash Screen Message</CardTitle>
            <CardDescription>
              This message is displayed when the app first loads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter splash screen message..."
                  className="min-h-[150px]"
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
                    Splash Preview:
                  </p>
                  <div className="bg-background p-6 rounded text-center">
                    <div className="text-2xl font-bold mb-2">🎯</div>
                    <p className="text-sm font-semibold">{content}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
