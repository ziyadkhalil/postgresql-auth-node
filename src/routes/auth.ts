import { Router } from "express";
import { makeAuthService } from "../services/auth";

export const authRouter = Router();

const authService = makeAuthService();

authRouter.post("/register", async (req, res) => {
  try {
    const params = req.body as {
      username: string;
      password: string;
      role: "instructor" | "student";
      name: string;
    };
    const userInfo = await authService.createAccount(
      params.username,
      params.password,
      params.name,
      params.role
    );

    res.json(userInfo);
  } catch (e) {
    res.status(404).send("Failed to create an account");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const params = req.body as {
      username: string;
      password: string;
    };

    const userInfo = await authService.login(params.username, params.password);

    res.json(userInfo);
  } catch (e) {
    res.status(404).send("Failed to login");
  }
});
