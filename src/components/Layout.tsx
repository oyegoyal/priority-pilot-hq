
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import { 
  CheckSquare, 
  ListTodo, 
  Users, 
  Calendar, 
  BarChart, 
  Settings, 
  LogOut,
  PlusCircle
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const AppSidebar = () => {
  const { user, logout, isManager } = useAuth();
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
      </SidebarFooter>
    </Sidebar>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

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
      </div>
    </SidebarProvider>
  );
};

export default Layout;
