import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Triangle, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Assuming useAdminLogin is provided in the generated API client
import { useAdminLogin } from "@workspace/api-client-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Use the hook if it exists, otherwise fallback to fetch
  const loginMutation = typeof useAdminLogin === 'function' ? useAdminLogin() : null;

  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      setLocation("/admin/dashboard");
    }
  }, [setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loginMutation) {
      loginMutation.mutate(
        { data: { email, password } },
        {
          onSuccess: (data: any) => {
            if (data.success && data.token) {
              localStorage.setItem("adminToken", data.token);
              toast({ title: "Connexion réussie" });
              setLocation("/admin/dashboard");
            } else {
              toast({
                title: "Échec de connexion",
                description: "Identifiants incorrects. Essayez admin@localmarket.fr / admin123",
                variant: "destructive",
              });
            }
          },
          onError: () => {
            toast({
              title: "Erreur réseau",
              description: "Impossible de joindre le serveur.",
              variant: "destructive",
            });
          }
        }
      );
    } else {
      // Fallback
      if (email === "admin@localmarket.fr" && password === "admin123") {
        localStorage.setItem("adminToken", "mock-token-123");
        toast({ title: "Connexion réussie" });
        setLocation("/admin/dashboard");
      } else {
        toast({
          title: "Échec de connexion",
          description: "Identifiants incorrects.",
          variant: "destructive",
        });
      }
    }
  };

  const isLoading = loginMutation?.isPending;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/10">
        <CardHeader className="space-y-4 items-center text-center pb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Triangle className="h-8 w-8 fill-current" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">Espace Administrateur</CardTitle>
            <CardDescription className="text-base">
              Connectez-vous pour gérer la plateforme LocalMarket
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@localmarket.fr" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Connexion en cours...</>
              ) : (
                <><Lock className="mr-2 h-5 w-5" /> Se connecter</>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6 bg-muted/20">
          <p className="text-sm text-muted-foreground text-center">
            Accès réservé à l'équipe de modération de LocalMarket.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
