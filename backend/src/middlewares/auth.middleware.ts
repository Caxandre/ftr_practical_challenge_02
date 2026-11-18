import type { Request } from "express";
import { verifyToken } from "../modules/auth/auth.service";

export function getUserIdFromRequest(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;

  const token = header.slice("Bearer ".length).trim();
  const payload = verifyToken(token);
  return payload?.userId ?? null;
}
