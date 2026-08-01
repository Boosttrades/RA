/**
 * update/logger.ts
 * Lightweight scoped logger for the update service.
 * Logs to the console in development only; never exposes sensitive data.
 */

const PREFIX = "[UpdateService]";
const IS_DEV = __DEV__;

export const updateLogger = {
  info(message: string, data?: unknown) {
    if (!IS_DEV) return;
    if (data !== undefined) {
      console.log(`${PREFIX} ${message}`, data);
    } else {
      console.log(`${PREFIX} ${message}`);
    }
  },

  warn(message: string, data?: unknown) {
    if (data !== undefined) {
      console.warn(`${PREFIX} ${message}`, data);
    } else {
      console.warn(`${PREFIX} ${message}`);
    }
  },

  error(message: string, err?: unknown) {
    // Avoid logging raw error objects that may contain tokens or stack traces
    // with sensitive path info. Only log the message.
    const detail =
      err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error";
    console.error(`${PREFIX} ${message}: ${detail}`);
  },
};
