import {
  type CommandConfig,
  type CommandInteraction,
  CommandOption,
} from "dressed";
import { database } from "../../app/db";
import { pugBans } from "../../app/db/schema";

export const config: CommandConfig = {
  description: "Ban a user from PUGs.",
  default_member_permissions: "0",
  options: [
    CommandOption({
      name: "user",
      description: "The user to ban from PUGs.",
      type: "User",
      required: true,
    }),
  ],
};

export default async function pugBan(interaction: CommandInteraction) {
  await interaction.deferReply({
    ephemeral: true,
  });

  const userToBan = interaction.getOption("user", true).user();

  if (!userToBan) {
    return interaction.editReply({
      content: "You must provide a user to ban.",
    });
  }

  const r = await database.select().from(pugBans);

  console.log("Current PUG bans:", r);
}
