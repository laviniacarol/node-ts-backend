import { UserService } from "../services/UserService";
import { LoginController } from "./LoginController";
import { makeMockRequest } from "../__mocks__/mockRequest.mock";
import { makeMockResponse } from "../__mocks__/mockResponse.mock";

const mockUserService = {
    getToken: jest.fn()
};

jest.mock('../services/UserService', () => {
    return {
        UserService: jest.fn().mockImplementation(() => mockUserService)
    }
});

describe('LoginController', () => {
    const loginController = new LoginController(mockUserService as unknown as UserService);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deve realizar login com sucesso e retornar um token', async () => {
        mockUserService.getToken.mockResolvedValue('mock-token');

        const mockRequest = makeMockRequest({
            body: {
                email: 'user@test.com',
                password: '123456'
            }
        });

        const mockResponse = makeMockResponse();

        await loginController.login(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(200);
        expect(mockResponse.state.json).toMatchObject({ token: 'mock-token' });
        expect(mockUserService.getToken).toHaveBeenCalledWith('user@test.com', '123456');
    });

    it('Deve retornar erro 401 se as credenciais forem inválidas', async () => {
        mockUserService.getToken.mockRejectedValue(new Error('Email/password inválido'));

        const mockRequest = makeMockRequest({
            body: {
                email: 'invalid@test.com',
                password: 'wrongpassword'
            }
        });

        const mockResponse = makeMockResponse();

        await loginController.login(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(401);
        expect(mockUserService.getToken).toHaveBeenCalledWith('invalid@test.com', 'wrongpassword');
    });
});
