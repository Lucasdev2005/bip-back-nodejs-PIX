import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} | ${level}: ${stack || message}`;
  })
);

export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    errors({ stack: true }),
    timestamp()
  ),
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),

    // Arquivo (opcional): JSON estruturado
    // new winston.transports.File({
    //   filename: 'logs.json',
    //   format: winston.format.json(),
    // }),
  ],
});
