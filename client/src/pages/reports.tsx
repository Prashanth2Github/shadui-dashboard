import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPlaceholder } from "@/components/ui/chart-placeholder";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  Calendar 
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  
  // Sample data for reports
  const salesData = [
    { name: "Jan", value: 4500 },
    { name: "Feb", value: 5800 },
    { name: "Mar", value: 4900 },
    { name: "Apr", value: 6200 },
    { name: "May", value: 7500 },
    { name: "Jun", value: 8100 },
    { name: "Jul", value: 7900 },
    { name: "Aug", value: 8900 },
    { name: "Sep", value: 9800 },
    { name: "Oct", value: 10200 },
    { name: "Nov", value: 9500 },
    { name: "Dec", value: 11000 },
  ];
  
  const categoryData = [
    { name: "Electronics", value: 45 },
    { name: "Clothing", value: 20 },
    { name: "Home & Garden", value: 15 },
    { name: "Sports", value: 10 },
    { name: "Other", value: 10 },
  ];
  
  const locationData = [
    { name: "North America", value: 6300 },
    { name: "Europe", value: 5200 },
    { name: "Asia", value: 4500 },
    { name: "Australia", value: 2100 },
    { name: "South America", value: 1800 },
    { name: "Africa", value: 900 },
  ];
  
  const recentReports = [
    { id: 1, name: "Sales Performance Q2 2023", date: "Aug 15, 2023", type: "PDF" },
    { id: 2, name: "Customer Acquisition Report", date: "Aug 10, 2023", type: "XLSX" },
    { id: 3, name: "Product Category Analysis", date: "Aug 5, 2023", type: "PDF" },
    { id: 4, name: "Marketing Campaign ROI", date: "Jul 28, 2023", type: "PDF" },
    { id: 5, name: "Regional Sales Breakdown", date: "Jul 20, 2023", type: "XLSX" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const handleDownload = (reportName: string) => {
    // In a real app, this would trigger a download
    alert(`Downloading ${reportName}`);
  };

  return (
    <DashboardLayout title="Reports">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <motion.h1 
            variants={itemVariants}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Reports Dashboard
          </motion.h1>
          
          <motion.div variants={itemVariants} className="flex space-x-2">
            <Button size="sm" className="flex items-center space-x-1 bg-green-600 hover:bg-green-700">
              <FileText className="h-4 w-4" />
              <span>Generate Report</span>
            </Button>
            <Button size="sm" variant="outline" className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Schedule</span>
            </Button>
          </motion.div>
        </div>
        
        <Tabs defaultValue="overview">
          <motion.div variants={itemVariants}>
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
          </motion.div>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <ChartPlaceholder
                  title="Sales Overview"
                  type="line"
                  data={salesData}
                  showSelect={true}
                  selectOptions={["This Year", "Last Year", "Last 6 Months"]}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <ChartPlaceholder
                  title="Sales by Category"
                  type="pie"
                  data={categoryData}
                  colors={["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"]}
                />
              </motion.div>
            </div>
            
            <motion.div variants={itemVariants} className="mt-6">
              <ChartPlaceholder
                title="Sales by Location"
                type="bar"
                data={locationData}
                showSelect={true}
                selectOptions={["This Year", "Last Year", "Last 6 Months"]}
              />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="sales">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Sales Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2">
                        <BarChart2 className="h-8 w-8 text-primary" />
                        <span>Monthly Sales</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2">
                        <PieChart className="h-8 w-8 text-purple-500" />
                        <span>Product Mix</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2">
                        <TrendingUp className="h-8 w-8 text-green-500" />
                        <span>Growth Analysis</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2">
                        <Calendar className="h-8 w-8 text-blue-500" />
                        <span>Year Overview</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="custom">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Create Custom Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Choose metrics and dimensions to create a custom report tailored to your specific needs.
                  </p>
                  <Button className="bg-primary hover:bg-primary/90">
                    Create New Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
        
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y dark:divide-gray-700">
                {recentReports.map((report) => (
                  <div 
                    key={report.id} 
                    className="py-3 flex items-center justify-between first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center">
                      <div className={`h-9 w-9 rounded-md flex items-center justify-center ${
                        report.type === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{report.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{report.date} • {report.type}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDownload(report.name)}
                      className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}