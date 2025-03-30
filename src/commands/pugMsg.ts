import {
  type APIApplicationCommandInteractionDataBasicOption,
  type APIApplicationCommandInteractionDataOption,
  type APIApplicationCommandInteractionDataStringOption,
  type APIApplicationCommandInteractionDataSubcommandOption,
  type APIApplicationCommandInteractionDataUserOption,
  type APIGuildChannel,
  ChannelType,
  MessageFlags,
  type RESTGetAPIGuildChannelsResult,
} from "discord-api-types/v10";
import { sendRequestToDiscord } from "../utilities/discord";
import { APP_ID, GUILD_ID } from "../utilities/env";
import { format, parse, addDays, addHours } from "date-fns";

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

    case "schedule":
      // date of this week's friday
      let friday = addDays(new Date(), 4 - (new Date().getDay() + 6) % 7);
      let timestamps = [];

      let fridayPugTimeEU = forceTimeInTimezoneForDate(friday, 'Europe/Berlin', '21:30:00');
      timestamps.push(fridayPugTimeEU.getTime());
      timestamps.push(addDays(fridayPugTimeEU, 1).getTime());
      timestamps.push(forceTimeInTimezoneForDate(addDays(friday, 2), 'Europe/Berlin', '20:30:00').getTime());

      let fridayPugTimeNA = forceTimeInTimezoneForDate(friday, 'America/New_York', '20:00:00');
      timestamps.push(fridayPugTimeNA.getTime());
      timestamps.push(addDays(fridayPugTimeNA, 1).getTime());
      timestamps.push(forceTimeInTimezoneForDate(addDays(friday, 2), 'America/New_York', '18:30:00').getTime());

      timestamps = timestamps.map(t => Math.round(t/1000));

      let pug_announcementsID = "1309656594388226199";

      message = 
        `**This week's PUGs' schedule:**\n\n**EU Lobbies:**\nOverwatch:\n<t:${timestamps[0]}:F>, <t:${timestamps[0]}:R>\n<t:${timestamps[1]}:F>, <t:${timestamps[1]}:R>\n\nMarvel Rivals:\n<t:${timestamps[2]}:F>, <t:${timestamps[2]}:R>\n\n**NA Lobbies:**\nOverwatch:\n<t:${timestamps[3]}:F>, <t:${timestamps[3]}:R>\n<t:${timestamps[4]}:F>, <t:${timestamps[4]}:R>\n\nMarvel Rivals:\n<t:${timestamps[5]}:F>, <t:${timestamps[5]}:R>\n\nLobbies, EU Rivals Lobbies in particular, may shift regions depending on present PUGgers' regions.\nKeep your eyes peeled for Lobby announcements in <#${pug_announcementsID}> and feel free to come PUG!🙂`;


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

// returns a date containing the day of donor date fixed to a specific time for a certain timezone
function forceTimeInTimezoneForDate(dayDonor: Date, timezone: string, time: string) {
  
  return zonedToUtc(
    parse(
      `${format(dayDonor, "yyyy-MM-dd")} ${time}`,
      "yyyy-MM-dd HH:mm:ss",
      dayDonor
    ),
    timezone
  );

}

function zonedToUtc(zonedTime: Date, timezone: string) {
  // evil calculation of negative timezone offset
  let offset = Math.round(
    (new Date().getTime() - new Date(new Date().toLocaleString('en-US', {timeZone:timezone})).getTime())/3600/1000
  );

  return addHours(zonedTime, offset);
}

