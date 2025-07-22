export const BOT_TOKEN = process.env.DISCORD_TOKEN;
export const APP_ID = process.env.DISCORD_APP_ID;
export const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;
export const IS_IN_DEV = process.env.NODE_ENV !== "production";
export const DATABASE_URL = "./data/db.sqlite";

export const GUILD_ID = process.env.GUILD_ID || "941819133576765492";
export const PUG_STAFF_ROLE_ID = process.env.PUG_STAFF_ROLE_ID || "1291187493336518749";
export const PUG_BANNED_ROLE_ID = process.env.PUG_BANNED_ROLE_ID || "1327429519052640339";
export const PUG_ANNOUNCEMENTS_CHANNEL_ID = process.env.PUG_ANNOUNCEMENTS_CHANNEL_ID || "1309656594388226199";
export const PUG_NOTES_CHANNEL_ID = process.env.PUG_NOTES_CHANNEL_ID || "1396800297061449738";
