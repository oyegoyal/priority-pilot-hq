
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskForm from "@/components/TaskForm";
import { useTask } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";

const EditTask: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { getTaskById } = useTask();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!taskId) {
    navigate("/");
    return null;
  }

  const task = getTaskById(taskId);

  if (!task) {
    navigate("/");
    return null;
  }

  // Check if the user is allowed to edit this task
  if (user?.id !== task.userId) {
    navigate("/");
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm task={task} isEdit />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTask;
