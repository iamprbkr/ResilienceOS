import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role, UserContext } from "../types.js";

export interface AuthenticatedRequest extends Request {
  user: UserContext;
}

const publicPaths = ["/health", "/ready", "/auth/login", "/auth/demo-token"];

export function requireAuth(jwtSecret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (publicPaths.some((p) => req.path.startsWith(p))) {
      (req as AuthenticatedRequest).user = {
        sub: "anon",
        tenantId: "none",
        role: "Viewer" as Role,
      };
      next();
      return;
    }

    const header = req.header("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as UserContext;
      (req as AuthenticatedRequest).user = decoded;
    } catch {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    next();
  };
}
