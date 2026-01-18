import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";


export class BaseModel {
    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Exclude()
    @CreateDateColumn({type: 'timestamptz'})
    created_at!: Date

    @Exclude()
    @UpdateDateColumn({type: 'timestamptz'})
    update_at!: Date
} 