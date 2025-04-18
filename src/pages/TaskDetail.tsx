
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTask } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Edit,
  ArrowLeft,
  Trash2,
  CheckSquare,
} from "lucide-react";
import AttachmentList from "@/components/AttachmentList";
import AddAttachment from "@/components/AddAttachment";
import ManagerPriority from "@/components/ManagerPriority";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { getTaskById, completeTask, deleteTask } = useTask();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!taskId) {
    navigate("/");
    return null;
  }

  const task = getTaskById(taskId);

  if (!task) {
    navigate("/");
    return null;
  }

  // Check if the user is allowed to view this task
  if (user?.id !== task.userId && user?.role !== "manager") {
    navigate("/");
    return null;
  }

  const handleComplete = () => {
    completeTask(task.id);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    navigate("/");
  };

  // Format dates
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get priority color class
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-task-low/10 text-task-low border-task-low/20";
      case "medium":
        return "bg-task-medium/10 text-task-medium border-task-medium/20";
      case "high":
        return "bg-task-high/10 text-task-high border-task-high/20";
      case "urgent":
        return "bg-task-urgent/10 text-task-urgent border-task-urgent/20";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate days pending
  const getDaysPending = () => {
    const created = new Date(task.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="flex items-center space-x-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>Due: {formatDate(task.dueDate)}</span>
                  </div>
                  {!task.isCompleted && (
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{getDaysPending()} days pending</span>
                    </div>
                  )}
                  {task.isCompleted && task.completedAt && (
                    <div className="flex items-center">
                      <CheckSquare className="mr-1 h-4 w-4 text-green-600" />
                      <span>
                        Completed: {formatDate(task.completedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2">
              <Badge className={getPriorityColor(task.userPriority)}>
                Priority: {task.userPriority.charAt(0).toUpperCase() + task.userPriority.slice(1)}
              </Badge>
              {task.isCompleted && (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Description</h3>
            <p className="mt-2 whitespace-pre-line">{task.description}</p>
          </div>

          <Separator />

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium">Attachments</h3>
              <div className="mt-4 space-y-4">
                <AttachmentList taskId={task.id} attachments={task.attachments} />
                {!task.isCompleted && (
                  <AddAttachment taskId={task.id} />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Priority Settings</h3>
              <div className="mt-4 space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">User Priority</p>
                  <div className="rounded-md bg-secondary p-2 text-sm">
                    {task.userPriority.charAt(0).toUpperCase() + task.userPriority.slice(1)}
                  </div>
                </div>

                <ManagerPriority task={task} />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            {!task.isCompleted && (
              <Button
                variant="outline"
                className="text-green-600"
                onClick={handleComplete}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Mark as Complete
              </Button>
            )}
          </div>

          <div className="flex space-x-2">
            {!task.isCompleted && (
              <Button variant="outline" asChild>
                <Link to={`/edit-task/${task.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the task and all of its
                    attachments. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TaskDetail;
