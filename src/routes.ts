import { Router, Request, Response } from 'express'
import { UserController } from './controllers/UserController'
import { LoginController } from './controllers/LoginController'

export const router = Router()

const userController = new UserController()
const loginController = new LoginController()

router.post('/user', userController.createUser)
router.get('/user', userController.getUsers)

router.delete('/user', (request: Request, response: Response) => {
  const user = request.body
  return response.status(200).json({ message: 'Usuário deletado' })
})

router.post('/login', loginController.login)