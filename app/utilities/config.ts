import rawConfig from "../../data/config.yaml";

type Config = {
  guildId: string;
  pugs: {
    bannedRoleId: string;
    announcementsChannelId: string;
    games: {
      name: string;
      staffRoleId: string;
      notesChannelId: string;
    }[];
  };
};

const config: Config = rawConfig as Config;

export const GUILD_ID = config.guildId;
export const IS_IN_DEV = process.env.NODE_ENV !== "production";
export const BOT_TOKEN = process.env.DISCORD_TOKEN;
export const DATABASE_URL = "./data/db.sqlite";

export const PUG_ANNOUNCEMENTS_CHANNEL_ID = config.pugs.announcementsChannelId;
export const PUG_BANNED_ROLE_ID = config.pugs.bannedRoleId;

export function getGameConfig(game: string) {
  return config.pugs.games.find((g) => g.name === game);
}

export function getStaffRoleIds() {
  return config.pugs.games.map((g) => g.staffRoleId);
}
