import { AppDataSource } from "../database";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";

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

    getUsers = async (): Promise<User[]> => {
        return this.userRepository.getUsers();
    }

    deleteUser = async (email: string): Promise<void> => {
        const user = await this.userRepository.getUserByEmail(email);

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        await this.userRepository.deleteUser(email);
    }
}