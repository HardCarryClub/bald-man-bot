import {
  ChannelType,
  MessageFlags,
  type APIApplicationCommandInteractionDataSubcommandOption,
  type APIGuildChannel,
  type RESTGetAPIGuildChannelsResult,
} from "discord-api-types/v10";
import { sendRequestToDiscord } from "../utilities/discord";
import { APP_ID, GUILD_ID } from "../utilities/env";

export default async function (
  token: string,
  name: string,
  options: APIApplicationCommandInteractionDataSubcommandOption[] | undefined,
) {
  console.log(JSON.stringify(options, null, 2));

  const subcommand = options?.[0];

  if (!subcommand) {
    return;
  }

  switch (subcommand.name) {
    case "lobby-add": {
      const letter = subcommand.options?.[0];

      if (!letter) {
        return;
      }

      const { id, ...response } = await sendRequestToDiscord(
        `/guilds/${GUILD_ID}/channels`,
        "POST",
        {
          name: `${letter.value} Lobby`,
          type: ChannelType.GuildCategory,
          position: 18,
          permission_overwrites: [
            {
              id: GUILD_ID,
              type: 0,
              allow: 0,
              deny: 1024,
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
        },
      );

      await sendRequestToDiscord(`/guilds/${GUILD_ID}/channels`, "POST", {
        name: `${letter.value} Lobby`,
        type: ChannelType.GuildVoice,
        parent_id: id,
        user_limit: 99,
        position: 1,
      });

      await sendRequestToDiscord(`/guilds/${GUILD_ID}/channels`, "POST", {
        name: `${letter.value} 🔵 Team (Left Side)`,
        type: ChannelType.GuildVoice,
        parent_id: id,
        user_limit: 6,
        position: 2,
      });

      await sendRequestToDiscord(`/guilds/${GUILD_ID}/channels`, "POST", {
        name: `${letter.value} 🔴 Team (Right Side)`,
        type: ChannelType.GuildVoice,
        parent_id: id,
        user_limit: 6,
        position: 3,
      });

      await sendRequestToDiscord(
        `/webhooks/${APP_ID}/${token}/messages/@original`,
        "PATCH",
        {
          content: `Created lobby ${letter.value} ✅`,
          // flags: MessageFlags.Ephemeral,
        },
      );

      break;
    }
    case "lobby-remove": {
      const category = subcommand.options?.[0];

      if (!category) {
        return;
      }

      console.log(category);

      const guildChannels = (await sendRequestToDiscord(
        `/guilds/${GUILD_ID}/channels`,
        "GET",
      )) as RESTGetAPIGuildChannelsResult;

      const categoryChannel = guildChannels.find(
        (channel) => channel.id === category.value,
      );

      const childChannels = guildChannels.filter(
        (channel) =>
          (channel as APIGuildChannel<ChannelType>).parent_id ===
          category.value,
      );

      if (!categoryChannel) {
        return;
      }

      if (
        !categoryChannel.name?.includes("Lobby") ||
        categoryChannel.name?.toLowerCase().length !== 7
      ) {
        await sendRequestToDiscord(
          `/webhooks/${APP_ID}/${token}/messages/@original`,
          "PATCH",
          {
            content: `Invalid category ${categoryChannel.name}!`,
            // flags: MessageFlags.Ephemeral,
          },
        );

        return;
      }

      await Promise.all(
        childChannels.map((channel) =>
          sendRequestToDiscord(`/channels/${channel.id}`, "DELETE"),
        ),
      );

      await sendRequestToDiscord(`/channels/${category.value}`, "DELETE");

      await sendRequestToDiscord(
        `/webhooks/${APP_ID}/${token}/messages/@original`,
        "PATCH",
        {
          content: `Removed lobby \`${categoryChannel.name}\` and all children ✅`,
          // flags: MessageFlags.Ephemeral,
        },
      );

      break;
    }
  }
}
