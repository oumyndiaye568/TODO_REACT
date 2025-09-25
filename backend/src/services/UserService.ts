import { UserRepository } from "../repositories/User.repository.js";
import type { User } from "@prisma/client";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.getAll();
    }

    async findUserById(id: number): Promise<User | null> {
        return this.userRepository.getById(id);
    }

    async createUser(data: Omit<User, "id">): Promise<User> {
        return this.userRepository.create(data);
    }

    async updateUser(id: number, data: Partial<User>): Promise<User> {
        return this.userRepository.update(id, data);
    }

    async deleteUser(id: number): Promise<void> {
        return this.userRepository.delete(id);
    }

    async findUserByLogin(login: string): Promise<User | null> {
        return this.userRepository.findByLogin(login);
    }
}