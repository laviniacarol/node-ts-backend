import { UserService } from "../services/UserService";
import { UserController } from "./UserController";
import { makeMockRequest } from "../__mocks__/mockRequest.mock";
import { makeMockResponse } from "../__mocks__/mockResponse.mock";
import { Request } from "express";

const mockUserService = {
    createUser: jest.fn(),
    deleteUser: jest.fn(),
    getUsers: jest.fn()
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
            message: 'Bad Request: User.Name obrigatório'
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
            message: 'Bad Request: User.Email obrigatório'
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
            message: 'Bad Request: User.Password obrigatório'
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
});