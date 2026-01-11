import Redis from 'ioredis';
import { logger } from '../../core/constant/logger.const.js';

export class RedisService extends Redis {
  constructor() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = Number(process.env.REDIS_PORT) || 6379;

    logger.info(`Connecting Redis to ${host}:${port}`);

    super({ host, port });

    this.on('connect', () => logger.info('Redis conectado'));
    this.on('error', (err) => logger.error('Redis error:', err));
  }

  async setKey(key, value, ttlSeconds) {
    try {
      const val = typeof value === 'object' ? JSON.stringify(value) : value;
      await this.set(key, val, 'EX', ttlSeconds);
      logger.info(`Redis set: ${key}`);
    } catch (err) {
      logger.error('Redis setKey error:', err);
    }
  }

  async getKey(key) {
    try {
      const val = await this.get(key);
      if (!val) return null;

      try {
        return JSON.parse(val); // tenta parse JSON
      } catch {
        return val; // se não for JSON, retorna string
      }
    } catch (err) {
      logger.error('edis getKey error:', err);
      return null;
    }
  }
}
