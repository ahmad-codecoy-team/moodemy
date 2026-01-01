"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Activity, FileText } from "lucide-react";

import type { Content, ContentType, ContentTypeLabels } from "@/types";
import { mockContent } from "@/mocks";

export default async function ContentPage() {
  // Verify user is authenticated and is admin
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized access');
  }

  // Fetch real content from Firebase
  const contents = await FirebaseFirestoreService.getContent();

  // Calculate stats
  const totalContent = contents.length;
  const activeContent = contents.filter(content => content.isActive).length;
  const inactiveContent = totalContent - activeContent;


  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
            <p className="text-muted-foreground">
              Manage app content and messages
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{totalContent}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{activeContent}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Management Component */}
        <Card>
          <CardHeader>
            <CardTitle>Content Items ({totalContent})</CardTitle>
            <CardDescription>
              Manage your application content • {activeContent} active • {inactiveContent} inactive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContentManagement contents={contents} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
