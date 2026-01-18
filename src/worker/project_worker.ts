import { Worker } from "bullmq";
import { redisConnection } from "../common/config/bullmq";
import { APP_CONFIGS } from "../common/config";
import { fetchRecommendation, getFullMetricsData, getTimeStampSeries} from "../common/utils/helper_func";
import { MetricRepo } from "../repositories/metrics_repo";
import { publishMsg, PubToNotification } from "../broker/producers/producer";



export async function projectWorker() {

    const metricRepo = new MetricRepo();

    const worker = new Worker(APP_CONFIGS.QUEUE_NAME, async (job) => {
        const prometheus_metric_url = job.data.prometheus_metric_url;
        const prometheusServerUrl = `https://${prometheus_metric_url}/api/v1/query?query=`
        console.log(prometheus_metric_url);
        // get the list of metrics names
        const metricsMetadata = await getFullMetricsData(prometheus_metric_url);
        console.log(metricsMetadata);
        const allRecommendation : any = {}
        // loop through data
        // save each recommendation in an array
        for (const [metricName, metricValue] of Object.entries(metricsMetadata)) {
            // console.log(`key: ${metricName}`)
            

            let metricData = {
                    type: '',
                    metric_name: '',
                    time_stamp: new Date(),
                    metric: {},
                    value: 0,
                    project_id: 0
            }
            const allSeries = `${prometheusServerUrl}${metricName}`;
            
            metricData.metric_name = metricName;
             console.log(`key: ${metricData.metric_name}`)
            const type = Object.values(metricValue[0])[0];
            console.log(type);
            metricData.type = type;
            const unformattedData =  await getTimeStampSeries(allSeries);
            console.log(unformattedData);
            unformattedData.forEach( async(metrics: any) => {

                const values: any = Object.values(metrics);
                metricData.metric = values[0];
                metricData.value = values[1][1]
                metricData.time_stamp = values[1][0] && new Date(values[1][0] * 1000);
                metricData.project_id = Number(job.data.id);

                // create metric and save to database
                const savedMetrics = await metricRepo.createMetric(metricData);
                console.log(savedMetrics)
                PubToNotification(JSON.stringify(savedMetrics))
                // publish to notificationQueue

                console.log('persisted to database')
            });
           
             // based on type, give a recommendation
             switch (type) {
                case 'counter':
                    const total = await fetchRecommendation(`${prometheusServerUrl}sum(increase(${metricData.metric_name}[5m]))`)
                    const counterDataFormat = {
                         [`total_${metricData.metric_name} in 5m`]: total, 

                         [`request_rate_${metricData.metric_name} in 5m`]: await fetchRecommendation(`${prometheusServerUrl}sum(rate(${metricData.metric_name}[5m]))`)
                    } 
                    allRecommendation['counter'] = {counter: counterDataFormat  }           
                    break;

                 case 'gauge':
                    const gaugeDataFormat = {
                         [`value over the_last_5_minutes_${metricData.metric_name} in 5m`]: await fetchRecommendation(`${prometheusServerUrl}avg_over_time(${metricData.metric_name}[5m])`),

                        [`value over the_last_5_minutes_${metricData.metric_name} in 5m`]: await fetchRecommendation(`${prometheusServerUrl}max_over_time(${metricData.metric_name}[5m])`)
                    } 
                    allRecommendation['gauge'] = {gauge: gaugeDataFormat}
                    break;

                case 'histogram':
                const histogramDataFormat = {
                         [`95th percentile latency_${metricData.metric_name}_bucket in 5m`]: await fetchRecommendation(`${prometheusServerUrl}histogram_quantile(0.95, sum(rate(${metricData.metric_name}_bucket[5m])) by (le))`)
                    } 
                    allRecommendation['histogram'] = {histogram: histogramDataFormat}
                break;
             
                default:
                    allRecommendation['metrics_type'] = {metric_type: 'not found'}
                    break;
             }

             allRecommendation['project_id'] = {project_id: metricData.project_id}

              // publish to broker when loop ends
        publishMsg(JSON.stringify(allRecommendation));
        console.log('published to broker')
            
        }      

    }, {connection: redisConnection})

    worker.on('completed', (job) => console.log(`Job ${job.id} completed`));
    worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed:`, err))
}