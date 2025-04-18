import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

// Task priority types
export type TaskPriority = "low" | "medium" | "high" | "urgent";

// Task attachment types
export type AttachmentType = "file" | "link" | "email";

// Attachment interface
export interface Attachment {
  id: string;
  type: AttachmentType;
  name: string;
  url: string;
  createdAt: string;
}

// Task interface
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  userPriority: TaskPriority;
  managerPriority?: TaskPriority;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  attachments: Attachment[];
  isCompleted: boolean;
  status: "todo" | "in_progress" | "done";
  needsHelp: boolean;
}

// State interface
interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

// Action types
type TaskAction =
  | { type: "FETCH_TASKS_SUCCESS"; payload: Task[] }
  | { type: "FETCH_TASKS_ERROR"; payload: string }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "COMPLETE_TASK"; payload: string }
  | { type: "ADD_ATTACHMENT"; payload: { taskId: string; attachment: Attachment } }
  | { type: "REMOVE_ATTACHMENT"; payload: { taskId: string; attachmentId: string } }
  | { type: "SET_MANAGER_PRIORITY"; payload: { taskId: string; priority: TaskPriority } };

// Initial state
const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Create some mock data for demo purposes
const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

const mockTasks: Task[] = [
  {
    id: "1",
    userId: "1", // Manager
    title: "Prepare weekly report",
    description: "Compile team progress and prepare slides for weekly meeting",
    userPriority: "high",
    dueDate: tomorrow,
    createdAt: today,
    attachments: [
      {
        id: "a1",
        type: "file",
        name: "report-template.docx",
        url: "#",
        createdAt: today,
      },
    ],
    isCompleted: false,
    status: "todo",
    needsHelp: false
  },
  {
    id: "2",
    userId: "2", // Alice
    title: "Design new landing page",
    description: "Create mockups for the new product landing page",
    userPriority: "medium",
    managerPriority: "high",
    dueDate: nextWeek,
    createdAt: yesterday,
    attachments: [],
    isCompleted: false,
    status: "todo",
    needsHelp: false
  },
  {
    id: "3",
    userId: "2", // Alice
    title: "Fix login bug",
    description: "Users reported issues with login redirect",
    userPriority: "high",
    managerPriority: "urgent",
    dueDate: today,
    createdAt: yesterday,
    attachments: [
      {
        id: "a2",
        type: "link",
        name: "Bug report",
        url: "https://github.com/issues/123",
        createdAt: yesterday,
      },
    ],
    isCompleted: false,
    status: "todo",
    needsHelp: false
  },
  {
    id: "4",
    userId: "3", // Bob
    title: "Update documentation",
    description: "Update the API documentation with new endpoints",
    userPriority: "low",
    managerPriority: "medium",
    dueDate: nextWeek,
    createdAt: today,
    attachments: [],
    isCompleted: false,
    status: "todo",
    needsHelp: false
  },
  {
    id: "5",
    userId: "3", // Bob
    title: "Implement search feature",
    description: "Add search functionality to the dashboard",
    userPriority: "medium",
    dueDate: tomorrow,
    createdAt: yesterday,
    attachments: [
      {
        id: "a3",
        type: "email",
        name: "Feature requirements",
        url: "mailto:requirements@example.com",
        createdAt: yesterday,
      },
    ],
    isCompleted: false,
    status: "todo",
    needsHelp: false
  },
];

// Helper function to persist tasks to localStorage
const saveTasks = (tasks: Task[]) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Helper function to load tasks from localStorage
const loadTasks = (): Task[] => {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : mockTasks;
};

// Reducer function
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "FETCH_TASKS_SUCCESS":
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null,
      };
    case "FETCH_TASKS_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "ADD_TASK":
      const newTasks = [...state.tasks, action.payload];
      saveTasks(newTasks);
      return {
        ...state,
        tasks: newTasks,
      };
    case "UPDATE_TASK":
      const updatedTasks = state.tasks.map((task) =>
        task.id === action.payload.id ? action.payload : task
      );
      saveTasks(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks,
      };
    case "DELETE_TASK":
      const filteredTasks = state.tasks.filter((task) => task.id !== action.payload);
      saveTasks(filteredTasks);
      return {
        ...state,
        tasks: filteredTasks,
      };
    case "COMPLETE_TASK":
      const completedTasks = state.tasks.map((task) => {
        if (task.id === action.payload) {
          return {
            ...task,
            isCompleted: true,
            completedAt: new Date().toISOString(),
          };
        }
        return task;
      });
      saveTasks(completedTasks);
      return {
        ...state,
        tasks: completedTasks,
      };
    case "ADD_ATTACHMENT":
      const tasksWithAttachment = state.tasks.map((task) => {
        if (task.id === action.payload.taskId) {
          return {
            ...task,
            attachments: [...task.attachments, action.payload.attachment],
          };
        }
        return task;
      });
      saveTasks(tasksWithAttachment);
      return {
        ...state,
        tasks: tasksWithAttachment,
      };
    case "REMOVE_ATTACHMENT":
      const tasksWithoutAttachment = state.tasks.map((task) => {
        if (task.id === action.payload.taskId) {
          return {
            ...task,
            attachments: task.attachments.filter(
              (a) => a.id !== action.payload.attachmentId
            ),
          };
        }
        return task;
      });
      saveTasks(tasksWithoutAttachment);
      return {
        ...state,
        tasks: tasksWithoutAttachment,
      };
    case "SET_MANAGER_PRIORITY":
      const tasksWithManagerPriority = state.tasks.map((task) => {
        if (task.id === action.payload.taskId) {
          return {
            ...task,
            managerPriority: action.payload.priority,
          };
        }
        return task;
      });
      saveTasks(tasksWithManagerPriority);
      return {
        ...state,
        tasks: tasksWithManagerPriority,
      };
    default:
      return state;
  }
};

