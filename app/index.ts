import { createServer } from "dressed/server";
import { commands, components, config, events } from "~/.dressed";
// import { database } from "./db";
import { logger } from "./utilities/logger";

logger.info("Connecting to database");
// await database.authenticate();

logger.info("Starting Dressed server");
createServer(commands, components, events, config).on("close", async () => {
  logger.info("Dressed server closed, closing DB connection");
  // await database.close();
});
