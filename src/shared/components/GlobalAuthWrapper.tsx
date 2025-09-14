import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/shared/components/LoadingScreen";
import { ReactNode } from "react";

interface GlobalAuthWrapperProps {
  children: ReactNode;
}

export const GlobalAuthWrapper = ({ children }: GlobalAuthWrapperProps) => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Authenticating..." />;
  }

  return <>{children}</>;
};
