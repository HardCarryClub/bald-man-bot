import { CommandOption } from "dressed";

export const multiGameOption = CommandOption({
  name: "game",
  description: "The game the note is for.",
  type: "String",
  choices: [
    {
      name: "Overwatch",
      value: "overwatch",
    },
    {
      name: "Marvel Rivals",
      value: "rivals",
    },
  ],
  required: true,
});
