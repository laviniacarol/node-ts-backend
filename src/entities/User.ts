import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ type: 'float', default: 0 })
  balance!: number;

  constructor(name?: string, email?: string, password?: string) {
    if (name) this.name = name;
    if (email) this.email = email;
    if (password) this.password = password;
    this.balance = 0;
  }
}