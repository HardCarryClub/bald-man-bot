import { getMember, type MessageComponentInteraction } from "dressed";
import { GUILD_ID } from "../../../app/utilities/config";
import { refreshUserNotes } from "../../commands/pug-note";
import { isStaff } from "../../utilities/auth";

export const pattern = "pug-note-:userId-refresh";

export default async function (interaction: MessageComponentInteraction, args: { userId: string }) {
  await interaction.deferReply({
    ephemeral: true,
  });

  if (!(await isStaff(interaction.member ?? interaction.user))) {
    await interaction.editReply({
      content: "You do not have permission to use this command.",
    });

    return;
  }

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
