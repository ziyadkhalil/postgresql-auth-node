import { NextFunction, Request, Response } from "express";
import { makeAuthService } from "../services/auth";

const authService = makeAuthService();

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error();
    const { id, username } = authService.verify(token) as {
      id: number;
      username: string;
    };
    res.locals.user = { id, username };
    next();
  } catch (e) {
    res.status(401).send("Unauthorized");
  }
}
