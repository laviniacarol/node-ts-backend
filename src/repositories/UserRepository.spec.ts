import { EntityManager } from "typeorm"
import { getMockEntityManager } from "../__mocks__/mockEntityManager.mock"
import { User } from "../entities/User"
import { UserRepository } from "./UserRepository"


describe('UserRepository', () => {
    const mockUser: User = {
        user_id: '12345',
        name: 'John Doe',
        email: 'test@exemplo.com',
        password: 'password'
    }

    it('Deve cadastrar um novo usuário no banco de dados', async () => {
        const managerMock = await getMockEntityManager({ saveReturn: mockUser })
        const userRepository = new UserRepository(managerMock as EntityManager)
        const response = await userRepository.createUser(mockUser)
        expect(managerMock.save).toHaveBeenCalled()
        expect(response).toMatchObject(mockUser)
    })

    it('Deve buscar um usuário pelo ID', async () => {
        const managerMock = await getMockEntityManager({ findOneReturn: mockUser })
        const userRepository = new UserRepository(managerMock as EntityManager)
        const response = await userRepository.getUser(mockUser.user_id)
        expect(managerMock.findOne).toHaveBeenCalled()
        expect(response).toMatchObject(mockUser)
    })

    it('Deve retornar null se o usuário não for encontrado pelo ID', async () => {
        const managerMock = await getMockEntityManager({ findOneReturn: null })
        const userRepository = new UserRepository(managerMock as EntityManager)
        const response = await userRepository.getUser('inexistente')
        expect(managerMock.findOne).toHaveBeenCalled()
        expect(response).toBeNull()
    })

    it('Deve listar todos os usuários', async () => {
        const managerMock = await getMockEntityManager({ findReturn: [mockUser] })
        const userRepository = new UserRepository(managerMock as EntityManager)
        const response = await userRepository.getUsers()
        expect(managerMock.find).toHaveBeenCalled()
        expect(response).toMatchObject([mockUser])
    })

    it('Deve buscar um usuário por email e senha', async () => {
        const managerMock = await getMockEntityManager({ findOneReturn: mockUser })
        const userRepository = new UserRepository(managerMock as EntityManager)
        const response = await userRepository.getUserByEmailAndPassword(mockUser.email, mockUser.password)
        expect(managerMock.findOne).toHaveBeenCalled()
        expect(response).toMatchObject(mockUser)
    })

    it('Deve buscar um usuário por email', async () => {
        const managerMock = await getMockEntityManager({ findOneReturn: mockUser })
        const userRepository = new UserRepository(managerMock as EntityManager)
        const response = await userRepository.getUserByEmail(mockUser.email)
        expect(managerMock.findOne).toHaveBeenCalled()
        expect(response).toMatchObject(mockUser)
    })

    it('Deve deletar um usuário', async () => {
        const managerMock = await getMockEntityManager({})
        const userRepository = new UserRepository(managerMock as EntityManager)
        await userRepository.deleteUser(mockUser.email)
        expect(managerMock.delete).toHaveBeenCalled()
    })
})
