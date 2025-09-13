import { db } from "@app/db";
import { pugLobbyHostSignup } from "@app/db/schema";
import { getGameConfig } from "@app/utilities/config";
import { logger } from "@app/utilities/logger";
import { thisOrNext } from "@app/utilities/time";
import to from "await-to-js";
import { isFriday, isSaturday, nextFriday, nextSaturday } from "date-fns";
import { type APIComponentInContainer, type APIMessageTopLevelComponent, MessageFlags } from "discord-api-types/v10";
import { h1, h2, h3, role, TimestampStyle, timestamp, user } from "discord-fmt";
import {
  ActionRow,
  Button,
  Container,
  createMessage,
  deleteMessage,
  editMessage,
  Separator,
  TextDisplay,
} from "dressed";

export type HostSignup = {
  id: number;
  game: string;
  channelId: string | null;
  messageId: string | null;
  data: {
    dayLabel: string;
    blocks: {
      startTime: number;
      endTime: number;
      responses: {
        canHost: {
          userId: string;
          note: string | null;
        }[];
        cannotHost: {
          userId: string;
          note: string | null;
        }[];
        unavailable: {
          userId: string;
          note: string | null;
        }[];
      };
      assignments: {
        userId: string;
        primary: boolean;
        secondary: boolean;
        note: string | null;
      }[];
    }[];
  };
};

export const timeBlocks: {
  [key: string]: {
    dayLabel: string;
    dayCheck: (date: Date) => boolean; // Matches the type of isFriday
    nextFn: (date: Date) => Date; // Matches the type of nextFriday
    blocks: {
      startTime: { hour: number; minute: number };
      endTime: { hour: number; minute: number };
    }[];
  }[];
} = {
  overwatch: [
    {
      dayLabel: "Friday",
      dayCheck: isFriday,
      nextFn: nextFriday,
      blocks: [
        { startTime: { hour: 16, minute: 0 }, endTime: { hour: 18, minute: 0 } },
        { startTime: { hour: 18, minute: 0 }, endTime: { hour: 20, minute: 0 } },
        { startTime: { hour: 20, minute: 0 }, endTime: { hour: 22, minute: 0 } },
      ],
    },
  ],
  rivals: [
    {
      dayLabel: "Saturday",
      dayCheck: isSaturday,
      nextFn: nextSaturday,
      blocks: [
        { startTime: { hour: 16, minute: 0 }, endTime: { hour: 18, minute: 0 } },
        { startTime: { hour: 18, minute: 0 }, endTime: { hour: 20, minute: 0 } },
        { startTime: { hour: 20, minute: 0 }, endTime: { hour: 22, minute: 0 } },
      ],
    },
  ],
};

export function createSignupRecords(game: string): HostSignup["data"][] | null {
  const gameConfig = getGameConfig(game);

  if (!gameConfig) {
    logger.error({ game }, `No game config found for game when creating signup record`);
    return null;
  }

  const times = timeBlocks[game];

  if (!times) {
    logger.error({ game }, `No time blocks found for game when creating signup record`);
    return null;
  }

  return times.map((day) => {
    return {
      dayLabel: day.dayLabel,
      blocks: day.blocks.map((block) => {
        const startTime = thisOrNext(
          day.dayCheck,
          day.nextFn,
          "America/New_York",
          block.startTime.hour,
          block.startTime.minute,
        );

        const endTime = thisOrNext(
          day.dayCheck,
          day.nextFn,
          "America/New_York",
          block.endTime.hour,
          block.endTime.minute,
        );

        return {
          startTime,
          endTime,
          responses: {
            canHost: [],
            cannotHost: [],
            unavailable: [],
          },
          assignments: [],
        };
      }),
    };
  });
}