// Task context interface
interface TaskContextType {
  state: TaskState;
  getUserTasks: () => Task[];
  getAllUserTasks: () => Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "isCompleted" | "attachments">) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  addAttachment: (taskId: string, attachment: Omit<Attachment, "id" | "createdAt">) => void;
  removeAttachment: (taskId: string, attachmentId: string) => void;
  setManagerPriority: (taskId: string, priority: TaskPriority) => void;
  getTaskById: (taskId: string) => Task | undefined;
  rolloverIncompleteTasks: () => void;
}

// Create the context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Task provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks on mount and when user changes
  useEffect(() => {
    if (user) {
      const tasks = loadTasks();
      dispatch({ type: "FETCH_TASKS_SUCCESS", payload: tasks });
    }
  }, [user]);

  // Get tasks for the current user
  const getUserTasks = () => {
    if (!user) return [];
    return state.tasks.filter((task) => task.userId === user.id);
  };

  // Get all user tasks (for managers)
  const getAllUserTasks = () => {
    return state.tasks;
  };

  // Get task by ID
  const getTaskById = (taskId: string) => {
    return state.tasks.find((task) => task.id === taskId);
  };

  // Add a new task
  const addTask = (task: Omit<Task, "id" | "createdAt" | "isCompleted" | "attachments">) => {
    if (!user) return;
    
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      isCompleted: false,
      attachments: [],
      status: "todo",
      needsHelp: false
    };
    
    dispatch({ type: "ADD_TASK", payload: newTask });
    toast.success("Task added successfully");
  };

  // Update a task
  const updateTask = (task: Task) => {
    dispatch({ type: "UPDATE_TASK", payload: task });
    toast.success("Task updated successfully");
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    dispatch({ type: "DELETE_TASK", payload: taskId });
    toast.success("Task deleted successfully");
  };

  // Complete a task
  const completeTask = (taskId: string) => {
    dispatch({ type: "COMPLETE_TASK", payload: taskId });
    toast.success("Task marked as complete");
  };

  // Add an attachment
  const addAttachment = (
    taskId: string,
    attachment: Omit<Attachment, "id" | "createdAt">
  ) => {
    const newAttachment: Attachment = {
      ...attachment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    dispatch({
      type: "ADD_ATTACHMENT",
      payload: { taskId, attachment: newAttachment },
    });
    
    toast.success("Attachment added successfully");
  };

  // Remove an attachment
  const removeAttachment = (taskId: string, attachmentId: string) => {
    dispatch({
      type: "REMOVE_ATTACHMENT",
      payload: { taskId, attachmentId },
    });
    
    toast.success("Attachment removed successfully");
  };

  // Set manager priority
  const setManagerPriority = (taskId: string, priority: TaskPriority) => {
    dispatch({
      type: "SET_MANAGER_PRIORITY",
      payload: { taskId, priority },
    });
    
    toast.success("Manager priority set successfully");
  };

  // Rollover incomplete tasks to next day
  const rolloverIncompleteTasks = () => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    
    const updatedTasks = state.tasks.map((task) => {
      if (!task.isCompleted && task.dueDate <= yesterday) {
        return {
          ...task,
          dueDate: today,
        };
      }
      return task;
    });
    
    saveTasks(updatedTasks);
    dispatch({ type: "FETCH_TASKS_SUCCESS", payload: updatedTasks });
    toast.info("Incomplete tasks rolled over to today");
  };

  return (
    <TaskContext.Provider
      value={{
        state,
        getUserTasks,
        getAllUserTasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        addAttachment,
        removeAttachment,
        setManagerPriority,
        getTaskById,
        rolloverIncompleteTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the task context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
