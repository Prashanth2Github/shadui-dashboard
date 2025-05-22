import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Dashboard" }: HeaderProps) {
  const { user } = useAuth();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center px-4 md:px-6 border-b dark:border-gray-700">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
        </div>
        
        <div className="relative">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Mail className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary"></span>
          </Button>
        </div>
        
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
        
        <div className="flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
              alt="User profile picture" 
            />
            <AvatarFallback>
              {user?.username.slice(0, 2).toUpperCase() || "JD"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 hidden md:block">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.username || "John Doe"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
