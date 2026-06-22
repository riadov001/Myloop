import { Router } from "express";
import { db, adsTable, usersTable, adminUsersTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { adminAuth } from "../middleware/adminAuth";

const router = Router();

// GET /admin/stats
router.get("/admin/stats", adminAuth, async (req, res) => {
  try {
    const [totalAdsRow] = await db.select({ c: count() }).from(adsTable);
    const [pendingRow] = await db.select({ c: count() }).from(adsTable).where(eq(adsTable.status, "pending"));
    const [publishedRow] = await db.select({ c: count() }).from(adsTable).where(eq(adsTable.status, "published"));
    const [rejectedRow] = await db.select({ c: count() }).from(adsTable).where(eq(adsTable.status, "rejected"));
    const [totalUsersRow] = await db.select({ c: count() }).from(usersTable);
    const [totalAdminsRow] = await db.select({ c: count() }).from(adminUsersTable);

    res.json({
      totalAds: totalAdsRow?.c ?? 0,
      pendingAds: pendingRow?.c ?? 0,
      publishedAds: publishedRow?.c ?? 0,
      rejectedAds: rejectedRow?.c ?? 0,
      totalUsers: totalUsersRow?.c ?? 0,
      totalAdmins: totalAdminsRow?.c ?? 0,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des stats" });
  }
});

export default router;
