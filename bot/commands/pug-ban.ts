import {
  addMemberRole,
  type CommandConfig,
  type CommandInteraction,
  CommandOption,
  editMessage,
} from "dressed";
import { eq } from "drizzle-orm";
import { db } from "../../app/db";
import { pugBans } from "../../app/db/schema";
import { GUILD_ID, PUG_BANNED_ROLE_ID } from "../../app/utilities/env";

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
    CommandOption({
      name: "reason",
      description: "The reason for banning the user from PUGs.",
      type: "String",
      required: false,
    }),
  ],
};

export default async function (interaction: CommandInteraction) {
  await interaction.deferReply({
    ephemeral: true,
  });

  const userToBan = interaction.getOption("user", true).user();

  if (!userToBan) {
    return interaction.editReply({
      content: "You must provide a user to ban.",
    });
  }

  const existingBan = await db
    .select()
    .from(pugBans)
    .where(eq(pugBans.userId, userToBan.id));

  if (existingBan.length > 0) {
    await addMemberRole(
      interaction.guild_id ?? GUILD_ID,
      userToBan.id,
      PUG_BANNED_ROLE_ID,
    );

    return interaction.editReply({
      content: `${userToBan.username} is already banned from PUGs.`,
    });
  }
}
