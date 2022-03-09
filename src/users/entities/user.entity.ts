import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany
} from 'typeorm';
import { Report } from '../../reports/entities/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User', this.logUser());
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User', this.logUser());
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User', this.logUser());
  }

  logUser() {
    return {
      id: this.id,
      email: this.email,
      password: this.password
    }
  }
}