
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Define user roles
export type UserRole = "team_member" | "manager";

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isManager: () => boolean;
}

// Mock users for demo purposes
const mockUsers = [
  {
    id: "1",
    name: "John Manager",
    email: "manager@example.com",
    password: "password",
    role: "manager" as UserRole,
    profileImage: "https://ui-avatars.com/api/?name=John+Manager&background=0D8ABC&color=fff"
  },
  {
    id: "2",
    name: "Alice Member",
    email: "alice@example.com",
    password: "password",
    role: "team_member" as UserRole,
    profileImage: "https://ui-avatars.com/api/?name=Alice+Member&background=C152D4&color=fff"
  },
  {
    id: "3",
    name: "Bob Member",
    email: "bob@example.com",
    password: "password",
    role: "team_member" as UserRole,
    profileImage: "https://ui-avatars.com/api/?name=Bob+Member&background=8CC152&color=fff"
  }
];

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from local storage on mount
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("You have been logged out");
  };

  // Check if user is a manager
  const isManager = () => {
    return user?.role === "manager";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isManager }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
