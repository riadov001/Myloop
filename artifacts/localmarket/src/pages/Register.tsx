import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Triangle, Lock, Loader2, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRegister } from "@workspace/api-client-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 8 caractères.",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate(
      { data: { name, email, password } },
      {
        onSuccess: (data) => {
          localStorage.setItem("userToken", data.token);
          localStorage.setItem("userName", data.user.name);
          toast({ title: "Compte créé", description: `Bienvenue sur LocalMarket, ${data.user.name} !` });
          setLocation("/");
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
            "Une erreur est survenue lors de l'inscription.";
          toast({ title: "Erreur", description: msg, variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Triangle className="h-5 w-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">LocalMarket</span>
          </Link>
        </div>

        <Card className="border-border/50 bg-card shadow-2xl shadow-black/30">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
            <CardDescription>Rejoignez la communauté LocalMarket</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jean Dupont"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11 pl-10"
                    autoComplete="name"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 8 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="h-11 pl-10"
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 font-semibold mt-2"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Inscription...</>
                ) : (
                  "Créer mon compte"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-3 border-t border-border/40 pt-4">
            <p className="text-sm text-muted-foreground text-center">
              Déjà un compte ?{" "}
              <Link href="/connexion" className="text-primary font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Retour à l'accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
