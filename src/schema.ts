// schema- collection of GraphQL type definitions

export const typeDefs = `#graphql

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

   enum TimeDifference {
        ONE_HOUR_AGO
        TWO_HOURS_AGO
        ONE_DAY_AGO
        A_MONTH_AGO
        A_YEAR_AGO
    }


    type Query {
        getMetrics(
            pageNumber?: Int,
            pageLimit?: Int,
            metric_name: String,
            project_id: String,     
            time_difference?: TimeDifference,
        ): [Metrics!]!
    }`