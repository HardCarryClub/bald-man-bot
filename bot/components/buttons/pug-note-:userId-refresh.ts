import type { APIUser } from "discord-api-types/v10";
import { getMember, getUser, type MessageComponentInteraction } from "dressed";
import { GUILD_ID } from "../../../app/utilities/env";
import { refreshUserNotes } from "../../commands/pug-note";

export default async function (
  interaction: MessageComponentInteraction,
  args: { userId: string },
) {
  await interaction.deferReply({
    ephemeral: true,
  });

  const userId = args.userId;

  if (!userId) {
    await interaction.editReply({
      content: "User ID is required.",
    });

    return;
  }

  const guildMember = await getMember(interaction.guild_id ?? GUILD_ID, userId);

  if (!guildMember) {
    await interaction.editReply({
      content: "Guild member not found.",
    });
    return;
  }

  await refreshUserNotes(guildMember.user);

  await interaction.editReply({
    content: `Notes for user <@${userId}> have been refreshed.`,
  });
}
