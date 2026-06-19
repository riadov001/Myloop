import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { RegisterBody, UserLoginBody } from "@workspace/api-zod";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "localmarket-dev-secret-2026";
const JWT_EXPIRES = "7d";

function makeToken(user: { id: number; name: string; email: string }) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function toProfile(user: { id: number; name: string; email: string; createdAt: Date }) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt.toISOString() };
}

// POST /auth/register
router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = RegisterBody.parse(req.body);
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "Cette adresse email est déjà utilisée." });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(usersTable).values({ name, email, passwordHash }).returning();
    const token = makeToken(user);
    res.status(201).json({ token, user: toProfile(user) });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Données invalides." });
  }
});

// POST /auth/login
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = UserLoginBody.parse(req.body);
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Identifiants incorrects." });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Identifiants incorrects." });
      return;
    }
    const token = makeToken(user);
    res.json({ token, user: toProfile(user) });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Données invalides." });
  }
});

// GET /auth/me
router.get("/auth/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Token manquant." });
      return;
    }
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { id: number };
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.id)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Utilisateur introuvable." });
      return;
    }
    res.json(toProfile(user));
  } catch {
    res.status(401).json({ error: "Token invalide ou expiré." });
  }
});

export default router;
