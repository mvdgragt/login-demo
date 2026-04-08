import { Router } from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { loginSchema } from "../src/types";

const prisma = new PrismaClient();
export const authRouter = Router();

// POST /api/auth/login  (prefix /api/auth comes from index.ts)
authRouter.post("/login", async (req: Request, res: Response) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.issues[0].message });
      return;
    }
    const { email, code } = result.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user || user.code !== code) {
      res.status(401).json({ error: "Invalid email or code." });
      return;
    }

    req.session.user = { id: String(user.id), role: user.role, name: user.firstName };
    res.json({ success: true, role: user.role });
  },
);

// POST /api/auth/logout
authRouter.post("/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

// GET /api/auth/me
authRouter.get("/me", (req: Request, res: Response) => {
  if (!req.session?.user) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }
  res.json(req.session.user);
});
