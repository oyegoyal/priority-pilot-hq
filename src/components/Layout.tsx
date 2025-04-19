
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { 
  CheckSquare, 
  ListTodo, 
  Users, 
  Calendar, 
  BarChart, 
  Settings, 
  LogOut,
  PlusCircle,
  Sun,
  Moon,
  AlertTriangle,
  X,
  CalendarIcon
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTask, Task } from "@/contexts/TaskContext";
import { format } from "date-fns";

interface LayoutProps {
  children: React.ReactNode;
}

const HelpRequiredSidebar = () => {
  const { getAllUserTasks, updateTask } = useTask();
  const allTasks = getAllUserTasks();
  const helpNeededTasks = allTasks.filter(task => task.needsHelp && !task.isCompleted);
  
  const handleResolveHelp = (task: Task) => {
    updateTask({ ...task, needsHelp: false });
  };
  
  if (helpNeededTasks.length === 0) return null;
  
  return (
    <div className="fixed right-4 top-20 w-64 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-yellow-800 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Help Requested
        </h3>
        <Badge className="bg-yellow-200 text-yellow-800">{helpNeededTasks.length}</Badge>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {helpNeededTasks.map(task => (
          <div key={task.id} className="bg-white p-3 rounded border border-yellow-100">
            <div className="flex justify-between">
              <Link to={`/task/${task.id}`} className="font-medium text-sm hover:underline">
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
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-muted-foreground">From:</span>
              <span className="ml-1 font-medium">
                {task.userId === "2" ? "Alice" : task.userId === "3" ? "Bob" : "Unknown"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AppSidebar = () => {
  const { user, logout, isManager } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  if (!user) return null;

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-4">
        <div className="flex items-center space-x-2">
          <div className="bg-primary rounded-md p-1">
            <CheckSquare className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">PriorityPilot</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tasks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/"}>
                  <Link to="/" className="flex items-center space-x-3">
                    <ListTodo className="h-5 w-5" />
                    <span>My Tasks</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/completed"}>
                  <Link to="/completed" className="flex items-center space-x-3">
                    <CheckSquare className="h-5 w-5" />
                    <span>Completed</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/calendar"}>
                  <Link to="/calendar" className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5" />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {isManager() && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/team"}>
                    <Link to="/team" className="flex items-center space-x-3">
                      <Users className="h-5 w-5" />
                      <span>Team View</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {isManager() && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/reports"}>
                    <Link to="/reports" className="flex items-center space-x-3">
                      <BarChart className="h-5 w-5" />
                      <span>Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/settings"}>
                  <Link to="/settings" className="flex items-center space-x-3">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">{user.name}</span>
              <span className="text-xs text-sidebar-foreground/70">{user.role === "manager" ? "Manager" : "Team Member"}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleTheme} 
                    className="text-sidebar-foreground hover:text-sidebar-foreground/70"
                  >
                    {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{theme === "light" ? "Dark mode" : "Light mode"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={logout} className="text-sidebar-foreground hover:text-sidebar-foreground/70">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isManager } = useAuth();
  const { getAllUserTasks } = useTask();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Effect to open dialog when clicking on task
  useEffect(() => {
    const handleTaskClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const taskLink = target.closest('a[href^="/task/"]');
      
      if (taskLink && !target.closest('button')) {
        e.preventDefault();
        const taskId = taskLink.getAttribute('href')?.split('/').pop();
        
        if (taskId) {
          const allTasks = getAllUserTasks();
          const task = allTasks.find(t => t.id === taskId);
          
          if (task) {
            setSelectedTask(task);
            setDialogOpen(true);
          }
        }
      }
    };
    
    document.addEventListener('click', handleTaskClick);
    
    return () => {
      document.removeEventListener('click', handleTaskClick);
    };
  }, [getAllUserTasks]);

  if (!user) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="container py-6">
            <div className="mb-4 flex items-center justify-between">
              <SidebarTrigger />
              <div className="ml-auto">
                <Link to="/add-task">
                  <Button className="flex items-center space-x-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Task</span>
                  </Button>
                </Link>
              </div>
            </div>
            {children}
          </div>
        </main>
        
        {isManager() && <HelpRequiredSidebar />}
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedTask?.title}</DialogTitle>
              <DialogDescription>
                {selectedTask?.description}
              </DialogDescription>
            </DialogHeader>
            {selectedTask && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={selectedTask.status}
                      onValueChange={(value) => {
                        setSelectedTask({...selectedTask, status: value as any});
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={selectedTask.userPriority}
                      onValueChange={(value) => {
                        setSelectedTask({...selectedTask, userPriority: value as any});
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(new Date(selectedTask.dueDate), 'PP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(selectedTask.dueDate)}
                        onSelect={(date) => {
                          if (date) {
                            setSelectedTask({
                              ...selectedTask, 
                              dueDate: date.toISOString().split('T')[0]
                            });
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    if (selectedTask) {
                      updateTask(selectedTask);
                      setDialogOpen(false);
                    }
                  }}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
