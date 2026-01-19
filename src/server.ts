import { APP_CONFIGS } from "./common/config/index";
import { dbInitialization } from "./common/config/database";
import { ProjectJob } from "./crons/metric_cron_job";
import { projectWorker } from "./worker/project_worker";
import { consumeProjectMessages } from "./broker/consumers/project_consumer";
import { clearQueueOnShutdown } from "./queue/queue";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { expressMiddleware } from "@as-integrations/express4";
import { resolvers } from "./resolver";
import { typeDefs } from "./schema";
import express from "express";
import http from "http";
import { json } from "body-parser";
import { logMiddleware } from "./Middleware/metric_middleware";
import cors from "cors";

(async () => {
  try {
    console.log("Starting GraphQL server...");

    // Initialize database

    // const app = express();
    // const httpServer = http.createServer(app);

    // Initialize Apollo Server with logging plugin
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      // introspection: true,
      // formatError: (formattedError, error) => {
      //   console.error("GraphQL Error:", formattedError);
      //   return {
      //     ...formattedError,
      //     extensions: {
      //       ...formattedError.extensions,
      //       timestamp: new Date().toISOString(),
      //     },
      //   };
      // },
    });

    // await apolloServer.start();

    const app: express.Application = express();
    console.log("Initializing database...");
    await dbInitialization();
    console.log("Database initialized");

    // app.use(
    //   "/graphql",
    //   cors(),
    //   json(),
    //   logMiddleware,
    //   expressMiddleware(apolloServer),
    // );

    // Start standalone Apollo Server
    const { url } = await startStandaloneServer(apolloServer, {
      listen: { port: parseInt(APP_CONFIGS.SERVER_PORT) },
    });

    console.log(`GraphQL Server ready at: ${url}`);
    console.log(`GraphQL Playground available at: ${url}`);

    // Initialize background jobs and workers
    console.log("Initializing background services...");

    await consumeProjectMessages();
    console.log("Message consumer started");

    await ProjectJob();
    console.log("Project cron job started");

    await projectWorker();
    console.log("Project worker started");

    console.log("All services running successfully");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  console.log(`${signal} received. Starting graceful shutdown...`);

  try {
    console.log("Clearing queues...");
    await clearQueueOnShutdown();
    console.log("Queues cleared");

    console.log("Graceful shutdown complete");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

// Handle termination signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection");
});
