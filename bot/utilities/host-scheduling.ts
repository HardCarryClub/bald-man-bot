import { getGameConfig } from "@app/utilities/config";
import { logger } from "@app/utilities/logger";
import { thisOrNext } from "@app/utilities/time";
import { isFriday, isSaturday, nextFriday, nextSaturday } from "date-fns";
import type { APIComponentInContainer, APIMessageTopLevelComponent } from "discord-api-types/v10";
import { h1, h2, h3, TimestampStyle, timestamp } from "discord-fmt";
import { ActionRow, Button, Container, Separator, TextDisplay } from "dressed";

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
  components.push(TextDisplay(h1(`${gameConfig.label} Host Signup - ${signup.data.dayLabel}`)));

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
${h3("Available to Host")}\n${block.responses.canHost.length ? block.responses.canHost.map((u) => `<@${u}>`).join(", ") : "No one yet."}\n
${h3("Playing, Can't Host")}\n${block.responses.cannotHost.length ? block.responses.cannotHost.map((u) => `<@${u}>`).join(", ") : "No one yet."}\n
${h3("Unavailable")}\n${block.responses.unavailable.length ? block.responses.unavailable.map((u) => `<@${u}>`).join(", ") : "No one yet."}`,
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
      ),
      ActionRow(
        Button({
          style: "Secondary",
          label: "Remove My Response",
          custom_id: `${id}-remove-response`,
        }),
      ),
    );

    components.push(Container(...items));
  }

  return components;
}
