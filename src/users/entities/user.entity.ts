import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

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