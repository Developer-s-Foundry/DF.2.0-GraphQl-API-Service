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

export enum timeDifference {
    oneHourAgo = '1-hour-ago',
    twoHourAgo = '2-hours-ago',
    oneDayAgo = "1-day-ago",
    aMonthAgo = '1-month-ago',
    aYearAgo = '1-year-ago'
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