import { ContentManagement } from "./content-management";

export default function ContentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">
            Manage app content and messages
          </p>
        </div>
      </div>

      {/* Content Management Component */}
      <ContentManagement />
    </div>
  );
}

