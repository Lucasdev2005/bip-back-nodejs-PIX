import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Formato colorido e legível para console
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} | ${level}: ${stack || message}`;
  })
);

// Logger principal
export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    errors({ stack: true }),
    timestamp()
  ),
  transports: [
    // Console: colorido e legível
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
