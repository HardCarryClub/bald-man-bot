import { nextFriday, nextSaturday, nextSunday } from "date-fns";
import { MessageFlags, type RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10";
import { bold, channel, h1, h2, subtext, TimestampStyle, timestamp, user } from "discord-fmt";
import {
  type CommandConfig,
  type CommandInteraction,
  CommandOption,
  Container,
  createMessage,
  Separator,
  TextDisplay,
} from "dressed";
import { PUG_ANNOUNCEMENTS_CHANNEL_ID } from "../../app/utilities/env";
import { getNextEpoch } from "../../app/utilities/time";

const messages: {
  tag: string;
  description: string;
  content: () => RESTPostAPIChannelMessageJSONBody;
}[] = [
  // What is PUGs?
  {
    tag: "define",
    description: "Define (What is PUGs?)",
    content: () => ({
      components: [
        Container(
          TextDisplay(h2("What does PUG/PUGs mean?")),
          TextDisplay(
            'PUG(s) stands for "Pick Up Games" and is a semi competitive environment, where people of different skill levels can play against each other. Like scrims but without pre-existing teams.',
          ),
        ),
      ],
    }),
  },

  // Is there room in PUGs?
  {
    tag: "is-there-room",
    description: "Room (Is there room?)",
    content: () => ({
      components: [
        Container(
          TextDisplay(h2("Is there still room for one more? / Can I join?")),
          TextDisplay(
            "Certainly! If you see people in the lobby VCs PUGs are most likely running and you can join and leave whenever you feel like it.",
          ),
        ),
      ],
    }),
  },

  // How to join PUGs
  {
    tag: "how-join",
    description: "How Join (How do I join?)",
    content: () => ({
      components: [
        TextDisplay(h1("How do I join? / How do I participate?")),
        Container(
          TextDisplay(h2("Overwatch")),
          TextDisplay(
            `You can participate by joining the Lobby VC, adding the current host of the lobby and joining the custom game through them by going to your friends tap > Right click > Join Game.\nTo check the lobby leader go to ${channel(PUG_ANNOUNCEMENTS_CHANNEL_ID)}, where you can see the current host and / or the rank lobby split and which channel you should go to.`,
          ),
        ),
        Container(
          TextDisplay(h2("Marvel Rivals")),
          TextDisplay(
            `You can participate by joining the Lobby VC, Joining the custom game under "hcc pugs a" depending on lobby split.\nTo check the lobby go to ${channel(PUG_ANNOUNCEMENTS_CHANNEL_ID)}, where you can see the current lobbies, password and / or the rank lobby split and which channel you should go to.`,
          ),
        ),
      ],
    }),
  },

  // PUG Schedule
  {
    tag: "schedule",
    description: "Schedule (When is PUGs?)",
    content: () => {
      const euZone = "Europe/Berlin";
      const naZone = "America/New_York";

      const owFridayEu = getNextEpoch(nextFriday, euZone, 21, 30);
      const owFridayNa = getNextEpoch(nextFriday, naZone, 20, 0);

      const mrSaturdayEu = getNextEpoch(nextSaturday, euZone, 21, 30);
      const mrSaturdayNa = getNextEpoch(nextSaturday, naZone, 20, 0);

      const mrSundayEu = getNextEpoch(nextSunday, euZone, 20, 30);
      const mrSundayNa = getNextEpoch(nextSunday, naZone, 18, 30);

      return {
        components: [
          TextDisplay(bold("Here is this week's PUG schedule")),

          // Overwatch Schedule
          Container(
            TextDisplay(h1("Overwatch Schedule")),
            Separator(),
            TextDisplay(h2("Friday")),
            TextDisplay(
              `${timestamp(owFridayEu, TimestampStyle.LongDateTime)}, ${timestamp(owFridayEu, TimestampStyle.RelativeTime)}`,
            ),
            TextDisplay(
              `${timestamp(owFridayNa, TimestampStyle.LongDateTime)}, ${timestamp(owFridayNa, TimestampStyle.RelativeTime)}`,
            ),
          ),

          // Marvel Rivals Schedule
          Container(
            TextDisplay(h1("Marvel Rivals Schedule")),
            Separator(),
            TextDisplay(h2("Saturday")),
            TextDisplay(
              `${timestamp(mrSaturdayEu, TimestampStyle.LongDateTime)}, ${timestamp(mrSaturdayEu, TimestampStyle.RelativeTime)}`,
            ),
            TextDisplay(
              `${timestamp(mrSaturdayNa, TimestampStyle.LongDateTime)}, ${timestamp(mrSaturdayNa, TimestampStyle.RelativeTime)}`,
            ),
            TextDisplay(h2("Sunday")),
            TextDisplay(
              `${timestamp(mrSundayEu, TimestampStyle.LongDateTime)}, ${timestamp(mrSundayEu, TimestampStyle.RelativeTime)}`,
            ),
            TextDisplay(
              `${timestamp(mrSundayNa, TimestampStyle.LongDateTime)}, ${timestamp(mrSundayNa, TimestampStyle.RelativeTime)}`,
            ),
          ),

          Separator(),
          TextDisplay(
            "Lobbies, EU Rivals Lobbies in particular, may shift regions depending on present PUGgers' regions.",
          ),
          TextDisplay(
            `Keep your eyes peeled for Lobby announcements in ${channel(PUG_ANNOUNCEMENTS_CHANNEL_ID)} and feel free to come PUG! 🙂`,
          ),
        ],
      };
    },
  },
];

export const config: CommandConfig = {
  description: "Send a message from a bucket to the current channel.",
  default_member_permissions: "0",
  options: [
    CommandOption({
      name: "tag",
      description: "The tag of the bucket to send the message from.",
      type: "String",
      required: true,
      choices: messages.map((msg) => ({
        name: msg.description,
        value: msg.tag,
      })),
    }),
    CommandOption({
      name: "user",
      description: "The user to mention in the message.",
      type: "User",
      required: false,
    }),
  ],
};

export default async function (interaction: CommandInteraction) {
  await interaction.deferReply({
    ephemeral: true,
  });

  const tag = interaction.getOption("tag", true).string();
  const userToTag = interaction.getOption("user", false)?.user() ?? null;

  if (!tag) {
    return interaction.editReply({
      content: "You must provide a tag to send a message.",
    });
  }

  let message: RESTPostAPIChannelMessageJSONBody = {};
  const foundTag = messages.find((msg) => msg.tag === tag);

  if (foundTag) {
    message = foundTag.content();
  } else {
    return interaction.editReply({
      content: "Invalid tag provided.",
    });
  }

  if (userToTag) {
    if (message.components && message.components.length > 0) {
      message.components.push(TextDisplay(subtext(user(userToTag.id))));
    } else {
      message.components = [TextDisplay(subtext(user(userToTag.id)))];
    }
  }

  await createMessage(interaction.channel.id, {
    ...message,
    flags: MessageFlags.IsComponentsV2,
  });

  return interaction.editReply({
    content: `Message sent successfully!`,
  });
}
