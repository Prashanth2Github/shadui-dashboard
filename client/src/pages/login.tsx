import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { BarChart2, AlertCircle } from "lucide-react";

export default function Login() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome to the Analytics Dashboard",
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid login credentials. Please try again.");
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container min-h-screen flex flex-col justify-center items-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="shadow-lg">
          <CardContent className="pt-6 px-6 pb-6">
            <div className="text-center space-y-2 mb-6">
              <motion.div 
                className="flex justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <BarChart2 className="text-primary-600 h-8 w-8" />
                </div>
              </motion.div>
              <motion.h1 
                className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Analytics Dashboard
              </motion.h1>
              <motion.p 
                className="text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Sign in to access your dashboard
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Button variant="link" className="p-0 font-medium text-primary hover:text-primary-dark">
                    Register now
                  </Button>
                </p>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div 
                className="space-y-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your-email@example.com"
                  className="focus:ring-primary-500 focus:border-primary-500"
                />
              </motion.div>

              <motion.div 
                className="space-y-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="focus:ring-primary-500 focus:border-primary-500"
                />
              </motion.div>

              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="remember-me" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember-me" className="text-sm text-gray-900 dark:text-gray-300">
                    Remember me
                  </Label>
                </div>

                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Forgot your password?
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Button
                  type="submit"
                  className="w-full transition-all duration-200 ease-in-out hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </motion.div>
            </form>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 bg-red-50 dark:bg-red-900/30 rounded-md p-3"
                >
                  <div className="flex">
                    <AlertCircle className="text-red-400 mr-3 h-5 w-5" />
                    <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
