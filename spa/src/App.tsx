import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { AppDataStoreProvider } from "./hooks/useAppDataStore";
import { router } from "./pages/routing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppDataStoreProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </AppDataStoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
