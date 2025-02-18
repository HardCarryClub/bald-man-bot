import type {
  APIChatInputApplicationCommandGuildInteraction,
  APIMessageComponentInteraction,
} from "discord-api-types/v10";

export type BaldCommand = {
  // name: string;
  description: string;
  contexts: number[];
  options?: unknown;
  default_member_permissions?: number;
  // handler?: (
  //   interaction: APIChatInputApplicationCommandGuildInteraction,
  // ) => Promise<unknown>;
};
