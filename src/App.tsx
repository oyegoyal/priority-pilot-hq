
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TaskProvider } from "@/contexts/TaskContext";
import AuthRoute from "@/components/AuthRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CompletedTasks from "./pages/CompletedTasks";
import CalendarView from "./pages/CalendarView";
import TeamView from "./pages/TeamView";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";
import TaskDetail from "./pages/TaskDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TaskProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route
                path="/"
                element={
                  <AuthRoute>
                    <Dashboard />
                  </AuthRoute>
                }
              />
              
              <Route
                path="/completed"
                element={
                  <AuthRoute>
                    <CompletedTasks />
                  </AuthRoute>
                }
              />
              
              <Route
                path="/calendar"
                element={
                  <AuthRoute>
                    <CalendarView />
                  </AuthRoute>
                }
              />
              
              <Route
                path="/team"
                element={
                  <AuthRoute>
                    <TeamView />
                  </AuthRoute>
                }
              />
              
              <Route
                path="/reports"
                element={
                  <AuthRoute>
                    <Reports />
                  </AuthRoute>
                }
              />
              
              <Route
                path="/settings"
                element={
                  <AuthRoute>
                    <Settings />
                  </AuthRoute>
                }
              />
              
              <Route
                path="/add-task"
                element={
                  <AuthRoute>
                    <AddTask />
                  </AuthRoute>
                }
              />
              
              <Route
                path="/edit-task/:taskId"
                element={
                  <AuthRoute>
                    <EditTask />
                  </AuthRoute>
                }
              />
              
              <Route
                path="/task/:taskId"
                element={
                  <AuthRoute>
                    <TaskDetail />
                  </AuthRoute>
                }
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TaskProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
