import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateAd } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, "Le titre doit faire au moins 5 caractères"),
  description: z.string().optional(),
  location: z.string().min(2, "La localisation est requise"),
  product: z.string().min(2, "Le produit est requis"),
  quantity: z.string().optional(),
  category: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Email invalide").optional().or(z.literal('')),
});

export default function PostAd() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createAd = useCreateAd();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      product: "",
      quantity: "",
      category: "AUTRES",
      contactPhone: "",
      contactEmail: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createAd.mutate(
      { data: values },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error) => {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la création de l'annonce.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isSuccess) {
    return (
      <PublicLayout>
        <div className="container max-w-2xl py-20 flex flex-col items-center justify-center text-center">
          <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Annonce envoyée !</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            Votre annonce a bien été enregistrée. Elle est actuellement en cours de révision par notre équipe et sera publiée prochainement.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setLocation("/publicites")}>
              Voir les annonces
            </Button>
            <Button onClick={() => { setIsSuccess(false); form.reset(); }}>
              Déposer une autre annonce
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-primary/5 py-8 border-b border-border/50">
        <div className="container max-w-3xl">
          <Button variant="ghost" onClick={() => setLocation("/")} className="mb-4 -ml-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour à l'accueil
          </Button>
          <h1 className="text-3xl font-bold">Déposer une annonce</h1>
          <p className="text-muted-foreground mt-2">Partagez vos produits, ressources ou services avec la communauté locale.</p>
        </div>
      </div>

      <div className="container max-w-3xl py-12">
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-8">
            <CardTitle>Détails de l'annonce</CardTitle>
            <CardDescription>Remplissez les informations ci-dessous avec le plus de précision possible.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Titre de l'annonce <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Tomates bio du jardin à échanger" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localisation <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Place du marché, Centre-ville" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="product"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Produit / Élément <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Tomates Coeur de Boeuf" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantité</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 5 kg, 3 cageots..." className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description détaillée</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez votre produit, vos conditions d'échange, etc." 
                            className="min-h-[120px] resize-y" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6 pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold">Contact (Optionnel)</h3>
                  <p className="text-sm text-muted-foreground -mt-4">
                    Laissez un moyen de vous joindre directement. Si vide, les utilisateurs utiliseront la messagerie intégrée.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email de contact</FormLabel>
                          <FormControl>
                            <Input placeholder="votre@email.fr" type="email" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="06 12 34 56 78" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex justify-end">
                  <Button type="submit" size="lg" className="w-full md:w-auto min-w-[200px]" disabled={createAd.isPending}>
                    {createAd.isPending ? "Envoi en cours..." : "Publier l'annonce"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
