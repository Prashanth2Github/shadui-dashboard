import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BarChart2, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Register() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setError(null);
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setError(null);
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      nextStep();
      return;
    }

    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call to register
    setTimeout(() => {
      // In a real app, this would be an API request to register the user
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully",
      });
      
      // Store the user info in localStorage to simulate API registration
      localStorage.setItem("user", JSON.stringify({
        id: 2, // A new ID
        username: formData.username,
        email: formData.email
      }));
      
      navigate("/dashboard");
      setIsLoading(false);
    }, 1500);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${step === 1 ? 'bg-primary' : 'bg-gray-300'}`}>1</div>
      <div className="w-12 h-1 bg-gray-200">
        <div className={`h-full ${step === 2 ? 'bg-primary' : 'bg-gray-200'}`} style={{ width: step > 1 ? '100%' : '0%', transition: 'width 0.3s ease-in-out' }}></div>
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${step === 2 ? 'bg-primary' : 'bg-gray-300'}`}>2</div>
    </div>
  );

  const renderStep1Content = () => (
    <div className="space-y-5">
      <div className="space-y-1">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          required
          placeholder="John Doe"
          className="focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your-email@example.com"
          className="focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <Button
        type="button"
        onClick={nextStep}
        className="w-full transition-all duration-200 ease-in-out hover:shadow-lg"
      >
        Next Step
      </Button>
    </div>
  );

  const renderStep2Content = () => (
    <div className="space-y-5">
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="johndoe"
          className="focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="••••••••"
          className="focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="••••••••"
          className="focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox 
          id="agreeTerms" 
          name="agreeTerms"
          checked={formData.agreeTerms}
          onCheckedChange={(checked) => {
            setFormData({
              ...formData,
              agreeTerms: checked as boolean
            });
          }}
        />
        <Label htmlFor="agreeTerms" className="text-sm text-gray-900 dark:text-gray-300">
          I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </Label>
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          className="w-full transition-all duration-200 ease-in-out hover:shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>
    </div>
  );

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
                Create an Account
              </motion.h1>
              <motion.p 
                className="text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Join our analytics platform
              </motion.p>
            </div>

            {renderStepIndicator()}

            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 ? renderStep1Content() : renderStep2Content()}
            </form>

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

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link href="/login">
                  <a className="font-medium text-primary hover:text-primary-dark">
                    Sign in
                  </a>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}