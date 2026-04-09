import { Router } from 'express'
import { UserController } from './controllers/UserController'
import { LoginController } from './controllers/LoginController'
import { verifyAuth } from './middleware/verifyAuth'

export const router = Router()

const userController = new UserController()
const loginController = new LoginController()

router.post('/user', userController.createUser)
router.get('/user', verifyAuth, userController.getUsers)
router.get('/user/:userId', verifyAuth, userController.getUserById)

router.delete('/user/:email', userController.deleteUser)

router.post('/login', loginController.login)