import type { RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10";
import { h2, subtext, user } from "discord-fmt";
import {
  type CommandConfig,
  type CommandInteraction,
  CommandOption,
  Container,
  createMessage,
  TextDisplay,
} from "dressed";

const messages: {
  name: string;
  description: string;
  content: () => RESTPostAPIChannelMessageJSONBody;
}[] = [
  // What is PUGs?
  {
    name: "define",
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
    name: "is-there-room",
    description: "Room (Is there room?)",
    content: () => ({
      components: [
        Container(
          TextDisplay(h2("Is there room?")),
          TextDisplay("This message is not yet implemented."),
        ),
      ],
    }),
  },

  // How to join PUGs
  {
    name: "how-join",
    description: "How Join (How do I join?)",
    content: () => ({
      components: [
        Container(
          TextDisplay(h2("How do I join?")),
          TextDisplay("This message is not yet implemented."),
        ),
      ],
    }),
  },

  // PUG Schedule
  {
    name: "schedule",
    description: "Schedule (When is PUGs?)",
    content: () => ({
      components: [
        Container(
          TextDisplay(h2("When is PUGs?")),
          TextDisplay("This message is not yet implemented."),
        ),
      ],
    }),
  },
];

export const config: CommandConfig = {
  description: "Send a message from a bucket to the current channel.",
  // contexts: [],
  default_member_permissions: "0",
  options: [
    CommandOption({
      name: "tag",
      description: "The tag of the bucket to send the message from.",
      type: "String",
      required: true,
      choices: messages.map((msg) => ({
        name: msg.name,
        value: msg.name,
      })),
      // choices: [
      //   {
      //     name: "Define (What is PUGs?)",
      //     value: "define",
      //   },
      //   {
      //     name: "Room (Is there room?)",
      //     value: "is-there-room",
      //   },
      //   {
      //     name: "How Join (How do I join?)",
      //     value: "how-join",
      //   },
      //   {
      //     name: "Schedule (When is PUGs?)",
      //     value: "schedule",
      //   },
      // ],
    }),
    CommandOption({
      name: "user",
      description: "The user to mention in the message.",
      type: "User",
      required: false,
    }),
  ],
};

export default async function pugMsg(interaction: CommandInteraction) {
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
  const foundTag = messages.find((msg) => msg.name === tag);

  if (foundTag) {
    if (tag === "schedule") {
      // do other timestamp shit here.
      message = foundTag.content();
    } else {
      message = foundTag.content();
    }
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

  await createMessage(interaction.channel.id, message);

  return interaction.editReply({
    content: `Message sent successfully!`,
  });
}
