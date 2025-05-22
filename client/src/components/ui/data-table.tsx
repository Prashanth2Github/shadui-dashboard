import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export interface Transaction {
  id: string;
  customer: {
    name: string;
    email: string;
    initials: string;
    avatarColor: string;
  };
  date: string;
  amount: string;
  status: "completed" | "pending" | "failed";
}

interface DataTableProps {
  data: Transaction[];
  className?: string;
}

export function DataTable({ data, className }: DataTableProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredData, setFilteredData] = useState<Transaction[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<"completed" | "pending" | "failed">("completed");
  const [editForm, setEditForm] = useState({
    customerName: "",
    customerEmail: "",
    amount: "",
    date: "",
    status: ""
  });
  
  const rowsPerPage = 5;

  // Apply filters
  useEffect(() => {
    let result = data;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        item =>
          item.id.toLowerCase().includes(term) ||
          item.customer.name.toLowerCase().includes(term) ||
          item.customer.email.toLowerCase().includes(term) ||
          item.amount.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(item => item.status === statusFilter);
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, statusFilter, data]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  
  // Handle opening detail view
  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewDialogOpen(true);
  };
  
  // Handle opening edit dialog
  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditForm({
      customerName: transaction.customer.name,
      customerEmail: transaction.customer.email,
      amount: transaction.amount,
      date: transaction.date,
      status: transaction.status
    });
    setIsEditDialogOpen(true);
  };
  
  // Handle opening delete dialog
  const handleDeleteTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle opening status change dialog
  const handleStatusChange = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setNewStatus(transaction.status);
    setIsStatusDialogOpen(true);
  };
  
  // Handle saving transaction edit
  const handleSaveEdit = () => {
    if (!selectedTransaction) return;
    
    // In a real app, this would call an API to update the transaction
    // For now, we'll update it in-memory
    const updatedData = filteredData.map(item => {
      if (item.id === selectedTransaction.id) {
        return {
          ...item,
          customer: {
            ...item.customer,
            name: editForm.customerName,
            email: editForm.customerEmail
          },
          amount: editForm.amount,
          date: editForm.date,
          status: editForm.status as "completed" | "pending" | "failed"
        };
      }
      return item;
    });
    
    setFilteredData(updatedData);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Transaction Updated",
      description: `Transaction ${selectedTransaction.id} has been updated.`
    });
  };
  
  // Handle confirming transaction deletion
  const handleConfirmDelete = () => {
    if (!selectedTransaction) return;
    
    // In a real app, this would call an API to delete the transaction
    // For now, we'll remove it from our data
    const updatedData = filteredData.filter(item => item.id !== selectedTransaction.id);
    setFilteredData(updatedData);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Transaction Deleted",
      description: `Transaction ${selectedTransaction.id} has been removed.`,
      variant: "destructive"
    });
  };
  
  // Handle confirming status change
  const handleConfirmStatusChange = () => {
    if (!selectedTransaction) return;
    
    // Update transaction status
    const updatedData = filteredData.map(item => {
      if (item.id === selectedTransaction.id) {
        return {
          ...item,
          status: newStatus
        };
      }
      return item;
    });
    
    setFilteredData(updatedData);
    setIsStatusDialogOpen(false);
    
    toast({
      title: "Status Updated",
      description: `Transaction ${selectedTransaction.id} status changed to ${newStatus}.`
    });
  };
  
  // Handle download receipt action
  const handleDownloadReceipt = (transaction: Transaction) => {
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for transaction ${transaction.id} has been downloaded.`
    });
  };

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 overflow-hidden", className)}>
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">Recent Transactions</h3>
          
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm rounded-md border border-gray-300 w-full sm:w-48"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-50 border-gray-300 h-9 w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-900">
            <TableRow>
              <TableHead className="font-medium text-xs uppercase tracking-wider">ID</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider">Customer</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider">Date</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider">Amount</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="table-row border-b dark:border-gray-700"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-gray-200">
                      {item.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <AvatarPlaceholder 
                          name={item.customer.name} 
                          color={item.customer.avatarColor} 
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{item.customer.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {item.date}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 dark:text-gray-200">
                      {item.amount}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span 
                          className={cn(
                            "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer",
                            item.status === "completed" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                            item.status === "pending" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                            item.status === "failed" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          )}
                          onClick={() => handleStatusChange(item)}
                        >
                          {item.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {item.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                          {item.status === "failed" && <XCircle className="w-3 h-3 mr-1" />}
                          <span>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleViewTransaction(item)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleEditTransaction(item)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDownloadReceipt(item)}
                            className="cursor-pointer"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download Receipt</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteTransaction(item)}
                            className="text-red-600 cursor-pointer focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      
      {filteredData.length > 0 && (
        <div className="px-5 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * rowsPerPage, filteredData.length)}
                </span>{" "}
                of <span className="font-medium">{filteredData.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-l-md"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-9 w-9",
                      currentPage === i + 1 ? "bg-primary-50 text-primary-600 border-primary-300 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800" : ""
                    )}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-r-md"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
      
      {/* View Transaction Dialog */}
      {selectedTransaction && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                View complete information about this transaction.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center border-b pb-4 border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{selectedTransaction.id}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-4 border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Date:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{selectedTransaction.date}</span>
              </div>
              
              <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer:</span>
                </div>
                <div className="flex items-center">
                  <AvatarPlaceholder 
                    name={selectedTransaction.customer.name} 
                    color={selectedTransaction.customer.avatarColor} 
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {selectedTransaction.customer.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedTransaction.customer.email}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-b pb-4 border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount:</span>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-200">{selectedTransaction.amount}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
                <Badge 
                  className={cn(
                    selectedTransaction.status === "completed" && "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/40",
                    selectedTransaction.status === "pending" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/40",
                    selectedTransaction.status === "failed" && "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/40"
                  )}
                >
                  {selectedTransaction.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                  {selectedTransaction.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                  {selectedTransaction.status === "failed" && <XCircle className="w-3 h-3 mr-1" />}
                  <span>{selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}</span>
                </Badge>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => handleDownloadReceipt(selectedTransaction)}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                <span>Download Receipt</span>
              </Button>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEditTransaction(selectedTransaction);
                  }}
                >
                  Edit
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Transaction Dialog */}
      {selectedTransaction && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
              <DialogDescription>
                Make changes to the transaction details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction-id" className="text-right">
                  ID
                </Label>
                <Input
                  id="transaction-id"
                  value={selectedTransaction.id}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customer-name" className="text-right">
                  Customer Name
                </Label>
                <Input
                  id="customer-name"
                  value={editForm.customerName}
                  onChange={(e) => setEditForm({...editForm, customerName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customer-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="customer-email"
                  type="email"
                  value={editForm.customerEmail}
                  onChange={(e) => setEditForm({...editForm, customerEmail: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction-amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="transaction-amount"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction-date" className="text-right">
                  Date
                </Label>
                <Input
                  id="transaction-date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction-status" className="text-right">
                  Status
                </Label>
                <Select 
                  value={editForm.status} 
                  onValueChange={(value) => setEditForm({...editForm, status: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Transaction Dialog */}
      {selectedTransaction && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete transaction {selectedTransaction.id}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="flex items-center">
                <AvatarPlaceholder 
                  name={selectedTransaction.customer.name} 
                  color={selectedTransaction.customer.avatarColor} 
                  size="sm"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{selectedTransaction.customer.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedTransaction.amount} • {selectedTransaction.date}</p>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete Transaction
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Change Status Dialog */}
      {selectedTransaction && (
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Transaction Status</DialogTitle>
              <DialogDescription>
                Change the status for transaction {selectedTransaction.id}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md cursor-pointer border-2 transition-all",
                      newStatus === "completed" 
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                        : "border-gray-200 dark:border-gray-700"
                    )}
                    onClick={() => setNewStatus("completed")}
                  >
                    <CheckCircle className={cn(
                      "h-5 w-5 mr-2",
                      newStatus === "completed" ? "text-green-500" : "text-gray-400"
                    )} />
                    <div>
                      <p className={cn(
                        "font-medium",
                        newStatus === "completed" ? "text-green-700 dark:text-green-400" : "text-gray-700 dark:text-gray-300"
                      )}>
                        Completed
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Payment has been processed
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md cursor-pointer border-2 transition-all",
                      newStatus === "pending" 
                        ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" 
                        : "border-gray-200 dark:border-gray-700"
                    )}
                    onClick={() => setNewStatus("pending")}
                  >
                    <Clock className={cn(
                      "h-5 w-5 mr-2",
                      newStatus === "pending" ? "text-yellow-500" : "text-gray-400"
                    )} />
                    <div>
                      <p className={cn(
                        "font-medium",
                        newStatus === "pending" ? "text-yellow-700 dark:text-yellow-400" : "text-gray-700 dark:text-gray-300"
                      )}>
                        Pending
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Payment is being processed
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md cursor-pointer border-2 transition-all",
                      newStatus === "failed" 
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20" 
                        : "border-gray-200 dark:border-gray-700"
                    )}
                    onClick={() => setNewStatus("failed")}
                  >
                    <XCircle className={cn(
                      "h-5 w-5 mr-2",
                      newStatus === "failed" ? "text-red-500" : "text-gray-400"
                    )} />
                    <div>
                      <p className={cn(
                        "font-medium",
                        newStatus === "failed" ? "text-red-700 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
                      )}>
                        Failed
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Payment could not be processed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmStatusChange}>Update Status</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
