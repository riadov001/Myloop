import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Search, MapPin, Package, Scale, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useListAds } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const CATEGORIES = [
  "FRUITS & LÉGUMES",
  "VIANDES & ŒUFS",
  "BOIS & MATÉRIAUX",
  "ARTISANAT",
  "SERVICES",
  "AUTRES"
];

export default function AdsList() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  
  const [location, setSearchLocation] = useState(params.get("location") || "");
  const [product, setProduct] = useState(params.get("product") || "");
  const [quantity, setQuantity] = useState(params.get("quantity") || "");
  const [category, setCategory] = useState(params.get("category") || "");

  const [, setUrlLocation] = useLocation();

  const { data: ads, isLoading } = useListAds({
    location: location || undefined,
    product: product || undefined,
    quantity: quantity || undefined,
    category: category || undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (location) newParams.set("location", location);
    if (product) newParams.set("product", product);
    if (quantity) newParams.set("quantity", quantity);
    if (category) newParams.set("category", category);
    setUrlLocation(`/publicites?${newParams.toString()}`);
  };

  const handleCategoryToggle = (cat: string) => {
    const newCat = category === cat ? "" : cat;
    setCategory(newCat);
    const newParams = new URLSearchParams(searchString);
    if (newCat) newParams.set("category", newCat);
    else newParams.delete("category");
    setUrlLocation(`/publicites?${newParams.toString()}`);
  };

  return (
    <PublicLayout>
      <div className="bg-primary/5 py-8 border-b border-border/50">
        <div className="container max-w-6xl">
          <h1 className="text-3xl font-bold mb-6">Toutes les annonces</h1>
          
          <Card className="p-2 shadow-sm border-primary/10 bg-card">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-3 bg-muted/30 rounded-md border border-transparent focus-within:border-primary focus-within:bg-background transition-colors">
                <MapPin className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
                <Input 
                  placeholder="Localisation" 
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-10"
                  value={location}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <div className="flex-1 flex items-center px-3 bg-muted/30 rounded-md border border-transparent focus-within:border-primary focus-within:bg-background transition-colors">
                <Package className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
                <Input 
                  placeholder="Produit/Élément" 
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-10"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                />
              </div>
              <div className="w-full md:w-32 flex items-center px-3 bg-muted/30 rounded-md border border-transparent focus-within:border-primary focus-within:bg-background transition-colors">
                <Scale className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
                <Input 
                  placeholder="Qté" 
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <Button type="submit" className="md:w-auto h-10 shrink-0">
                <Search className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </form>
          </Card>
          
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium flex items-center mr-2">
              <Filter className="h-4 w-4 mr-1.5" /> Catégories :
            </span>
            {CATEGORIES.map(cat => (
              <Badge 
                key={cat} 
                variant={category === cat ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${category !== cat ? 'hover:bg-primary/10 hover:text-primary hover:border-primary/30' : ''}`}
                onClick={() => handleCategoryToggle(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-6xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))
          ) : ads?.length ? (
            ads.map((ad) => (
              <Card key={ad.id} className="overflow-hidden flex flex-col hover-elevate transition-all border-border/50 bg-card group">
                <div className="h-48 bg-primary/5 flex items-center justify-center relative border-b border-border/50">
                  <Package className="h-16 w-16 text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold rounded-md shadow-sm border border-border/50">
                    {ad.category}
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg line-clamp-2 mb-3 group-hover:text-primary transition-colors">{ad.title}</h3>
                  {ad.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {ad.description}
                    </p>
                  )}
                  <div className="space-y-2 mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center text-sm text-foreground font-medium">
                      <Package className="h-4 w-4 mr-2 text-primary/70 shrink-0" />
                      <span className="truncate">{ad.product}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 shrink-0" />
                      <span className="truncate">{ad.location}</span>
                    </div>
                    {ad.quantity && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Scale className="h-4 w-4 mr-2 shrink-0" />
                        <span>{ad.quantity}</span>
                      </div>
                    )}
                  </div>
                  <Button className="w-full mt-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                    Contacter
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-lg border border-dashed">
              <div className="h-16 w-16 bg-muted flex items-center justify-center rounded-full mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Aucune annonce trouvée</h3>
              <p className="text-muted-foreground max-w-md">
                Nous n'avons trouvé aucune annonce correspondant à vos critères de recherche. Essayez de modifier vos filtres.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => {
                setSearchLocation(""); setProduct(""); setQuantity(""); setCategory("");
                setUrlLocation("/publicites");
              }}>
                Réinitialiser la recherche
              </Button>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
