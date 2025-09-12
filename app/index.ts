import { db } from "@app/db";
import { GUILD_ID, PUG_BANNED_ROLE_ID } from "@app/utilities/config";
import { logger } from "@app/utilities/logger";
import { audit } from "@bot/utilities/audit";
import { sendHostSignupMessages } from "@bot/utilities/host-scheduling";
import { createConnection } from "@dressed/ws";
import to from "await-to-js";
import { Cron } from "croner";
import { addMemberRole } from "dressed";
import { createInteraction, handleInteraction } from "dressed/server";
import { commands, components, config } from "../.dressed";

logger.info("Starting Dressed WS server");
const connection = createConnection({
  intents: ["GuildMembers"],
  shards: {
    reshardInterval: -1,
  },
});

connection.shards.reshard(1);

connection.onReady((data) => {
  logger.info(`Connected as ${data.user.global_name || data.user.username}`);
});

connection.onInteractionCreate((data) => {
  const interaction = createInteraction(data);
  handleInteraction(commands, components, interaction, config.middleware);
});

connection.onGuildMemberAdd(async (data) => {
  logger.info(
    {
      ...data.user,
    },
    "New member joined",
  );

  const userId = data.user.id;

  const [err, dbResult] = await to(
    db.query.pugBan.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    }),
  );

  if (err) {
    logger.error({ err }, "Error checking for PUG ban");
    return;
  }

  if (dbResult) {
    logger.info("User was previously PUG banned, reapplying ban");
    await addMemberRole(data.guild_id ?? GUILD_ID, userId, PUG_BANNED_ROLE_ID);

    audit("PUG Ban", `Re-applied PUG ban to ${data.user.username} upon re-joining the server.`);
  }
});

export const signupJobs = {
  overwatch: new Cron(
    "0 13 * * 1",
    {
      name: "host-scheduler-overwatch",
      catch: (err) => {
        logger.error({ err }, "Error running Overwatch host signup creation job");
      },
    },
    async () => {
      logger.info("Running Overwatch host signup creation job");

      await sendHostSignupMessages("overwatch");
    },
  ),
  rivals: new Cron(
    "0 13 * * 1",
    {
      name: "host-scheduler-rivals",
      catch: (err) => {
        logger.error({ err }, "Error running Rivals host signup creation job");
      },
    },
    async () => {
      logger.info("Running Rivals host signup creation job");

      await sendHostSignupMessages("rivals");
    },
  ),
};
