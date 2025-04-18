
import React, { useState } from "react";
import { useTask } from "@/contexts/TaskContext";
import TaskFilters from "@/components/TaskFilters";
import TasksTable from "@/components/TasksTable";
import { useTaskFiltering } from "@/hooks/useTaskFiltering";

const Dashboard: React.FC = () => {
  const { getUserTasks } = useTask();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");

  const tasks = getUserTasks();
  const filteredTasks = useTaskFiltering(tasks, searchTerm, sortBy);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <TaskFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>
      <TasksTable tasks={filteredTasks} />
    </div>
  );
};

export default Dashboard;

