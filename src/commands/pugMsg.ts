import {
  ChannelType,
  MessageFlags,
  type APIApplicationCommandInteractionDataBasicOption,
  type APIApplicationCommandInteractionDataOption,
  type APIApplicationCommandInteractionDataStringOption,
  type APIApplicationCommandInteractionDataSubcommandOption,
  type APIApplicationCommandInteractionDataUserOption,
  type APIGuildChannel,
  type RESTGetAPIGuildChannelsResult,
} from "discord-api-types/v10";
import { sendRequestToDiscord } from "../utilities/discord";
import { APP_ID, GUILD_ID } from "../utilities/env";

export default async function (
  token: string,
  name: string,
  channelId: string,
  options: APIApplicationCommandInteractionDataOption[] | undefined,
) {
  const tag: APIApplicationCommandInteractionDataStringOption | undefined =
    options?.find(
      (option) => option.name === "tag",
    ) as APIApplicationCommandInteractionDataStringOption;
  const user = options?.find(
    (option) => option.name === "user",
  ) as APIApplicationCommandInteractionDataUserOption;

  if (!tag) {
    return sendRequestToDiscord(
      `/webhooks/${APP_ID}/${token}/messages/@original`,
      "PATCH",
      {
        content: "You must provide a tag.",
        flags: MessageFlags.Ephemeral,
      },
    );
  }

  console.log(tag.value);

  let message: string | null = "";

  switch (tag.value) {
    case "define":
      message =
        '**What does PUG/PUGs mean?**\nPUG(s) stands for "Pick Up Games" and is a semi competitive environment, where people of different skill levels can play against each other. Like scrims but without pre-existing teams.';
      break;

    case "is-there-room":
      message =
        "**Is there still room for one more? / Can I join?**\nCertainly! If you see people in the lobby VCs PUGs are most likely running and you can join and leave whenever you feel like it.";
      break;

    case "how-join":
      message =
        "**How do I join?**\nYou can participate by joining the Lobby VC, adding the current host of the lobby and joining the custom game through them by going to your friends tap > Right click > Join Game.\nTo check the lobby leader go to <#1309656594388226199>, where you can see the current host and / or the rank lobby split and which channel you should go to.";
      break;

    default: {
      message = null;
    }
  }

  console.log(message);

  if (!message) {
    return sendRequestToDiscord(
      `/webhooks/${APP_ID}/${token}/messages/@original`,
      "PATCH",
      {
        content: "Invalid tag.",
        flags: MessageFlags.Ephemeral,
      },
    );
  }

  if (user) {
    message = `${message}\n\n-# <@${user.value}>`;
  }

  try {
    await sendRequestToDiscord(`/channels/${channelId}/messages`, "POST", {
      content: message,
    });

    await sendRequestToDiscord(
      `/webhooks/${APP_ID}/${token}/messages/@original`,
      "PATCH",
      {
        content: "Message sent.",
        flags: MessageFlags.Ephemeral,
      },
    );
  } catch (err) {
    console.log(err);
    await sendRequestToDiscord(
      `/webhooks/${APP_ID}/${token}/messages/@original`,
      "PATCH",
      {
        content: "Message could not be sent.",
        flags: MessageFlags.Ephemeral,
      },
    );

    throw err;
  }
}
