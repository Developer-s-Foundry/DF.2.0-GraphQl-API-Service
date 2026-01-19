import {IsNumber, IsString } from "class-validator"


export class MetricData {

    @IsNumber()
    project_id: number
    
    @IsString()
    type!: string

    @IsString()
    metric_name!: string

    @IsString()
    time_stamp!: Date

    metric!: any 
}

export interface QueryData {
    pageNumber: number
    pageLimit: number
    metric_name?: string
    project_id?: string
}

export enum TimeDifference {
  ONE_HOUR_AGO,
  TWO_HOURS_AGO,
  ONE_DAY_AGO,
  A_MONTH_AGO,
  A_YEAR_AGO
}


export interface metricPatialData {
    metricName: string,
    metricType: string,
    label?: string | Array<string>
}

export interface ProjectData {

    id: number,
    
    name: string,
    
    description: string,
    
    base_url: string

    prometheus_metric_url: string
    
    team_id: number

    owner_id: number
}