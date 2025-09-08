import { formatISO } from "date-fns";
import { MessageFlags } from "discord-api-types/v10";
import { channel, h1, subtext, user } from "discord-fmt";
import {
  addMemberRole,
  type CommandConfig,
  type CommandInteraction,
  CommandOption,
  Container,
  createDM,
  createMessage,
  deleteMessage,
  Separator,
  TextDisplay,
} from "dressed";
import { eq } from "drizzle-orm";
import { db } from "../../app/db";
import { pugBans, pugUserNoteDiscordMessages } from "../../app/db/schema";
import { GUILD_ID, PUG_BANNED_ROLE_ID } from "../../app/utilities/config";
import { logger } from "../../app/utilities/logger";
import { isStaff } from "../utilities/auth";

export const config: CommandConfig = {
  description: "Ban a user from PUGs.",
  default_member_permissions: ["Administrator"],
  guilds: [GUILD_ID],
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

  if (!(await isStaff(interaction.member ?? interaction.user))) {
    await interaction.editReply({
      content: "You do not have permission to use this command.",
    });

    return;
  }

  const userToBan = interaction.getOption("user", true).user();

  if (!userToBan) {
    return interaction.editReply({
      content: "You must provide a user to ban.",
    });
  }

  const existingBan = await db.select().from(pugBans).where(eq(pugBans.userId, userToBan.id));

  await addMemberRole(interaction.guild_id ?? GUILD_ID, userToBan.id, PUG_BANNED_ROLE_ID);

  if (existingBan.length > 0) {
    interaction.editReply({
      content: `${userToBan.username} is already banned from PUGs.`,
    });

    return;
  }

  const reason = interaction.getOption("reason", false)?.string() || "No reason provided";

  await db.insert(pugBans).values({
    userId: userToBan.id,
    reason,
    createdAt: formatISO(new Date()),
    createdBy: interaction.user.id,
  });

  let messageContent = `${user(userToBan.id)} has been banned from PUGs.\nReason: ${reason}`;

  const noteMessageDbResult = await db.query.pugUserNoteDiscordMessages.findFirst({
    where: eq(pugUserNoteDiscordMessages.userId, userToBan.id),
  });

  if (noteMessageDbResult) {
    await deleteMessage(noteMessageDbResult.channelId, noteMessageDbResult.messageId);
    messageContent += `\nThe user's note has been deleted from ${channel(noteMessageDbResult.channelId)}.`;

    await db.delete(pugUserNoteDiscordMessages).where(eq(pugUserNoteDiscordMessages.id, noteMessageDbResult.id));
  }

  try {
    const dmChannel = await createDM(userToBan.id);
    await createMessage(dmChannel.id, {
      components: [
        Container(
          TextDisplay(h1("PUG Ban Notification")),
          Separator(),
          TextDisplay(`You have been banned from participating in PUGs for the following reason:\n\n${reason}`),
        ),
        TextDisplay(subtext("Sent from The Hard Carry Club")),
      ],
      flags: MessageFlags.IsComponentsV2,
    });
  } catch (error) {
    messageContent += `\nFailed to send a DM to ${user(userToBan.id)}.`;

    logger.error(error, "Failed to send DM to user after PUG ban");
  }

  await interaction.editReply({
    content: messageContent,
  });
}
