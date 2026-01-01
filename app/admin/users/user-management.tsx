'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import type { User } from "@/types";
import { useRouter } from "next/navigation";

interface UserManagementProps {
  users: User[];
  searchTerm?: string;
}

export function UserManagement({ users, searchTerm = "" }: UserManagementProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchTerm);
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    isActive: true,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    router.push(`/admin/users?${params.toString()}`);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
    });
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingUser(null);
    setFormData({
      firstName: "",
      lastName: "",
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      // Import and use the server action
      const { updateUserInfo } = await import('./actions');
      
      const result = await updateUserInfo(editingUser.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        isActive: formData.isActive,
      });

      if (result.success) {
        handleCloseDialog();
        router.refresh(); // Refresh to get updated data
      } else {
        console.error("Update failed:", result.error);
        // You could add toast notification here
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
        {searchTerm && (
          <Button 
            type="button" 
            variant="ghost"
            onClick={() => {
              setSearchQuery("");
              router.push('/admin/users');
            }}
          >
            Clear
          </Button>
        )}
      </form>

      {/* Users Table */}
      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="border-b bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left p-4 font-medium">User</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Created</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  {searchTerm ? `No users found matching "${searchTerm}"` : "No users found"}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </span>
                      </div>
                      <span className="font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and status.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
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
                <Label htmlFor="isActive">Active User</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}