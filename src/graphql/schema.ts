import { gql } from "apollo-server-express";

export const typeDefs = gql`

    type Metrics {
        id: string!
        created_at: String!
        updated_at: String!
        metric_name: string!
        time_stamp: Date
        metric: any
        value!: number
        project_id!: number
        project!: {
            id: number,
            name: string,
            description: string,
            base_url: string,
            prometheus_metric_url: string,
            team_id: number,
            owner_id: number,
            updated_at: Date,
            created_at: Date
            }
    }
        
    type QueryData {
        pageNumber: Int!
        pageLimit: Int!
        metric_name: String!
        project_id: String!
    }

    enum timeDifference {
        oneHourAgo
        twoHourAgo
        oneDayAgo
        aMonthAgo
        aYearAgo
    }

    type Query {

        getMetrics(
            data: QueryData!
            time_difference: timeDifference,
        ): [Metrics!]!
    }`;
