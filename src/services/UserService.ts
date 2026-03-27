

export interface User {
    name: string;
    email: string;
}

const db = [
    {
        name: "John Doe",
        email: "example@gmail.com"
    }
]



export class UserService {

db: User[]

constructor(
    database = db
) {
    this.db = database
}
    createUser = (name: string, email: string) => {
        const user = {
            name,
            email
        }
        this.db.push(user)
        console.log('DB atualizado', this.db)
    }

    getAllUser = () => {
        return this.db
    }
}