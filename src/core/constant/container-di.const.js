import { asClass, createContainer } from 'awilix';
import { Api } from '../app.js';
import { Dependencies } from './dependencie.enum.js';
import { PixController } from '../../features/pix/controllers/pix.controller.js';
import { PixService } from '../../features/pix/services/pix.service.js';
import { ConfigService } from '../services/config.service.js';
import { RedisService } from '../../common/services/redis.service.js';

export const containerDI = createContainer();

containerDI.register({
  [Dependencies.API]: asClass(Api).singleton(),
  [Dependencies.PIX_CONTROLLER]: asClass(PixController).scoped(),
  [Dependencies.PIX_SERVICE]: asClass(PixService).singleton(),
  [Dependencies.CONFIG_SERVICE]: asClass(ConfigService).singleton(),
  [Dependencies.REDIS_SERVICE]: asClass(RedisService).singleton()
});