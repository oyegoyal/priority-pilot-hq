
import React, { useState, useEffect } from "react";
import { useTask, Task } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUserTasks, rolloverIncompleteTasks } = useTask();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const today = new Date().toISOString().split("T")[0];

  // Get all tasks for the current user
  const tasks = getUserTasks();

  // Filter and sort tasks based on search term and sort option
  useEffect(() => {
    let filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Only show incomplete tasks on the dashboard
    filtered = filtered.filter((task) => !task.isCompleted);

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return a.dueDate.localeCompare(b.dueDate);
        case "priority":
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return (
            priorityOrder[a.userPriority] - priorityOrder[b.userPriority]
          );
        case "managerPriority":
          const managerPriorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          if (!a.managerPriority && !b.managerPriority) return 0;
          if (!a.managerPriority) return 1;
          if (!b.managerPriority) return -1;
          return (
            managerPriorityOrder[a.managerPriority] -
            managerPriorityOrder[b.managerPriority]
          );
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, sortBy]);

  // Group tasks by due date
  const todayTasks = filteredTasks.filter((task) => task.dueDate === today);
  const upcomingTasks = filteredTasks.filter((task) => task.dueDate > today);
  const overdueTasks = filteredTasks.filter((task) => task.dueDate < today);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Handle rollover tasks
  const handleRollover = () => {
    rolloverIncompleteTasks();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRollover}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Rollover Tasks</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              {user?.role === "team_member" && (
                <SelectItem value="managerPriority">Manager Priority</SelectItem>
              )}
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
              <h3 className="text-lg font-semibold">No tasks found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Try a different search term" : "Add a new task to get started"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="today" className="mt-6">
          {todayTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
              <h3 className="text-lg font-semibold">No tasks for today</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {todayTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-6">
          {upcomingTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
              <h3 className="text-lg font-semibold">No upcoming tasks</h3>
              <p className="text-sm text-muted-foreground">
                Your schedule is clear ahead
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="overdue" className="mt-6">
          {overdueTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
              <h3 className="text-lg font-semibold">No overdue tasks</h3>
              <p className="text-sm text-muted-foreground">
                You're on top of everything!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {overdueTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
