import { Entity, Column, ManyToOne, JoinColumn,  } from "typeorm";
import { BaseModel } from "./base_model";
import { Project } from "./project";


@Entity()
export class Metric extends BaseModel{

    // @Column()
    // type!: string
    
    @Column()
    metric_name!:  string

    @Column({type: 'timestamptz'})
    time_stamp!: Date

    // @Column({ type: 'jsonb'}) 
    // labels!: any 

    @Column({type: 'jsonb'})
    metric!: any

    @Column('float')
    value: number

    // @Column({type: 'jsonb'})
    // extras!: any

    @Column()
    project_id: number

    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    @ManyToOne(() => Project, (project) => project.metrics)
    project!: Project
}