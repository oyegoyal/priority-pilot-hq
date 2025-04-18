
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const Reports: React.FC = () => {
  const { isManager } = useAuth();

  // Redirect if not manager
  if (!isManager()) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>
            View team productivity and task completion metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">
            Reports functionality will be available in the next version.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
