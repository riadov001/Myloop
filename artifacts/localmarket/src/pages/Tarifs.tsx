import { useLocation } from "wouter";
import { Check, Zap, Star, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useListPlans } from "@workspace/api-client-react";

const ICONS = [Star, Zap, Rocket];
const COLORS = [
  { bg: "bg-slate-100 dark:bg-slate-800", badge: "bg-slate-200 text-slate-700", btn: "bg-slate-700 hover:bg-slate-800 text-white", border: "border-slate-200" },
  { bg: "bg-primary/5", badge: "bg-primary text-primary-foreground", btn: "bg-primary hover:bg-primary/90 text-primary-foreground", border: "border-primary/30" },
  { bg: "bg-amber-50 dark:bg-amber-950/30", badge: "bg-amber-500 text-white", btn: "bg-amber-500 hover:bg-amber-600 text-white", border: "border-amber-300" },
];

export default function Tarifs() {
  const [, setLocation] = useLocation();
  const { data: plans, isLoading } = useListPlans();

  const activePlans = plans?.filter(p => p.isActive).sort((a, b) => a.sortOrder - b.sortOrder) ?? [];

  return (
    <PublicLayout>
      <section className="py-16 lg:py-24">
        <div className="container max-w-6xl px-4">
          <div className="text-center mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Offres & Abonnements
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Choisissez votre plan
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Des offres adaptées à chaque besoin, du particulier au professionnel.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[0, 1, 2].map(i => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : activePlans.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">Aucun plan disponible pour le moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {activePlans.map((plan, i) => {
                const color = COLORS[i % COLORS.length];
                const Icon = ICONS[i % ICONS.length];
                const isPopular = i === 1;
                const features = plan.features as string[];

                return (
                  <div key={plan.id} className={`relative ${isPopular ? "md:-mt-4" : ""}`}>
                    {isPopular && (
                      <div className="absolute -top-4 left-0 right-0 flex justify-center">
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                          Populaire
                        </span>
                      </div>
                    )}
                    <Card className={`overflow-hidden border-2 ${color.border} shadow-xl ${isPopular ? "shadow-primary/20" : ""}`}>
                      <CardHeader className={`${color.bg} p-8 pb-6`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color.badge}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          {plan.name.toLowerCase() === "max" && (
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[11px] font-bold">
                              MAX
                            </Badge>
                          )}
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">{plan.name}</h2>
                        {plan.description && (
                          <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                        )}
                        <div className="mt-6">
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-foreground">
                              {plan.priceMonthly === "0" ? "Gratuit" : `${plan.priceMonthly} €`}
                            </span>
                            {plan.priceMonthly !== "0" && (
                              <span className="text-muted-foreground text-sm">/mois</span>
                            )}
                          </div>
                          {plan.priceAnnual && plan.priceMonthly !== "0" && (
                            <p className="text-xs text-muted-foreground mt-1">
                              ou {plan.priceAnnual} €/an{" "}
                              <span className="text-green-600 font-semibold">
                                (économisez {Math.round((1 - Number(plan.priceAnnual) / (Number(plan.priceMonthly) * 12)) * 100)}%)
                              </span>
                            </p>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-6 space-y-6">
                        {plan.maxAds != null && (
                          <div className="text-sm font-semibold text-foreground border-b border-border/40 pb-4">
                            {plan.maxAds} annonce{plan.maxAds > 1 ? "s" : ""} active{plan.maxAds > 1 ? "s" : ""}
                          </div>
                        )}
                        {plan.maxAds == null && (
                          <div className="text-sm font-bold text-primary border-b border-border/40 pb-4">
                            Annonces illimitées
                          </div>
                        )}
                        <ul className="space-y-3">
                          {features.map((f, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-foreground">
                              <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={`w-full h-11 font-semibold ${color.btn}`}
                          onClick={() => {
                            if (plan.priceMonthly === "0") {
                              setLocation("/inscription");
                            } else {
                              setLocation(`/inscription?plan=${plan.slug}`);
                            }
                          }}
                        >
                          {plan.priceMonthly === "0" ? "Commencer gratuitement" : `Choisir ${plan.name}`}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-16 text-center">
            <p className="text-muted-foreground text-sm mb-6">
              Toutes les offres incluent un accès complet à la plateforme d'échanges locaux.
              <br />Paiement sécurisé par Stripe. Annulation à tout moment.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm">
              {["Accès immédiat", "Sans engagement", "Support inclus", "100% sécurisé"].map(t => (
                <div key={t} className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
