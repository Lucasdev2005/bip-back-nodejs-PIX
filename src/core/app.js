import express from 'express';
import { scopePerRequest } from 'awilix-express';
import swaggerUi from 'swagger-ui-express';
import { createPixRoutes } from '../features/pix/routes/pix.routes.js';
import { swagger } from './constant/swagger.const.js';
import { containerDI } from './constant/container-di.const.js';
import { logger } from './constant/logger.const.js';

export class Api {
  constructor() {}

  async run() {
    logger.info('Starting API server.');
    const app = await express();

    app.use(express.json());
    app.use(scopePerRequest(containerDI));

    logger.info('setup swagger ui.');
    /** Swagger UI */
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger));

    logger.info('setup routes.');
    /** Routes */
    app.use('/pix', (req, res, next) => {
      const router = createPixRoutes(req.container);
      router(req, res, next);
    });

    app.listen(3000, () => {
      logger.info('Server is running on port 3000.');
    });
  }
}