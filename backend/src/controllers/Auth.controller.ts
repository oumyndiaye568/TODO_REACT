
import { AuthService } from "../services/AuthService.js";

import type { Request,Response } from "express";


export  class AuthController {

    private static authService = new AuthService();

    static async login(req:Request,res:Response)
    {
        try {
            const {username,password} = req.body

            const token =  await AuthController.authService.login(username,password)

            res.status(200).json(token)
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async create(req:Request,res:Response)
    {
        try {
            const user = await AuthController.authService.create(req.body)
            res.status(201).json(user)
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
