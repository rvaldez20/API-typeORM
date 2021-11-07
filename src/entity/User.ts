import {Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { MinLength, IsNotEmpty, IsEmail } from "class-validator";
import  * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['username'])

export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MinLength(6)
    @IsEmail()
    @IsNotEmpty()
    username: string;

    @Column()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    CreateAt: Date;

    @Column()
    @UpdateDateColumn()
    updateAt: Date;

    //methods
    hashPassword():void {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    // password es el que viene desde el frontend
    checkPassword(password:string):boolean {
        return bcrypt.compareSync(password, this.password)
    }
}
