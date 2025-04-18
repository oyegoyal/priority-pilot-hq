
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Paperclip, 
  CheckCircle2, 
  Edit, 
  Trash2,
  Flag
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Task, TaskPriority, useTask } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "low":
      return "task-priority-low";
    case "medium":
      return "task-priority-medium";
    case "high":
      return "task-priority-high";
    case "urgent":
      return "task-priority-urgent";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityLabel = (priority: TaskPriority) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

const getDaysPending = (createdDate: string) => {
  const created = new Date(createdDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: "numeric", 
    month: "short", 
    day: "numeric" 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const isTaskOverdue = (dueDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDueDate = new Date(dueDate);
  taskDueDate.setHours(0, 0, 0, 0);
  return taskDueDate < today;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { completeTask, deleteTask } = useTask();
  const { user, isManager } = useAuth();
  
  const daysPending = getDaysPending(task.createdAt);
  const isOverdue = isTaskOverdue(task.dueDate) && !task.isCompleted;

  const handleComplete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    completeTask(task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTask(task.id);
  };

  return (
    <Link to={`/task/${task.id}`} className="block">
      <Card className={cn(
        "transition-all duration-200 hover:shadow-md",
        task.isCompleted ? "opacity-60" : "",
        isOverdue ? "border-destructive/30" : ""
      )}>
        <CardHeader className="pb-2 flex flex-row justify-between items-start">
          <div>
            <h3 className={cn(
              "font-medium text-lg",
              task.isCompleted ? "line-through" : ""
            )}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-3 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-1 h-3.5 w-3.5" />
                <span className={isOverdue ? "text-destructive" : ""}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
              {!task.isCompleted && daysPending > 1 && (
                <div className="flex items-center">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  <span>{daysPending} days pending</span>
                </div>
              )}
              {task.attachments.length > 0 && (
                <div className="flex items-center">
                  <Paperclip className="mr-1 h-3.5 w-3.5" />
                  <span>{task.attachments.length}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Badge className={getPriorityColor(task.userPriority)}>
              {getPriorityLabel(task.userPriority)}
            </Badge>
            
            {task.managerPriority && isManager() && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className={cn(
                      "flex items-center gap-1",
                      getPriorityColor(task.managerPriority)
                    )}>
                      <Flag className="h-3 w-3" />
                      <span>{getPriorityLabel(task.managerPriority)}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Manager priority</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        </CardContent>
        
        <CardFooter className="pt-2 flex justify-between">
          <div>
            {task.isCompleted ? (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                Completed
              </Badge>
            ) : isOverdue ? (
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                Overdue
              </Badge>
            ) : null}
          </div>
          
          <div className="flex space-x-2">
            {!task.isCompleted && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleComplete}
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark as complete</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span className="sr-only">Open menu</span>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                    <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/edit-task/${task.id}`} className="flex items-center">
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default TaskCard;
