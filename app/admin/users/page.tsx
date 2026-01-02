import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { UserX, UserCheck, Users } from "lucide-react";
import { FirebaseAuthService } from "@/lib/firebase-auth";
import { FirebaseFirestoreService } from "@/lib/firebase-firestore";
import { getServerSession } from "@/lib/session";
import { UserManagement } from "./user-management";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  // Verify user is authenticated and is admin
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized access");
  }

  // Fetch users from Firebase Auth
  const usersData = await FirebaseAuthService.listUsers(1000);

  // Combine Auth data with Firestore users collection data
  let users = await FirebaseFirestoreService.getCombinedUserData(
    usersData.users
  );

  // Filter out admin users (don't show current admin or other admins in the users list)
  users = users.filter((user) => user.role !== "ADMIN");

  // Apply search filter if provided
  const searchTerm = searchParams.search?.toLowerCase();
  if (searchTerm) {
    users = users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm) ||
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm)
    );
  }

  // Pagination setup
  const currentPage = parseInt(searchParams.page || "1", 10);
  const itemsPerPage = 5;
  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  // Get users for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  // Calculate stats for the header (only non-admin users)
  const activeUsers = users.filter((user) => user.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {activeUsers}
                </div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-red-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {inactiveUsers}
                </div>
                <div className="text-xs text-muted-foreground">Inactive</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {totalUsers}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Component */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({totalUsers})</CardTitle>
            <CardDescription>
              Manage user accounts and permissions • {activeUsers} active •{" "}
              {inactiveUsers} inactive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserManagement
              users={paginatedUsers}
              searchTerm={searchParams.search}
              pagination={{
                currentPage,
                totalPages,
                totalUsers,
                itemsPerPage,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
