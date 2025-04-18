
import React, { useState, useEffect } from "react";
import { useTask, Task } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

// Mock team members data (would come from a proper API in a real app)
const teamMembers: TeamMember[] = [
  {
    id: "2",
    name: "Alice Member",
    email: "alice@example.com",
    profileImage: "https://ui-avatars.com/api/?name=Alice+Member&background=C152D4&color=fff",
  },
  {
    id: "3",
    name: "Bob Member",
    email: "bob@example.com",
    profileImage: "https://ui-avatars.com/api/?name=Bob+Member&background=8CC152&color=fff",
  },
];

const TeamView: React.FC = () => {
  const { getAllUserTasks, setManagerPriority } = useTask();
  const { isManager } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // Redirect if not manager
  if (!isManager()) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  // Get all tasks
  const allTasks = getAllUserTasks();

  // Filter tasks based on search term and selected team member
  useEffect(() => {
    let filtered = allTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Only show tasks from team members (not manager's own tasks)
    filtered = filtered.filter((task) => task.userId !== "1");

    // Filter by selected team member if any
    if (selectedTeamMember) {
      filtered = filtered.filter((task) => task.userId === selectedTeamMember);
    }

    // Only show incomplete tasks
    filtered = filtered.filter((task) => !task.isCompleted);

    // Sort by due date (soonest first)
    filtered.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    setFilteredTasks(filtered);
  }, [allTasks, searchTerm, selectedTeamMember]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle team member selection
  const handleTeamMemberChange = (value: string) => {
    setSelectedTeamMember(value === "all" ? null : value);
  };

  // Handle manager priority change
  const handlePriorityChange = (taskId: string, priority: string) => {
    if (priority === "none") {
      // Remove manager priority
      const task = allTasks.find((t) => t.id === taskId);
      if (task) {
        const updatedTask = { ...task };
        delete updatedTask.managerPriority;
        setManagerPriority(taskId, undefined as any);
      }
    } else {
      setManagerPriority(taskId, priority as any);
    }
  };

  // Get team member by ID
  const getTeamMember = (id: string) => {
    return teamMembers.find((member) => member.id === id);
  };

  // Get priority color and label
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

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Team Tasks</h1>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        <div>
          <Select
            value={selectedTeamMember || "all"}
            onValueChange={handleTeamMemberChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Team Member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Team Members</SelectItem>
              {teamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Team Tasks Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <h3 className="text-lg font-semibold">No tasks found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm
                  ? "Try a different search term"
                  : selectedTeamMember
                  ? "This team member has no active tasks"
                  : "Your team has no active tasks"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Task</TableHead>
                  <TableHead>Team Member</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>User Priority</TableHead>
                  <TableHead>Manager Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => {
                  const teamMember = getTeamMember(task.userId);
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        <Link
                          to={`/task/${task.id}`}
                          className="hover:underline"
                        >
                          {task.title}
                        </Link>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {task.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        {teamMember && (
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={teamMember.profileImage}
                                alt={teamMember.name}
                              />
                              <AvatarFallback>
                                {teamMember.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{teamMember.name}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "inline-flex items-center",
                            getPriorityColor(task.userPriority)
                          )}
                        >
                          {task.userPriority.charAt(0).toUpperCase() +
                            task.userPriority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={task.managerPriority || "none"}
                          onValueChange={(value) =>
                            handlePriorityChange(task.id, value)
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Set priority">
                              {task.managerPriority ? (
                                <div className="flex items-center space-x-1">
                                  <Flag className="h-3.5 w-3.5" />
                                  <span>
                                    {task.managerPriority.charAt(0).toUpperCase() +
                                      task.managerPriority.slice(1)}
                                  </span>
                                </div>
                              ) : (
                                "None"
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Priority</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamView;
