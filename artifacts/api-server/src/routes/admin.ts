import { Router } from "express";
import { AdminLoginBody } from "@workspace/api-zod";

const router = Router();

const ADMIN_EMAIL = "admin@localmarket.fr";
const ADMIN_PASSWORD = "admin123";
const ADMIN_TOKEN = "localmarket-admin-token-2026";

// POST /admin/login
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = AdminLoginBody.parse(req.body);
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      res.json({ success: true, token: ADMIN_TOKEN });
    } else {
      res.status(401).json({ success: false, token: "" });
    }
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid credentials format" });
  }
});

export default router;
