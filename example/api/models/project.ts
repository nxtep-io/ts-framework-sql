import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import Company from './company';
import User from './user';

@Entity()
export default class Project {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(type => Company, company => company.projects)
  company: Company;

  @JoinTable()
  @ManyToMany(type => User, user => user.projects)
  users: User[];

  constructor(data: Partial<Project> = {}) {
    this.id = data.id;
    this.name = data.name;
    this.company = data.company;
    this.users = data.users;
  }

}
