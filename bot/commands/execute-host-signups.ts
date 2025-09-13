import { signupJobs } from "@app/jobs";
import { GUILD_ID } from "@app/utilities/config";
import { isStaff } from "@bot/utilities/authz.ts";
import to from "await-to-js";
import { MessageFlags } from "discord-api-types/v10";
import type { CommandConfig, CommandInteraction } from "dressed";

export const config: CommandConfig = {
  description: "Execute host signups job manually",
  default_member_permissions: ["Administrator"],
  guilds: [GUILD_ID],
};

export default async function (interaction: CommandInteraction) {
  if (!(await isStaff(interaction.member ?? interaction.user))) {
    await interaction.editReply({
      content: "You do not have permission to use this command.",
    });

    return;
  }

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  for (const job of Object.values(signupJobs)) {
    const [err] = await to(job.trigger());

    if (err) {
      await interaction.editReply({
        content: `Failed to execute job **${job.name}**: ${err.message}`,
      });
      return;
    }
  }

  await interaction.editReply({
    content: "Successfully executed all host signup jobs.",
  });
}
