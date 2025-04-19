
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task, useTask } from '@/contexts/TaskContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HelpRequiredSidebarProps {
  tasks: Task[];
}

const HelpRequiredSidebar: React.FC<HelpRequiredSidebarProps> = ({ tasks }) => {
  const { updateTask } = useTask();
  const helpNeededTasks = tasks.filter(task => task.needsHelp && !task.isCompleted);
  
  if (helpNeededTasks.length === 0) return null;
  
  const handleResolveHelp = (task: Task) => {
    updateTask({ ...task, needsHelp: false });
  };
  
  return (
    <div className={cn(
      "fixed right-4 top-20 w-64 rounded-lg p-4 shadow-lg z-50 animate-fade-in",
      "bg-card border border-border",
      "dark:bg-card/95 dark:backdrop-blur-sm"
    )}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center text-foreground">
          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
          Help Requested
        </h3>
        <Badge variant="secondary">{helpNeededTasks.length}</Badge>
      </div>
      <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {helpNeededTasks.map(task => (
          <div 
            key={task.id} 
            className={cn(
              "p-3 rounded border animate-fade-in",
              "bg-background/50 hover:bg-background/80 transition-colors",
              "dark:bg-background/30 dark:hover:bg-background/40"
            )}
          >
            <div className="flex justify-between items-start">
              <Link 
                to={`/task/${task.id}`} 
                className="font-medium text-sm hover:underline text-foreground"
              >
                {task.title}
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={() => handleResolveHelp(task)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-muted-foreground">From:</span>
              <span className="ml-1 font-medium text-foreground">
                {task.userId === "2" ? "Alice" : task.userId === "3" ? "Bob" : "Unknown"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpRequiredSidebar;
