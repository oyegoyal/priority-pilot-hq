
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Paperclip,
  HelpCircle,
  Edit,
  Trash2,
  Flag
} from "lucide-react";
import { Task, useTask } from "@/contexts/TaskContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { deleteTask, updateTask } = useTask();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTask(task.id);
  };

  const handleAskHelp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateTask({ ...task, needsHelp: true });
  };

  return (
    <Link to={`/task/${task.id}`}>
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="p-4">
          <div className="flex items-start justify-between space-x-4">
            <div className="space-y-1.5">
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={cn(
                task.needsHelp ? "bg-yellow-100 text-yellow-800" : "",
                task.userPriority === "high" ? "bg-red-100 text-red-800" :
                task.userPriority === "medium" ? "bg-orange-100 text-orange-800" :
                "bg-blue-100 text-blue-800"
              )}>
                {task.userPriority}
              </Badge>
              {task.managerPriority && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Flag className="h-3 w-3" />
                  {task.managerPriority}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              {task.attachments.length > 0 && (
                <div className="flex items-center">
                  <Paperclip className="mr-1 h-4 w-4" />
                  <span>{task.attachments.length}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {!task.needsHelp && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAskHelp}
                  className="h-8 w-8 p-0"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span className="sr-only">Ask for help</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 w-8 p-0"
              >
                <Link to={`/edit-task/${task.id}`}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TaskCard;
