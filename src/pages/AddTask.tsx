
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskForm from "@/components/TaskForm";

const AddTask: React.FC = () => {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTask;
