import {
  ApplicationCommandOptionType,
  ChannelType,
} from "discord-api-types/v10";
import type { BaldCommand } from "./types";

export const commandMap: { [key: string]: BaldCommand } = {
  // "reload-commands": {
  //   description: "Reloads all commands",
  //   contexts: [1],
  //   default_member_permissions: 0x8,
  // },

  "pug-ban": {
    description: "Adds the PUG banned role to a user.",
    options: [
      {
        name: "user",
        description: "The user to ban.",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
    contexts: [1],
    default_member_permissions: 0x8,
  },

  "pug-manage": {
    description: "Manages PUG shit",
    contexts: [1],
    default_member_permissions: 0x8,
    options: [
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "lobby-add",
        description: "Adds a PUG lobby.",
        options: [
          {
            name: "letter",
            description: "The letter of the lobby.",
            type: ApplicationCommandOptionType.String,
            max_length: 1,
            required: true,
          },
        ],
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "lobby-remove",
        description: "Removes a PUG lobby.",
        options: [
          {
            name: "category",
            description: "The category of the lobby.",
            type: ApplicationCommandOptionType.Channel,
            channel_types: [ChannelType.GuildCategory],
            required: true,
          },
        ],
      },
    ],
  },

  "pug-msg": {
    description: "Send a message from a bucket to the current channel.",
    contexts: [1],
    default_member_permissions: 0x8,
    options: [
      {
        name: "tag",
        description: "The tag of the bucket to send the message from.",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "Define (What is PUGs?)",
            value: "define",
          },
          {
            name: "Room (Is there room?)",
            value: "is-there-room",
          },
          {
            name: "How Join (How do I join?)",
            value: "how-join",
          },
          {
            name: "Schedule (When is PUGs?)",
            value: "schedule",
          },
        ],
        required: true,
      },
      {
        name: "user",
        description: "The user to mention.",
        type: ApplicationCommandOptionType.User,
        required: false,
      },
    ],
  },
};
