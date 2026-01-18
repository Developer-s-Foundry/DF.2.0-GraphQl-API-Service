// import { createChannel } from "../../common/config/rabbitmq";
// import { APP_CONFIGS } from "../../common/config";
// import { addJobsToQueue, logDetails } from "../../queue/queue";

// export const consumeMsg = () => {
//   const assertQueueOptions = { durable: true };
//   console.log('sending message to queue');

//   return createChannel()
//     .then((channel) => {
//       console.log('here is the consumed message channel');

//       if (!channel) {
//         throw new Error('failed to create a channel');
//       }

//       // assert the queue first (and wait for completion)
//       return channel.assertExchange(APP_CONFIGS.PROM_EXCHANGE_NAME, 'fanout', {durable: false})
//         .then( async () => {
//           console.log('Exchange asserted successfully');

//           // start consuming messages
//           const queueCopy = await channel.assertQueue('', { exclusive: true });
//           await channel.bindQueue(queueCopy.queue, APP_CONFIGS.PROM_EXCHANGE_NAME, '');
  
//           channel.consume(queueCopy.queue, (msg) => {
//             if (!msg) {
//               console.error('Consumer cancelled by server');
//               return;
//             }

//             try {
//               const content = JSON.parse(msg.content.toString());
//               console.log('Received message:', content);

//               // send to BullMQ queue
//               addJobsToQueue(logDetails, APP_CONFIGS.JOB_NAME, content)
//                 .then(() => {
//                   console.log('Job added to queue');
//                   // channel.ack(msg);
//                 })
//                 .catch((err) => {
//                   console.error('Error adding job to queue:', err);
//                   channel.nack(msg, false, false); // reject message if processing fails
//                 });

//             } catch (error) {
//               console.error('Error handling message:', error);
//               channel.nack(msg, false, false);
//             }
//           });

//           console.log('Consumer is now listening for messages...');
//         })
//         .catch((err) => {
//           console.error(`Error asserting queue: ${err.message || err}`);
//           throw err;
//         });
//     })
//     .catch((err) => {
//       console.error(`Consumer initialization failed: ${err.message || err}`);
//       throw err;
//     });
// };
