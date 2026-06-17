import { useState } from "react";
import { useLocation } from "wouter";
import { Search, MapPin, Package, Scale, ArrowRight, ShieldCheck, Users, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useGetStats, useListAds } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [, setLocation] = useLocation();
  const [location, setSearchLocation] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: ads, isLoading: adsLoading } = useListAds({ limit: 4 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (product) params.set("product", product);
    if (quantity) params.set("quantity", quantity);
    setLocation(`/publicites?${params.toString()}`);
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-primary/5 py-20 lg:py-32">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Trouvez ce dont vous avez besoin <span className="text-primary">près de chez vous</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                LocalMarket est la plateforme d'échanges locaux entre voisins, agriculteurs et artisans. Simple, de confiance, et ancrée dans votre territoire.
              </p>
              
              <Card className="p-2 shadow-lg border-primary/10">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 flex items-center px-3 bg-muted/50 rounded-md border border-transparent focus-within:border-primary focus-within:bg-background transition-colors">
                    <MapPin className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
                    <Input 
                      placeholder="Localisation" 
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-12"
                      value={location}
                      onChange={(e) => setSearchLocation(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 flex items-center px-3 bg-muted/50 rounded-md border border-transparent focus-within:border-primary focus-within:bg-background transition-colors">
                    <Package className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
                    <Input 
                      placeholder="Produit/Élément" 
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-12"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-32 flex items-center px-3 bg-muted/50 rounded-md border border-transparent focus-within:border-primary focus-within:bg-background transition-colors">
                    <Scale className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
                    <Input 
                      placeholder="Qté" 
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-12"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <Button type="submit" size="lg" className="md:w-auto h-12 shrink-0">
                    <Search className="h-5 w-5 mr-2" />
                    Rechercher
                  </Button>
                </form>
              </Card>
            </div>
            
            <div className="relative hidden lg:block h-[500px] w-full rounded-2xl overflow-hidden border border-border shadow-2xl bg-muted">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                <MapPin className="h-16 w-16 mb-4 text-primary opacity-50" />
                <h3 className="text-xl font-medium">Carte interactive</h3>
                <p className="text-sm mt-2">Découvrez les offres autour de vous</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-none bg-primary/5 text-center p-6">
              <ShieldCheck className="h-10 w-10 mx-auto text-primary mb-4" />
              {statsLoading ? <Skeleton className="h-10 w-24 mx-auto mb-2" /> : <h3 className="text-4xl font-bold text-foreground mb-2">{stats?.totalAds || 0}</h3>}
              <p className="text-muted-foreground font-medium">Annonces actives</p>
            </Card>
            <Card className="border-none shadow-none bg-primary/5 text-center p-6">
              <Users className="h-10 w-10 mx-auto text-primary mb-4" />
              {statsLoading ? <Skeleton className="h-10 w-24 mx-auto mb-2" /> : <h3 className="text-4xl font-bold text-foreground mb-2">{stats?.totalExchangers || 0}</h3>}
              <p className="text-muted-foreground font-medium">Échangeurs locaux</p>
            </Card>
            <Card className="border-none shadow-none bg-primary/5 text-center p-6">
              <Sprout className="h-10 w-10 mx-auto text-primary mb-4" />
              {statsLoading ? <Skeleton className="h-10 w-24 mx-auto mb-2" /> : <h3 className="text-4xl font-bold text-foreground mb-2">{stats?.satisfaction || 0}%</h3>}
              <p className="text-muted-foreground font-medium">Taux de satisfaction</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Ads Section */}
      <section className="py-20 bg-muted/30 border-t border-border/50">
        <div className="container max-w-6xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Dernières annonces</h2>
            <Button variant="ghost" onClick={() => setLocation("/publicites")} className="text-primary hover:text-primary/80">
              Voir tout <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-40 bg-muted animate-pulse" />
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))
            ) : ads?.length ? (
              ads.map((ad) => (
                <Card key={ad.id} className="overflow-hidden hover-elevate transition-all border-border/50 bg-card group cursor-pointer" onClick={() => setLocation(`/publicites?product=${ad.title}`)}>
                  <div className="h-40 bg-primary/10 flex items-center justify-center relative">
                    <Package className="h-12 w-12 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold rounded-md shadow-sm border border-border/50">
                      {ad.category}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg line-clamp-1 mb-2 group-hover:text-primary transition-colors">{ad.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4 mr-1.5 shrink-0" />
                      <span className="truncate">{ad.location}</span>
                    </div>
                    {ad.quantity && (
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Scale className="h-4 w-4 mr-1.5 shrink-0" />
                        <span>{ad.quantity}</span>
                      </div>
                    )}
                    <Button variant="outline" className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Contacter
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Aucune annonce trouvée pour le moment.
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
