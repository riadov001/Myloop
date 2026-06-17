import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminListAds, useUpdateAdStatus, useDeleteAd, useGetBranding, useUpdateBranding } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Trash2, Eye, Paintbrush, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const activeTab = params.get("tab") || "annonces";
  
  const { toast } = useToast();

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const handleTabChange = (val: string) => {
    setLocation(`/admin/dashboard?tab=${val}`);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 pb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground mt-2">Gérez les annonces et l'identité de LocalMarket.</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="annonces">Annonces</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="annonces" className="mt-6">
            <AnnoncesTab />
          </TabsContent>

          <TabsContent value="branding" className="mt-6">
            <BrandingTab />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>
                  Gérez les paramètres globaux de la plateforme. (Mock)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Email de contact principal</Label>
                  <Input defaultValue="contact@localmarket.fr" />
                </div>
                <div className="space-y-2">
                  <Label>Réseaux sociaux</Label>
                  <Input placeholder="URL Facebook" defaultValue="https://facebook.com/localmarket" />
                </div>
                <Button>Sauvegarder les paramètres</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

function AnnoncesTab() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  
  const { data: ads, isLoading, refetch } = useAdminListAds({ 
    status: statusFilter !== "all" ? statusFilter : undefined 
  });
  
  const updateStatus = useUpdateAdStatus();
  const deleteAd = useDeleteAd();

  const handleStatusChange = (id: number, status: 'published' | 'rejected') => {
    updateStatus.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          toast({ title: `Annonce ${status === 'published' ? 'publiée' : 'rejetée'} avec succès.` });
          refetch();
        },
        onError: () => toast({ title: "Erreur", variant: "destructive" })
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      deleteAd.mutate(
        { id },
        {
          onSuccess: () => {
            toast({ title: "Annonce supprimée." });
            refetch();
          },
          onError: () => toast({ title: "Erreur", variant: "destructive" })
        }
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>;
      case 'published': return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Publiée</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejetée</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/30 border-b pb-4">
        <div>
          <CardTitle>Gestion des annonces</CardTitle>
          <CardDescription>Validez ou rejetez les annonces soumises par les utilisateurs.</CardDescription>
        </div>
        <div className="w-64">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les annonces</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="published">Publiées</SelectItem>
              <SelectItem value="rejected">Rejetées</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement des annonces...
                </TableCell>
              </TableRow>
            ) : ads?.length ? (
              ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-mono text-xs">#{ad.id}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate" title={ad.title}>{ad.title}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{ad.category}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(ad.createdAt), "dd MMM yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>{getStatusBadge(ad.status)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {ad.status === 'pending' && (
                      <>
                        <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleStatusChange(ad.id, 'published')} title="Valider">
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleStatusChange(ad.id, 'rejected')} title="Rejeter">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button size="icon" variant="outline" className="h-8 w-8 text-muted-foreground" title="Voir">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(ad.id)} title="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Aucune annonce trouvée avec ce filtre.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function BrandingTab() {
  const { data: branding, isLoading } = useGetBranding();
  const updateBranding = useUpdateBranding();
  const { toast } = useToast();

  const [formState, setFormState] = useState({
    siteName: "",
    primaryColor: "",
    accentColor: "",
    backgroundColor: "",
    fontFamily: "",
    logoUrl: ""
  });

  useEffect(() => {
    if (branding) {
      setFormState({
        siteName: branding.siteName || "LocalMarket",
        primaryColor: branding.primaryColor || "#2563eb",
        accentColor: branding.accentColor || "#eab308",
        backgroundColor: branding.backgroundColor || "#ffffff",
        fontFamily: branding.fontFamily || "Inter",
        logoUrl: branding.logoUrl || ""
      });
    }
  }, [branding]);

  // Handle live preview by updating inline CSS variables on the document root
  // Note: we'd ideally convert HEX to HSL since our CSS uses HSL space separated vars,
  // but for the sake of the live preview UI requested, we just show a visual representation
  // in the admin panel itself without breaking the global theme complex calculations here.

  const handleSave = () => {
    updateBranding.mutate(
      { data: formState },
      {
        onSuccess: () => {
          toast({ title: "Branding mis à jour", description: "Les modifications ont été sauvegardées." });
        },
        onError: () => toast({ title: "Erreur", variant: "destructive" })
      }
    );
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Éditeur de marque</CardTitle>
          <CardDescription>Personnalisez l'apparence globale de la plateforme.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Nom du site</Label>
            <Input 
              value={formState.siteName} 
              onChange={(e) => setFormState({...formState, siteName: e.target.value})} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input 
              placeholder="https://..."
              value={formState.logoUrl} 
              onChange={(e) => setFormState({...formState, logoUrl: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Couleur Primaire</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  className="w-12 p-1 h-10 cursor-pointer" 
                  value={formState.primaryColor}
                  onChange={(e) => setFormState({...formState, primaryColor: e.target.value})}
                />
                <Input 
                  value={formState.primaryColor}
                  onChange={(e) => setFormState({...formState, primaryColor: e.target.value})}
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Couleur d'Accent</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  className="w-12 p-1 h-10 cursor-pointer" 
                  value={formState.accentColor}
                  onChange={(e) => setFormState({...formState, accentColor: e.target.value})}
                />
                <Input 
                  value={formState.accentColor}
                  onChange={(e) => setFormState({...formState, accentColor: e.target.value})}
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Couleur de Fond</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  className="w-12 p-1 h-10 cursor-pointer" 
                  value={formState.backgroundColor}
                  onChange={(e) => setFormState({...formState, backgroundColor: e.target.value})}
                />
                <Input 
                  value={formState.backgroundColor}
                  onChange={(e) => setFormState({...formState, backgroundColor: e.target.value})}
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Police de caractères</Label>
            <Select value={formState.fontFamily} onValueChange={(v) => setFormState({...formState, fontFamily: v})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter (Sans-serif Moderne)</SelectItem>
                <SelectItem value="Roboto">Roboto (Clair & Lisible)</SelectItem>
                <SelectItem value="Poppins">Poppins (Arrondi & Convivial)</SelectItem>
                <SelectItem value="Lato">Lato (Chaleureux)</SelectItem>
                <SelectItem value="Montserrat">Montserrat (Élégant)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} disabled={updateBranding.isPending} className="w-full">
            <Paintbrush className="h-4 w-4 mr-2" /> Appliquer le nouveau style
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Aperçu en direct</h3>
        <Card 
          className="overflow-hidden border-2 shadow-xl" 
          style={{ 
            backgroundColor: formState.backgroundColor,
            fontFamily: formState.fontFamily === 'Inter' ? 'Inter, sans-serif' : formState.fontFamily,
          }}
        >
          <div className="h-14 border-b flex items-center px-4 justify-between" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center gap-2 font-bold text-lg" style={{ color: formState.primaryColor }}>
              {formState.logoUrl ? (
                <img src={formState.logoUrl} alt="Logo" className="h-8" />
              ) : (
                <div className="h-8 w-8 rounded flex items-center justify-center text-white" style={{ backgroundColor: formState.primaryColor }}>
                  LM
                </div>
              )}
              {formState.siteName}
            </div>
            <div className="flex gap-3">
              <div className="h-2 w-16 bg-muted rounded-full"></div>
              <div className="h-2 w-16 bg-muted rounded-full"></div>
            </div>
          </div>
          <div className="p-8">
            <div className="max-w-md space-y-6">
              <h2 className="text-3xl font-bold" style={{ color: '#1e293b' }}>
                Bienvenue sur <span style={{ color: formState.primaryColor }}>{formState.siteName}</span>
              </h2>
              <p style={{ color: '#64748b' }}>Aperçu de la typographie et des couleurs que vous avez sélectionnées.</p>
              <div className="flex gap-4">
                <Button style={{ backgroundColor: formState.primaryColor, color: '#ffffff' }}>Action principale</Button>
                <Button variant="outline" style={{ borderColor: formState.accentColor, color: formState.accentColor }}>Action secondaire</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