export function signupComponents(signup: HostSignup): APIMessageTopLevelComponent[] | null {
  const gameConfig = getGameConfig(signup.game);

  if (!gameConfig) {
    logger.error({ game: signup.game }, `No game config found for game when generating signup message components`);
    return null;
  }

  const components: APIMessageTopLevelComponent[] = [];
  components.push(
    TextDisplay(
      `${h1(`${gameConfig.label} Host Signup - ${signup.data.dayLabel}`)}\nSchedule your hosting availability for upcoming PUGs!\n${role(gameConfig.staffRoleId)}`,
    ),
  );

  for (const block of signup.data.blocks) {
    const items: APIComponentInContainer[] = [];

    const id = `pug-host-signup-${signup.id}-${signup.data.dayLabel}-${block.startTime}`;

    items.push(
      TextDisplay(
        `${h2(
          `${timestamp(block.startTime.toString(), TimestampStyle.ShortTime)} - ${timestamp(
            block.endTime.toString(),
            TimestampStyle.ShortTime,
          )}`,
        )}\n
${h3("Quick Glance")}\n${block.responses.canHost.length} available • ${block.responses.cannotHost.length} can't host • ${block.responses.unavailable.length} unavailable\n
${h3("Available to Host")}\n${block.responses.canHost.length ? block.responses.canHost.map((u) => user(u.userId)).join(", ") : "No one yet."}\n
${h3("Playing, Can't Host")}\n${block.responses.cannotHost.length ? block.responses.cannotHost.map((u) => user(u.userId)).join(", ") : "No one yet."}\n
${h3("Unavailable")}\n${block.responses.unavailable.length ? block.responses.unavailable.map((u) => user(u.userId)).join(", ") : "No one yet."}`,
      ),
    );

    items.push(
      Separator(),
      ActionRow(
        Button({
          style: "Success",
          label: "Available to Host",
          custom_id: `${id}-can-host`,
        }),
        Button({
          style: "Primary",
          label: "Playing, Can't Host",
          custom_id: `${id}-cannot-host`,
        }),
        Button({
          style: "Secondary",
          label: "Unavailable",
          custom_id: `${id}-unavailable`,
        }),
        Button({
          style: "Secondary",
          label: "🗑️",
          custom_id: `${id}-remove-response`,
        }),
      ),
    );

    components.push(Container(...items));
  }

  return components;
}

export async function sendHostSignupMessages(game: string) {
  const gameConfig = getGameConfig(game);

  if (!gameConfig) {
    logger.error(`No game config found for ${game} when running host signup creation job`);
    return;
  }

  logger.debug({ game, gameConfig }, "Starting host signup creation job");

  const records = createSignupRecords(game);

  if (!records) {
    logger.error(`Failed to create signup records for ${game}`);
    return;
  }

  const channelId = gameConfig.hostScheduleChannelId;

  if (!channelId) {
    logger.error(`No host schedule channel ID configured for ${game}`);
    return;
  }

  for (const record of records) {
    const message = await createMessage(channelId, {
      components: [TextDisplay("Setting up host signup...")],
      flags: MessageFlags.IsComponentsV2,
    });

    const [err, results] = await to(
      db
        .insert(pugLobbyHostSignup)
        .values({
          game,
          channelId: message.channel_id,
          messageId: message.id,
          data: JSON.stringify(record),
          createdAt: new Date().toISOString(),
          createdBy: "host-scheduler",
        })
        .returning({ id: pugLobbyHostSignup.id }),
    );

    if (err || results.length === 0) {
      logger.error({ err, results }, `Error inserting new ${game} host signup record into database`);
      await deleteMessage(message.channel_id, message.id);
      continue;
    }

    const result = results[0];

    if (!result || !result.id) {
      logger.error({ results }, `No ID returned after inserting new ${game} host signup record into database`);
      await deleteMessage(message.channel_id, message.id);
      continue;
    }

    const signup: HostSignup = {
      id: result.id,
      game,
      channelId: message.channel_id,
      messageId: message.id,
      data: record,
    };

    const components = signupComponents(signup);

    if (!components) {
      return logger.error(`Failed to create signup components for ${game} host signup message`);
    }

    await editMessage(message.channel_id, message.id, {
      components,
      flags: MessageFlags.IsComponentsV2,
      allowed_mentions: {
        roles: [gameConfig.staffRoleId],
      },
    });
  }
}
