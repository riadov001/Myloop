import { Link, useLocation } from "wouter";
import { Menu, Triangle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useHealthCheck } from "@workspace/api-client-react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { data: health } = useHealthCheck();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
                <Triangle className="h-5 w-5 fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">LocalMarket</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">Accueil</Link>
              <Link href="/publicites" className="text-sm font-medium transition-colors hover:text-primary">Publicités</Link>
              <Link href="/deposer" className="text-sm font-medium transition-colors hover:text-primary">Déposer une annonce</Link>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" className="text-yellow-600 border-yellow-600 hover:bg-yellow-50 font-semibold">
              Dons
            </Button>
            <div className="text-sm border rounded px-2 py-1 bg-muted/50 font-medium">FR</div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setLocation("/connexion")}>Se connecter</Button>
              <Button onClick={() => setLocation("/inscription")}>S'inscrire</Button>
            </div>
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium">Accueil</Link>
                <Link href="/publicites" className="text-lg font-medium">Publicités</Link>
                <Link href="/deposer" className="text-lg font-medium">Déposer une annonce</Link>
                <hr className="my-4" />
                <Button variant="outline" className="w-full text-yellow-600 border-yellow-600 justify-start">Faire un don</Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setLocation("/connexion")}>Se connecter</Button>
                <Button className="w-full justify-start" onClick={() => setLocation("/inscription")}>S'inscrire</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-200 py-12">
        <div className="container max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation("/")}>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
                <Triangle className="h-5 w-5 fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">LocalMarket</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              La plateforme de confiance pour les échanges locaux. Connectons voisins, agriculteurs et artisans.
            </p>
            {health && (
              <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                <Activity className="h-3 w-3 text-green-500" />
                <span>Système {health.status}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Qui sommes-nous</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link href="/cgu" className="hover:text-white transition-colors">CGU</Link></li>
              <li><Link href="/politique-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Administration</Link></li>
            </ul>
          </div>
        </div>
        <div className="container max-w-7xl mt-12 pt-8 border-t border-slate-800 text-sm text-slate-400 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <div>&copy; {new Date().getFullYear()} LocalMarket. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  );
}
