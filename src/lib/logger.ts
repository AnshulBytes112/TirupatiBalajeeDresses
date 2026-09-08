type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  return JSON.stringify({
    timestamp,
    level: level.toUpperCase(),
    message,
    ...(context ? { context } : {}),
  });
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    if (shouldLog("debug")) {
      console.debug(formatMessage("debug", message, context));
    }
  },
  info(message: string, context?: Record<string, unknown>) {
    if (shouldLog("info")) {
      console.info(formatMessage("info", message, context));
    }
  },
  warn(message: string, context?: Record<string, unknown>) {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", message, context));
    }
  },
  error(message: string, context?: Record<string, unknown>) {
    if (shouldLog("error")) {
      console.error(formatMessage("error", message, context));
    }
  },
};
