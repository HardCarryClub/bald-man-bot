import type { APIUser } from "discord-api-types/v10";

export function avatarUrl(id: string, avatar: string): string {
  return `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=512`;
}
