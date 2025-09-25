import type { Request, Response } from "express";
import { TaskService } from "../services/TaskService.js";
import type {JwtPayload} from "jsonwebtoken"
export class TaskController {
    private static taskService = new TaskService();

    static async getAll(req: Request, res: Response) {
        try {
            const user = req.user as any;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const { tasks, total } = await TaskController.taskService.getAllForUser(user.id, skip, limit);
            res.status(200).json({
                tasks,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // static async create(req: Request, res: Response) 
    // {
    //     try 
    //     {
    //         const user = req.user as JwtPayload;
    //         const task = await TaskController.taskService.create({...req.body,userId:user.id});
    //         res.status(201).json(task);
    //     } catch (error: any) 
    //     {
    //         res.status(500).json({ error: error.message });
    //     }
    // }
    static async create(req: Request, res: Response) {
    try {
      console.log("Create task request received", req.body);
      const user = req.user as any; // ton JWT contient user.id
    //   console.log("User from JWT:", user);
      const { libelle, description, status, userId } = req.body;

      if (!libelle || libelle.trim() === '') {
        res.status(400).json({ error: "Le titre de la tâche est validations." });
        return;
      }

      if (!description || description.trim() === '') {
        res.status(400).json({ error: "La description de la tâche est validations." });
        return;
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const photo = files?.photo ? `uploads/${files.photo[0].filename}` : null;
      const voiceMessage = files?.voiceMessage ? `uploads/${files.voiceMessage[0].filename}` : null;

      const taskData = {
        libelle: libelle.trim(),
        description: description.trim(),
        status,
        userId: Number(userId || user.id), // Allow assigning to another user if provided
        photo,
        voiceMessage,
      };
      console.log("Task data to create:", taskData);

      const task = await TaskController.taskService.create(taskData);
      console.log("Task created successfully:", task);

      res.status(201).json(task);
    } catch (error: any) {
      console.error("Error creating task:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

    static async getById(req: Request, res: Response) 
    {
        try 
        {
            const id = Number(req.params.id);
            const task = await TaskController.taskService.getById(id);
            if (!task) 
            {
                return res.status(404).json({ message: "Task not found" });
            }

            return res.status(200).json(task);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }


    static async update(req: Request, res: Response)
    {
        try
        {
            const id = Number(req.params.id);
            const user = req.user as JwtPayload;
            const updateData = { ...req.body };
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files?.photo) {
                updateData.photo = `uploads/${files.photo[0].filename}`;
            }
            if (files?.voiceMessage) {
                updateData.voiceMessage = `uploads/${files.voiceMessage[0].filename}`;
            }
            const updatedTask = await TaskController.taskService.update(id, user.id, updateData);
            res.status(200).json(updatedTask);
        }
        catch (error: any)
        {
            if (error.message === "Non autorisé") {
                res.status(403).json({ error: "Vous n'avez pas les droits pour modifier cette tâche" });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    static async delete(req: Request, res: Response)
    {
        try
        {
            const id = Number(req.params.id);
            const user = req.user as JwtPayload;
            await TaskController.taskService.delete(id,user.id);
            res.status(204).send();
        } catch (error: any) {
            if (error.message === "Non autorisé") {
                res.status(403).json({ error: "Vous n'avez pas les droits pour supprimer cette tâche" });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    static async delegate(req: Request, res: Response)
    {
        try
        {
            const user = req.user as any;
            const taskId = Number(req.params.id);
            const delegateUserId = Number(req.params.userId);
            console.log(`Delegating task ${taskId} to user ${delegateUserId} by user ${user.id}`);
            await TaskController.taskService.delegateTask(user.id, taskId, delegateUserId);
            res.status(200).json({ message: "Droit délégué avec succès" });
        } catch (error: any)
        {
            console.error('Error delegating:', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getAssignees(req: Request, res: Response) {
        try {
            const taskId = Number(req.params.id);
            const assignees = await TaskController.taskService.getAssignees(taskId);
            res.status(200).json(assignees);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async removeAssignee(req: Request, res: Response) {
        try {
            const user = req.user as any;
            const taskId = Number(req.params.id);
            const assigneeId = Number(req.params.userId);
            await TaskController.taskService.removeAssignee(user.id, taskId, assigneeId);
            res.status(200).json({ message: "Droit retiré avec succès" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllTasks(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const { tasks, total } = await TaskController.taskService.getAll(skip, limit);
            res.status(200).json({
                tasks,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getDelegatedTasks(req: Request, res: Response) {
        try {
            const user = req.user as any;
            console.log(`Getting delegated tasks for user:`, user);
            const tasks = await TaskController.taskService.getDelegatedTasks(user.id);
            console.log(`Found ${tasks.length} delegated tasks`);
            res.status(200).json(tasks);
        } catch (error: any) {
            console.error('Error getting delegated tasks:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
