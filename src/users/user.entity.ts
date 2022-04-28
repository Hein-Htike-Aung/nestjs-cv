import { Exclude } from 'class-transformer';
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    // @Exclude() 
    password: string;

    // Hooks
    @AfterInsert()
    logInsert() {   
        console.log(`Inserted user with id - ${this.id}`);
    }

    // Hooks
    @AfterUpdate()
    logUpadate() {   
        console.log(`Updated user with id - ${this.id}`);
    }

    // Hooks
    @AfterRemove()
    logRemove() {   
        console.log(`Removed user`);
    }
}