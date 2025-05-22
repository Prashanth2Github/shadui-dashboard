import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AvatarPlaceholderProps {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export function AvatarPlaceholder({ 
  name, 
  color = "blue", 
  size = "md" 
}: AvatarPlaceholderProps) {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    orange: "bg-orange-100 text-orange-600",
  };

  const sizes: Record<string, string> = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  // Get initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <Avatar className={`${sizes[size]} flex items-center justify-center ${colors[color]}`}>
      <AvatarFallback className={`${colors[color]}`}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
