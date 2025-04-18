
import React from "react";
import { Task } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskCard from "@/components/TaskCard";

interface TasksByStatusProps {
  tasks: Task[];
}

const TasksByStatus: React.FC<TasksByStatusProps> = ({ tasks }) => {
  // Group tasks by status
  const todoTasks = tasks.filter(task => task.status === "todo");
  const inProgressTasks = tasks.filter(task => task.status === "in_progress");
  const doneTasks = tasks.filter(task => task.status === "done");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="bg-red-50 pb-2">
          <CardTitle className="text-lg text-red-700 flex justify-between">
            <span>To Do</span>
            <span className="bg-red-100 text-red-800 px-2 rounded-full">
              {todoTasks.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {todoTasks.length > 0 ? (
              todoTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No tasks</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-blue-50 pb-2">
          <CardTitle className="text-lg text-blue-700 flex justify-between">
            <span>In Progress</span>
            <span className="bg-blue-100 text-blue-800 px-2 rounded-full">
              {inProgressTasks.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No tasks</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-green-50 pb-2">
          <CardTitle className="text-lg text-green-700 flex justify-between">
            <span>Done</span>
            <span className="bg-green-100 text-green-800 px-2 rounded-full">
              {doneTasks.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {doneTasks.length > 0 ? (
              doneTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No tasks</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksByStatus;
