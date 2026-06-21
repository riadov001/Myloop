import { Request, Response, NextFunction } from "express";

const ADMIN_TOKEN = "localmarket-admin-token-2026";

export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : (req.headers["x-admin-token"] as string | undefined);

  if (!token || token !== ADMIN_TOKEN) {
    res.status(401).json({ error: "Accès non autorisé" });
    return;
  }
  next();
}
