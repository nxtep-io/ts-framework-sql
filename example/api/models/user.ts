import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, Index } from 'typeorm';
import Project from './project';
import Company from './company';

@Entity(User.tableName)
export default class User {
  private static readonly tableName = 'user';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @ManyToOne(type => Company, company => company.users)
  company: Company;

  @ManyToMany(type => Project, project => project.users)
  projects: Project[];

  constructor(data: Partial<User> = {}) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.company = data.company;
    this.projects = data.projects;
  }

}
