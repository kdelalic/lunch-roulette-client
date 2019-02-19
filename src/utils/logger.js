import { createLogger, format, transports } from 'winston';
import { LOGGER_LEVEL, LOGGER_LEVELS } from './config';

export default class Logger {
  constructor() {
    this.logger = createLogger({
      format: format.simple(),
      level: LOGGER_LEVEL,
      levels: LOGGER_LEVELS,
      transports: [new transports.Console()]
    });
  }

  error = (message, ...data) => {
    this.logger.error(`${message} ${data}`);
  };

  warn = (message, ...data) => {
    this.logger.warn(`${message} ${data}`);
  };

  info = (message, ...data) => {
    this.logger.info(`${message} ${data}`);
  };

  trace = (message, ...data) => {
    this.logger.trace(`${message} ${data}`);
  };

  debug = (message, ...data) => {
    this.logger.debug(`${message} ${data}`);
  };
}
