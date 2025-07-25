import pino from "pino";
import { IS_IN_DEV } from "./env";

export const logger = pino({
  level: IS_IN_DEV ? "debug" : "info",
  transport: {
    target: IS_IN_DEV ? "pino-pretty" : "",
  },
});
