import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LevelProvider, useLevel } from "./contexts/LevelContext";
import LevelUpAnimation from "./components/LevelUpAnimation";

const queryClient = new QueryClient();

const LevelUpLayer = () => {
  const { showLevelUp, level } = useLevel();
  return showLevelUp ? <LevelUpAnimation level={level} /> : null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LevelProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <LevelUpLayer />
      </TooltipProvider>
    </LevelProvider>
  </QueryClientProvider>
);

export default App;
