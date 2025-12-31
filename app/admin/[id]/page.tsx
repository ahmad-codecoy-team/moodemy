// app/admin/content/[type]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Activity, FileText } from "lucide-react";

// TYPES

type ContentType = "ABOUT_US" | "HELP_SUPPORT" | "PRIVACY_POLICY";
interface Content {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ContentPage() {
  const params = useParams();
  const rawId = params.id;
  const typeFromURL = ((Array.isArray(rawId) ? rawId[0] : rawId) ?? "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const labelMap: Record<ContentType, string> = {
    ABOUT_US: "about",
    HELP_SUPPORT: "Help & Support",
    PRIVACY_POLICY: "Privacy Policy",
  };

  const readableTitle = typeFromURL;

  console.log("typeFromURL:", typeFromURL);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`/api/admin/content?type=${typeFromURL}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setContents(data.contents);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [typeFromURL]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Dynamic Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {readableTitle}
            </h1>
            <p className="text-muted-foreground">
              Manage {readableTitle} content
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add {readableTitle}
          </Button>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Activity className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : contents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p>No {readableTitle} content created yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contents.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{labelMap[item.type]}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-3">{item.content}</p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// DYNAMIC ROUTE FOLDER STRUCTURE:
// app/admin/content/[type]/page.tsx
