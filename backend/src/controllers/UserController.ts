import { Request, Response } from "express";
import { User } from "@prisma/client";
import { UserService } from "../services/UserService.js";

const service = new UserService();

export class UserController {
    static async getAll(_req: Request, res: Response) {
        try {
            const users = await service.getAllUsers();
            res.json(users);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const user = await service.findUserById(id);
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé" });
            }
            return res.json(user);
        } catch (error: any) {
           return res.status(400).json({ error: error.message });
        }
    }


    static async create(req: Request, res: Response) {
        try {
            const data = req.body as Omit<User, "id">;
            const user = await service.createUser(data);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const data = req.body as Partial<Omit<User, "id">>;
            const user = await service.updateUser(id, data);
            res.json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            await service.deleteUser(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async checkLoginAvailability(req: Request, res: Response) {
        try {
            const { login } = req.query;
            if (!login || typeof login !== 'string') {
                res.status(400).json({ error: 'Login requis' });
                return;
            }

            const user = await service.findUserByLogin(login.trim());
            res.json({ available: !user });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
