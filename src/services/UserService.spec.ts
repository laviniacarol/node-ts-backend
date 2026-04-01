import { UserService } from "./UserService"


jest.mock('../repositories/UserRepository')
jest.mock('../database', () => {
    initialize: jest.fn()
})

const mockUserRepository = require('../repositories/UserRepository')



describe('UserService', () => {
    const userService = new UserService(mockUserRepository)    
   
    it('Deve adicionar um novo usuário', async () => {
        mockUserRepository.createUser = jest.fn().mockImplementation(() => Promise.resolve({
            id_user: '123456',
            name: 'John Doe',
            email: 'John@test.com',
            password: '123456'
        }))
        const response = await userService.createUser('nath', 'nath@test.com', '12345')
        expect(mockUserRepository.createUser).toHaveBeenCalled()
        expect(response).toMatchObject({
            id_user: '123456',
            name: 'John Doe',
            email: 'John@test.com',
            password: '123456'
        })
    })

})