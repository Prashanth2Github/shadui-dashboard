import { cn } from "@/lib/utils";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  BarChart2,
  LayoutDashboard,
  Users,
  FileText,
  CheckSquare,
  Settings,
  HelpCircle,
  Folder,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const menuItems = [
    {
      title: "Main",
      items: [
        {
          icon: <LayoutDashboard className="h-5 w-5" />,
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          icon: <BarChart2 className="h-5 w-5" />,
          label: "Analytics",
          href: "/analytics",
        },
        {
          icon: <FileText className="h-5 w-5" />,
          label: "Reports",
          href: "/reports",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          icon: <Users className="h-5 w-5" />,
          label: "Customers",
          href: "/customers",
        },
        {
          icon: <Folder className="h-5 w-5" />,
          label: "Projects",
          href: "/projects",
        },
        {
          icon: <CheckSquare className="h-5 w-5" />,
          label: "Tasks",
          href: "/tasks",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          icon: <Settings className="h-5 w-5" />,
          label: "Settings",
          href: "/settings",
        },
        {
          icon: <HelpCircle className="h-5 w-5" />,
          label: "Help & Support",
          href: "/help",
        },
      ],
    },
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <motion.div
        initial={isMobile ? "closed" : "open"}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "bg-white dark:bg-gray-900 shadow-lg w-64 flex flex-col fixed inset-y-0 z-40 border-r",
          className
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center mr-2">
              <BarChart2 className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Analytics</h1>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex-grow overflow-y-auto px-4 py-6 space-y-6">
          {menuItems.map((section, i) => (
            <div className="space-y-1" key={i}>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                {section.title}
              </p>
              {section.items.map((item, j) => {
                const isActive = location === item.href;
                return (
                  <div key={j} onClick={closeSidebar}>
                    <Link href={item.href}>
                      <div
                        className={cn(
                          "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                          isActive
                            ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                        )}
                      >
                        <span
                          className={cn(
                            "mr-3",
                            isActive
                              ? "text-primary-500 dark:text-primary-400"
                              : "text-gray-400 dark:text-gray-500"
                          )}
                        >
                          {item.icon}
                        </span>
                        {item.label}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="border-t p-4">
          <button
            onClick={logout}
            className="flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </motion.div>

      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={closeSidebar}
        />
      )}
    </>
  );
}
