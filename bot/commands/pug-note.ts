import { formatISO, getUnixTime } from "date-fns";
import { type APIMessage, type APIUser, MessageFlags } from "discord-api-types/v10";
import { code, h2, subtext, TimestampStyle, timestamp, user as userMention } from "discord-fmt";
import {
  ActionRow,
  Button,
  type CommandConfig,
  type CommandInteraction,
  CommandOption,
  Container,
  createMessage,
  editMessage,
  Section,
  Separator,
  TextDisplay,
  Thumbnail,
} from "dressed";
import { asc, eq } from "drizzle-orm";
import { db } from "../../app/db";
import { pugUserNoteDiscordMessages, pugUserNotes } from "../../app/db/schema";
import { avatarUrl } from "../../app/utilities/discord";
import { PUG_NOTES_CHANNEL_ID } from "../../app/utilities/env";
import { logger } from "../../app/utilities/logger";
import { isStaff } from "../utilities/auth";

export const config: CommandConfig = {
  description: "Manage PUG notes.",
  default_member_permissions: "0",
  options: [
    CommandOption({
      name: "add",
      description: "Add a note to a user.",
      type: "Subcommand",
      options: [
        CommandOption({
          name: "user",
          description: "The user to add a note for.",
          type: "User",
          required: true,
        }),
        CommandOption({
          name: "note",
          description: "The note to add.",
          type: "String",
          required: true,
        }),
      ],
    }),
    CommandOption({
      name: "remove",
      type: "Subcommand",
      description: "Remove a note from a user.",
      options: [
        CommandOption({
          name: "id",
          description: "The ID of the note to remove.",
          type: "Integer",
          required: true,
        }),
      ],
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

  const addSubcommand = interaction.getOption("add")?.subcommand();
  const removeSubcommand = interaction.getOption("remove")?.subcommand();

  if (addSubcommand) {
    const user = addSubcommand.getOption("user")?.user();
    const note = addSubcommand.getOption("note")?.string();

    if (!user || !note) {
      logger.error("User or note is missing in pug-note command.");
      await interaction.editReply({
        content: "Please provide both a user and a note.",
      });
      return;
    }

    const success = await add(interaction, user as APIUser, note as string);

    if (success) {
      await interaction.editReply({
        content: `Note added for ${userMention(user.id)}.`,
      });
      await refreshUserNotes(user as APIUser);
    } else {
      logger.error("Failed to add note for user:", user.id);
      await interaction.editReply({
        content: "Failed to add note. Please try again later.",
      });
    }

    return;
  } else if (removeSubcommand) {
    const noteId = Number(removeSubcommand.getOption("id")?.string());

    if (!noteId || typeof noteId !== "number" || noteId <= 0 || Number.isNaN(noteId) || !Number.isInteger(noteId)) {
      await interaction.editReply({
        content: "Please provide a note ID to remove.",
      });

      return;
    }

    const noteToRemove = await db.query.pugUserNotes.findFirst({
      where: eq(pugUserNotes.id, noteId),
    });

    if (!noteToRemove) {
      await interaction.editReply({
        content: "Note not found.",
      });
      return;
    }

    if (noteToRemove.createdBy !== interaction.user.id) {
      await interaction.editReply({
        content: "You can only remove your own notes.",
      });
      return;
    }

    await db.delete(pugUserNotes).where(eq(pugUserNotes.id, noteId));

    await interaction.editReply({
      content: `Note with ID ${code(noteId.toString())} has been removed.`,
    });

    await refreshUserNotes({
      id: noteToRemove.userId,
    });

    return;
  }

  logger.error("No subcommand provided for pug-note command.");

  await interaction.editReply({
    content: "Please provide a valid subcommand.",
  });
}

async function add(interaction: CommandInteraction, user: APIUser, note: string) {
  await db
    .insert(pugUserNotes)
    .values({
      userId: user.id,
      note: note,
      createdAt: formatISO(new Date()),
      createdBy: interaction.user.id,
    })
    .returning();

  const result = await refreshUserNotes(user);

  return !!result;
}

export async function refreshUserNotes(user: APIUser | { id: string; avatar?: string }): Promise<APIMessage | null> {
  const discordMessage = await db.query.pugUserNoteDiscordMessages.findFirst({
    where: eq(pugUserNoteDiscordMessages.userId, user.id),
  });

  const notes = await db.query.pugUserNotes.findMany({
    where: eq(pugUserNotes.userId, user.id),
    orderBy: [asc(pugUserNotes.createdAt)],
  });

  const formattedNotes = notes
    .map((entry) => {
      const createdAt = getUnixTime(entry.createdAt).toString();
      const attribution = subtext(
        `by ${userMention(entry.createdBy)} at ${timestamp(createdAt, TimestampStyle.ShortDate)} (ID ${code(entry.id.toString())})`,
      );

      return `${entry.note}\n${attribution}`;
    })
    .join(`\n${subtext("-")}\n`);

  const components = [
    Container(
      Section(
        [h2(userMention(user.id)), `Total notes: ${notes.length}`],
        Thumbnail(user.avatar ? avatarUrl(user.id, user.avatar) : "https://cdn.hardcarry.club/Logo.png"),
      ),
      Separator(),
      TextDisplay(formattedNotes || "No notes available."),
    ),
    ActionRow(
      Button({
        custom_id: `pug-note-${user.id}-refresh`,
        label: "🔄 Refresh",
        style: "Secondary",
      }),
    ),
  ];

  let message: APIMessage | null = null;

  if (discordMessage) {
    message = await editMessage(discordMessage.channelId, discordMessage.messageId, {
      components,
      flags: MessageFlags.IsComponentsV2,
    });

    if (!message) {
      logger.error(`Failed to edit message for user ${user.id} in channel ${discordMessage.channelId}.`);

      return null;
    }
  } else {
    message = await createMessage(PUG_NOTES_CHANNEL_ID, {
      components,
      flags: MessageFlags.IsComponentsV2,
    });

    await db.insert(pugUserNoteDiscordMessages).values({
      channelId: message.channel_id,
      messageId: message.id,
      userId: user.id,
    });
  }

  return message;
}
