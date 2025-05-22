import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChartPlaceholder } from "@/components/ui/chart-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function Analytics() {
  // Monthly conversions data
  const conversionData = [
    { name: "Jan", value: 2.1 },
    { name: "Feb", value: 2.5 },
    { name: "Mar", value: 2.3 },
    { name: "Apr", value: 2.8 },
    { name: "May", value: 3.1 },
    { name: "Jun", value: 3.3 },
    { name: "Jul", value: 3.5 },
    { name: "Aug", value: 3.4 },
    { name: "Sep", value: 3.6 },
    { name: "Oct", value: 3.8 },
    { name: "Nov", value: 3.9 },
    { name: "Dec", value: 4.2 },
  ];

  // User acquisition data
  const acquisitionData = [
    { name: "Organic Search", value: 5234 },
    { name: "Direct", value: 3426 },
    { name: "Referral", value: 2315 },
    { name: "Social Media", value: 1824 },
    { name: "Email", value: 948 },
  ];

  // User engagement data
  const engagementData = [
    { name: "Product Page", value: 65 },
    { name: "Checkout", value: 42 },
    { name: "Homepage", value: 38 },
    { name: "Blog", value: 25 },
    { name: "Account", value: 15 },
  ];

  // Device usage data
  const deviceData = [
    { name: "Mobile", value: 58 },
    { name: "Desktop", value: 32 },
    { name: "Tablet", value: 10 },
  ];

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.h1 
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Analytics Overview
          </motion.h1>
          
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Select defaultValue="30days">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 md:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartPlaceholder
                title="Monthly Conversion Rate"
                type="line"
                data={conversionData}
                colors={["#6366f1"]}
              />
              
              <ChartPlaceholder
                title="Traffic Source Breakdown"
                type="pie"
                data={acquisitionData}
                colors={["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"]}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartPlaceholder
                title="Page Engagement (Avg. Time in Minutes)"
                type="bar"
                data={engagementData}
                colors={["#10b981"]}
              />
              
              <ChartPlaceholder
                title="Device Usage"
                type="pie"
                data={deviceData}
                colors={["#6366f1", "#8b5cf6", "#10b981"]}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="acquisition">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Acquisition Channels</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ChartPlaceholder
                    title=""
                    type="bar"
                    data={acquisitionData}
                    colors={["#6366f1"]}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="behavior">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>User Behavior</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ChartPlaceholder
                    title=""
                    type="bar"
                    data={engagementData}
                    colors={["#10b981"]}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="conversions">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ChartPlaceholder
                    title=""
                    type="line"
                    data={conversionData}
                    colors={["#6366f1"]}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
