import { createLogger, format, transports } from 'winston';
import { LOGGER_LEVEL, LOGGER_LEVELS, DEVELOPMENT_MODE } from './config';

const formatTemplate = (message, ...data) => `(${message}) ${data}`;

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
    if (DEVELOPMENT_MODE) {
      this.logger.error(formatTemplate(message, ...data));
    }
  };

  warn = (message, ...data) => {
    if (DEVELOPMENT_MODE) {
      this.logger.warn(formatTemplate(message, ...data));
    }
  };

  info = (message, ...data) => {
    if (DEVELOPMENT_MODE) {
      this.logger.info(formatTemplate(message, ...data));
    }
  };

  verbose = (message, ...data) => {
    if (DEVELOPMENT_MODE) {
      this.logger.verbose(formatTemplate(message, ...data));
    }
  };

  debug = (message, ...data) => {
    if (DEVELOPMENT_MODE) {
      this.logger.debug(formatTemplate(message, ...data));
    }
  };
}
