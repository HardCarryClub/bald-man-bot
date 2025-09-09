import { formatISO } from "date-fns";
import { type APIGuildChannel, type APIUser, ChannelType } from "discord-api-types/v10";
import {
  type CommandConfig,
  type CommandInteraction,
  CommandOption,
  createChannel,
  deleteChannel,
  listChannels,
} from "dressed";
import { eq } from "drizzle-orm";
import { db } from "../../app/db";
import { pugLobby } from "../../app/db/schema";
import { GUILD_ID } from "../../app/utilities/config";
import { logger } from "../../app/utilities/logger";
import { isStaff } from "../utilities/auth";

export const config: CommandConfig = {
  description: "Manage PUG lobbies",
  default_member_permissions: ["Administrator"],
  guilds: [GUILD_ID],
  options: [
    CommandOption({
      name: "create",
      description: "Create a new PUG lobby",
      type: "Subcommand",
      options: [
        CommandOption({
          name: "name",
          description: "Name of the PUG lobby",
          type: "String",
          required: true,
        }),
      ],
    }),
    CommandOption({
      name: "remove",
      description: "Remove an existing PUG lobby",
      type: "Subcommand",
      options: [
        CommandOption({
          name: "category",
          description: "Existing PUG lobby",
          type: "Channel",
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

  const createCommand = interaction.getOption("create")?.subcommand();
  const removeCommand = interaction.getOption("remove")?.subcommand();

  if (!createCommand && !removeCommand) {
    await interaction.editReply({
      content: "Invalid subcommand.",
    });

    return;
  }

  if (createCommand) {
    const name = createCommand.getOption("name")?.string();

    if (!name) {
      await interaction.editReply({
        content: "Please provide a name for the PUG lobby.",
      });

      return;
    }

    const success = await createLobby(interaction.guild_id || GUILD_ID, name, interaction.user);

    if (success) {
      await interaction.editReply({
        content: `PUG lobby "${name}" created successfully.`,
      });
    } else {
      await interaction.editReply({
        content: "Failed to create PUG lobby. Please try again later.",
      });
    }

    return;
  } else if (removeCommand) {
    const category = removeCommand.getOption("category")?.channel();

    if (!category || category.type !== ChannelType.GuildCategory) {
      await interaction.editReply({
        content: "Please provide a valid PUG lobby category.",
      });

      return;
    }

    const success = await removeLobby(interaction.guild_id || GUILD_ID, category.id, interaction.user);

    if (success) {
      await interaction.editReply({
        content: `PUG lobby "${category.name}" removed successfully.`,
      });
    } else {
      await interaction.editReply({
        content: "Failed to remove PUG lobby, it may not be managed by me or may already be marked as deleted.",
      });
    }

    return;
  }
}

async function removeLobby(guildId: string, categoryId: string, user: APIUser): Promise<boolean> {
  try {
    const existingLobbyDb = await db.query.pugLobby.findFirst({
      where: eq(pugLobby.categoryId, categoryId),
    });

    if (!existingLobbyDb) {
      logger.warn(`No PUG lobby found with category ID: ${categoryId}`);
      return false;
    }

    const guildChannels = (await listChannels(guildId)) as APIGuildChannel<
      ChannelType.GuildVoice | ChannelType.GuildText | ChannelType.GuildCategory
    >[];

    const childChannels = guildChannels.filter((channel) => channel.parent_id === categoryId);

    await Promise.all(childChannels.map((channel) => deleteChannel(channel.id)));
    await deleteChannel(categoryId);

    await db
      .update(pugLobby)
      .set({
        deletedAt: formatISO(new Date()),
        deletedBy: user.id,
      })
      .where(eq(pugLobby.categoryId, categoryId));

    return true;
  } catch (error) {
    logger.error(error, "Failed to remove PUG lobby");
    return false;
  }
}

async function createLobby(guildId: string, name: string, user: APIUser): Promise<boolean> {
  try {
    const newCategory = await createChannel(guildId, {
      name: `${name} Lobby`,
      type: ChannelType.GuildCategory,
      position: 18,
      permission_overwrites: [
        {
          id: GUILD_ID,
          type: 0,
          allow: "0",
          deny: "1024",
        },
        {
          id: "1291187493336518749",
          type: 0,
          allow: "281492455434000",
          deny: "0",
        },
        {
          id: "1304158945811759218",
          type: 0,
          allow: "1536",
          deny: "2048",
        },
        {
          id: "1327429519052640339",
          type: 0,
          allow: "1024",
          deny: "3146240",
        },
        {
          id: "1300959426718466121",
          type: 0,
          allow: "0",
          deny: "377957125121",
        },
        {
          id: "1335709977956061234",
          type: 0,
          allow: "1536",
          deny: "2048",
        },
      ],
    });

    await createChannel(guildId, {
      name: `${name} Lobby`,
      type: ChannelType.GuildVoice,
      parent_id: newCategory.id,
      user_limit: 99,
      position: 1,
    });

    await createChannel(guildId, {
      name: `${name} 🔵 Team (Left Side)`,
      type: ChannelType.GuildVoice,
      parent_id: newCategory.id,
      user_limit: 6,
      position: 2,
    });

    await createChannel(guildId, {
      name: `${name} 🔴 Team (Right Side)`,
      type: ChannelType.GuildVoice,
      parent_id: newCategory.id,
      user_limit: 6,
      position: 3,
    });

    logger.info(`PUG lobby "${name}" created successfully with category ID: ${newCategory.id}`);

    await db.insert(pugLobby).values({
      categoryId: newCategory.id,
      createdAt: formatISO(new Date()),
      createdBy: user.id,
    });

    return true;
  } catch (error) {
    logger.error(error, "Failed to create PUG lobby");

    return false;
  }
}
