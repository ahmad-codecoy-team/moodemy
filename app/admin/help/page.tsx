'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function AboutPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState(
    'Welcome to MoodyMe! We are a platform dedicated to helping you track and understand your mood patterns. Our mission is to provide you with insights into your emotional well-being and help you lead a healthier, more balanced life.'
  );

  const handleSave = () => {
    // TODO: Save to database
    console.log('Saving about text:', aboutText);
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
            <p className="text-muted-foreground">Manage your application's help page content</p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {/* About Content Card */}
        <Card>
          <CardHeader>
            <CardTitle>About MoodyMe</CardTitle>
            <CardDescription>Your application description and mission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  placeholder="Enter about text..."
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
              <p className="text-muted-foreground leading-relaxed">{aboutText}</p>
            )}
          </CardContent>
        </Card>

        {/* Stats Section */}
        {/* <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Founded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2024</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </AdminLayout>
  );
}
