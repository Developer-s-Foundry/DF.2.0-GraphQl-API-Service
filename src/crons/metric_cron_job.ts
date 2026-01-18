import cron from 'node-cron';
import { ProjectRepository } from '../repositories/project_repo';
import { addJobsToQueue, projectQueue} from '../queue/queue';
import { APP_CONFIGS } from '../common/config';


const projectRepo = new ProjectRepository();


export async function ProjectJob () {

    let isRunning = false
    
    cron.schedule('*/5 * * * *', async () => {
        if (isRunning) return;

        isRunning = true

        try {
            const projects = await projectRepo.findManyByConditions({})


            for (let i = 0; i < projects.length; i++) {
                const project = projects[i];
                addJobsToQueue(projectQueue, APP_CONFIGS.JOB_NAME, project);
                console.log('got added to Queue')
            }
        } finally {
            isRunning = false
        }

        console.log('running a task every minute');
});
}