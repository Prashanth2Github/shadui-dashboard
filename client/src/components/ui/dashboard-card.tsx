import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    text?: string;
  };
  delay?: number;
  className?: string;
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary-600",
  iconBgColor = "bg-primary-100",
  trend,
  delay = 0,
  className,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Card className={cn("card-hover border border-gray-100", className)}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</h3>
            </div>
            <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", iconBgColor)}>
              <Icon className={cn("h-6 w-6", iconColor)} />
            </div>
          </div>
          
          {trend && (
            <div className="flex items-center mt-3">
              <span className={cn(
                "text-sm font-medium flex items-center",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}>
                {trend.isPositive ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 012 0v1h5a1 1 0 011 1z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M5 14a1 1 0 01-1-1V9a1 1 0 012 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M12 14a1 1 0 01-1-1V9a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M15 7a1 1 0 01-1 1h-2a1 1 0 010-2h2a1 1 0 011 1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 13a1 1 0 01-1 1H5a1 1 0 01-1-1v-2a1 1 0 012 0v1h5a1 1 0 011 1z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M5 6a1 1 0 01-1-1V3a1 1 0 012 0v2a1 1 0 01-1 1z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M12 6a1 1 0 01-1-1V3a1 1 0 112 0v2a1 1 0 01-1 1z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M15 13a1 1 0 01-1 1h-2a1 1 0 010-2h2a1 1 0 011 1z" clipRule="evenodd" />
                  </svg>
                )}
                {trend.value}
              </span>
              <span className="text-xs text-gray-500 ml-2">{trend.text || "vs last month"}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
