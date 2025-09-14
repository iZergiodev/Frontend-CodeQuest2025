import { Toaster } from "./shared/components/ui/toaster";
import { Toaster as Sonner } from "./shared/components/ui/sonner";
import { TooltipProvider } from "./shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { GlobalAuthWrapper } from "@/shared/components/GlobalAuthWrapper";
import { appRouter } from "./app/router/app.router";
import { OpenProvider } from "./hooks/useOpen";

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
          <OpenProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <RouterProvider router={appRouter} />
            </TooltipProvider>
          </OpenProvider>
        </GlobalAuthWrapper>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
