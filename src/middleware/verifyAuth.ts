import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export function verifyAuth(request: Request, response: Response, next: NextFunction) {
 const authToken = request.headers['authorization'];

 if(authToken) {
    const [, token] = authToken.split(' ');
    try {
        const { sub } = verify(token, '123456789') as { sub: string };
        console.log('Token verificado, userId:', sub);
        return next();
    } catch (error) {
        return response.status(401).json({ message: 'Unauthorized: Token inválido' });
    }
 }

    return response.status(401).json({ message: 'Unauthorized: Token não fornecido' });
}