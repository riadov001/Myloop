import { Router } from "express";
import { db, adsTable } from "@workspace/db";
import { eq, and, ilike, or } from "drizzle-orm";
import {
  ListAdsQueryParams,
  CreateAdBody,
  GetAdParams,
  AdminListAdsQueryParams,
  UpdateAdStatusParams,
  UpdateAdStatusBody,
  DeleteAdParams,
} from "@workspace/api-zod";

const router = Router();

// GET /ads — list published ads with optional filters
router.get("/ads", async (req, res) => {
  try {
    const query = ListAdsQueryParams.parse(req.query);
    let conditions: ReturnType<typeof eq>[] = [eq(adsTable.status, "published")];

    const ads = await db
      .select()
      .from(adsTable)
      .where(and(...conditions))
      .orderBy(adsTable.createdAt)
      .limit(query.limit ?? 50)
      .offset(query.offset ?? 0);

    let filtered = ads;
    if (query.location) {
      filtered = filtered.filter((a) =>
        a.location.toLowerCase().includes((query.location as string).toLowerCase())
      );
    }
    if (query.product) {
      filtered = filtered.filter((a) =>
        a.product.toLowerCase().includes((query.product as string).toLowerCase()) ||
        a.title.toLowerCase().includes((query.product as string).toLowerCase())
      );
    }
    if (query.category) {
      filtered = filtered.filter((a) =>
        a.category.toLowerCase() === (query.category as string).toLowerCase()
      );
    }

    res.json(
      filtered.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid query params" });
  }
});

// POST /ads — create a new ad (pending review)
router.post("/ads", async (req, res) => {
  try {
    const body = CreateAdBody.parse(req.body);
    const [ad] = await db
      .insert(adsTable)
      .values({
        title: body.title,
        description: body.description,
        location: body.location,
        product: body.product,
        quantity: body.quantity,
        category: body.category,
        contactPhone: body.contactPhone,
        contactEmail: body.contactEmail,
        status: "pending",
      })
      .returning();
    res.status(201).json({ ...ad, createdAt: ad.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid ad data" });
  }
});

// GET /ads/:id — get single ad
router.get("/ads/:id", async (req, res) => {
  try {
    const { id } = GetAdParams.parse(req.params);
    const [ad] = await db.select().from(adsTable).where(eq(adsTable.id, id));
    if (!ad) return res.status(404).json({ error: "Ad not found" });
    res.json({ ...ad, createdAt: ad.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid id" });
  }
});

// GET /admin/ads — list all ads (admin)
router.get("/admin/ads", async (req, res) => {
  try {
    const query = AdminListAdsQueryParams.parse(req.query);
    const conditions = query.status
      ? [eq(adsTable.status, query.status as "pending" | "published" | "rejected")]
      : [];

    const ads = await db
      .select()
      .from(adsTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(adsTable.createdAt);

    res.json(ads.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid query" });
  }
});

// PATCH /admin/ads/:id/status — update ad status
router.patch("/admin/ads/:id/status", async (req, res) => {
  try {
    const { id } = UpdateAdStatusParams.parse(req.params);
    const { status } = UpdateAdStatusBody.parse(req.body);
    const [updated] = await db
      .update(adsTable)
      .set({ status })
      .where(eq(adsTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Ad not found" });
    res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

// DELETE /admin/ads/:id
router.delete("/admin/ads/:id", async (req, res) => {
  try {
    const { id } = DeleteAdParams.parse(req.params);
    await db.delete(adsTable).where(eq(adsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid id" });
  }
});

export default router;
