import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Mail, Settings, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  title?: string;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "alert" | "message" | "update" | "task";
}

interface Message {
  id: number;
  from: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
  avatar: string;
}

export function Header({ title = "Dashboard" }: HeaderProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  
  // Sample notifications data
  const notifications: Notification[] = [
    {
      id: 1,
      title: "New User Registered",
      description: "A new user has registered to the platform.",
      time: "Just now",
      read: false,
      type: "alert"
    },
    {
      id: 2,
      title: "System Update",
      description: "The system will undergo maintenance in 2 hours.",
      time: "1 hour ago",
      read: false,
      type: "update"
    },
    {
      id: 3,
      title: "Task Completed",
      description: "The data migration task has been completed successfully.",
      time: "3 hours ago",
      read: true,
      type: "task"
    },
    {
      id: 4,
      title: "New Comment",
      description: "Jane left a comment on your report.",
      time: "Yesterday",
      read: true,
      type: "message"
    }
  ];
  
  // Sample messages data
  const messages: Message[] = [
    {
      id: 1,
      from: "Jane Smith",
      subject: "Project Update",
      preview: "I've completed the design mockups for the dashboard...",
      time: "10:30 AM",
      read: false,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      id: 2,
      from: "Michael Johnson",
      subject: "Meeting Rescheduled",
      preview: "The team meeting has been moved to tomorrow at 2pm...",
      time: "Yesterday",
      read: false,
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      id: 3,
      from: "Robert Chen",
      subject: "Question about API",
      preview: "I was wondering if you could help me with...",
      time: "2 days ago",
      read: true,
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
    }
  ];
  
  // Count unread items
  const unreadNotifications = notifications.filter(notification => !notification.read).length;
  const unreadMessages = messages.filter(message => !message.read).length;
  
  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // In a real app, this would mark the notification as read
    toast({
      title: notification.title,
      description: notification.description,
    });
    setShowNotifications(false);
  };
  
  // Handle message click
  const handleMessageClick = (message: Message) => {
    // In a real app, this would open the message in a dedicated interface
    toast({
      title: `Message from ${message.from}`,
      description: message.subject,
    });
    setShowMessages(false);
  };
  
  // Handle admin panel navigation
  const handleAdminClick = () => {
    navigate("/dashboard?tab=users");
    toast({
      title: "Admin Panel",
      description: "Navigated to user management."
    });
  };
  
  // Handle profile navigation
  const handleProfileClick = () => {
    navigate("/settings");
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };
  
  // Animation variants for dropdowns
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -5 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring",
        duration: 0.3,
        bounce: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -5,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center px-4 md:px-6 border-b dark:border-gray-700 z-30 relative">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications Button */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 relative"
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (showMessages) setShowMessages(false);
            }}
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-red-500">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              </span>
            )}
          </Button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
                    <Button variant="ghost" size="sm" className="h-auto text-xs">
                      Mark all as read
                    </Button>
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex">
                          <div className={`flex-shrink-0 h-2 w-2 rounded-full mt-1 mr-3 ${!notification.read ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                          <div className="flex-1">
                            <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {notification.description}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No notifications yet
                    </div>
                  )}
                </div>
                
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="ghost" size="sm" className="w-full text-center text-xs">
                    View all notifications
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Messages Button */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 relative"
            onClick={() => {
              setShowMessages(!showMessages);
              if (showNotifications) setShowNotifications(false);
            }}
          >
            <Mail className="h-5 w-5" />
            {unreadMessages > 0 && (
              <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-primary">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              </span>
            )}
          </Button>
          
          <AnimatePresence>
            {showMessages && (
              <motion.div 
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Messages</h3>
                    <Button variant="ghost" size="sm" className="h-auto text-xs">
                      Mark all as read
                    </Button>
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${!message.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        onClick={() => handleMessageClick(message)}
                      >
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={message.avatar} alt={message.from} />
                              <AvatarFallback>
                                {message.from.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm ${!message.read ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
                                {message.from}
                              </p>
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {message.time}
                              </span>
                            </div>
                            <p className={`text-xs ${!message.read ? 'font-medium text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-300'}`}>
                              {message.subject}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                              {message.preview}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No messages yet
                    </div>
                  )}
                </div>
                
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="ghost" size="sm" className="w-full text-center text-xs">
                    View all messages
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
        
        {/* User Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                  alt="User profile picture" 
                />
                <AvatarFallback>
                  {user?.username.slice(0, 2).toUpperCase() || "JD"}
                </AvatarFallback>
              </Avatar>
              <div className="ml-1 hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.username || "John Doe"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleAdminClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
