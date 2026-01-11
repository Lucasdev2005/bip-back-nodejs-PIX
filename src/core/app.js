import express from 'express';
import { scopePerRequest } from 'awilix-express';
import swaggerUi from 'swagger-ui-express';
import { createPixRoutes } from '../features/pix/routes/pix.routes.js';
import { swagger } from './constant/swagger.const.js';
import { containerDI } from './constant/container-di.const.js';
import { logger } from './constant/logger.const.js';

export class Api {
  constructor({ redisService, configService }) {
    this.redisService = redisService;
    this.configService = configService;
  }

  async run() {
    logger.info('Starting API server.');
    const app = await express();
    const port = this.configService.getNumber('PORT');

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

    app.listen(port, () => {
      logger.info(`Server is running on port ${port}.`);
    });
  }
}