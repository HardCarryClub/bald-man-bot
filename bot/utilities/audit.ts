import { config } from "@app/utilities/config";
import { logger } from "@app/utilities/logger";
import to from "await-to-js";
import { Routes } from "discord-api-types/v10";
import { callDiscord } from "dressed/utils";

export async function audit(module: string, message: string) {
  const [err] = await to(
    callDiscord(Routes.webhook(config.auditLogWebhook.id, config.auditLogWebhook.token), {
      method: "POST",
      body: {
        content: `**[${module}]** ${message}`,
      },
    }),
  );

  if (err) {
    logger.error({ err, message }, "Failed to call audit log webhook");
  }
}
