import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Search, 
  HelpCircle, 
  FileText, 
  MessageCircle, 
  Mail,
  Phone,
  Send,
  Check,
  PlusCircle,
  ArrowRight,
  Users,
  BarChart2,
  Settings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function Help() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [ticketFormData, setTicketFormData] = useState({
    subject: "",
    category: "general",
    priority: "medium",
    description: ""
  });

  // Handle contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactFormData.name || !contactFormData.email || !contactFormData.message) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    // In a real app, this would make an API call
    toast({
      title: "Message Sent",
      description: "Thank you for your message. Our team will get back to you soon.",
    });
    
    setContactFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  // Handle support ticket submission
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketFormData.subject || !ticketFormData.description) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    // In a real app, this would make an API call
    toast({
      title: "Support Ticket Created",
      description: "Your support ticket has been submitted successfully. We'll respond soon.",
    });
    
    setTicketFormData({
      subject: "",
      category: "general",
      priority: "medium",
      description: ""
    });
  };

  // Filter FAQ items based on search
  const faqItems = [
    {
      question: "How do I create a new project?",
      answer: "Navigate to the Projects page and click on the 'New Project' button in the top right corner. Fill in the required details in the form that appears, then click 'Create Project'."
    },
    {
      question: "How can I add team members to my account?",
      answer: "Go to the Settings page and select the 'Team' tab. Click on 'Invite Team Member' and enter their email address. They will receive an invitation to join your team."
    },
    {
      question: "How do I generate reports?",
      answer: "Navigate to the Reports page and click on the 'Generate Report' button. Select the type of report you want to create, customize the parameters, and click 'Generate'."
    },
    {
      question: "What are the different task priorities?",
      answer: "Tasks can be set to three priority levels: Low, Medium, and High. High priority tasks are shown at the top of your task list and are highlighted to draw attention to their urgency."
    },
    {
      question: "How do I change my account password?",
      answer: "Go to the Settings page and select the 'Security' tab. Click on 'Change Password', enter your current password and your new password, then click 'Save Changes'."
    },
    {
      question: "Can I export my data from the dashboard?",
      answer: "Yes, most sections of the dashboard allow data export. Look for the 'Export' or download button in the section you want to export data from. We support CSV and Excel formats."
    },
    {
      question: "How do I mark a task as completed?",
      answer: "You can mark a task as completed by clicking the checkbox next to the task name, or by selecting 'Mark as Completed' from the task's menu (three dots icon)."
    },
    {
      question: "What browsers are supported?",
      answer: "Our dashboard works best with the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience."
    }
  ];

  const filteredFAQs = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Quick start guides
  const quickStartGuides = [
    {
      title: "Getting Started with Projects",
      description: "Learn how to create and manage projects",
      icon: <PlusCircle className="h-10 w-10 text-primary" />,
      link: "#"
    },
    {
      title: "Task Management",
      description: "Efficiently organize and track your tasks",
      icon: <Check className="h-10 w-10 text-green-500" />,
      link: "#"
    },
    {
      title: "Team Collaboration",
      description: "Work effectively with your team members",
      icon: <Users className="h-10 w-10 text-blue-500" />,
      link: "#"
    },
    {
      title: "Analytics & Reports",
      description: "Make data-driven decisions with analytics",
      icon: <BarChart2 className="h-10 w-10 text-purple-500" />,
      link: "#"
    },
    {
      title: "Account Settings",
      description: "Customize your profile and preferences",
      icon: <Settings className="h-10 w-10 text-gray-500" />,
      link: "#"
    }
  ];

  return (
    <DashboardLayout title="Help & Support">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="text-center py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            How can we help you?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-lg mx-auto">
            Find answers to common questions, learn how to use our platform, or get in touch with our support team.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for help articles, guides, and FAQs..."
              className="pl-10 py-6 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Start Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickStartGuides.map((guide, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex">
                    {guide.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg mb-1">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardContent>
                <div className="px-6 pb-4">
                  <Button variant="link" className="p-0 text-primary flex items-center">
                    Read Guide <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="faq">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>FAQs</span>
              </TabsTrigger>
              <TabsTrigger value="documentation" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Documentation</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>Contact Us</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Find quick answers to common questions about the dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredFAQs.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFAQs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger>
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No results found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        We couldn't find any FAQs matching "{searchTerm}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documentation" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>
                    Detailed guides and tutorials to help you get the most out of our platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Getting Started</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li>
                            <a href="#" className="text-primary hover:underline flex items-center">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Dashboard Overview
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-primary hover:underline flex items-center">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              User Account Setup
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-primary hover:underline flex items-center">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Navigation Guide
                            </a>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Projects</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li>
                            <a href="#" className="text-primary hover:underline flex items-center">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Creating Projects
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-primary hover:underline flex items-center">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Managing Project Teams
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-primary hover:underline flex items-center">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Project Analytics
                            </a>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Tasks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li>
                            <a href="#" className="text-primary hover:underline flex items-center">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Task Management
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-primary hover:underline flex items-center">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Task Prioritization
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-primary hover:underline flex items-center">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Task Assignments
                            </a>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Reports</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li>
                            <a href="#" className="text-primary hover:underline flex items-center">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Generating Reports
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-primary hover:underline flex items-center">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Data Visualization
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-primary hover:underline flex items-center">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Exporting Data
                            </a>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Latest Updates</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Badge className="mt-0.5">New</Badge>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium">Advanced Analytics Features Added</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            We've added new chart types and filtering options to the Analytics page.
                          </p>
                          <a href="#" className="text-primary text-sm hover:underline mt-1 inline-block">
                            Read more
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Badge variant="outline" className="mt-0.5">Update</Badge>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium">Task Management Improvements</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Task management now includes better sorting and filtering capabilities.
                          </p>
                          <a href="#" className="text-primary text-sm hover:underline mt-1 inline-block">
                            Read more
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                    <CardDescription>
                      Send us a message and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name"
                          value={contactFormData.name}
                          onChange={(e) => setContactFormData({...contactFormData, name: e.target.value})}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={contactFormData.email}
                          onChange={(e) => setContactFormData({...contactFormData, email: e.target.value})}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input 
                          id="subject"
                          value={contactFormData.subject}
                          onChange={(e) => setContactFormData({...contactFormData, subject: e.target.value})}
                          placeholder="What is your message about?"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                          id="message"
                          value={contactFormData.message}
                          onChange={(e) => setContactFormData({...contactFormData, message: e.target.value})}
                          placeholder="How can we help you?"
                          className="min-h-[120px]"
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create Support Ticket</CardTitle>
                      <CardDescription>
                        Submit a support ticket for technical assistance.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleTicketSubmit} className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="ticket-subject">Subject</Label>
                          <Input 
                            id="ticket-subject"
                            value={ticketFormData.subject}
                            onChange={(e) => setTicketFormData({...ticketFormData, subject: e.target.value})}
                            placeholder="Brief description of your issue"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="ticket-category">Category</Label>
                            <select
                              id="ticket-category"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={ticketFormData.category}
                              onChange={(e) => setTicketFormData({...ticketFormData, category: e.target.value})}
                            >
                              <option value="general">General Question</option>
                              <option value="technical">Technical Issue</option>
                              <option value="billing">Billing & Account</option>
                              <option value="feature">Feature Request</option>
                            </select>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="ticket-priority">Priority</Label>
                            <select
                              id="ticket-priority"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={ticketFormData.priority}
                              onChange={(e) => setTicketFormData({...ticketFormData, priority: e.target.value})}
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="ticket-description">Description</Label>
                          <Textarea 
                            id="ticket-description"
                            value={ticketFormData.description}
                            onChange={(e) => setTicketFormData({...ticketFormData, description: e.target.value})}
                            placeholder="Please provide details about your issue"
                            className="min-h-[120px]"
                            required
                          />
                        </div>
                        
                        <Button type="submit" className="w-full">
                          Submit Ticket
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>
                        Alternative ways to reach our support team.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium">Email Support</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <a href="mailto:support@example.com" className="text-primary hover:underline">
                              support@example.com
                            </a>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Response time: Within 24 hours
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium">Phone Support</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <a href="tel:+1-555-123-4567" className="text-primary hover:underline">
                              +1 (555) 123-4567
                            </a>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Available Monday-Friday, 9am-5pm EST
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MessageCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium">Live Chat</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Available for premium users
                          </p>
                          <Button variant="link" className="p-0 h-auto text-primary text-sm mt-1">
                            Start Chat
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}