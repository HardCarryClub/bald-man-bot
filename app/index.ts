import { db } from "@app/db";
import { GUILD_ID, PUG_BANNED_ROLE_ID } from "@app/utilities/config";
import { logger } from "@app/utilities/logger";
import { audit } from "@bot/utilities/audit";
import { createConnection } from "@dressed/ws";
import to from "await-to-js";
import { addMemberRole } from "dressed";
import { createServer } from "dressed/server";
import { commands, components, config, events } from "../.dressed";

logger.info("Starting Dressed server");
createServer(commands, components, events, config);

logger.info("Starting Dressed WS server");
const connection = createConnection({
  intents: ["GuildMembers"],
});

connection.onReady((data) => {
  logger.info(`Connected as ${data.user.global_name || data.user.username}`);
});

connection.onGuildMemberAdd(async (data) => {
  // logger.info(`New member joined: ${data.user.tag}`);
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
