import { gql } from "apollo-server-express";

export const typeDefs = gql`

scalar Date
scalar JSON

type Project {
  id: ID!
  name: String!
  description: String
  base_url: String
  prometheus_metric_url: String
  team_id: Int
  owner_id: Int
  created_at: Date
  updated_at: Date
}

type Metric {
  id: ID!
  created_at: Date!
  updated_at: Date!
  metric_name: String!
  time_stamp: Date
  metric: JSON
  value: Float
  project_id: ID!
  project: Project
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
    pageNumber: Int
    pageLimit: Int
    metric_name: String
    project_id: ID!
    time_difference: TimeDifference
  ): [Metric!]!
}
`;
