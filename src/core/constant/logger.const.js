import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} | ${level}: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    logFormat,
  ),
  transports: [new winston.transports.Console()],
});
