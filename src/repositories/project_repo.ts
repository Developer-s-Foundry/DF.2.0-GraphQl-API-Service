import { ProjectData } from './../common/types/interface';
import { Repository } from "typeorm";
import { Project } from "../models/entities/project";
import { AppDataSource } from "../common/config/database";
import { FindOptionsWhere , FindOneOptions} from 'typeorm';




export class ProjectRepository {

    private projectRepository: Repository<Project>

    constructor() {
        this.projectRepository = AppDataSource.getRepository(Project)
    }

    async create(projectData: ProjectData): Promise<Project>{
        return await this.projectRepository.save(projectData)
    }

    async update(projectData: ProjectData) {
        await this.projectRepository.update(projectData.id, projectData)
    }

    async delete(id: string) {
        return await this.projectRepository.delete(id)
    }

    async find(id: number): Promise<Project | null> {
        return await this.projectRepository.findOneBy({id: id})
    }

    async findManyByConditions(conditions: FindOptionsWhere<Project>): Promise<Project[] | []> {
        return await this.projectRepository.find({
        where: conditions,
        } as FindOneOptions<Project>);
  }
}
