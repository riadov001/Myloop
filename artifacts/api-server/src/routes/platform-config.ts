import { Router } from "express";
import { db, platformConfigTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { adminAuth } from "../middleware/adminAuth";
import { z } from "zod/v4";

const router = Router();

const MASK = "••••••••••••••••";

const UpdateConfigSchema = z.object({
  value: z.string(),
});

function maskConfig(row: typeof platformConfigTable.$inferSelect) {
  return {
    key: row.key,
    value: row.isSecret ? (row.value ? MASK : null) : row.value,
    isSecret: row.isSecret,
    label: row.label,
    description: row.description ?? null,
  };
}

const DEFAULT_CONFIG = [
  { key: "stripe_api_key", label: "Clé API Stripe", description: "Clé secrète Stripe (sk_...)", isSecret: true },
  { key: "stripe_webhook_secret", label: "Secret Webhook Stripe", description: "Secret de validation des webhooks Stripe (whsec_...)", isSecret: true },
  { key: "resend_api_key", label: "Clé API Resend", description: "Clé API pour l'envoi d'emails via Resend", isSecret: true },
  { key: "from_email", label: "Email expéditeur", description: "Adresse email utilisée pour les envois (ex: noreply@localmarket.fr)", isSecret: false },
  { key: "contact_email", label: "Email de contact", description: "Email affiché pour le support / contact", isSecret: false },
  { key: "site_url", label: "URL du site", description: "URL publique de la plateforme (ex: https://localmarket.fr)", isSecret: false },
];

async function ensureDefaults() {
  const existing = await db.select({ key: platformConfigTable.key }).from(platformConfigTable);
  const existingKeys = new Set(existing.map(r => r.key));
  const toInsert = DEFAULT_CONFIG.filter(c => !existingKeys.has(c.key));
  if (toInsert.length > 0) {
    await db.insert(platformConfigTable).values(
      toInsert.map(c => ({ key: c.key, label: c.label, description: c.description, isSecret: c.isSecret, value: null }))
    );
  }
}

// GET /admin/config
router.get("/admin/config", adminAuth, async (req, res) => {
  try {
    await ensureDefaults();
    const rows = await db.select().from(platformConfigTable).orderBy(platformConfigTable.key);
    res.json(rows.map(maskConfig));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération de la configuration" });
  }
});

// PUT /admin/config/:key
router.put("/admin/config/:key", adminAuth, async (req, res) => {
  try {
    const key: string = req.params.key as string;
    const { value } = UpdateConfigSchema.parse(req.body);

    const [existing] = await db
      .select()
      .from(platformConfigTable)
      .where(eq(platformConfigTable.key, key));

    if (!existing) {
      res.status(404).json({ error: "Clé de configuration introuvable" });
      return;
    }

    // If the submitted value is the mask, don't update — keep existing secret
    const newValue = (existing.isSecret && value === MASK) ? existing.value : value;

    const [updated] = await db
      .update(platformConfigTable)
      .set({ value: newValue })
      .where(eq(platformConfigTable.key, key))
      .returning();

    res.json(maskConfig(updated));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Données invalides" });
  }
});

export default router;
