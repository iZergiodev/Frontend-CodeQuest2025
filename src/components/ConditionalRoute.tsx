import { useAuth } from "@/hooks/useAuth";
import Index from "@/pages/Index";
import Home from "@/pages/Home";

const ConditionalRoute = () => {
  const { user } = useAuth();

  return user ? <Home /> : <Index />;
};

export default ConditionalRoute;
