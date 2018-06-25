import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  constructor(data: Partial<User> = {}) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
  }

}
