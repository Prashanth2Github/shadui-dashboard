import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { ChartPlaceholder } from "@/components/ui/chart-placeholder";
import { DataTable, Transaction } from "@/components/ui/data-table";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  ShoppingBag,
  UserPlus,
  Trash2,
  Edit,
  Mail,
  Search,
  AlertTriangle,
  CheckCircle,
  FileText,
  Activity,
  Clock
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// User interface for the user management functionality
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
  avatarColor: string;
}

// Log entry interface for activity logs
interface LogEntry {
  id: number;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
  avatarColor: string;
}

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
  });
  
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  // Parse URL query parameter for initial tab selection
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const tab = query.get("tab");
    if (tab === "users") {
      setActiveTab("users");
    } else if (tab === "logs") {
      setActiveTab("logs");
    }
  }, [location]);
  
  // Initialize mock users data
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: "Admin User",
        email: "admin@example.com",
        role: "Admin",
        status: "active",
        lastLogin: "10 minutes ago",
        avatarColor: "blue"
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "Manager",
        status: "active",
        lastLogin: "2 hours ago",
        avatarColor: "green"
      },
      {
        id: 3,
        name: "Michael Johnson",
        email: "michael@example.com",
        role: "User",
        status: "active",
        lastLogin: "1 day ago",
        avatarColor: "purple"
      },
      {
        id: 4,
        name: "Robert Brown",
        email: "robert@example.com",
        role: "User",
        status: "inactive",
        lastLogin: "3 days ago",
        avatarColor: "red"
      }
    ];
    
    setUsers(mockUsers);
    
    // Initialize mock logs data
    const mockLogs: LogEntry[] = [
      {
        id: 1,
        user: "Admin User",
        action: "Login",
        target: "System",
        timestamp: "Today, 10:45 AM",
        details: "User logged in successfully",
        avatarColor: "blue"
      },
      {
        id: 2,
        user: "Jane Smith",
        action: "Create",
        target: "Project",
        timestamp: "Today, 9:30 AM",
        details: "Created new project 'Website Redesign'",
        avatarColor: "green"
      },
      {
        id: 3,
        user: "Admin User",
        action: "Update",
        target: "Settings",
        timestamp: "Yesterday, 4:15 PM",
        details: "Updated system notification settings",
        avatarColor: "blue"
      },
      {
        id: 4,
        user: "Michael Johnson",
        action: "Create",
        target: "Task",
        timestamp: "Yesterday, 2:20 PM",
        details: "Added new task 'Fix login page'",
        avatarColor: "purple"
      },
      {
        id: 5,
        user: "System",
        action: "Maintenance",
        target: "Database",
        timestamp: "Yesterday, 12:00 AM",
        details: "Automated database backup completed",
        avatarColor: "orange"
      }
    ];
    
    setLogs(mockLogs);
  }, []);

  // Chart data for Revenue Overview
  const revenueData = [
    { name: "Jan", value: 2500 },
    { name: "Feb", value: 3300 },
    { name: "Mar", value: 2900 },
    { name: "Apr", value: 3800 },
    { name: "May", value: 3500 },
    { name: "Jun", value: 4000 },
    { name: "Jul", value: 4200 },
    { name: "Aug", value: 4800 },
    { name: "Sep", value: 4600 },
    { name: "Oct", value: 5000 },
    { name: "Nov", value: 4700 },
    { name: "Dec", value: 5200 },
  ];

  // Chart data for Traffic Sources
  const trafficData = [
    { name: "Organic Search", value: 40 },
    { name: "Direct", value: 25 },
    { name: "Social Media", value: 15 },
    { name: "Email", value: 12 },
    { name: "Referral", value: 8 },
  ];
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter logs based on search term
  const filteredLogs = logs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Name and email are required fields."
      });
      return;
    }

    const id = Math.max(0, ...users.map(u => u.id)) + 1;
    const colors = ["blue", "green", "purple", "red", "orange"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const user: User = {
      id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status as "active" | "inactive",
      lastLogin: "Never",
      avatarColor: randomColor
    };

    setUsers([...users, user]);
    setNewUser({ 
      name: "", 
      email: "", 
      role: "user", 
      status: "active" 
    });
    setIsAddUserDialogOpen(false);
    
    // Add to logs
    const newLog: LogEntry = {
      id: logs.length + 1,
      user: "Admin User",
      action: "Create",
      target: "User",
      timestamp: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }),
      details: `Created new user account: ${user.name}`,
      avatarColor: "blue"
    };
    
    setLogs([newLog, ...logs]);
    
    toast({
      title: "User Added",
      description: `${user.name} has been added successfully.`
    });
  };

  // Handle editing a user
  const handleEditUser = () => {
    if (!selectedUser) return;
    
    const updatedUsers = users.map(user =>
      user.id === selectedUser.id ? selectedUser : user
    );
    
    setUsers(updatedUsers);
    setIsEditUserDialogOpen(false);
    
    // Add to logs
    const newLog: LogEntry = {
      id: logs.length + 1,
      user: "Admin User",
      action: "Update",
      target: "User",
      timestamp: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }),
      details: `Updated user account: ${selectedUser.name}`,
      avatarColor: "blue"
    };
    
    setLogs([newLog, ...logs]);
    
    toast({
      title: "User Updated",
      description: `${selectedUser.name}'s information has been updated.`
    });
  };

  // Handle deleting a user
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setIsDeleteUserDialogOpen(false);
    
    // Add to logs
    const newLog: LogEntry = {
      id: logs.length + 1,
      user: "Admin User",
      action: "Delete",
      target: "User",
      timestamp: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }),
      details: `Deleted user account: ${selectedUser.name}`,
      avatarColor: "blue"
    };
    
    setLogs([newLog, ...logs]);
    
    toast({
      title: "User Deleted",
      description: `${selectedUser.name} has been removed from the system.`
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

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Login":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Create":
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case "Update":
        return <Edit className="h-4 w-4 text-orange-500" />;
      case "Delete":
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case "Maintenance":
        return <Activity className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getTargetIcon = (target: string) => {
    switch (target) {
      case "User":
        return <Users className="h-4 w-4" />;
      case "System":
        return <Activity className="h-4 w-4" />;
      case "Project":
        return <FileText className="h-4 w-4" />;
      case "Task":
        return <CheckCircle className="h-4 w-4" />;
      case "Database":
        return <Activity className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="animate-fade-in">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {!statsLoading && statsData ? (
              <>
                <DashboardCard
                  title="Total Revenue"
                  value={statsData.revenue.value}
                  icon={DollarSign}
                  iconColor="text-primary-600"
                  iconBgColor="bg-primary-100"
                  trend={{
                    value: statsData.revenue.trend.value,
                    isPositive: statsData.revenue.trend.isPositive,
                  }}
                  delay={1}
                />
                <DashboardCard
                  title="Active Users"
                  value={statsData.users.value}
                  icon={Users}
                  iconColor="text-blue-600"
                  iconBgColor="bg-blue-100"
                  trend={{
                    value: statsData.users.trend.value,
                    isPositive: statsData.users.trend.isPositive,
                  }}
                  delay={2}
                />
                <DashboardCard
                  title="Conversion Rate"
                  value={statsData.conversion.value}
                  icon={TrendingUp}
                  iconColor="text-green-600"
                  iconBgColor="bg-green-100"
                  trend={{
                    value: statsData.conversion.trend.value,
                    isPositive: statsData.conversion.trend.isPositive,
                  }}
                  delay={3}
                />
                <DashboardCard
                  title="Avg. Order Value"
                  value={statsData.orderValue.value}
                  icon={ShoppingBag}
                  iconColor="text-purple-600"
                  iconBgColor="bg-purple-100"
                  trend={{
                    value: statsData.orderValue.trend.value,
                    isPositive: statsData.orderValue.trend.isPositive,
                  }}
                  delay={4}
                />
              </>
            ) : (
              // Loading state for stats cards
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div className="flex items-center mt-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Revenue Chart */}
            <ChartPlaceholder
              title="Revenue Overview"
              type="area"
              data={revenueData}
              showSelect={true}
              className="lg:col-span-2"
            />
            
            {/* Traffic Sources Chart */}
            <ChartPlaceholder
              title="Traffic Sources"
              type="pie"
              data={trafficData}
              colors={["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"]}
            />
          </div>
          
          {/* Table Section */}
          {!isLoading && transactionsData ? (
            <DataTable data={transactionsData} />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
              <div className="space-y-3">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="users">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                <p className="text-gray-500 dark:text-gray-400">Add, edit, and manage user accounts</p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-9 w-full sm:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={() => setIsAddUserDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add User</span>
                </Button>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Last Login
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                              <motion.tr 
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b dark:border-gray-700"
                              >
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <AvatarPlaceholder 
                                      name={user.name} 
                                      color={user.avatarColor} 
                                    />
                                    <div className="ml-3">
                                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">{user.role}</span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user.status === "active" 
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                  }`}>
                                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{user.lastLogin}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 px-2">
                                        Actions
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem 
                                        onClick={() => {
                                          setSelectedUser(user);
                                          setIsEditUserDialogOpen(true);
                                        }}
                                        className="flex items-center cursor-pointer"
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Edit</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => {
                                          setSelectedUser(user);
                                          setIsDeleteUserDialogOpen(true);
                                        }}
                                        className="flex items-center text-red-600 dark:text-red-400 cursor-pointer"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </td>
                              </motion.tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                No users found. Try a different search term or add a new user.
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="logs">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Logs</h2>
                <p className="text-gray-500 dark:text-gray-400">Track user and system activities</p>
              </div>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  className="pl-9 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    <AnimatePresence>
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log, index) => (
                          <motion.li 
                            key={log.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <div className="flex items-start">
                              <AvatarPlaceholder 
                                name={log.user} 
                                color={log.avatarColor} 
                                size="sm"
                              />
                              
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {log.user}
                                  </p>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {log.timestamp}
                                  </span>
                                </div>
                                
                                <div className="mt-1 flex items-center">
                                  <Badge className="mr-2 flex items-center gap-1">
                                    {getActionIcon(log.action)}
                                    <span>{log.action}</span>
                                  </Badge>
                                  
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    {getTargetIcon(log.target)}
                                    <span>{log.target}</span>
                                  </Badge>
                                </div>
                                
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                  {log.details}
                                </p>
                              </div>
                            </div>
                          </motion.li>
                        ))
                      ) : (
                        <li className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                          No logs found matching your search criteria.
                        </li>
                      )}
                    </AnimatePresence>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="John Smith"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="john.smith@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input 
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <select
                  id="edit-role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser, 
                    status: e.target.value as "active" | "inactive"
                  })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                You are about to delete the following user:
              </p>
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <AvatarPlaceholder name={selectedUser.name} color={selectedUser.avatarColor} />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
