
import React, { useState } from "react";
import { useTask } from "@/contexts/TaskContext";
import TaskFilters from "@/components/TaskFilters";
import { useTaskFiltering } from "@/hooks/useTaskFiltering";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksByStatus from "@/components/dashboard/TasksByStatus";
import TasksByPriority from "@/components/dashboard/TasksByPriority";
import TasksTable from "@/components/TasksTable";

const Dashboard: React.FC = () => {
  const { getUserTasks } = useTask();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [viewType, setViewType] = useState("table");
  
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
      
      <Tabs defaultValue="table" onValueChange={setViewType}>
        <TabsList className="mb-4">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="status">By Status</TabsTrigger>
          <TabsTrigger value="priority">By Priority</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="space-y-4">
          <TasksTable tasks={filteredTasks} editable={true} />
        </TabsContent>
        
        <TabsContent value="status" className="space-y-4">
          <TasksByStatus tasks={filteredTasks} />
        </TabsContent>
        
        <TabsContent value="priority" className="space-y-4">
          <TasksByPriority tasks={filteredTasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
