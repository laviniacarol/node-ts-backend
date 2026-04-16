import { Response, Request } from "express"
import { sign } from "jsonwebtoken"
import { UserService } from "../services/UserService"



export class LoginController {
  userService: UserService;

  constructor(
      userService = new UserService(),
  ){
    this.userService = userService;
  }


     login = async (request: Request, response: Response) => {
        const { email, password } = request.body

        try {
            const result = await this.userService.getToken(email, password)
            return response.status(200).json(result)
        } catch (error) {
            return response.status(401).json({ message: error })
        }
     
     }
}