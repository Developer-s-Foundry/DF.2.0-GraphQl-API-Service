import { Queue } from "bullmq"
import { APP_CONFIGS } from "../common/config";
import { redisConnection } from "../common/config/bullmq";


// set up a queue
// export const logDetails = new Queue(APP_CONFIGS.QUEUE_NAME, {connection: redisConnection});
// ptoject queue
export const projectQueue = new Queue(APP_CONFIGS.QUEUE_NAME, {connection: redisConnection});

export const addJobsToQueue = async (Queue_obj: Queue, jobname: string, msg: {}) => {
    if (!Queue_obj) {
        throw new Error('fail to initialise queue')
    }
   await Queue_obj.add(jobname, msg)
}

export async function clearQueueOnShutdown() {
  console.log("\n🔄 Cleaning BullMQ queue before shutdown...");

  try {
    // Remove waiting + delayed
    await projectQueue.drain(true);

    // Clean other states
   await projectQueue.clean(
  60000, // 1 minute
  1000, // max number of jobs to clean
  'paused',
);
await projectQueue.clean(
  60000, // 1 minute
  1000, // max number of jobs to clean
  'failed',
);

await projectQueue.clean(
  60000, // 1 minute
  1000, // max number of jobs to clean
  'active',
);
    await projectQueue.clean(
  60000, // 1 minute
  1000, // max number of jobs to clean
  'wait',
);

await projectQueue.clean(
  60000, // 1 minute
  1000, // max number of jobs to clean
  'delayed',
);
 

    console.log("✅ Queue successfully cleared.");
  } catch (err) {
    console.error("❌ Failed to clean projectQueue:", err);
  }
}

