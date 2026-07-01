import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index";
import CardapiosPage from "./pages/CardapiosPage";
import MenuPage from "./pages/MenuPage";
import BuscaPage from "./pages/BuscaPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import EmporioPage from "./pages/EmporioPage";
import PresentesPage from "./pages/PresentesPage";
import ToGoPage from "./pages/ToGoPage";
import VinhosPage from "./pages/VinhosPage";
import EventosPage from "./pages/EventosPage";
import CafePage from "./pages/CafePage";
import SemanaPage from "./pages/SemanaPage";
import RotisseriePage from "./pages/RotisseriePage";
import EntrarPage from "./pages/EntrarPage";
import MinhaContaPage from "./pages/MinhaContaPage";
import ObrigadoPage from "./pages/ObrigadoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  useCartSync();
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/cardapios" element={<CardapiosPage />} />
        <Route path="/cafe" element={<CafePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/emporio" element={<EmporioPage />} />
        <Route path="/presentes" element={<PresentesPage />} />
        <Route path="/to-go" element={<ToGoPage />} />
        <Route path="/vinhos" element={<VinhosPage />} />
        <Route path="/eventos" element={<EventosPage />} />
        <Route path="/semana" element={<SemanaPage />} />
        <Route path="/rotisserie" element={<RotisseriePage />} />
        <Route path="/product/:handle" element={<ProductDetailPage />} />
        <Route path="/busca" element={<BuscaPage />} />
        {/* Auth (Shopify Storefront Customer API) */}
        <Route path="/entrar" element={<EntrarPage />} />
        <Route path="/minha-conta" element={<MinhaContaPage />} />
        {/* Legacy redirects */}
        <Route path="/conta" element={<Navigate to="/minha-conta" replace />} />
        <Route path="/login" element={<Navigate to="/entrar" replace />} />
        <Route path="/auth" element={<Navigate to="/entrar" replace />} />
        <Route path="/perfil" element={<Navigate to="/minha-conta" replace />} />
        <Route path="/criar-conta" element={<Navigate to="/entrar" replace />} />
        <Route path="/recuperar-senha" element={<Navigate to="/entrar" replace />} />
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
