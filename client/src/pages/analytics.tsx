import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChartPlaceholder } from "@/components/ui/chart-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type TimeRange = "7days" | "30days" | "90days" | "year";

export default function Analytics() {
  const { toast } = useToast();
  const [selectedRange, setSelectedRange] = useState<TimeRange>("30days");
  
  // Data sets for each time range to simulate different periods
  const dataByTimeRange = {
    // 7 days data - more granular with recent days
    "7days": {
      conversionData: [
        { name: "Jun 10", value: 3.7 },
        { name: "Jun 11", value: 3.9 },
        { name: "Jun 12", value: 4.1 },
        { name: "Jun 13", value: 3.8 },
        { name: "Jun 14", value: 4.0 },
        { name: "Jun 15", value: 4.3 },
        { name: "Jun 16", value: 4.5 },
      ],
      acquisitionData: [
        { name: "Organic Search", value: 1234 },
        { name: "Direct", value: 876 },
        { name: "Referral", value: 615 },
        { name: "Social Media", value: 524 },
        { name: "Email", value: 248 },
      ],
      engagementData: [
        { name: "Product Page", value: 75 },
        { name: "Checkout", value: 52 },
        { name: "Homepage", value: 48 },
        { name: "Blog", value: 35 },
        { name: "Account", value: 25 },
      ],
      deviceData: [
        { name: "Mobile", value: 62 },
        { name: "Desktop", value: 30 },
        { name: "Tablet", value: 8 },
      ]
    },
    
    // 30 days data - weekly grouping
    "30days": {
      conversionData: [
        { name: "Week 1", value: 3.5 },
        { name: "Week 2", value: 3.7 },
        { name: "Week 3", value: 3.9 },
        { name: "Week 4", value: 4.2 },
      ],
      acquisitionData: [
        { name: "Organic Search", value: 5234 },
        { name: "Direct", value: 3426 },
        { name: "Referral", value: 2315 },
        { name: "Social Media", value: 1824 },
        { name: "Email", value: 948 },
      ],
      engagementData: [
        { name: "Product Page", value: 65 },
        { name: "Checkout", value: 42 },
        { name: "Homepage", value: 38 },
        { name: "Blog", value: 25 },
        { name: "Account", value: 15 },
      ],
      deviceData: [
        { name: "Mobile", value: 58 },
        { name: "Desktop", value: 32 },
        { name: "Tablet", value: 10 },
      ]
    },
    
    // 90 days data - monthly grouping
    "90days": {
      conversionData: [
        { name: "Apr", value: 3.2 },
        { name: "May", value: 3.5 },
        { name: "Jun", value: 3.9 },
      ],
      acquisitionData: [
        { name: "Organic Search", value: 15234 },
        { name: "Direct", value: 9426 },
        { name: "Referral", value: 6315 },
        { name: "Social Media", value: 5824 },
        { name: "Email", value: 2948 },
      ],
      engagementData: [
        { name: "Product Page", value: 63 },
        { name: "Checkout", value: 41 },
        { name: "Homepage", value: 35 },
        { name: "Blog", value: 26 },
        { name: "Account", value: 17 },
      ],
      deviceData: [
        { name: "Mobile", value: 55 },
        { name: "Desktop", value: 35 },
        { name: "Tablet", value: 10 },
      ]
    },
    
    // Annual data - monthly grouping for entire year
    "year": {
      conversionData: [
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
      ],
      acquisitionData: [
        { name: "Organic Search", value: 52340 },
        { name: "Direct", value: 34260 },
        { name: "Referral", value: 23150 },
        { name: "Social Media", value: 18240 },
        { name: "Email", value: 9480 },
      ],
      engagementData: [
        { name: "Product Page", value: 60 },
        { name: "Checkout", value: 40 },
        { name: "Homepage", value: 35 },
        { name: "Blog", value: 22 },
        { name: "Account", value: 15 },
      ],
      deviceData: [
        { name: "Mobile", value: 52 },
        { name: "Desktop", value: 38 },
        { name: "Tablet", value: 10 },
      ]
    }
  };
  
  // Get the current data set based on selected time range
  const currentData = dataByTimeRange[selectedRange];
  
  // Handle time range change
  const handleRangeChange = (value: string) => {
    setSelectedRange(value as TimeRange);
    toast({
      title: "Time range updated",
      description: `Analytics data now showing for ${
        value === "7days" ? "last 7 days" : 
        value === "30days" ? "last 30 days" : 
        value === "90days" ? "last 90 days" : 
        "last 12 months"
      }`
    });
  };

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
            <Select value={selectedRange} onValueChange={handleRangeChange}>
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
                title="Conversion Rate"
                type="line"
                data={currentData.conversionData}
                colors={["#6366f1"]}
              />
              
              <ChartPlaceholder
                title="Traffic Source Breakdown"
                type="pie"
                data={currentData.acquisitionData}
                colors={["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"]}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartPlaceholder
                title="Page Engagement (Avg. Time in Minutes)"
                type="bar"
                data={currentData.engagementData}
                colors={["#10b981"]}
              />
              
              <ChartPlaceholder
                title="Device Usage"
                type="pie"
                data={currentData.deviceData}
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
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Acquisition Channels</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {selectedRange === "7days" ? "Last 7 days" : 
                     selectedRange === "30days" ? "Last 30 days" : 
                     selectedRange === "90days" ? "Last 90 days" : 
                     "Last 12 months"}
                  </div>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ChartPlaceholder
                    title=""
                    type="bar"
                    data={currentData.acquisitionData}
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
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>User Behavior</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {selectedRange === "7days" ? "Last 7 days" : 
                     selectedRange === "30days" ? "Last 30 days" : 
                     selectedRange === "90days" ? "Last 90 days" : 
                     "Last 12 months"}
                  </div>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ChartPlaceholder
                    title=""
                    type="bar"
                    data={currentData.engagementData}
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
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Conversion Trends</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {selectedRange === "7days" ? "Last 7 days" : 
                     selectedRange === "30days" ? "Last 30 days" : 
                     selectedRange === "90days" ? "Last 90 days" : 
                     "Last 12 months"}
                  </div>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ChartPlaceholder
                    title=""
                    type="line"
                    data={currentData.conversionData}
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
