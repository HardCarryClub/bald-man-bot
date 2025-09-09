// export function isStaff(member: GuildMember | APIUser): boolean {
//   if (member instanceof GuildMember) {
//     return member.roles.cache.some(role => role.name === "Staff");
//   }
//   return false;
// }

import type { APIGuildMember, APIUser } from "discord-api-types/v10";
import { getMember } from "dressed";
import { GUILD_ID, getStaffRoleIds } from "../../app/utilities/config";
import { logger } from "../../app/utilities/logger";

export async function isStaff(user: APIUser | APIGuildMember): Promise<boolean> {
  const rolesIds = getStaffRoleIds();

  if (!rolesIds || rolesIds.length === 0) {
    return false;
  }

  if (!("roles" in user)) {
    user = await getMember(GUILD_ID, user.id);
  }

  logger.debug(`Checking the roles: ${user.roles}`);
  logger.debug(`Checking for role ID: ${rolesIds}`);

  return user.roles.some((role) => rolesIds.includes(role));
}
