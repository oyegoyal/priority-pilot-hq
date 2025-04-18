
import React, { useState } from "react";
import { useTask, Task } from "@/contexts/TaskContext";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const CalendarView: React.FC = () => {
  const { getUserTasks } = useTask();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Get all tasks for the current user
  const tasks = getUserTasks();

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    const dateStr = task.dueDate;
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const getTasksForSelectedDate = () => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return tasksByDate[dateStr] || [];
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
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

  // Custom day component to show dot for days with tasks
  const dayWithTasks = (day: Date, selectedDate: Date) => {
    const dateStr = day.toISOString().split("T")[0];
    const hasTasks = tasksByDate[dateStr] && tasksByDate[dateStr].length > 0;
    const isSelected = day.toDateString() === selectedDate?.toDateString();
    const isToday =
      day.toDateString() === new Date().toDateString() && !isSelected;

    return (
      <div className="relative">
        <div
          className={cn(
            "h-8 w-8 p-0 font-normal",
            isSelected && "bg-primary text-primary-foreground",
            isToday && "border border-primary"
          )}
        >
          <time dateTime={dateStr}>{day.getDate()}</time>
        </div>
        {hasTasks && (
          <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"></div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Calendar</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card>
          <CardContent className="p-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              components={{
                Day: ({ day, ...props }) =>
                  dayWithTasks(day, date || new Date()),
              }}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">
            {date
              ? new Intl.DateTimeFormat("en-US", {
                  dateStyle: "full",
                }).format(date)
              : "Select a date"}
          </h2>

          {getTasksForSelectedDate().length === 0 ? (
            <p className="text-muted-foreground">No tasks for this date</p>
          ) : (
            <div className="space-y-3">
              {getTasksForSelectedDate().map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-3">
                    <Link
                      to={`/task/${task.id}`}
                      className="block hover:opacity-70"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3
                            className={cn(
                              "font-medium",
                              task.isCompleted && "line-through"
                            )}
                          >
                            {task.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {task.description}
                          </p>
                        </div>
                        <Badge className={getPriorityColor(task.userPriority)}>
                          {task.userPriority.charAt(0).toUpperCase() +
                            task.userPriority.slice(1)}
                        </Badge>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
