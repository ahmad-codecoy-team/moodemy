import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserX,
  Image,
  FileText,
  Activity,
} from "lucide-react";
import type { DashboardStats, StatCard, RecentUser } from "@/types";
import { FirebaseAuthService } from "@/lib/firebase-auth";
import { FirebaseFirestoreService } from "@/lib/firebase-firestore";
import { getServerSession } from "@/lib/session";

export default async function AdminDashboard() {
  // Verify user is authenticated and is admin
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized access");
  }

  // Fetch real data from Firebase
  const [usersData, contentData] = await Promise.all([
    FirebaseAuthService.listUsers(),
    FirebaseFirestoreService.getContent(),
  ]);

  // Calculate real stats
  const stats: DashboardStats = {
    totalUsers: usersData.users.length,
    activeUsers: usersData.users.filter((user) => user.isActive).length,
    inactiveUsers: usersData.users.filter((user) => !user.isActive).length,
    totalBanners: 0, // You can implement banner collection later
    activeBanners: 0, // You can implement banner collection later
    contentCount: contentData.length,
  };

  // Get recent users (last 10)
  const recentUsers: RecentUser[] = usersData.users
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10)
    .map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      isActive: user.isActive,
    }));

  const statCards: StatCard[] = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "All registered users",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      description: "Currently active users",
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Inactive Users",
      value: stats.inactiveUsers,
      icon: UserX,
      description: "Deactivated users",
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/30",
    },
    // {
    //   title: "Active Banners",
    //   value: stats.activeBanners,
    //   icon: Image,
    //   description: `${stats.activeBanners} of ${stats.totalBanners} banners`,
    //   color: "text-purple-500",
    //   bg: "bg-purple-50 dark:bg-purple-950/30",
    // },
    // {
    //   title: "Content Pages",
    //   value: stats.contentCount,
    //   icon: FileText,
    //   description: "Total content items",
    //   color: "text-pink-500",
    //   bg: "bg-pink-50 dark:bg-pink-950/30",
    // },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your MoodyMe application
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
