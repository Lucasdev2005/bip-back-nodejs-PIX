import { createPixRoutes } from '../../../src/features/pix/routes/pix.routes.js';
import { Dependencies } from '../../../src/core/constant/dependencie.enum.js';
import { Router } from 'express';
import { jest } from '@jest/globals';

describe('Pix Router (unitário)', () => {
  it('deve registrar GET /participants/:ispb com o controller correto', () => {
    const controllerMock = {
      getParticipantsByIspb: jest.fn(),
    };

    const containerMock = {
      resolve: jest.fn().mockReturnValue(controllerMock),
    };

    const router = createPixRoutes(containerMock);

    const stack = router.stack.find(
      (layer) =>
        layer.route &&
        layer.route.path === '/participants/:ispb' &&
        layer.route.methods.get
    );

    expect(stack).toBeDefined();
    expect(containerMock.resolve).toHaveBeenCalledWith(
      Dependencies.PIX_CONTROLLER
    );
  });
});
