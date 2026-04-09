import { UserService } from "../services/UserService";
import { UserController } from "./UserController";
import { makeMockRequest } from "../__mocks__/mockRequest.mock";
import { makeMockResponse } from "../__mocks__/mockResponse.mock";
import { Request } from "express";

const mockUserService = {
    createUser: jest.fn(),
    deleteUser: jest.fn(),
    getUsers: jest.fn(),
    getUser: jest.fn()
};

jest.mock('../services/UserService', () => {
    return {
        UserService: jest.fn().mockImplementation(() => mockUserService)
    }
});

describe('UserController', () => {

    const userController = new UserController(mockUserService as unknown as UserService);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deve adicionar um novo usuário', async () => {
        mockUserService.createUser.mockResolvedValue({
            id_user: '1',
            name: 'Hugo',
            email: 'hugo@test.com',
            password: '123'
        });

        const mockRequest = {
            body: {
                name: 'Hugo',
                email: 'hugo@test.com',
                password: '123'
            }
        } as Request;

        const mockResponse = makeMockResponse();

        await userController.createUser(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(201);

        expect(mockUserService.createUser).toHaveBeenCalledWith(
            'Hugo',
            'hugo@test.com',
            '123'
        );
    });

    it('Deve retornar erro se name não for informado', async () => {
        const mockRequest = makeMockRequest({
            body: {
                name: '',
                email: 'hugo@test.com',
                password: 'password'
            }
        });

        const mockResponse = makeMockResponse();

        await userController.createUser(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(400);
        expect(mockResponse.state.json).toMatchObject({
            message: 'Bad Request: Todos os campos são obrigatórios'
        });

        expect(mockUserService.createUser).not.toHaveBeenCalled();
    });

    it('Deve retornar erro se email não for informado', async () => {
        const mockRequest = makeMockRequest({
            body: {
                name: 'Hugo',
                email: '',
                password: 'password'
            }
        });

        const mockResponse = makeMockResponse();

        await userController.createUser(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(400);
        expect(mockResponse.state.json).toMatchObject({
            message: 'Bad Request: Todos os campos são obrigatórios'
        });

        expect(mockUserService.createUser).not.toHaveBeenCalled();
    });

    it('Deve retornar erro se password não for informado', async () => {
        const mockRequest = makeMockRequest({
            body: {
                name: 'Hugo',
                email: 'hugo@test.com',
                password: ''
            }
        });

        const mockResponse = makeMockResponse();

        await userController.createUser(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(400);
        expect(mockResponse.state.json).toMatchObject({
            message: 'Bad Request: Todos os campos são obrigatórios'
        });

        expect(mockUserService.createUser).not.toHaveBeenCalled();
    });

    it('Deve deletar um usuário', async () => {
        const mockRequest = makeMockRequest({
            params: {
                email: 'teste@email.com'
            }
        });

        const mockResponse = makeMockResponse();

        await userController.deleteUser(mockRequest, mockResponse);

        expect(mockUserService.deleteUser).toHaveBeenCalledWith('teste@email.com');
        expect(mockResponse.state.status).toBe(200);
        expect(mockResponse.state.json).toMatchObject({
            message: 'Usuário deletado'
        });
    });

    it('Deve retornar lista de usuários', async () => {
        mockUserService.getUsers.mockResolvedValue([{
            user_id: '1',
            name: 'Hugo',
            email: 'hugo@test.com',
            password: '123'
        }]);

        const mockRequest = makeMockRequest();
        const mockResponse = makeMockResponse();

        await userController.getUsers(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(200);
        expect(mockUserService.getUsers).toHaveBeenCalled();
    });

    it('Deve retornar 500 se o serviço lançar um erro ao criar usuário', async () => {
        mockUserService.createUser.mockRejectedValue(new Error('Database error'));

        const mockRequest = makeMockRequest({
            body: {
                name: 'Hugo',
                email: 'hugo@test.com',
                password: '123'
            }
        });

        const mockResponse = makeMockResponse();

        await userController.createUser(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(500);
        expect(mockResponse.state.json).toMatchObject({
            message: 'Internal server error'
        });
    });

    it('Deve retornar 500 se o serviço lançar um erro ao buscar usuários', async () => {
        mockUserService.getUsers.mockRejectedValue(new Error('Database error'));

        const mockRequest = makeMockRequest();
        const mockResponse = makeMockResponse();

        await userController.getUsers(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(500);
        expect(mockResponse.state.json).toMatchObject({
            message: 'Internal server error'
        });
    });

    it('Deve retornar 404 se o usuário não existir ao deletar', async () => {
        mockUserService.deleteUser.mockRejectedValue(new Error('Usuário não encontrado'));

        const mockRequest = makeMockRequest({
            params: {
                email: 'notfound@test.com'
            }
        });

        const mockResponse = makeMockResponse();

        await userController.deleteUser(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(404);
        expect(mockResponse.state.json).toMatchObject({
            message: 'Usuário não encontrado'
        });
    });

    it('Deve retornar 500 se ocorrer um erro inesperado ao deletar', async () => {
        mockUserService.deleteUser.mockRejectedValue('unexpected error');

        const mockRequest = makeMockRequest({
            params: {
                email: 'teste@email.com'
            }
        });

        const mockResponse = makeMockResponse();

        await userController.deleteUser(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(500);
        expect(mockResponse.state.json).toMatchObject({
            message: 'Internal server error'
        });
    });

    it('Deve retornar 400 se email não for informado no delete', async () => {
        const mockRequest = makeMockRequest({
            params: {}
        });

        const mockResponse = makeMockResponse();

        await userController.deleteUser(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(400);
        expect(mockResponse.state.json).toMatchObject({
            message: 'Bad Request: Todos os campos são obrigatórios'
        });
        expect(mockUserService.deleteUser).not.toHaveBeenCalled();
    });

    it('Deve retornar o usuário com o userId informado', async () => {
        const mockUser = {
            user_id: '123456',
            name: 'Hugo',
            email: 'hugo@test.com',
            password: '123'
        };
        mockUserService.getUser.mockResolvedValue(mockUser);

        const mockRequest = makeMockRequest({
            params: {
                userId: '123456'
            }
        });
        const mockResponse = makeMockResponse();

        await userController.getUserById(mockRequest, mockResponse);

        expect(mockUserService.getUser).toHaveBeenCalledWith('123456');
        expect(mockResponse.state.status).toBe(200);
    });

    it('Deve retornar 404 se o userId não existir', async () => {
        mockUserService.getUser.mockResolvedValue(null);

        const mockRequest = makeMockRequest({
            params: { userId: 'inexistente' }
        });
        const mockResponse = makeMockResponse();

        await userController.getUserById(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(404);
        expect(mockResponse.state.json).toMatchObject({ message: 'Usuário não encontrado' });
    });

    it('Deve retornar 400 se userId não for informado', async () => {
        const mockRequest = makeMockRequest({ params: {} });
        const mockResponse = makeMockResponse();

        await userController.getUserById(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(400);
        expect(mockUserService.getUser).not.toHaveBeenCalled();
    });

    it('Deve retornar 500 se o serviço lançar um erro ao buscar por userId', async () => {
        mockUserService.getUser.mockRejectedValue(new Error('Database error'));

        const mockRequest = makeMockRequest({
            params: { userId: '123456' }
        });
        const mockResponse = makeMockResponse();

        await userController.getUserById(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(500);
        expect(mockResponse.state.json).toMatchObject({ message: 'Internal server error' });
    });
});