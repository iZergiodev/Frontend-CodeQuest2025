import { Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserNameWithCrownProps {
  name: string;
  userId?: number;
  userRole?: string;
  className?: string;
  crownSize?: "sm" | "md" | "lg";
}

export const UserNameWithCrown = ({ 
  name, 
  userId, 
  userRole, 
  className = "", 
  crownSize = "sm" 
}: UserNameWithCrownProps) => {
  const { user: currentUser } = useAuth();
  
  const shouldShowCrown = () => {
    if (userRole) {
      return userRole.toLowerCase() === 'admin';
    }
    
    if (userId && currentUser && userId === currentUser.id) {
      return currentUser.role?.toLowerCase() === 'admin';
    }
    
    return false;
  };

  const crownSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span>{name}</span>
      {shouldShowCrown() && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Crown className={`${crownSizeClasses[crownSize]} text-yellow-500 fill-current`} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Admin</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
