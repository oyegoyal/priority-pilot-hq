
import React, { useState } from "react";
import { useTask } from "@/contexts/TaskContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard: React.FC = () => {
  const { getUserTasks, updateTask } = useTask();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");

  const tasks = getUserTasks();

  // Filter tasks based on search and sort
  const filteredTasks = tasks
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "priority":
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.userPriority] - priorityOrder[b.userPriority];
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

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
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex items-center space-x-2">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <Link
                    to={`/task/${task.id}`}
                    className="hover:underline"
                  >
                    {task.title}
                  </Link>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="truncate">{task.description}</p>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(task.userPriority)}>
                    {task.userPriority.charAt(0).toUpperCase() + task.userPriority.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={getStatusColor(task.status)}>
                    {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.slice(1)}
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
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to={`/edit-task/${task.id}`}>Edit</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
