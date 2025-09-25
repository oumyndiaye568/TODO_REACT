import { Router } from "express";
import { TaskController } from "../controllers/Task.controller.js"; 
import {authMidlleware} from "../middlewares/auth.middlware.js"
import { upload } from "../middlewares/upload.middlware.js";

const router = Router();

router.post("/", authMidlleware,upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'voiceMessage', maxCount: 1 }]),TaskController.create);

router.get("/", authMidlleware,TaskController.getAll);  

router.get("/:id", authMidlleware,TaskController.getById);  

router.put("/:id", authMidlleware,upload.fields([{ name: 'photo', maxCount: 1 }, 
    { name: 'voiceMessage', maxCount: 1 }]),TaskController.update);

router.delete("/:id",authMidlleware, TaskController.delete);  
router.post("/:id/delegate/:userId", authMidlleware, TaskController.delegate);

router.get("/:id/assignees", authMidlleware, TaskController.getAssignees);

router.delete("/:id/assignee/:userId", authMidlleware, TaskController.removeAssignee);

router.get("/all", authMidlleware, TaskController.getAllTasks);
router.get("/delegated", authMidlleware, TaskController.getDelegatedTasks);

export default router;
