import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const ACCESS_TOKEN = process.env.ACCESS_SECRET || "default_secret_key" as string;

export class AuthRepository {

    private prisma: PrismaClient;
    
    constructor() {
        this.prisma = new PrismaClient();
    }

    async login(username: string, password: string) {
        // Trouver l'utilisateur par username
        const user = await this.prisma.user.findUnique({
            where: { username: username }
        });

        if (!user) {
            throw new Error("Utilisateur introuvable");
        }

        // Si c'est un utilisateur de test et pas de mot de passe fourni, permettre la connexion
        if (user.isTestUser && !password) {
            // Pas de vérification de mot de passe
        } else {
            // Vérifier le mot de passe
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Mot de passe incorrect");
            }
        }

        // Générer le token JWT
        const accesstoken = jwt.sign(
            {
                id: user.id,
                name: user.fullname,
                username: user.username
            },
            ACCESS_TOKEN,
            { expiresIn: '24h' }
        );

        return { token: accesstoken, user: { id: user.id, fullname: user.fullname, username: user.username } };
    }

    async create(data: any) {
        // Validations
        if (!data.fullname || data.fullname.trim() === '') {
            throw new Error("Le nom complet est obligatoire");
        }

        if (!data.username || data.username.trim() === '') {
            throw new Error("Le nom d'utilisateur est obligatoire");
        }

        if (!data.password || data.password.length < 6) {
            throw new Error("Le mot de passe doit contenir au moins 6 caractères");
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await this.prisma.user.findUnique({
            where: { username: data.username.trim() }
        });

        if (existingUser) {
            throw new Error("Ce nom d'utilisateur est déjà pris");
        }

        // Hasher le mot de passe avant de le stocker
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const userData = {
            fullname: data.fullname.trim(),
            username: data.username.trim(),
            password: hashedPassword,
            isTestUser: false
        };

        return this.prisma.user.create({ data: userData });
    }
}
