
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, TaskPriority, useTask } from "@/contexts/TaskContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Define the form schema
const taskSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  userPriority: z.enum(["low", "medium", "high", "urgent"] as const),
  dueDate: z.string().min(1, {
    message: "Please select a due date.",
  }),
});

interface TaskFormProps {
  task?: Task;
  isEdit?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, isEdit = false }) => {
  const { addTask, updateTask } = useTask();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format for the date input
  const today = new Date().toISOString().split("T")[0];

  // Initialize form with default values or existing task values
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      userPriority: task?.userPriority || "medium",
      dueDate: task?.dueDate || today,
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof taskSchema>) => {
    if (isEdit && task) {
      // Update existing task
      updateTask({
        ...task,
        ...values,
      });
    } else {
      // Add new task with userId included
      addTask({
        title: values.title,
        description: values.description,
        userPriority: values.userPriority as TaskPriority,
        dueDate: values.dueDate,
        userId: user?.id || "", // Add the userId from the auth context
        status: "todo", // Add default status
        needsHelp: false // Add default needsHelp value
      });
    }
    navigate("/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormDescription>
                A short title for your task.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter task details"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about the task.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="userPriority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Set the priority level for this task.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" min={today} {...field} />
                </FormControl>
                <FormDescription>
                  When should this task be completed?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
