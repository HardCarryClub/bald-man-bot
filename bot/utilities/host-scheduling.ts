import { getGameConfig } from "@app/utilities/config";
import { logger } from "@app/utilities/logger";
import { isFriday, isSaturday } from "date-fns";
import type { APIComponentInContainer, APIMessageTopLevelComponent } from "discord-api-types/v10";
import { h1 } from 'discord-fmt';
import { Container, Separator, TextDisplay } from "dressed";

type HostSignup = {
  blocks: {
    startTime: number;
    responses: {
      canHost: string[];
      cannotHost: string[];
      unavailable: string[];
    };
    assignments: {
      userId: string;
      primary: boolean;
      secondary: boolean;
      note: string | null;
    }[];
  }[];
};

export function signupMessageComponents(game: string): APIMessageTopLevelComponent[] | null {
  const gameConfig = getGameConfig(game);

  if (!gameConfig) {
    logger.error({ game }, `No game config found for game when generating signup message components`);
    return null;
  }

  const times = timeBlocks[game];

  if (!times) {
    logger.error({ game }, `No time blocks found for game when generating signup message components`);
    return null;
  }

  const components = times.map((day, index) => {
    const comps: APIComponentInContainer[] = [TextDisplay("Test")];

    if (index < times.length - 1) {
      comps.push(Separator());
    }

    return Container(...comps);
  });

  return [TextDisplay(h1(`${gameConfig.label} Host Signup`)), ...components];
}

export const timeBlocks: {
  [key: string]: {
    dayCheck: unknown; // TODO: need to type this like typeof isFriday
    blocks: {
      startTime: { hour: number; minute: number };
      endTime: { hour: number; minute: number };
    }[];
  }[];
} = {
  overwatch: [
    {
      dayCheck: isFriday,
      blocks: [
        { startTime: { hour: 16, minute: 0 }, endTime: { hour: 18, minute: 0 } },
        { startTime: { hour: 18, minute: 0 }, endTime: { hour: 20, minute: 0 } },
        { startTime: { hour: 20, minute: 0 }, endTime: { hour: 22, minute: 0 } },
      ],
    },
  ],
  rivals: [
    {
      dayCheck: isSaturday,
      blocks: [
        { startTime: { hour: 16, minute: 0 }, endTime: { hour: 18, minute: 0 } },
        { startTime: { hour: 18, minute: 0 }, endTime: { hour: 20, minute: 0 } },
        { startTime: { hour: 20, minute: 0 }, endTime: { hour: 22, minute: 0 } },
      ],
    },
  ],
};
