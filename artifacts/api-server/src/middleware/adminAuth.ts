import { Request, Response, NextFunction } from "express";

export const ROOT_TOKEN = "localmarket-root-token-2026";
export const ADMIN_TOKEN_PREFIX = "localmarket-admin-token-2026";

function extractToken(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : (req.headers["x-admin-token"] as string | undefined);
}

export function isRootToken(token: string): boolean {
  return token === ROOT_TOKEN;
}

export function isValidAdminToken(token: string): boolean {
  if (token === ROOT_TOKEN) return true;
  // DB admin token format: "localmarket-admin-token-2026:<id>:<role>"
  return token.startsWith(ADMIN_TOKEN_PREFIX + ":");
}

export function getTokenRole(token: string): "root" | "admin" {
  if (token === ROOT_TOKEN) return "root";
  const parts = token.split(":");
  return parts[2] === "root" ? "root" : "admin";
}

export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token || !isValidAdminToken(token)) {
    res.status(401).json({ error: "Accès non autorisé" });
    return;
  }
  (req as Request & { adminRole: string }).adminRole = getTokenRole(token);
  next();
}

export function rootAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token || !isValidAdminToken(token) || getTokenRole(token) !== "root") {
    res.status(403).json({ error: "Accès réservé au root admin" });
    return;
  }
  next();
}
