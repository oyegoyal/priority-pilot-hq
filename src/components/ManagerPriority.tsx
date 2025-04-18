
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, TaskPriority, useTask } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";

interface ManagerPriorityProps {
  task: Task;
}

const ManagerPriority: React.FC<ManagerPriorityProps> = ({ task }) => {
  const { setManagerPriority } = useTask();
  const { isManager } = useAuth();

  const handleChange = (value: string) => {
    setManagerPriority(task.id, value as TaskPriority);
  };

  if (!isManager()) {
    return task.managerPriority ? (
      <div className="space-y-1">
        <p className="text-sm font-medium">Manager Priority</p>
        <div className="rounded-md bg-secondary p-2 text-sm">
          {task.managerPriority.charAt(0).toUpperCase() + task.managerPriority.slice(1)}
        </div>
      </div>
    ) : null;
  }

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">Manager Priority</p>
      <Select
        value={task.managerPriority || ""}
        onValueChange={handleChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Set manager priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">No Priority</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ManagerPriority;
