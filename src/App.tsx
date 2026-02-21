import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index";
import CardapiosPage from "./pages/CardapiosPage";
import MenuPage from "./pages/MenuPage";
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
import CriarContaPage from "./pages/CriarContaPage";
import RecuperarSenhaPage from "./pages/RecuperarSenhaPage";
import AtualizarSenhaPage from "./pages/AtualizarSenhaPage";
import ContaPage from "./pages/ContaPage";
import CompletarCadastroPage from "./pages/CompletarCadastroPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
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
        {/* Auth routes */}
        <Route path="/entrar" element={<EntrarPage />} />
        <Route path="/criar-conta" element={<CriarContaPage />} />
        <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
        <Route path="/atualizar-senha" element={<AtualizarSenhaPage />} />
        <Route path="/conta" element={<ContaPage />} />
        <Route path="/completar-cadastro" element={<CompletarCadastroPage />} />
        {/* Legacy routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
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
