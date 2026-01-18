import { MetricData, QueryData, timeDifference} from '../common/types/interface';
import { AppDataSource } from "../common/config/database";
import { Metric } from "../models/entities/metric";
import { Repository } from 'typeorm';
import { ProjectRepository } from './project_repo';





export class MetricRepo {

    private projectRepo: ProjectRepository
    private MetricRepository:  Repository<Metric>
    
    constructor() {
        this.MetricRepository = AppDataSource.getRepository(Metric);
        this.projectRepo = new ProjectRepository();
    }
    
    async createMetric(MetricData: MetricData ): Promise<Metric> {
        // console.log(MetricData)
        if (!MetricData) {
            throw new Error('log data missing')
        }
        // create project using project_id


        let new_metrics = this.MetricRepository.create({...MetricData});

        // save to database
        const foundProject = await this.projectRepo.find(MetricData.project_id);
        if(!foundProject) {
            throw new Error('project not found')
        }
        new_metrics.project = foundProject;
        return await this.MetricRepository.save(new_metrics);
    }

    async getMetrics(data: QueryData, timeData: timeDifference): Promise<Metric[]> {
        const {
                metric_name, pageLimit, pageNumber, project_id} = data;
        
        let startDate;
        const endDate = new Date();

        switch (timeData) {
            case timeDifference.oneHourAgo:
                startDate = new Date(endDate.getTime() - 60 * 60 * 1000 * 1);
                
                break;

             case timeDifference.twoHourAgo:
                startDate = new Date(endDate.getTime() - 60 * 60 * 1000 * 2);
            
                break;

            case timeDifference.oneDayAgo:
                startDate = new Date(endDate.getDay());
            
                break;

            case timeDifference.aMonthAgo:
                startDate = new Date(endDate.getFullYear(), 
                    endDate.getMonth() > 0 ?  endDate.getMonth() - 1 : 0,  endDate.getDay());
                break;

            case timeDifference.aYearAgo:
                startDate = new Date(endDate.getFullYear() - 1,  0,  1);
                
                break;
        
            default:
                startDate = new Date(endDate.getTime() - 60 * 60 * 1000 * 1);
                break;
        }

        const queryBuild = this.MetricRepository.createQueryBuilder().where(`
            time_stamp BETWEEN :startDate and :endDate`, {startDate, endDate}
            )
            .andWhere(`project_id = :project_id`, {project_id})

        if (metric_name) {
            queryBuild.andWhere(`metric_name = :metric_name`, {metric_name})
        }

    
        const logs = await queryBuild.skip(pageNumber)
            .take(pageLimit)
            .getMany();

        console.log(logs);

        return logs;
    }
}