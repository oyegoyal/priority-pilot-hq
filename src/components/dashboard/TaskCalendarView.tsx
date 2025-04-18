
import React, { useState } from "react";
import { Task } from "@/contexts/TaskContext";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskCard from "@/components/TaskCard";
import { format, isSameDay, addDays } from "date-fns";

interface TaskCalendarViewProps {
  tasks: Task[];
}

const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({ tasks }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get tasks for the selected date
  const tasksForSelectedDate = selectedDate
    ? tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return isSameDay(dueDate, selectedDate);
      })
    : [];
  
  // Helper function to highlight dates with tasks
  const getDateClassNames = (date: Date) => {
    const hasTasksDue = tasks.some(task => {
      const dueDate = new Date(task.dueDate);
      return isSameDay(dueDate, date);
    });
    
    return hasTasksDue ? "bg-primary/20 text-primary font-bold" : "";
  };

  // Get dates for the next 7 days
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Task Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto"
              modifiers={{
                highlighted: date => getDateClassNames(date) !== "",
              }}
              modifiersClassNames={{
                highlighted: "bg-primary/20 text-primary font-bold",
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Upcoming Due Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {next7Days.map(date => {
                const tasksForDay = tasks.filter(task => 
                  isSameDay(new Date(task.dueDate), date)
                );
                
                return (
                  <div 
                    key={date.toISOString()} 
                    className={`p-2 rounded-md cursor-pointer hover:bg-accent ${
                      selectedDate && isSameDay(date, selectedDate) ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {format(date, 'EEE, MMM d')}
                      </div>
                      {tasksForDay.length > 0 && (
                        <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-semibold">
                          {tasksForDay.length}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'No date selected'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasksForSelectedDate.length > 0 ? (
                tasksForSelectedDate.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  No tasks due on this date
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskCalendarView;
