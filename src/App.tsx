import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import EmporioPage from "./pages/EmporioPage";
import IndividualPage from "./pages/IndividualPage";
import PresentearPage from "./pages/PresentearPage";
import EventosPage from "./pages/EventosPage";
import CafePage from "./pages/CafePage";
import SemanaPage from "./pages/SemanaPage";
import RotisseriePage from "./pages/RotisseriePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  useCartSync();
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/cafe" element={<CafePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/emporio" element={<EmporioPage />} />
        <Route path="/individual" element={<IndividualPage />} />
        <Route path="/presentear" element={<PresentearPage />} />
        <Route path="/eventos" element={<EventosPage />} />
        <Route path="/semana" element={<SemanaPage />} />
        <Route path="/rotisserie" element={<RotisseriePage />} />
        <Route path="/product/:handle" element={<ProductDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
