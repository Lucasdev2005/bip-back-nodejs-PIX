import { Router } from 'express';
import { Dependencies } from '../../../core/constant/dependencie.enum.js';

export const createPixRoutes = (container) => {
  const router = Router();
  const controller = container.resolve(Dependencies.PIX_CONTROLLER  );

  /**
   * @swagger
   * /pix/participants/{ispb}:
   *   get:
   *     summary: Busca participante PIX por ISPB
   *     tags: [PIX]
   *     parameters:
   *       - in: path
   *         name: ispb
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   */
  router.get(
    '/participants/:ispb',
    controller.getParticipantsByIspb.bind(controller)
  );

  return router;
};
