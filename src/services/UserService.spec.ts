import { UserService } from "./UserService"
import * as jwt from 'jsonwebtoken'


jest.mock('../repositories/UserRepository')
jest.mock('../database', () => ({
    AppDataSource: {
        manager: {}
    }
}))

jest.mock('jsonwebtoken')

const mockUserRepository = require('../repositories/UserRepository')



describe('UserService', () => {
    const userService = new UserService(mockUserRepository)  
    const mockUser = {
         user_id: '123456',
            name: 'John Doe',
            email: 'John@test.com',
            password: '123456'
    }  
   
    it('Deve adicionar um novo usuário', async () => {
        mockUserRepository.createUser = jest.fn().mockImplementation(() => Promise.resolve({
            user_id: '123456',
            name: 'John Doe',
            email: 'John@test.com',
            password: '123456'
        }))
        const response = await userService.createUser('nath', 'nath@test.com', '12345')
        expect(mockUserRepository.createUser).toHaveBeenCalled()
        expect(response).toMatchObject({
            user_id: '123456',
            name: 'John Doe',
            email: 'John@test.com',
            password: '123456'
        })
    })

    it('Devo retornar um token de usuário', async () => {
        jest.spyOn(userService, 'getAuthenticatedUser').mockImplementation((email: string, password: string) => Promise.resolve(mockUser))
        jest.spyOn(jwt, 'sign').mockImplementation(() => 'token')
        const token = await userService.getToken('John@test.com', '123456')
        expect(token).toBe('token')
    })

    it('Deve lançar um erro se o email ou password for inválido', async () => {
        jest.spyOn(userService, 'getAuthenticatedUser').mockImplementation(() => Promise.resolve(null))
        await expect(userService.getToken('invalid@test.com', 'wrongpassword')).rejects.toThrow('Email/password inválido')
    })

    it('Deve deletar um usuário', async () => {
        mockUserRepository.getUserByEmail = jest.fn().mockResolvedValue(mockUser)
        mockUserRepository.deleteUser = jest.fn().mockResolvedValue(undefined)
        await expect(userService.deleteUser('John@test.com')).resolves.toBeUndefined()
        expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith('John@test.com')
        expect(mockUserRepository.deleteUser).toHaveBeenCalledWith('John@test.com')
    })

    it('Deve lançar um erro ao deletar usuário não encontrado', async () => {
        mockUserRepository.getUserByEmail = jest.fn().mockResolvedValue(null)
        await expect(userService.deleteUser('notfound@test.com')).rejects.toThrow('Usuário não encontrado')
    })

})