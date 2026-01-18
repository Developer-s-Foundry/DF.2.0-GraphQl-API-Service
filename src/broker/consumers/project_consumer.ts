import { createChannel } from "../../common/config/rabbitmq";
import { ProjectRepository } from "../../repositories/project_repo";


export async function consumeProjectMessages() {
  // console.log('I ran')
  const channel = await createChannel();
  const queue = "projects_queue";
 
  await channel.assertQueue(queue, { durable: true });
  // console.log('I ran')
  channel.consume(queue, async (msg: any) => {
    if (msg !== null) { 
      console.log('message is not null')
      const receivedMessage = msg.content.toString();
      const sentData = JSON.parse(msg.content);
      const { data, event_type } = sentData;

      if (!data) return;
      const projectRepository = new ProjectRepository()
      const {id, name, description, base_url, prometheus_metric_url, team_id, owner_id } = data;
      switch (event_type) {
        case "PROJECT_CREATED":
          await projectRepository.create({
            id,
            name,
            description,
            base_url,
            prometheus_metric_url,
            team_id,
            owner_id,
          });
          console.log(`Project created`);
          break;
 
        case "PROJECT_UPDATED":
          await projectRepository.update({
            name,
            id,
            description,
            base_url,
            prometheus_metric_url,
            team_id,
            owner_id,
          });
          console.log(`Project updated`);
          break;
 
        case "PROJECT_DELETED":
          await projectRepository.delete(id);
          console.log(`Project deleted`);
          break;
 
        default:
          break;
      }
 
      console.log(
          `Message successfully consumed from queue: ${queue} - Message: ${receivedMessage}`
        );
 
    //   channel.ack(msg);
    }
  });
 
}
 