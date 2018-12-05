import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Project from './project';
import User from './user';

@Entity()
export default class Company {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  website: string;

  @OneToMany(type => User, user => user.company)
  users: User[];

  @OneToMany(type => Project, project => project.company)
  projects: Project[];

  constructor(data: Partial<Company> = {}) {
    this.id = data.id;
    this.name = data.name;
    this.users = data.users;
    this.projects = data.projects;
  }
}
