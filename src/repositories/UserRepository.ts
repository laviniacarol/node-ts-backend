import { EntityManager } from "typeorm";
import { User } from "../entities/User";

export class UserRepository {
    private manager: EntityManager;

    constructor(manager: EntityManager) {
        this.manager = manager;
    }

    createUser = async (user: User): Promise<User> => {
        return this.manager.save(user);
    }

    getUser = async (userId: string): Promise<User | null> => {
        return this.manager.findOne(User, {
            where: { user_id: userId }
        });
    }

    getUsers = async (): Promise<User[]> => {
        return this.manager.find(User);
    }

    getUserByEmail = async (email: string): Promise<User | null> => {
        return this.manager.findOne(User, {
            where: { email }
        });
    }

    deleteUser = async (email: string): Promise<void> => {
        await this.manager.delete(User, { email });
    }
}