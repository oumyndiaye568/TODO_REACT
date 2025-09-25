import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { authMidlleware } from "../middlewares/auth.middlware.js";

const router = Router();

router.get("/check-login", UserController.checkLoginAvailability); 
router.get("/", authMidlleware, UserController.getAll);
router.get("/:id", authMidlleware, UserController.findById);
router.post("/", UserController.create); 
router.put("/:id", authMidlleware, UserController.update);
router.delete("/:id", authMidlleware, UserController.delete);

export default router;