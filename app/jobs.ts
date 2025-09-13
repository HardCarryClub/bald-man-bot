import { logger } from "@app/utilities/logger";
import { sendHostSignupMessages } from "@bot/utilities/host-scheduling";
import { Cron } from "croner";

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
