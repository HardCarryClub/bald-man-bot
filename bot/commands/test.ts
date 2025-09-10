import { signupMessageComponents } from "@bot/utilities/host-scheduling";
import { MessageFlags } from "discord-api-types/v10";
import type { CommandConfig, CommandInteraction } from "dressed";

export const config: CommandConfig = {
  description: "Test command",
  default_member_permissions: ["Administrator"],
  guilds: ["1018219866081210469"], // Dev Guild ID
};

export default async function (interaction: CommandInteraction) {
  await interaction.reply({
    components: signupMessageComponents("overwatch") || [],
    flags: MessageFlags.IsComponentsV2,
  });
}
