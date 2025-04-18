
import React from "react";
import { Task, useTask } from "@/contexts/TaskContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface TasksTableProps {
  tasks: Task[];
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks }) => {
  const { updateTask } = useTask();

  const handleAskHelp = (taskId: string, currentNeedsHelp: boolean) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      updateTask({ ...task, needsHelp: !currentNeedsHelp });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "text-red-500";
      case "in_progress":
        return "text-blue-500";
      case "done":
        return "text-green-500";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Est. Completion</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Help Required</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">
                <Link to={`/task/${task.id}`} className="hover:underline">
                  {task.title}
                </Link>
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="truncate">{task.description}</p>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(task.userPriority)}>
                  {task.userPriority.charAt(0).toUpperCase() +
                    task.userPriority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(task.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <span className={getStatusColor(task.status)}>
                  {task.status.replace("_", " ").charAt(0).toUpperCase() +
                    task.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant={task.needsHelp ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleAskHelp(task.id, task.needsHelp)}
                >
                  {task.needsHelp ? "Help Requested" : "Ask for Help"}
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/edit-task/${task.id}`}>Edit</Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TasksTable;

