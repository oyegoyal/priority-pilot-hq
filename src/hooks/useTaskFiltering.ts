
import { Task } from "@/contexts/TaskContext";

export const useTaskFiltering = (tasks: Task[], searchTerm: string, sortBy: string) => {
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

  return filteredTasks;
};

