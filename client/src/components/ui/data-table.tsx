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
import { SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredData, setFilteredData] = useState<Transaction[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
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
            <AnimatePresence mode="wait">
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
                      <span className={cn(
                        "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                        item.status === "completed" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                        item.status === "pending" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                        item.status === "failed" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="link" className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 mr-3 h-auto p-0">View</Button>
                      <Button variant="link" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 h-auto p-0">Edit</Button>
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
    </div>
  );
}
