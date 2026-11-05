import { Router } from "express";
import { forgotPassword, login, register } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/me", authenticate, (req, res) => {
  res.json(req.auth);
});

export default router;
