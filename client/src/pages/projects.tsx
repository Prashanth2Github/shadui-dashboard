import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Search, 
  Plus, 
  Clock, 
  Users, 
  BarChart, 
  Tag, 
  Calendar,
  MoreHorizontal,
  Star,
  Trash2,
  Edit,
  Filter,
  ArrowUpDown,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";

// Project interface
interface Project {
  id: number;
  name: string;
  description: string;
  status: "active" | "completed" | "on-hold";
  progress: number;
  dueDate: string;
  team: {
    name: string;
    avatarColor: string;
  }[];
  category: string;
  priority: "low" | "medium" | "high";
  isFavorite: boolean;
}

export default function Projects() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [sortField, setSortField] = useState<keyof Project>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    category: "Development",
    dueDate: "",
    priority: "medium"
  });

  // Mock project data
  useEffect(() => {
    setTimeout(() => {
      setProjects([
        {
          id: 1,
          name: "Website Redesign",
          description: "Redesign company website with modern UI/UX",
          status: "active",
          progress: 65,
          dueDate: "2023-09-15",
          team: [
            { name: "John Doe", avatarColor: "blue" },
            { name: "Sarah Kim", avatarColor: "green" },
            { name: "Robert Chen", avatarColor: "purple" }
          ],
          category: "Design",
          priority: "high",
          isFavorite: true
        },
        {
          id: 2,
          name: "Mobile App Development",
          description: "Create iOS and Android versions of our product",
          status: "active",
          progress: 35,
          dueDate: "2023-10-20",
          team: [
            { name: "Emma Wilson", avatarColor: "red" },
            { name: "Michael Brown", avatarColor: "orange" }
          ],
          category: "Development",
          priority: "high",
          isFavorite: false
        },
        {
          id: 3,
          name: "Marketing Campaign",
          description: "Q3 digital marketing campaign for new product launch",
          status: "on-hold",
          progress: 20,
          dueDate: "2023-09-30",
          team: [
            { name: "Alex Johnson", avatarColor: "blue" },
            { name: "Jessica Lee", avatarColor: "purple" }
          ],
          category: "Marketing",
          priority: "medium",
          isFavorite: false
        },
        {
          id: 4,
          name: "Data Analysis Project",
          description: "Analyze customer behavior patterns to improve retention",
          status: "completed",
          progress: 100,
          dueDate: "2023-08-10",
          team: [
            { name: "David Wang", avatarColor: "green" }
          ],
          category: "Research",
          priority: "low",
          isFavorite: true
        },
        {
          id: 5,
          name: "Product Documentation",
          description: "Create comprehensive user documentation for v2.0",
          status: "active",
          progress: 75,
          dueDate: "2023-09-05",
          team: [
            { name: "Lisa Parker", avatarColor: "red" },
            { name: "James Wilson", avatarColor: "blue" }
          ],
          category: "Documentation",
          priority: "medium",
          isFavorite: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter projects based on search term and tab
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "favorites") return matchesSearch && project.isFavorite;
    return matchesSearch && project.status === activeTab;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];
    
    // Handle special case for dates
    if (sortField === "dueDate") {
      valueA = new Date(a.dueDate).getTime();
      valueB = new Date(b.dueDate).getTime();
    }
    
    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  // Handle add project
  const handleAddProject = () => {
    if (!newProject.name || !newProject.description) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Name and description are required fields."
      });
      return;
    }

    const id = Math.max(0, ...projects.map(p => p.id)) + 1;
    
    const today = new Date();
    const dueDate = newProject.dueDate || new Date(today.setMonth(today.getMonth() + 1)).toISOString().split('T')[0];
    
    const project: Project = {
      id,
      name: newProject.name,
      description: newProject.description,
      status: "active",
      progress: 0,
      dueDate,
      team: [
        { name: "You", avatarColor: "blue" }
      ],
      category: newProject.category,
      priority: newProject.priority as "low" | "medium" | "high",
      isFavorite: false
    };

    setProjects([...projects, project]);
    setNewProject({ 
      name: "", 
      description: "", 
      category: "Development", 
      dueDate: "",
      priority: "medium"
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Project Added",
      description: `${project.name} has been created successfully.`
    });
  };

  // Handle edit project
  const handleEditProject = () => {
    if (!selectedProject) return;
    
    const updatedProjects = projects.map(project =>
      project.id === selectedProject.id ? selectedProject : project
    );
    
    setProjects(updatedProjects);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Project Updated",
      description: `${selectedProject.name} has been updated successfully.`
    });
  };

  // Handle delete project
  const handleDeleteProject = () => {
    if (!selectedProject) return;
    
    setProjects(projects.filter(project => project.id !== selectedProject.id));
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Project Deleted",
      description: `${selectedProject.name} has been permanently removed.`
    });
  };

  // Handle toggle favorite
  const handleToggleFavorite = (project: Project) => {
    const updatedProjects = projects.map(p => 
      p.id === project.id ? { ...p, isFavorite: !p.isFavorite } : p
    );
    
    setProjects(updatedProjects);
    
    toast({
      title: project.isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: `${project.name} has been ${project.isFavorite ? "removed from" : "added to"} your favorites.`
    });
  };

  // Handle toggle sort
  const handleSort = (field: keyof Project) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
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
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout title="Projects">
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
            Project Management
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search projects..."
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
              <span>New Project</span>
            </Button>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="on-hold">On Hold</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
            
            <TabsContent value={activeTab}>
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {loading ? (
                    // Loading skeletons
                    Array(3).fill(0).map((_, index) => (
                      <div key={`skeleton-${index}`} className="animate-pulse">
                        <Card className="overflow-hidden">
                          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 py-4">
                            <div className="flex justify-between items-center">
                              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                            <div className="flex justify-between mb-6">
                              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex -space-x-2">
                                {Array(3).fill(0).map((_, i) => (
                                  <div key={i} className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800"></div>
                                ))}
                              </div>
                              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))
                  ) : sortedProjects.length > 0 ? (
                    sortedProjects.map((project, index) => (
                      <motion.div 
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden">
                          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 py-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-base font-semibold">
                                  {project.name}
                                </CardTitle>
                                <Badge 
                                  className={`
                                    ${project.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                                    ${project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                                    ${project.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                                  `}
                                >
                                  {project.status === 'active' ? 'Active' : 
                                   project.status === 'on-hold' ? 'On Hold' : 
                                   'Completed'}
                                </Badge>
                              </div>
                              <button 
                                onClick={() => handleToggleFavorite(project)} 
                                className="text-gray-400 hover:text-yellow-400 dark:text-gray-500 dark:hover:text-yellow-400 transition-colors"
                              >
                                <Star className={`h-5 w-5 ${project.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                              </button>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                              {project.description}
                            </p>
                            
                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
                            
                            <div className="flex flex-wrap justify-between mb-4">
                              <div className="flex items-center text-sm">
                                <Tag className="h-4 w-4 mr-1 text-gray-400" />
                                <span className="text-gray-500 dark:text-gray-400">{project.category}</span>
                              </div>
                              
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                <span className="text-gray-500 dark:text-gray-400">{formatDate(project.dueDate)}</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex -space-x-2">
                                {project.team.map((member, i) => (
                                  <AvatarPlaceholder 
                                    key={i}
                                    name={member.name} 
                                    color={member.avatarColor}
                                  />
                                ))}
                              </div>
                              
                              <Badge 
                                className={`
                                  ${project.priority === 'low' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                                  ${project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                                  ${project.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                                `}
                              >
                                {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
                              </Badge>
                            </div>
                          </CardContent>
                          <CardFooter className="bg-gray-50 dark:bg-gray-800/50 py-3 flex justify-between">
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-1 text-gray-400" />
                              <span className="text-gray-500 dark:text-gray-400">
                                {project.status === 'completed' ? (
                                  'Completed'
                                ) : (
                                  getDaysRemaining(project.dueDate) > 0 ? 
                                    `${getDaysRemaining(project.dueDate)} days left` : 
                                    'Due today'
                                )}
                              </span>
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
                                    setSelectedProject(project);
                                    setIsEditDialogOpen(true);
                                  }}
                                  className="flex items-center cursor-pointer"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                
                                {project.status !== 'completed' && (
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      const updatedProjects = projects.map(p => 
                                        p.id === project.id ? { ...p, status: 'completed', progress: 100 } : p
                                      );
                                      setProjects(updatedProjects);
                                      toast({
                                        title: "Project Completed",
                                        description: `${project.name} has been marked as completed.`
                                      });
                                    }}
                                    className="flex items-center cursor-pointer"
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    <span>Mark as Completed</span>
                                  </DropdownMenuItem>
                                )}
                                
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedProject(project);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="flex items-center text-red-600 dark:text-red-400 cursor-pointer"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="mx-auto w-full max-w-sm">
                        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                            <Search className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div className="mt-4 text-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No projects found</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {searchTerm ? 
                                `We couldn't find any projects matching "${searchTerm}"` : 
                                "Get started by creating a new project"
                              }
                            </p>
                            <div className="mt-6">
                              <Button 
                                onClick={() => setIsAddDialogOpen(true)}
                                className="flex items-center gap-1 mx-auto"
                              >
                                <Plus className="h-4 w-4" />
                                <span>Create Project</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* Add Project Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Enter project details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input 
                id="project-name"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                placeholder="Website Redesign"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-description">Description</Label>
              <Input 
                id="project-description"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                placeholder="Brief description of the project"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="project-category">Category</Label>
                <select
                  id="project-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newProject.category}
                  onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Research">Research</option>
                  <option value="Documentation">Documentation</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-priority">Priority</Label>
                <select
                  id="project-priority"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newProject.priority}
                  onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-duedate">Due Date</Label>
              <Input 
                id="project-duedate"
                type="date"
                value={newProject.dueDate}
                onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Project Name</Label>
                <Input 
                  id="edit-name"
                  value={selectedProject.name}
                  onChange={(e) => setSelectedProject({...selectedProject, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input 
                  id="edit-description"
                  value={selectedProject.description}
                  onChange={(e) => setSelectedProject({...selectedProject, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <select
                    id="edit-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedProject.category}
                    onChange={(e) => setSelectedProject({...selectedProject, category: e.target.value})}
                  >
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Research">Research</option>
                    <option value="Documentation">Documentation</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedProject.status}
                    onChange={(e) => setSelectedProject({
                      ...selectedProject, 
                      status: e.target.value as "active" | "completed" | "on-hold",
                      // If status is completed, set progress to 100%
                      progress: e.target.value === "completed" ? 100 : selectedProject.progress
                    })}
                  >
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-duedate">Due Date</Label>
                  <Input 
                    id="edit-duedate"
                    type="date"
                    value={selectedProject.dueDate}
                    onChange={(e) => setSelectedProject({...selectedProject, dueDate: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <select
                    id="edit-priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedProject.priority}
                    onChange={(e) => setSelectedProject({
                      ...selectedProject, 
                      priority: e.target.value as "low" | "medium" | "high"
                    })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-progress">Progress ({selectedProject.progress}%)</Label>
                <input
                  id="edit-progress"
                  type="range"
                  min="0"
                  max="100"
                  value={selectedProject.progress}
                  onChange={(e) => setSelectedProject({
                    ...selectedProject, 
                    progress: parseInt(e.target.value),
                    // If progress is 100%, set status to completed
                    status: parseInt(e.target.value) === 100 ? "completed" : selectedProject.status
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                You are about to delete the following project:
              </p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{selectedProject.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedProject.description}</p>
                <div className="flex items-center mt-3 text-xs text-gray-500">
                  <Badge className="mr-2">{selectedProject.category}</Badge>
                  <span>{formatDate(selectedProject.dueDate)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProject}>Delete Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}