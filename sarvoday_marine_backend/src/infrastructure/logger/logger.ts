import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
    format.json(),
  ),
  transports: [new transports.Console(), new transports.File({ filename: 'error.log', level: 'error' })],
});

export default logger;
