import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
    userService: UserService;

    constructor(userService = new UserService()) {
        this.userService = userService;
    }

    createUser = async (request: Request, response: Response) => {
        const { name, email, password } = request.body;

        if (!name) {
            return response.status(400).json({
                message: 'Bad Request: User.Name obrigatório'
            });
        }

        if (!email) {
            return response.status(400).json({
                message: 'Bad Request: User.Email obrigatório'
            });
        }

        if (!password) {
            return response.status(400).json({
                message: 'Bad Request: User.Password obrigatório'
            });
        }

        try {
            const user = await this.userService.createUser(name, email, password);
            return response.status(201).json(user);
        } catch {
            return response.status(500).json({
                message: 'Internal server error'
            });
        }
    };

    getUsers = async (request: Request, response: Response) => {
        try {
            const users = await this.userService.getUsers();
            return response.status(200).json(users);
        } catch {
            return response.status(500).json({
                message: 'Internal server error'
            });
        }
    };

    deleteUser = async (request: Request, response: Response) => {
        const email = request.params.email as string;

        if (!email) {
            return response.status(400).json({
                message: 'Bad Request: Email obrigatório'
            });
        }

        try {
            await this.userService.deleteUser(email);

            return response.status(200).json({
                message: 'Usuário deletado'
            });
        } catch (error) {
            if (error instanceof Error) {
                return response.status(404).json({
                    message: error.message
                });
            }

            return response.status(500).json({
                message: 'Internal server error'
            });
        }
    };
}