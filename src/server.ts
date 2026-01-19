// server.ts - GraphQL Server with Logging
import { APP_CONFIGS } from "./common/config/index";
import { dbInitialization } from "./common/config/database";
import { ProjectJob } from "./crons/metric_cron_job";
import { projectWorker } from "./worker/project_worker";
import { consumeProjectMessages } from "./broker/consumers/project_consumer";
import { clearQueueOnShutdown } from "./queue/queue";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolver";
import { typeDefs } from "./schema";

// GraphQL Plugin for Logging (replaces logMiddleware)
const loggingPlugin = {
  async requestDidStart(requestContext: any) {
    const start = Date.now();
    const { request } = requestContext;

    // Log incoming request
    console.log("📥 GraphQL Request:", {
      operation: request.operationName,
      query: request.query?.substring(0, 100), // First 100 chars
      variables: request.variables,
      timestamp: new Date().toISOString(),
    });

    return {
      async willSendResponse(responseContext: any) {
        const duration = Date.now() - start;
        const { response, errors } = responseContext;

        // Log response
        if (errors) {
          console.error("❌ GraphQL Errors:", {
            operation: request.operationName,
            errors: errors.map((e: any) => e.message),
            duration: `${duration}ms`,
          });
        } else {
          console.log("✅ GraphQL Response:", {
            operation: request.operationName,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
          });
        }

        // You can also save to database here if your logMiddleware did that
        // await saveLogToDatabase({...});
      },
    };
  },
};

(async () => {
  try {
    console.log("🚀 Starting GraphQL server...");

    // Initialize database
    console.log("📦 Initializing database...");
    await dbInitialization();
    console.log("✅ Database initialized");

    // Initialize Apollo Server with logging plugin
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      plugins: [loggingPlugin], // Add logging plugin
      formatError: (formattedError, error) => {
        console.error("GraphQL Error:", formattedError);
        return {
          ...formattedError,
          extensions: {
            ...formattedError.extensions,
            timestamp: new Date().toISOString(),
          },
        };
      },
    });

    // Start standalone Apollo Server
    const { url } = await startStandaloneServer(apolloServer, {
      listen: { port: parseInt(APP_CONFIGS.SERVER_PORT) },
    });

    console.log(`🚀 GraphQL Server ready at: ${url}`);
    console.log(`📊 GraphQL Playground available at: ${url}`);

    // Initialize background jobs and workers
    console.log("🔄 Initializing background services...");

    await consumeProjectMessages();
    console.log("✅ Message consumer started");

    await ProjectJob();
    console.log("✅ Project cron job started");

    await projectWorker();
    console.log("✅ Project worker started");

    console.log("✅ All services running successfully");
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

  try {
    console.log("🧹 Clearing queues...");
    await clearQueueOnShutdown();
    console.log("✅ Queues cleared");

    console.log("👋 Graceful shutdown complete");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

// Handle termination signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection");
});
