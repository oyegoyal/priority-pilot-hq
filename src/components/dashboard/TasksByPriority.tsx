
import React from "react";
import { Task } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskCard from "@/components/TaskCard";

interface TasksByPriorityProps {
  tasks: Task[];
}

const TasksByPriority: React.FC<TasksByPriorityProps> = ({ tasks }) => {
  // Group tasks by priority
  const urgentTasks = tasks.filter(task => task.userPriority === "urgent");
  const highTasks = tasks.filter(task => task.userPriority === "high");
  const mediumTasks = tasks.filter(task => task.userPriority === "medium");
  const lowTasks = tasks.filter(task => task.userPriority === "low");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-red-50 pb-2">
          <CardTitle className="text-lg text-red-700 flex justify-between">
            <span>Urgent</span>
            <span className="bg-red-100 text-red-800 px-2 rounded-full">
              {urgentTasks.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentTasks.length > 0 ? (
              urgentTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No urgent tasks</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-orange-50 pb-2">
          <CardTitle className="text-lg text-orange-700 flex justify-between">
            <span>High</span>
            <span className="bg-orange-100 text-orange-800 px-2 rounded-full">
              {highTasks.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highTasks.length > 0 ? (
              highTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No high priority tasks</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-yellow-50 pb-2">
          <CardTitle className="text-lg text-yellow-700 flex justify-between">
            <span>Medium</span>
            <span className="bg-yellow-100 text-yellow-800 px-2 rounded-full">
              {mediumTasks.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediumTasks.length > 0 ? (
              mediumTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No medium priority tasks</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-blue-50 pb-2">
          <CardTitle className="text-lg text-blue-700 flex justify-between">
            <span>Low</span>
            <span className="bg-blue-100 text-blue-800 px-2 rounded-full">
              {lowTasks.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowTasks.length > 0 ? (
              lowTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No low priority tasks</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksByPriority;
