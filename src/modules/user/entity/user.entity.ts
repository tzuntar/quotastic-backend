import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password?: string;

    @Column({default: 0})
    karma?: number;

    @Column({nullable: true})
    avatarUrl?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    //@OneToMany(() => Quote, (quote) => quote.user)
    //quotes: Quote[];

}
