import { Router } from "express";
import { HistoryController } from "../controllers/HistoryController.js";
import { authMidlleware } from "../middlewares/auth.middlware.js";

const router = Router();

router.get("/", authMidlleware, HistoryController.getAll);

export default router;