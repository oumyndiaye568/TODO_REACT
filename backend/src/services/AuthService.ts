import { AuthRepository } from "../repositories/Auth.repository.js";

export class AuthService {

    private authRepository: AuthRepository

    constructor() {
        this.authRepository = new AuthRepository()
    }

    async login(username: string, password: string) {
        return this.authRepository.login(username, password)
    }

    async create(data: any) {
        return this.authRepository.create(data)
    }
}
