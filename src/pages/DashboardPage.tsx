import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, LogOut, User, Mail, Calendar } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário";
  const avatarUrl = (profile as any)?.avatar_url || user?.user_metadata?.avatar_url || "";
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 animate-[fadeIn_0.5s_ease-out]">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="font-sans text-3xl font-bold tracking-[-0.06em] text-foreground">
            Dashboard
          </h1>
          <p className="font-sans text-sm tracking-[-0.02em] text-muted-foreground">
            Olá, {displayName}
          </p>
        </div>

        {/* Profile card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6 animate-[fadeIn_0.6s_ease-out]">
          {profileLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-border">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                  <AvatarFallback className="bg-secondary text-foreground font-sans font-semibold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-sans font-semibold text-foreground tracking-[-0.03em] truncate">
                    {displayName}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground tracking-[-0.02em] truncate">
                    {profile?.email || user?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <InfoRow icon={<User className="h-4 w-4" />} label="Nome" value={displayName} />
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={profile?.email || user?.email || "—"} />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Membro desde" value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString("pt-BR") : "—"} />
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link to="/perfil">
            <Button variant="outline" className="w-full font-sans tracking-[-0.02em]">
              Editar Perfil
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full font-sans tracking-[-0.02em] text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-sans text-xs text-muted-foreground tracking-[-0.02em] uppercase w-24">{label}</span>
      <span className="font-sans text-sm text-foreground tracking-[-0.02em] truncate">{value}</span>
    </div>
  );
}
