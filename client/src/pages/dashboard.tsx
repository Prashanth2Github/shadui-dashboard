import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { ChartPlaceholder } from "@/components/ui/chart-placeholder";
import { DataTable, Transaction } from "@/components/ui/data-table";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, TrendingUp, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

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

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
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
      </div>
    </DashboardLayout>
  );
}
