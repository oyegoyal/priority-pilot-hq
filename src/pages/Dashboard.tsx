
import React, { useState } from "react";
import { useTask, Task } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard: React.FC = () => {
  const { getUserTasks } = useTask();
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
          return a.dueDate.localeCompare(b.dueDate);
        case "priority":
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.userPriority] - priorityOrder[b.userPriority];
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const todoTasks = filteredTasks.filter(task => task.status === "todo");
  const inProgressTasks = filteredTasks.filter(task => task.status === "in_progress");
  const doneTasks = filteredTasks.filter(task => task.status === "done");

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold">Task List</h1>
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* To Do Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <h2 className="font-semibold">To Do ({todoTasks.length})</h2>
          </div>
          <div className="space-y-3">
            {todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <h2 className="font-semibold">In Progress ({inProgressTasks.length})</h2>
          </div>
          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Done Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <h2 className="font-semibold">Done ({doneTasks.length})</h2>
          </div>
          <div className="space-y-3">
            {doneTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
