import { containerDI } from './core/constant/container-di.const.js';
import { Dependencies } from './core/constant/dependencie.enum.js';
import 'dotenv/config';

const api = containerDI.resolve(Dependencies.API);

api.run();