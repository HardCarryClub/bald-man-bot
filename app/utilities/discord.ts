import type { APIUser } from "discord-api-types/v10";

export function avatarUrl(user: APIUser): string {
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=512`;
}
