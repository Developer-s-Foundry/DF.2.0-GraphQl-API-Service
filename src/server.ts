import expressConfig from "./common/config/express";
import { APP_CONFIGS } from "./common/config/index";
import express, { Response as ExResponse, Request as ExRequest } from "express";
import { dbInitialization } from "./common/config/database";
import { RegisterRoutes } from './swagger/routes'
import swaggerUi from "swagger-ui-express";
import { logMiddleware } from "./Middleware/metric_middleware";
import { ProjectJob } from "./crons/metric_cron_job";
import { projectWorker } from "./worker/project_worker";
import { consumeProjectMessages } from "./broker/consumers/project_consumer";
import { clearQueueOnShutdown } from "./queue/queue";
import swaggerDoc from "./swagger/swagger.json"
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from "./resolver";
import { typeDefs } from "./schema";



(async () => {
  const app: express.Application = express();
  // expressConfig(app);
  await dbInitialization();

  // app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  //   return res.send(
  //     swaggerUi.generateHTML(swaggerDoc)
  //   );
  // });
  
  // app.use('/logs', logMiddleware)

  // RegisterRoutes(app)


  // Initialize Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(apolloServer, {
  listen: { port: parseInt(APP_CONFIGS.SERVER_PORT) },
});
console.log(`🚀  Server ready at: ${url}`);

  app.listen(APP_CONFIGS.SERVER_PORT, async () => {
    console.log(`Server running on port ${APP_CONFIGS.SERVER_PORT}`);
    await consumeProjectMessages()
    await ProjectJob();
    await projectWorker();
  });

 
})();
 process.on("SIGINT", async () => {
  await clearQueueOnShutdown();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await clearQueueOnShutdown();
  process.exit(0);
});