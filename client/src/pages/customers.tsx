import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  MoreVertical,
  Download,
  Upload,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock user data interface
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "active" | "inactive";
  joined: string;
  avatarColor: string;
}

export default function Customers() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [sortField, setSortField] = useState<keyof Customer>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Initialize with mock data
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setCustomers([
        {
          id: 1,
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "(555) 123-4567",
          location: "New York, USA",
          status: "active",
          joined: "Jan 15, 2023",
          avatarColor: "blue"
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah.j@example.com",
          phone: "(555) 234-5678",
          location: "London, UK",
          status: "active",
          joined: "Feb 3, 2023",
          avatarColor: "green"
        },
        {
          id: 3,
          name: "Michael Brown",
          email: "michael.b@example.com",
          phone: "(555) 345-6789",
          location: "Toronto, Canada",
          status: "inactive",
          joined: "Mar 12, 2023",
          avatarColor: "purple"
        },
        {
          id: 4,
          name: "Emma Wilson",
          email: "emma.w@example.com",
          phone: "(555) 456-7890",
          location: "Sydney, Australia",
          status: "active",
          joined: "Apr 5, 2023",
          avatarColor: "red"
        },
        {
          id: 5,
          name: "David Kim",
          email: "david.k@example.com",
          phone: "(555) 567-8901",
          location: "Seoul, South Korea",
          status: "active",
          joined: "May 20, 2023",
          avatarColor: "orange"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  // Handle sort toggle
  const handleSort = (field: keyof Customer) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle add customer
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Name and email are required fields."
      });
      return;
    }

    const id = Math.max(0, ...customers.map(c => c.id)) + 1;
    const colors = ["blue", "green", "purple", "red", "orange"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const customer: Customer = {
      id,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone || "(Not provided)",
      location: newCustomer.location || "(Not provided)",
      status: "active",
      joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      avatarColor: randomColor as any
    };

    setCustomers([...customers, customer]);
    setNewCustomer({ name: "", email: "", phone: "", location: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Customer Added",
      description: `${customer.name} has been added successfully.`
    });
  };

  // Handle edit customer
  const handleEditCustomer = () => {
    if (!selectedCustomer) return;
    
    const updatedCustomers = customers.map(customer =>
      customer.id === selectedCustomer.id ? selectedCustomer : customer
    );
    
    setCustomers(updatedCustomers);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Customer Updated",
      description: `${selectedCustomer.name}'s information has been updated.`
    });
  };

  // Handle delete customer
  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    
    setCustomers(customers.filter(customer => customer.id !== selectedCustomer.id));
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Customer Deleted",
      description: `${selectedCustomer.name} has been removed from the system.`
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

  // Export customers (simulation)
  const handleExportCustomers = () => {
    toast({
      title: "Export Started",
      description: "Customers data is being exported to CSV."
    });
  };

  return (
    <DashboardLayout title="Customers">
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
            Customer Management
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-9 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Customer</span>
            </Button>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-gray-800/50 py-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold">
                  All Customers
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleExportCustomers}>
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-1">
                          Customer
                          {sortField === "name" && (
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center gap-1">
                          Email
                          {sortField === "email" && (
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                        Phone
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell cursor-pointer"
                        onClick={() => handleSort("location")}
                      >
                        <div className="flex items-center gap-1">
                          Location
                          {sortField === "location" && (
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          {sortField === "status" && (
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell cursor-pointer"
                        onClick={() => handleSort("joined")}
                      >
                        <div className="flex items-center gap-1">
                          Joined
                          {sortField === "joined" && (
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <AnimatePresence>
                      {loading ? (
                        // Loading skeleton
                        Array(5).fill(0).map((_, index) => (
                          <tr key={`skeleton-${index}`} className="animate-pulse">
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="ml-3">
                                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell">
                              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-4 py-4 hidden lg:table-cell">
                              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-4 py-4 hidden sm:table-cell">
                              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-4 py-4 hidden sm:table-cell">
                              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md inline-block"></div>
                            </td>
                          </tr>
                        ))
                      ) : sortedCustomers.length > 0 ? (
                        sortedCustomers.map((customer, index) => (
                          <motion.tr 
                            key={customer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <AvatarPlaceholder name={customer.name} color={customer.avatarColor} />
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell">
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 hidden lg:table-cell">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">{customer.location}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 hidden sm:table-cell">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                customer.status === "active" 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                              }`}>
                                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                              {customer.joined}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedCustomer(customer);
                                      setIsEditDialogOpen(true);
                                    }}
                                    className="flex items-center cursor-pointer"
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedCustomer(customer);
                                      setIsDeleteDialogOpen(true);
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
                          <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            No customers found. Try a different search term or add a new customer.
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

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter the details for the new customer. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                placeholder="John Smith"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                placeholder="john.smith@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location"
                value={newCustomer.location}
                onChange={(e) => setNewCustomer({...newCustomer, location: e.target.value})}
                placeholder="New York, USA"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCustomer}>Save Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the customer details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input 
                  id="edit-name"
                  value={selectedCustomer.name}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email"
                  type="email"
                  value={selectedCustomer.email}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input 
                  id="edit-phone"
                  value={selectedCustomer.phone}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input 
                  id="edit-location"
                  value={selectedCustomer.location}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, location: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedCustomer.status}
                  onChange={(e) => setSelectedCustomer({
                    ...selectedCustomer, 
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCustomer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                You are about to delete the following customer:
              </p>
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <AvatarPlaceholder name={selectedCustomer.name} color={selectedCustomer.avatarColor} />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedCustomer.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedCustomer.email}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>Delete Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}