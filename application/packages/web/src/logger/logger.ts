import { ILogObj, Logger } from "tslog";

const _log: Logger<ILogObj> = new Logger();

export const logger = {
  info(...args: unknown[]) {
    _log.info(args);
  },
  warn(...args: unknown[]) {
    _log.warn(args);
  },
  debug(...args: unknown[]) {
    _log.debug(args);
  },
  error(...args: unknown[]) {
    // TODO: notify to Slack
    _log.error(args);
  },
};
