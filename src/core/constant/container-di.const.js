import { asClass, createContainer } from 'awilix';
import { Api } from '../app.js';
import { Dependencies } from './dependencie.enum.js';
import { PixController } from '../../features/pix/controllers/pix.controller.js';

export const containerDI = createContainer();

containerDI.register({
  [Dependencies.API]: asClass(Api).singleton(),
  [Dependencies.PIX_CONTROLLER]: asClass(PixController).scoped(),
});