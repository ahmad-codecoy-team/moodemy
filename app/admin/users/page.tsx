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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, UserX, UserCheck, Activity, Users } from "lucide-react";
import type { User } from "@/types";
import { FirebaseAuthService } from "@/lib/firebase-auth";
import { getServerSession } from "@/lib/session";
import { UserManagement } from "./user-management";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  // Verify user is authenticated and is admin
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized access');
  }

  // Fetch real users from Firebase
  const usersData = await FirebaseAuthService.listUsers(1000);
  let users = usersData.users;

  // Apply search filter if provided
  const searchTerm = searchParams.search?.toLowerCase();
  if (searchTerm) {
    users = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm) ||
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm)
    );
  }

  // Calculate stats for the header
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-red-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">{inactiveUsers}</div>
                <div className="text-xs text-muted-foreground">Inactive</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
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
              Manage user accounts and permissions • {activeUsers} active • {inactiveUsers} inactive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserManagement users={users} searchTerm={searchParams.search} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
