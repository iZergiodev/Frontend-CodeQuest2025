import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { GlobalAuthWrapper } from "@/components/GlobalAuthWrapper";
import { appRouter } from "./router/app.router";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      <AuthProvider>
        <GlobalAuthWrapper>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <RouterProvider router={appRouter} />
          </TooltipProvider>
        </GlobalAuthWrapper>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
