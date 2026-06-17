import { useState } from "react";
import { useLocation } from "wouter";
import { Search, MapPin, Package, Scale, ArrowRight, ShieldCheck, Users, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useGetStats, useListAds } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MapView } from "@/components/MapView";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchLocation, setSearchLocation] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: ads, isLoading: adsLoading } = useListAds({ limit: 20 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) params.set("location", searchLocation);
    if (product) params.set("product", product);
    if (quantity) params.set("quantity", quantity);
    setLocation(`/publicites?${params.toString()}`);
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left — texte + recherche */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Plateforme d'échanges locaux
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
                Trouvez ce dont vous avez besoin{" "}
                <span className="text-primary">près de chez vous</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                LocalMarket connecte voisins, agriculteurs et artisans pour échanger produits et ressources localement.
              </p>

              {/* Statistiques */}
              <div className="grid grid-cols-3 gap-4">
                {statsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border border-border rounded-xl p-4 bg-card text-center space-y-1">
                      <Skeleton className="h-8 w-16 mx-auto" />
                      <Skeleton className="h-3 w-20 mx-auto" />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="border border-border rounded-xl p-4 bg-card text-center" data-testid="stat-total-ads">
                      <div className="text-2xl font-bold text-primary">
                        {(stats?.totalAds ?? 0).toLocaleString("fr-FR")}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide font-medium">Annonces actives</div>
                    </div>
                    <div className="border border-border rounded-xl p-4 bg-card text-center" data-testid="stat-exchangers">
                      <div className="text-2xl font-bold text-primary">
                        {(stats?.totalExchangers ?? 0).toLocaleString("fr-FR")}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide font-medium">Échangeurs locaux</div>
                    </div>
                    <div className="border border-border rounded-xl p-4 bg-card text-center" data-testid="stat-satisfaction">
                      <div className="text-2xl font-bold text-primary">
                        {stats?.satisfaction ?? 99.7}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide font-medium">Satisfaction</div>
                    </div>
                  </>
                )}
              </div>

              {/* Barre de recherche 3 champs */}
              <Card className="border-border/60 bg-card shadow-xl shadow-black/30">
                <form onSubmit={handleSearch} className="flex flex-col gap-0">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-primary/80 uppercase tracking-widest mb-0.5">Localisation</div>
                      <Input
                        placeholder="Ville, code postal, adresse..."
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto text-sm text-foreground placeholder:text-muted-foreground"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        data-testid="input-location"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
                    <Package className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-primary/80 uppercase tracking-widest mb-0.5">Produit / Élément</div>
                      <Input
                        placeholder="pommes, bois, sable..."
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto text-sm text-foreground placeholder:text-muted-foreground"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        data-testid="input-product"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Scale className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-primary/80 uppercase tracking-widest mb-0.5">Quantité</div>
                      <Input
                        placeholder="ex: 10 kg, 3 stères, 2 palettes..."
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto text-sm text-foreground placeholder:text-muted-foreground"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        data-testid="input-quantity"
                      />
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <Button type="submit" className="w-full h-11 font-semibold text-base" data-testid="button-search">
                      <Search className="h-4 w-4 mr-2" />
                      Rechercher
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Right — Carte OpenStreetMap */}
            <div className="relative h-[560px] w-full rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-black/40">
              {adsLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-card text-muted-foreground gap-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Chargement de la carte...</span>
                </div>
              ) : (
                <MapView ads={ads ?? []} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Dernières annonces */}
      <section className="py-16 border-t border-border/30">
        <div className="container max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Dernières annonces</h2>
              <p className="text-sm text-muted-foreground mt-1">publiées récemment</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setLocation("/publicites")}
              className="text-primary hover:text-primary/80 hover:bg-primary/10 font-semibold"
              data-testid="link-all-ads"
            >
              Toutes les annonces
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {adsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden border-border/50 bg-card">
                  <div className="h-36 bg-muted animate-pulse" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </CardContent>
                </Card>
              ))
            ) : ads?.slice(0, 4).map((ad) => (
              <Card
                key={ad.id}
                className="overflow-hidden border-border/50 bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group cursor-pointer"
                onClick={() => setLocation(`/publicites`)}
                data-testid={`card-ad-${ad.id}`}
              >
                <div className="h-36 bg-primary/10 flex items-center justify-center relative overflow-hidden">
                  <Package className="h-12 w-12 text-primary/30 group-hover:scale-110 group-hover:text-primary/50 transition-all duration-500" />
                  <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wide text-foreground border border-border/50">
                    {ad.category}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                    {ad.title}
                  </h3>
                  {ad.quantity && (
                    <div className="flex items-center text-xs text-muted-foreground mb-1">
                      <Package className="h-3 w-3 mr-1 shrink-0" />
                      <span>{ad.quantity}</span>
                    </div>
                  )}
                  <div className="flex items-center text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3 mr-1 shrink-0" />
                    <span className="truncate">{ad.location}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground/60">
                    {new Date(ad.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi LocalMarket */}
      <section className="py-16 border-t border-border/30">
        <div className="container max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-center mb-10 text-foreground">Pourquoi choisir LocalMarket ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3 p-6 rounded-xl border border-border/40 bg-card/50">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mx-auto">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Annonces vérifiées</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Chaque annonce est soumise à validation par notre équipe de modération avant publication.</p>
            </div>
            <div className="text-center space-y-3 p-6 rounded-xl border border-border/40 bg-card/50">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Communauté locale</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Connectez-vous avec des voisins, agriculteurs et artisans de votre territoire.</p>
            </div>
            <div className="text-center space-y-3 p-6 rounded-xl border border-border/40 bg-card/50">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mx-auto">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Circuit court</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Favorisez les échanges de proximité et soutenez l'économie locale de votre région.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
