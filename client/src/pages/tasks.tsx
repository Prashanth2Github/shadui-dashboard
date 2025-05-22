import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Clock,
  CheckCircle,
  CircleX,
  CalendarDays,
  Tag,
  MoreHorizontal,
  Trash2,
  Edit,
  Filter,
  ClipboardList,
  Calendar,
  Flag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

// Task interface
interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  category: string;
  isCompleted: boolean;
}

export default function Tasks() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "General",
    dueDate: "",
    priority: "medium",
    status: "todo"
  });

  // Mock task data
  useEffect(() => {
    setTimeout(() => {
      setTasks([
        {
          id: 1,
          title: "Prepare marketing presentation",
          description: "Create slides for the Q3 marketing strategy",
          status: "in-progress",
          priority: "high",
          dueDate: "2023-08-25",
          category: "Marketing",
          isCompleted: false
        },
        {
          id: 2,
          title: "Design new product logo",
          description: "Create a modern logo for our new mobile app",
          status: "todo",
          priority: "medium",
          dueDate: "2023-08-30",
          category: "Design",
          isCompleted: false
        },
        {
          id: 3,
          title: "Fix login page bug",
          description: "Address authentication issue in production",
          status: "completed",
          priority: "high",
          dueDate: "2023-08-15",
          category: "Development",
          isCompleted: true
        },
        {
          id: 4,
          title: "Update user documentation",
          description: "Revise PDF guide with new features",
          status: "todo",
          priority: "low",
          dueDate: "2023-09-10",
          category: "Documentation",
          isCompleted: false
        },
        {
          id: 5,
          title: "Conduct user interviews",
          description: "Schedule and conduct interviews for user research",
          status: "in-progress",
          priority: "medium",
          dueDate: "2023-08-28",
          category: "Research",
          isCompleted: false
        },
        {
          id: 6,
          title: "Weekly team meeting",
          description: "Discuss progress and blockers",
          status: "completed",
          priority: "medium",
          dueDate: "2023-08-18",
          category: "General",
          isCompleted: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter tasks based on search term and tab
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "completed") return matchesSearch && task.isCompleted;
    if (activeTab === "pending") return matchesSearch && !task.isCompleted;
    
    return matchesSearch && task.status === activeTab;
  });

  // Sort tasks - upcoming due dates first, then by priority
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Completed tasks always at the bottom
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    
    // Sort by due date
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    
    if (dateA !== dateB) {
      return dateA - dateB;
    }
    
    // Sort by priority if dates are the same
    const priorityWeight = { high: 0, medium: 1, low: 2 };
    return priorityWeight[a.priority] - priorityWeight[b.priority];
  });

  // Handle add task
  const handleAddTask = () => {
    if (!newTask.title) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Task title is required."
      });
      return;
    }

    const id = Math.max(0, ...tasks.map(t => t.id)) + 1;
    
    const today = new Date();
    const dueDate = newTask.dueDate || new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0];
    
    const task: Task = {
      id,
      title: newTask.title,
      description: newTask.description || "",
      status: newTask.status as "todo" | "in-progress" | "completed",
      priority: newTask.priority as "low" | "medium" | "high",
      dueDate,
      category: newTask.category,
      isCompleted: newTask.status === "completed"
    };

    setTasks([...tasks, task]);
    setNewTask({ 
      title: "", 
      description: "", 
      category: "General", 
      dueDate: "",
      priority: "medium",
      status: "todo"
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Task Added",
      description: `"${task.title}" has been added to your tasks.`
    });
  };

  // Handle edit task
  const handleEditTask = () => {
    if (!selectedTask) return;
    
    // Update isCompleted based on status
    const updatedTask = {
      ...selectedTask,
      isCompleted: selectedTask.status === "completed"
    };
    
    const updatedTasks = tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    
    setTasks(updatedTasks);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Task Updated",
      description: `"${selectedTask.title}" has been updated.`
    });
  };

  // Handle delete task
  const handleDeleteTask = () => {
    if (!selectedTask) return;
    
    setTasks(tasks.filter(task => task.id !== selectedTask.id));
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Task Deleted",
      description: `"${selectedTask.title}" has been removed.`
    });
  };

  // Handle toggle completion
  const handleToggleComplete = (task: Task) => {
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { 
        ...t, 
        isCompleted: !t.isCompleted,
        status: !t.isCompleted ? "completed" : "todo"
      } : t
    );
    
    setTasks(updatedTasks);
    
    toast({
      title: task.isCompleted ? "Task Reopened" : "Task Completed",
      description: `"${task.title}" has been marked as ${task.isCompleted ? "pending" : "completed"}.`
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate days remaining
  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Generate status badge
  const getStatusBadge = (status: string, isOverdue: boolean) => {
    if (isOverdue && status !== "completed") {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          Overdue
        </Badge>
      );
    }
    
    switch (status) {
      case "todo":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            To Do
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  // Generate priority flag
  const getPriorityFlag = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <div className="flex items-center text-red-600 dark:text-red-400">
            <Flag className="h-4 w-4 mr-1" />
            <span>High</span>
          </div>
        );
      case "medium":
        return (
          <div className="flex items-center text-yellow-600 dark:text-yellow-400">
            <Flag className="h-4 w-4 mr-1" />
            <span>Medium</span>
          </div>
        );
      case "low":
        return (
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <Flag className="h-4 w-4 mr-1" />
            <span>Low</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Tasks">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Task Management
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-9 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </Button>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="todo">To Do</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
            
            <TabsContent value={activeTab}>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg">
                    {activeTab === "all" ? "All Tasks" : 
                     activeTab === "todo" ? "To Do" : 
                     activeTab === "in-progress" ? "In Progress" : 
                     activeTab === "completed" ? "Completed" : 
                     "Pending Tasks"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <AnimatePresence>
                    {loading ? (
                      // Loading skeletons
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {Array(5).fill(0).map((_, index) => (
                          <div key={`skeleton-${index}`} className="p-4 animate-pulse">
                            <div className="flex items-center">
                              <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
                              <div className="space-y-3 flex-1">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                              </div>
                              <div className="flex space-x-3">
                                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : sortedTasks.length > 0 ? (
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedTasks.map((task, index) => {
                          const isOverdue = getDaysRemaining(task.dueDate) < 0;
                          
                          return (
                            <motion.li 
                              key={task.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.05 }}
                              className={`p-4 ${task.isCompleted ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
                            >
                              <div className="flex items-start">
                                <Checkbox
                                  checked={task.isCompleted}
                                  onCheckedChange={() => handleToggleComplete(task)}
                                  id={`task-${task.id}`}
                                  className="mt-1"
                                />
                                <div className="ml-3 flex-1">
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                    <div>
                                      <label 
                                        htmlFor={`task-${task.id}`}
                                        className={`text-sm font-medium ${
                                          task.isCompleted 
                                            ? 'line-through text-gray-500 dark:text-gray-400' 
                                            : 'text-gray-900 dark:text-gray-100'
                                        }`}
                                      >
                                        {task.title}
                                      </label>
                                      
                                      {task.description && (
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                          {task.description}
                                        </p>
                                      )}
                                      
                                      <div className="mt-2 flex flex-wrap gap-2">
                                        {getStatusBadge(task.status, isOverdue)}
                                        
                                        <Badge variant="outline" className="flex items-center gap-1">
                                          <Tag className="h-3 w-3" />
                                          <span>{task.category}</span>
                                        </Badge>
                                        
                                        <Badge 
                                          variant="outline" 
                                          className={`flex items-center gap-1 ${
                                            isOverdue && !task.isCompleted 
                                              ? 'text-red-500 dark:text-red-400' 
                                              : ''
                                          }`}
                                        >
                                          <Calendar className="h-3 w-3" />
                                          <span>{formatDate(task.dueDate)}</span>
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center mt-3 sm:mt-0">
                                      <div className="mr-3 hidden sm:block">
                                        {getPriorityFlag(task.priority)}
                                      </div>
                                      
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem 
                                            onClick={() => {
                                              setSelectedTask(task);
                                              setIsEditDialogOpen(true);
                                            }}
                                            className="flex items-center cursor-pointer"
                                          >
                                            <Edit className="mr-2 h-4 w-4" />
                                            <span>Edit</span>
                                          </DropdownMenuItem>
                                          
                                          <DropdownMenuItem 
                                            onClick={() => handleToggleComplete(task)}
                                            className="flex items-center cursor-pointer"
                                          >
                                            {task.isCompleted ? (
                                              <>
                                                <CircleX className="mr-2 h-4 w-4" />
                                                <span>Mark as Pending</span>
                                              </>
                                            ) : (
                                              <>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                <span>Mark as Completed</span>
                                              </>
                                            )}
                                          </DropdownMenuItem>
                                          
                                          <DropdownMenuItem 
                                            onClick={() => {
                                              setSelectedTask(task);
                                              setIsDeleteDialogOpen(true);
                                            }}
                                            className="flex items-center text-red-600 dark:text-red-400 cursor-pointer"
                                          >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Delete</span>
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                          <ClipboardList className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No tasks found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {searchTerm ? 
                            `We couldn't find any tasks matching "${searchTerm}"` : 
                            "Get started by creating a new task"
                          }
                        </p>
                        <div className="mt-6">
                          <Button 
                            onClick={() => setIsAddDialogOpen(true)}
                            className="flex items-center gap-1 mx-auto"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Task</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* Add Task Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Enter task details below. Click add when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input 
                id="task-title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Write a blog post"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-description">Description (Optional)</Label>
              <Input 
                id="task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Brief description of the task"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-status">Status</Label>
                <select
                  id="task-status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newTask.status}
                  onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-priority">Priority</Label>
                <select
                  id="task-priority"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-category">Category</Label>
                <select
                  id="task-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                >
                  <option value="General">General</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Research">Research</option>
                  <option value="Documentation">Documentation</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-duedate">Due Date</Label>
                <Input 
                  id="task-duedate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Task Title</Label>
                <Input 
                  id="edit-title"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input 
                  id="edit-description"
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedTask.status}
                    onChange={(e) => setSelectedTask({
                      ...selectedTask, 
                      status: e.target.value as "todo" | "in-progress" | "completed"
                    })}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <select
                    id="edit-priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedTask.priority}
                    onChange={(e) => setSelectedTask({
                      ...selectedTask, 
                      priority: e.target.value as "low" | "medium" | "high"
                    })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <select
                    id="edit-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedTask.category}
                    onChange={(e) => setSelectedTask({...selectedTask, category: e.target.value})}
                  >
                    <option value="General">General</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Research">Research</option>
                    <option value="Documentation">Documentation</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-duedate">Due Date</Label>
                  <Input 
                    id="edit-duedate"
                    type="date"
                    value={selectedTask.dueDate}
                    onChange={(e) => setSelectedTask({...selectedTask, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="edit-completed"
                  checked={selectedTask.isCompleted}
                  onCheckedChange={(checked) => {
                    setSelectedTask({
                      ...selectedTask, 
                      isCompleted: checked as boolean,
                      status: checked ? "completed" : "todo"
                    });
                  }}
                />
                <label
                  htmlFor="edit-completed"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark as completed
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Task Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                You are about to delete the following task:
              </p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{selectedTask.title}</h3>
                {selectedTask.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedTask.description}</p>
                )}
                <div className="flex items-center mt-3">
                  <Badge className="mr-2">
                    {selectedTask.status === "todo" ? "To Do" : 
                    selectedTask.status === "in-progress" ? "In Progress" : 
                    "Completed"}
                  </Badge>
                  <span className="text-xs text-gray-500">{formatDate(selectedTask.dueDate)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTask}>Delete Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}