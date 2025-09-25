import { PrismaClient, type User } from "@prisma/client";
import type { IRepository } from "./Irepository.js";

export class UserRepository implements IRepository<User> {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getAll(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async getById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id }
        });
    }

    async create(data: Omit<User, "id">): Promise<User> {
        return this.prisma.user.create({
            data
        });
    }

    async update(id: number, data: Partial<User>): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data
        });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.user.delete({
            where: { id }
        });
    }

    async findByLogin(login: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { login }
        });
    }
}