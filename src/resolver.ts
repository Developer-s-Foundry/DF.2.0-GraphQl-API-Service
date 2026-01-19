// handles the queries and mutations for metrics
import { TimeDifference } from "./common/types/interface";
import { MetricRepo } from "./repositories/metrics_repo";

const metricRepo = new MetricRepo();

export const resolvers = {

    Query: {
        getMetrics: async (_: any, args: {project_id: string, time_difference?: TimeDifference, page?: number, metric_name: string, limit?: number}) => {
            const { project_id, time_difference, page, metric_name, limit } = args;

            const pageLimit = limit || 10;
            const pageNumber = page || 0;
            const timeDifferences = time_difference || TimeDifference.ONE_HOUR_AGO;

            const queryData = {
                metric_name,
                pageNumber,
                pageLimit,
                project_id
            };

            return await metricRepo.getMetrics(queryData, timeDifferences);
        }
    }
};