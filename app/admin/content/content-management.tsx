'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash2, Plus } from "lucide-react";
import type { Content, ContentType, ContentTypeLabels } from "@/types";
import { useRouter } from "next/navigation";

interface ContentManagementProps {
  contents: Content[];
}

export function ContentManagement({ contents }: ContentManagementProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [deletingContent, setDeletingContent] = useState<Content | null>(null);
  const [formData, setFormData] = useState({
    type: "ABOUT_US" as ContentType,
    title: "",
    content: "",
    isActive: true,
  });

  // Removed handleAddContent since we only update existing documents

  const handleEditContent = (content: Content) => {
    setEditingContent(content);
    setFormData({
      type: content.type,
      title: content.title,
      content: content.content,
      isActive: content.isActive,
    });
    setShowDialog(true);
  };

  const handleDeleteContent = (content: Content) => {
    setDeletingContent(content);
    setShowDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingContent(null);
    setFormData({
      type: "ABOUT_US" as ContentType,
      title: "",
      content: "",
      isActive: true,
    });
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setDeletingContent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingContent) {
        // Update existing content
        const { updateContent } = await import('./actions');
        const result = await updateContent(editingContent.id, {
          title: formData.title,
          content: formData.content,
          isActive: formData.isActive,
        });

        if (result.success) {
          handleCloseDialog();
          router.refresh();
        } else {
          console.error("Update failed:", result.error);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingContent) return;

    try {
      const { deleteContent } = await import('./actions');
      const result = await deleteContent(deletingContent.id);

      if (result.success) {
        handleCloseDeleteDialog();
        router.refresh();
      } else {
        console.error("Delete failed:", result.error);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Content Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Content Items</h3>
          <p className="text-sm text-muted-foreground">
            Edit your predefined app content and messages
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contents.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No content found. Please initialize the content collection first.
          </div>
        ) : (
          contents.map((content) => (
            <div key={content.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{content.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ContentTypeLabels[content.type]}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    content.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {content.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-3">
                {content.content}
              </p>
              
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditContent(content)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteContent(content)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Deactivate
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Content Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>
              Update the content information below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">Content Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as ContentType })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  disabled={!!editingContent}
                  required
                >
                  <option value="ABOUT_US">About Us</option>
                  <option value="HELP_SUPPORT">Help & Support</option>
                  <option value="PRIVACY_POLICY">Privacy Policy</option>
                  <option value="HOME_SCREEN">Home Screen</option>
                  <option value="SPLASH_SCREEN">Splash Screen</option>
                  <option value="SIGNUP_MESSAGE">Signup Message</option>
                  <option value="LOGIN_MESSAGE">Login Message</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={6}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                Update Content
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Content</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate "{deletingContent?.title}"? This will make it inactive in your application.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDeleteDialog}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}