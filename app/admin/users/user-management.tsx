"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Search, UserCheck, UserX } from "lucide-react";
import type { CombinedUser } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  itemsPerPage: number;
}

interface UserManagementProps {
  users: CombinedUser[];
  searchTerm?: string;
  pagination: PaginationInfo;
}

export function UserManagement({
  users,
  searchTerm = "",
  pagination,
}: UserManagementProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchTerm);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  // Debounced instant search
  useEffect(() => {
    // Only trigger navigation if searchQuery is different from URL searchTerm
    if (searchQuery === searchTerm) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      } else {
        params.delete("search");
      }

      // Reset to page 1 when search changes
      params.set("page", "1");

      router.push(`/admin/users?${params.toString()}`);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/admin/users?${params.toString()}`);
  };

  const handleToggleUserStatus = async (user: CombinedUser) => {
    const newStatus = !user.isActive;
    const action = newStatus ? "activate" : "suspend";

    // Set loading state
    setLoadingStates((prev) => ({ ...prev, [user.uid]: true }));

    try {
      // Import and use the server action
      const { updateUserStatus } = await import("./actions");

      const result = await updateUserStatus(user.uid, newStatus);

      if (result.success) {
        toast.success(`User ${action}d successfully`);
        router.refresh(); // Refresh to get updated data
      } else {
        toast.error(result.error || `Failed to ${action} user`);
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast.error(`Failed to ${action} user`);
    } finally {
      // Clear loading state
      setLoadingStates((prev) => ({ ...prev, [user.uid]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setSearchQuery("");
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Users Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-150 overflow-auto">
          <table className="w-full min-w-max">
            <thead className="border-b bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="text-left p-4 font-medium whitespace-nowrap">
                  User
                </th>
                <th className="text-left p-4 font-medium whitespace-nowrap">
                  Email
                </th>
                <th className="text-left p-4 font-medium whitespace-nowrap">
                  Can Email
                </th>
                <th className="text-left p-4 font-medium whitespace-nowrap">
                  Role
                </th>
                <th className="text-left p-4 font-medium whitespace-nowrap">
                  Status
                </th>
                <th className="text-left p-4 font-medium whitespace-nowrap">
                  Created
                </th>
                <th className="text-left p-4 font-medium whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    {searchTerm
                      ? `No users found matching "${searchTerm}"`
                      : "No users found"}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.uid} className="border-b">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {user.firstName?.[0] || user.email?.[0] || "?"}
                            {user.lastName?.[0] || ""}
                          </span>
                        </div>
                        <span className="font-medium">
                          {user.fullName ||
                            `${user.firstName} ${user.lastName}`.trim() ||
                            user.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.allowEmailSent
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {user.allowEmailSent ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 text-sm whitespace-nowrap">
                      {user.profileCreatedAt
                        ? new Date(user.profileCreatedAt).toLocaleDateString()
                        : user.authData?.metadata?.creationTime
                        ? new Date(
                            user.authData.metadata.creationTime
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleUserStatus(user)}
                        disabled={loadingStates[user.uid] || false}
                        className={`flex items-center gap-2 ${
                          user.isActive
                            ? "text-red-600 hover:text-red-700 hover:border-red-300"
                            : "text-green-600 hover:text-green-700 hover:border-green-300"
                        }`}
                      >
                        {loadingStates[user.uid] ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : user.isActive ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                        {loadingStates[user.uid]
                          ? "Processing..."
                          : user.isActive
                          ? "Suspend"
                          : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalUsers}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
            showInfo={true}
            className="border-t pt-4"
          />
        </div>
      )}
    </div>
  );
}
