
import React, { useState } from "react";
import { Task, useTask, TaskPriority } from "@/contexts/TaskContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Check, Edit, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TasksTableProps {
  tasks: Task[];
  editable?: boolean;
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks, editable = false }) => {
  const { updateTask } = useTask();
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Partial<Task>>({});

  const handleAskHelp = (taskId: string, currentNeedsHelp: boolean) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      updateTask({ ...task, needsHelp: !currentNeedsHelp });
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditedValues({
      title: task.title,
      description: task.description,
      userPriority: task.userPriority,
      dueDate: task.dueDate,
      status: task.status
    });
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditedValues({});
  };

  const saveEditing = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && editedValues) {
      updateTask({ ...task, ...editedValues });
      setEditingTask(null);
      setEditedValues({});
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedValues({ ...editedValues, [field]: value });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "text-red-500";
      case "in_progress":
        return "text-blue-500";
      case "done":
        return "text-green-500";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Est. Completion</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Help Required</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">
                {editingTask === task.id ? (
                  <Input 
                    value={editedValues.title || ''} 
                    onChange={(e) => handleInputChange('title', e.target.value)} 
                    className="w-full"
                  />
                ) : (
                  <Link to={`/task/${task.id}`} className="hover:underline">
                    {task.title}
                  </Link>
                )}
              </TableCell>
              <TableCell className="max-w-xs">
                {editingTask === task.id ? (
                  <Input 
                    value={editedValues.description || ''} 
                    onChange={(e) => handleInputChange('description', e.target.value)} 
                    className="w-full"
                  />
                ) : (
                  <p className="truncate">{task.description}</p>
                )}
              </TableCell>
              <TableCell>
                {editingTask === task.id ? (
                  <Select 
                    value={editedValues.userPriority || task.userPriority} 
                    onValueChange={(value) => handleInputChange('userPriority', value as TaskPriority)}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={getPriorityColor(task.userPriority)}>
                    {task.userPriority.charAt(0).toUpperCase() +
                      task.userPriority.slice(1)}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {new Date(task.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {editingTask === task.id ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[130px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editedValues.dueDate ? format(new Date(editedValues.dueDate), 'PP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editedValues.dueDate ? new Date(editedValues.dueDate) : undefined}
                        onSelect={(date) => handleInputChange('dueDate', date ? date.toISOString().split('T')[0] : '')}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  new Date(task.dueDate).toLocaleDateString()
                )}
              </TableCell>
              <TableCell>
                {editingTask === task.id ? (
                  <Select 
                    value={editedValues.status || task.status} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className={getStatusColor(task.status)}>
                    {task.status.replace("_", " ").charAt(0).toUpperCase() +
                      task.status.replace("_", " ").slice(1)}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant={task.needsHelp ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleAskHelp(task.id, task.needsHelp)}
                >
                  {task.needsHelp ? "Help Requested" : "Ask for Help"}
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {editingTask === task.id ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => saveEditing(task.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={cancelEditing}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    editable ? (
                      <Button variant="outline" size="sm" onClick={() => startEditing(task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/edit-task/${task.id}`}>Edit</Link>
                      </Button>
                    )
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TasksTable;
