import { db, categoriesTable, unitsTable, promotionPricesTable } from "@workspace/db";

async function seed() {
  await db.insert(categoriesTable).values([
    { name: "Fruits", slug: "fruits", active: true },
    { name: "Légumes", slug: "legumes", active: true },
    { name: "Bois", slug: "bois", active: true },
    { name: "Sable", slug: "sable", active: true },
    { name: "Terre", slug: "terre", active: true },
    { name: "Compost", slug: "compost", active: true },
    { name: "Foin", slug: "foin", active: true },
    { name: "Paille", slug: "paille", active: true },
    { name: "Matériaux", slug: "materiaux", active: true },
    { name: "Services", slug: "services", active: true },
    { name: "Divers", slug: "divers", active: true },
  ]).onConflictDoNothing();

  await db.insert(unitsTable).values([
    { name: "Kilogramme", symbol: "kg", active: true },
    { name: "Gramme", symbol: "g", active: true },
    { name: "Tonne", symbol: "tonne", active: true },
    { name: "Litre", symbol: "litre", active: true },
    { name: "Mètre cube", symbol: "m³", active: true },
    { name: "Stère", symbol: "stère", active: true },
    { name: "Palette", symbol: "palette", active: true },
    { name: "Sac", symbol: "sac", active: true },
    { name: "Caisse", symbol: "caisse", active: true },
    { name: "Pièce", symbol: "pièce", active: true },
    { name: "Lot", symbol: "lot", active: true },
  ]).onConflictDoNothing();

  await db.insert(promotionPricesTable).values([
    { duration: 7, label: "7 jours", price: "9.90", active: true },
    { duration: 15, label: "15 jours", price: "17.90", active: true },
    { duration: 30, label: "30 jours", price: "29.90", active: true },
  ]).onConflictDoNothing();

  console.log("Seed terminé avec succès.");
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
