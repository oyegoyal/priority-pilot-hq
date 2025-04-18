
import React, { useState, useEffect } from "react";
import { useTask, Task } from "@/contexts/TaskContext";
import TaskCard from "@/components/TaskCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const CompletedTasks: React.FC = () => {
  const { getUserTasks } = useTask();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // Get all tasks for the current user
  const tasks = getUserTasks();

  // Filter completed tasks based on search term
  useEffect(() => {
    let filtered = tasks.filter(
      (task) =>
        task.isCompleted &&
        (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sort by completion date (most recent first)
    filtered.sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-bold">Completed Tasks</h1>
      </div>

      <div className="relative w-full md:w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search completed tasks..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-8"
        />
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
          <h3 className="text-lg font-semibold">No completed tasks</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm
              ? "Try a different search term"
              : "Complete some tasks to see them here"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;
