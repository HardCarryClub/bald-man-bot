import { createServer } from "dressed/server";
import { commands, components, config, events } from "../.dressed";
import { database } from "./db";
import { logger } from "./utilities/logger";

logger.info("Starting Dressed server");
createServer(commands, components, events, config);
