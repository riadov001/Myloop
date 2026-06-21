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
import { Switch } from "@/components/ui/switch";
import {
  useAdminListAds, useUpdateAdStatus, useDeleteAd,
  useGetBranding, useUpdateBranding,
  useAdminListCategories, useAdminCreateCategory, useAdminUpdateCategory, useAdminDeleteCategory,
  useAdminListUnits, useAdminCreateUnit, useAdminUpdateUnit, useAdminDeleteUnit,
  useAdminListPromotionPrices, useAdminCreatePromotionPrice, useAdminUpdatePromotionPrice, useAdminDeletePromotionPrice,
  useAdminListPlans, useAdminCreatePlan, useAdminUpdatePlan, useAdminDeletePlan,
  useAdminListConfig, useAdminUpdateConfig,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Trash2, Eye, EyeOff, Paintbrush, Loader2, Plus, Pencil, Settings2, Star } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const activeTab = params.get("tab") || "annonces";

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
          <TabsList className="flex w-full flex-wrap gap-0">
            <TabsTrigger value="annonces" className="flex-1">Annonces</TabsTrigger>
            <TabsTrigger value="categories" className="flex-1">Catégories</TabsTrigger>
            <TabsTrigger value="unites" className="flex-1">Unités</TabsTrigger>
            <TabsTrigger value="tarifs" className="flex-1">Tarifs</TabsTrigger>
            <TabsTrigger value="plans" className="flex-1">Plans</TabsTrigger>
            <TabsTrigger value="branding" className="flex-1">Branding</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="annonces" className="mt-6"><AnnoncesTab /></TabsContent>
          <TabsContent value="categories" className="mt-6"><CategoriesTab /></TabsContent>
          <TabsContent value="unites" className="mt-6"><UnitesTab /></TabsContent>
          <TabsContent value="tarifs" className="mt-6"><TarifsTab /></TabsContent>
          <TabsContent value="plans" className="mt-6"><PlansTab /></TabsContent>
          <TabsContent value="branding" className="mt-6"><BrandingTab /></TabsContent>
          <TabsContent value="settings" className="mt-6"><ParametresTab /></TabsContent>
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
          onSuccess: () => { toast({ title: "Annonce supprimée." }); refetch(); },
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
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin inline mr-2" /> Chargement...
                </TableCell>
              </TableRow>
            ) : ads?.length ? (
              ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-mono text-xs">#{ad.id}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate" title={ad.title}>
                    {ad.isPromoted && <Badge className="mr-1 bg-amber-500 text-white text-[10px]">Sponsorisé</Badge>}
                    {ad.title}
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{ad.category}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {ad.listingType === "free" ? "Don" : ad.listingType === "fixed" ? "Prix fixe" : "Prix libre"}
                    {ad.price && ` — ${ad.price}€`}
                  </TableCell>
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
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Aucune annonce trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CategoriesTab() {
  const { toast } = useToast();
  const { data: categories, isLoading, refetch } = useAdminListCategories();
  const createCategory = useAdminCreateCategory();
  const updateCategory = useAdminUpdateCategory();
  const deleteCategory = useAdminDeleteCategory();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    const slug = newSlug.trim() || newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    createCategory.mutate(
      { data: { name: newName.trim(), slug, active: true } },
      {
        onSuccess: () => { toast({ title: "Catégorie créée." }); setNewName(""); setNewSlug(""); refetch(); },
        onError: () => toast({ title: "Erreur", variant: "destructive" })
      }
    );
  };

  const handleUpdate = (id: number) => {
    updateCategory.mutate(
      { id, data: { name: editName, slug: editSlug, active: true } },
      {
        onSuccess: () => { toast({ title: "Catégorie mise à jour." }); setEditingId(null); refetch(); },
        onError: () => toast({ title: "Erreur", variant: "destructive" })
      }
    );
  };

  const handleToggleActive = (cat: { id: number; name: string; slug: string; active: boolean }) => {
    updateCategory.mutate(
      { id: cat.id, data: { name: cat.name, slug: cat.slug, active: !cat.active } },
      {
        onSuccess: () => { refetch(); },
        onError: () => toast({ title: "Erreur", variant: "destructive" })
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Supprimer cette catégorie ?")) {
      deleteCategory.mutate(
        { id },
        {
          onSuccess: () => { toast({ title: "Catégorie supprimée." }); refetch(); },
          onError: () => toast({ title: "Erreur", variant: "destructive" })
        }
      );
    }
  };

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <CardTitle>Gestion des catégories</CardTitle>
        <CardDescription>Créez, modifiez, activez ou désactivez les catégories d'annonces.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="flex gap-3">
          <Input
            placeholder="Nom de la catégorie"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Input
            placeholder="Slug (auto)"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            className="w-40"
          />
          <Button onClick={handleCreate} disabled={createCategory.isPending}>
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Actif</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>
            ) : categories?.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  {editingId === cat.id ? (
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8" />
                  ) : cat.name}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {editingId === cat.id ? (
                    <Input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className="h-8" />
                  ) : cat.slug}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={cat.active}
                    onCheckedChange={() => handleToggleActive(cat)}
                  />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {editingId === cat.id ? (
                    <>
                      <Button size="sm" onClick={() => handleUpdate(cat.id)} disabled={updateCategory.isPending}>Enregistrer</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Annuler</Button>
                    </>
                  ) : (
                    <>
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditSlug(cat.slug); }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function UnitesTab() {
  const { toast } = useToast();
  const { data: units, isLoading, refetch } = useAdminListUnits();
  const createUnit = useAdminCreateUnit();
  const updateUnit = useAdminUpdateUnit();
  const deleteUnit = useAdminDeleteUnit();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newSymbol, setNewSymbol] = useState("");
  const [editName, setEditName] = useState("");
  const [editSymbol, setEditSymbol] = useState("");

  const handleCreate = () => {
    if (!newName.trim() || !newSymbol.trim()) return;
    createUnit.mutate(
      { data: { name: newName.trim(), symbol: newSymbol.trim(), active: true } },
      {
        onSuccess: () => { toast({ title: "Unité créée." }); setNewName(""); setNewSymbol(""); refetch(); },
        onError: () => toast({ title: "Erreur", variant: "destructive" })
      }
    );
  };

  const handleUpdate = (id: number) => {
    updateUnit.mutate(
      { id, data: { name: editName, symbol: editSymbol, active: true } },
      {
        onSuccess: () => { toast({ title: "Unité mise à jour." }); setEditingId(null); refetch(); },
        onError: () => toast({ title: "Erreur", variant: "destructive" })
      }
    );
  };

  const handleToggleActive = (unit: { id: number; name: string; symbol: string; active: boolean }) => {
    updateUnit.mutate(
      { id: unit.id, data: { name: unit.name, symbol: unit.symbol, active: !unit.active } },
      {
        onSuccess: () => { refetch(); },
        onError: () => toast({ title: "Erreur", variant: "destructive" })
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Supprimer cette unité ?")) {
      deleteUnit.mutate(
        { id },
        {
          onSuccess: () => { toast({ title: "Unité supprimée." }); refetch(); },
          onError: () => toast({ title: "Erreur", variant: "destructive" })
        }
      );
    }
  };

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <CardTitle>Gestion des unités de mesure</CardTitle>
        <CardDescription>Gérez les unités disponibles dans les formulaires d'annonces.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="flex gap-3">
          <Input
            placeholder="Nom (ex: Kilogramme)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Input
            placeholder="Symbole (ex: kg)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="w-36"
          />
          <Button onClick={handleCreate} disabled={createUnit.isPending}>
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Symbole</TableHead>
              <TableHead>Actif</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>
            ) : units?.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>
                  {editingId === unit.id ? (
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8" />
                  ) : unit.name}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {editingId === unit.id ? (
                    <Input value={editSymbol} onChange={(e) => setEditSymbol(e.target.value)} className="h-8 w-24" />
                  ) : unit.symbol}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={unit.active}
                    onCheckedChange={() => handleToggleActive(unit)}
                  />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {editingId === unit.id ? (
                    <>
                      <Button size="sm" onClick={() => handleUpdate(unit.id)} disabled={updateUnit.isPending}>Enregistrer</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Annuler</Button>
                    </>
                  ) : (
                    <>
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => { setEditingId(unit.id); setEditName(unit.name); setEditSymbol(unit.symbol); }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(unit.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TarifsTab() {
  const { toast } = useToast();
  const { data: prices, isLoading, refetch } = useAdminListPromotionPrices();
  const createPrice = useAdminCreatePromotionPrice();
  const updatePrice = useAdminUpdatePromotionPrice();
  const deletePrice = useAdminDeletePromotionPrice();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newDuration, setNewDuration] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const handleCreate = () => {
    if (!newLabel.trim() || !newPrice.trim() || !newDuration) return;
    createPrice.mutate(
      { data: { duration: Number(newDuration), label: newLabel.trim(), price: newPrice.trim(), active: true } },
      {
        onSuccess: () => {
          toast({ title: "Tarif créé." });
          setNewDuration(""); setNewLabel(""); setNewPrice("");
          refetch();
        },
        onError: () => toast({ title: "Erreur", variant: "destructive" })
      }
    );
  };

  const handleUpdate = (id: number) => {
    updatePrice.mutate(
      { id, data: { duration: Number(editDuration), label: editLabel, price: editPrice, active: true } },
      {
        onSuccess: () => { toast({ title: "Tarif mis à jour." }); setEditingId(null); refetch(); },
        onError: () => toast({ title: "Erreur", variant: "destructive" })
      }
    );
  };

  const handleToggleActive = (p: { id: number; duration: number; label: string; price: string; active: boolean }) => {
    updatePrice.mutate(
      { id: p.id, data: { duration: p.duration, label: p.label, price: p.price, active: !p.active } },
      {
        onSuccess: () => { refetch(); },
        onError: () => toast({ title: "Erreur", variant: "destructive" })
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Supprimer ce tarif ?")) {
      deletePrice.mutate(
        { id },
        {
          onSuccess: () => { toast({ title: "Tarif supprimé." }); refetch(); },
          onError: () => toast({ title: "Erreur", variant: "destructive" })
        }
      );
    }
  };

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <CardTitle>Tarifs de mise en avant</CardTitle>
        <CardDescription>Gérez les tarifs publicitaires pour la mise en avant des annonces. Ces tarifs s'affichent directement dans le formulaire de dépôt.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="Durée (jours)"
            type="number"
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
            className="w-32"
          />
          <Input
            placeholder="Libellé (ex: 7 jours)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="flex-1 min-w-[140px]"
          />
          <Input
            placeholder="Prix (ex: 9.90)"
            type="number"
            step="0.01"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="w-32"
          />
          <Button onClick={handleCreate} disabled={createPrice.isPending}>
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Durée</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead>Prix (€)</TableHead>
              <TableHead>Actif</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>
            ) : prices?.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {editingId === p.id ? (
                    <Input type="number" value={editDuration} onChange={(e) => setEditDuration(e.target.value)} className="h-8 w-24" />
                  ) : `${p.duration} jours`}
                </TableCell>
                <TableCell>
                  {editingId === p.id ? (
                    <Input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} className="h-8" />
                  ) : p.label}
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  {editingId === p.id ? (
                    <Input type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="h-8 w-28" />
                  ) : `${p.price} €`}
                </TableCell>
                <TableCell>
                  <Switch checked={p.active} onCheckedChange={() => handleToggleActive(p)} />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {editingId === p.id ? (
                    <>
                      <Button size="sm" onClick={() => handleUpdate(p.id)} disabled={updatePrice.isPending}>Enregistrer</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Annuler</Button>
                    </>
                  ) : (
                    <>
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => { setEditingId(p.id); setEditDuration(String(p.duration)); setEditLabel(p.label); setEditPrice(p.price); }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PlansTab() {
  const { toast } = useToast();
  const { data: plans, isLoading, refetch } = useAdminListPlans();
  const createPlan = useAdminCreatePlan();
  const updatePlan = useAdminUpdatePlan();
  const deletePlan = useAdminDeletePlan();

  const emptyForm = { name: "", slug: "", description: "", priceMonthly: "0", priceAnnual: "", maxAds: "", featuresText: "", isActive: true, sortOrder: "0" };
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const setField = (k: keyof typeof emptyForm, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const toPayload = () => ({
    name: form.name.trim(),
    slug: form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    description: form.description.trim() || undefined,
    priceMonthly: form.priceMonthly || "0",
    priceAnnual: form.priceAnnual.trim() || undefined,
    maxAds: form.maxAds ? Number(form.maxAds) : undefined,
    features: form.featuresText.split("\n").map(s => s.trim()).filter(Boolean),
    isActive: form.isActive,
    sortOrder: Number(form.sortOrder) || 0,
  });

  const handleCreate = () => {
    if (!form.name.trim()) return;
    createPlan.mutate(
      { data: toPayload() },
      {
        onSuccess: () => { toast({ title: "Plan créé." }); setForm(emptyForm); setShowForm(false); refetch(); },
        onError: () => toast({ title: "Erreur", variant: "destructive" }),
      }
    );
  };

  const startEdit = (p: NonNullable<typeof plans>[number]) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description ?? "",
      priceMonthly: p.priceMonthly,
      priceAnnual: p.priceAnnual ?? "",
      maxAds: p.maxAds != null ? String(p.maxAds) : "",
      featuresText: (p.features as string[]).join("\n"),
      isActive: p.isActive,
      sortOrder: String(p.sortOrder),
    });
    setShowForm(true);
  };

  const handleUpdate = () => {
    if (!editingId) return;
    updatePlan.mutate(
      { id: editingId, data: toPayload() },
      {
        onSuccess: () => { toast({ title: "Plan mis à jour." }); setEditingId(null); setForm(emptyForm); setShowForm(false); refetch(); },
        onError: () => toast({ title: "Erreur", variant: "destructive" }),
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Supprimer ce plan ?")) return;
    deletePlan.mutate(
      { id },
      {
        onSuccess: () => { toast({ title: "Plan supprimé." }); refetch(); },
        onError: () => toast({ title: "Erreur", variant: "destructive" }),
      }
    );
  };

  const cancel = () => { setEditingId(null); setForm(emptyForm); setShowForm(false); };

  return (
    <div className="space-y-6">
      <Card className="border-primary/10 shadow-md">
        <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestion des plans</CardTitle>
            <CardDescription>Créez et gérez les offres d'abonnement de la plateforme (Economy, Max, etc.).</CardDescription>
          </div>
          <Button onClick={() => { cancel(); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Nouveau plan
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {showForm && (
            <div className="mb-6 p-5 border rounded-lg bg-muted/20 space-y-4">
              <h3 className="font-semibold text-base">{editingId ? "Modifier le plan" : "Créer un plan"}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Nom du plan *</Label>
                  <Input placeholder="ex: Max" value={form.name} onChange={e => setField("name", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Slug (auto)</Label>
                  <Input placeholder="ex: max" value={form.slug} onChange={e => setField("slug", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Prix mensuel (€) *</Label>
                  <Input type="number" step="0.01" placeholder="0" value={form.priceMonthly} onChange={e => setField("priceMonthly", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Prix annuel (€)</Label>
                  <Input type="number" step="0.01" placeholder="Optionnel" value={form.priceAnnual} onChange={e => setField("priceAnnual", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Limite d'annonces</Label>
                  <Input type="number" placeholder="Illimité si vide" value={form.maxAds} onChange={e => setField("maxAds", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Ordre d'affichage</Label>
                  <Input type="number" value={form.sortOrder} onChange={e => setField("sortOrder", e.target.value)} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label>Description</Label>
                  <Input placeholder="Brève description du plan" value={form.description} onChange={e => setField("description", e.target.value)} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label>Fonctionnalités incluses <span className="text-muted-foreground text-xs">(une par ligne)</span></Label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder={"Annonces illimitées\nMise en avant prioritaire\nSupport prioritaire"}
                    value={form.featuresText}
                    onChange={e => setField("featuresText", e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.isActive} onCheckedChange={v => setField("isActive", v)} />
                  <Label>Plan actif</Label>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={editingId ? handleUpdate : handleCreate} disabled={createPlan.isPending || updatePlan.isPending}>
                  {editingId ? "Enregistrer les modifications" : "Créer le plan"}
                </Button>
                <Button variant="ghost" onClick={cancel}>Annuler</Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordre</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prix mensuel</TableHead>
                <TableHead>Prix annuel</TableHead>
                <TableHead>Limite annonces</TableHead>
                <TableHead>Fonctionnalités</TableHead>
                <TableHead>Actif</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>
              ) : plans?.length ? plans.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="text-muted-foreground text-sm">{p.sortOrder}</TableCell>
                  <TableCell>
                    <div className="font-semibold flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500" />
                      {p.name}
                    </div>
                    {p.description && <div className="text-xs text-muted-foreground">{p.description}</div>}
                  </TableCell>
                  <TableCell className="font-semibold text-primary">{p.priceMonthly} €/mois</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.priceAnnual ? `${p.priceAnnual} €/an` : "—"}</TableCell>
                  <TableCell className="text-sm">{p.maxAds != null ? `${p.maxAds} annonces` : "Illimité"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(p.features as string[]).slice(0, 3).map((f, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px]">{f}</Badge>
                      ))}
                      {(p.features as string[]).length > 3 && (
                        <Badge variant="outline" className="text-[10px]">+{(p.features as string[]).length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch checked={p.isActive} onCheckedChange={() => {
                      updatePlan.mutate({ id: p.id, data: { name: p.name, slug: p.slug, description: p.description ?? undefined, priceMonthly: p.priceMonthly, priceAnnual: p.priceAnnual ?? undefined, maxAds: p.maxAds ?? undefined, features: p.features as string[], isActive: !p.isActive, sortOrder: p.sortOrder } }, { onSuccess: () => refetch() });
                    }} />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => startEdit(p)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    Aucun plan configuré. Cliquez sur "Nouveau plan" pour commencer.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ParametresTab() {
  const { toast } = useToast();
  const { data: configs, isLoading, refetch } = useAdminListConfig();
  const updateConfig = useAdminUpdateConfig();
  const [values, setValues] = useState<Record<string, string>>({});
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (configs) {
      const initial: Record<string, string> = {};
      configs.forEach(c => { initial[c.key] = c.value ?? ""; });
      setValues(initial);
    }
  }, [configs]);

  const handleSave = (key: string, isSecret: boolean) => {
    setSaving(s => ({ ...s, [key]: true }));
    updateConfig.mutate(
      { key, data: { value: values[key] ?? "" } },
      {
        onSuccess: () => {
          toast({ title: "Configuration sauvegardée." });
          refetch();
        },
        onError: () => toast({ title: "Erreur lors de la sauvegarde", variant: "destructive" }),
        onSettled: () => setSaving(s => ({ ...s, [key]: false })),
      }
    );
    void isSecret;
  };

  const secretConfigs = configs?.filter(c => c.isSecret) ?? [];
  const publicConfigs = configs?.filter(c => !c.isSecret) ?? [];

  if (isLoading) {
    return <div className="flex items-center gap-2 text-muted-foreground py-10"><Loader2 className="h-5 w-5 animate-spin" /> Chargement...</div>;
  }

  const renderConfigRow = (c: NonNullable<typeof configs>[number]) => {
    const isSecret = c.isSecret;
    const showClear = isSecret && visible[c.key];
    return (
      <div key={c.key} className="space-y-2 p-4 border rounded-lg bg-card">
        <div className="flex items-start justify-between">
          <div>
            <Label className="text-sm font-semibold">{c.label}</Label>
            {c.description && <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>}
          </div>
          {isSecret && (
            <Badge variant="outline" className="text-[10px] text-amber-700 border-amber-300 bg-amber-50">
              Secret
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={isSecret && !visible[c.key] ? "password" : "text"}
              value={values[c.key] ?? ""}
              onChange={e => setValues(v => ({ ...v, [c.key]: e.target.value }))}
              placeholder={isSecret ? "Saisir pour définir ou remplacer la clé" : ""}
              className="pr-10 font-mono text-sm"
            />
            {isSecret && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setVisible(v => ({ ...v, [c.key]: !v[c.key] }))}
                tabIndex={-1}
                title={showClear ? "Masquer" : "Afficher"}
              >
                {showClear ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => handleSave(c.key, isSecret)}
            disabled={saving[c.key]}
            className="shrink-0"
          >
            {saving[c.key] ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sauvegarder"}
          </Button>
        </div>
        {isSecret && c.value && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
            Clé configurée — laissez vide ou saisissez une nouvelle valeur pour remplacer
          </p>
        )}
        {isSecret && !c.value && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400 inline-block" />
            Non configuré
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <Card className="border-primary/10 shadow-md">
        <CardHeader className="bg-muted/30 border-b pb-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <CardTitle>Clés API et intégrations</CardTitle>
          </div>
          <CardDescription>
            Les clés secrètes sont masquées et ne sont jamais affichées en clair. Saisissez une nouvelle valeur pour remplacer une clé existante.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {secretConfigs.length === 0 && !isLoading && (
            <p className="text-muted-foreground text-sm">Aucune clé secrète configurée.</p>
          )}
          {secretConfigs.map(renderConfigRow)}
        </CardContent>
      </Card>

      <Card className="border-primary/10 shadow-md">
        <CardHeader className="bg-muted/30 border-b pb-4">
          <CardTitle>Paramètres généraux</CardTitle>
          <CardDescription>Configurez les paramètres publics de la plateforme.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {publicConfigs.length === 0 && !isLoading && (
            <p className="text-muted-foreground text-sm">Aucun paramètre à configurer.</p>
          )}
          {publicConfigs.map(renderConfigRow)}
        </CardContent>
      </Card>
    </div>
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
            <Input value={formState.siteName} onChange={(e) => setFormState({ ...formState, siteName: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input placeholder="https://..." value={formState.logoUrl} onChange={(e) => setFormState({ ...formState, logoUrl: e.target.value })} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Couleur Primaire</Label>
              <div className="flex gap-2">
                <Input type="color" className="w-12 p-1 h-10 cursor-pointer" value={formState.primaryColor} onChange={(e) => setFormState({ ...formState, primaryColor: e.target.value })} />
                <Input value={formState.primaryColor} onChange={(e) => setFormState({ ...formState, primaryColor: e.target.value })} className="font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Couleur d'Accent</Label>
              <div className="flex gap-2">
                <Input type="color" className="w-12 p-1 h-10 cursor-pointer" value={formState.accentColor} onChange={(e) => setFormState({ ...formState, accentColor: e.target.value })} />
                <Input value={formState.accentColor} onChange={(e) => setFormState({ ...formState, accentColor: e.target.value })} className="font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Couleur de Fond</Label>
              <div className="flex gap-2">
                <Input type="color" className="w-12 p-1 h-10 cursor-pointer" value={formState.backgroundColor} onChange={(e) => setFormState({ ...formState, backgroundColor: e.target.value })} />
                <Input value={formState.backgroundColor} onChange={(e) => setFormState({ ...formState, backgroundColor: e.target.value })} className="font-mono" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Police de caractères</Label>
            <Select value={formState.fontFamily} onValueChange={(v) => setFormState({ ...formState, fontFamily: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
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
        <Card className="overflow-hidden border-2 shadow-xl" style={{ backgroundColor: formState.backgroundColor, fontFamily: formState.fontFamily }}>
          <div className="h-14 border-b flex items-center px-4 justify-between" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center gap-2 font-bold text-lg" style={{ color: formState.primaryColor }}>
              {formState.logoUrl ? (
                <img src={formState.logoUrl} alt="Logo" className="h-8" />
              ) : (
                <div className="h-8 w-8 rounded flex items-center justify-center text-white" style={{ backgroundColor: formState.primaryColor }}>LM</div>
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
              <p style={{ color: '#64748b' }}>Aperçu de la typographie et des couleurs sélectionnées.</p>
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
