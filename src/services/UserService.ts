import { AppDataSource } from "../database";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";
import { sign } from "jsonwebtoken";

export class UserService {

    private userRepository: UserRepository;

    constructor(
        userRepository = new UserRepository(AppDataSource.manager),
    ){
        this.userRepository = userRepository;
    }

    createUser = async (name: string, email: string, password: string): Promise<User> => {
        const user = new User(name, email, password);
        return this.userRepository.createUser(user);
    }

    getUser = async (userId: string): Promise<User | null> => {
        return this.userRepository.getUser(userId);
    }

    getUsers = async (): Promise<User[]> => {
        return this.userRepository.getUsers();
    }

    deleteUser = async (email: string): Promise<void> => {
        const user = await this.userRepository.getUserByEmail(email);

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        await this.userRepository.deleteUser(user.email);
    }

    getAuthenticatedUser = async (email: string, password: string): Promise<User | null> => {
        return this.userRepository.getUserByEmailAndPassword(email, password);
    }

    getToken = async (email: string, password: string): Promise<string> => {
        const user = await this.getAuthenticatedUser(email, password);

        if (!user) {
            throw new Error('Email/password inválido');
        }

        const tokenData = {
            name: user?.name,
            email: user?.email
        }

        const tokenKey = '123456789'

        const tokenOptions = {
            subject: user?.user_id,
        }

        const token = sign(tokenData, tokenKey, tokenOptions)

        return token
     }
}