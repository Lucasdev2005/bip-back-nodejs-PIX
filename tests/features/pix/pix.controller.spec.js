import { PixController } from '../../../src/features/pix/controllers/pix.controller.js';
import { jest } from '@jest/globals';

describe('PixController', () => {
  let pixController;
  let pixServiceMock;

  let req;
  let res;

  beforeEach(() => {
    pixServiceMock = {
      getParticipantsByIspb: jest.fn(),
    };

    pixController = new PixController({
      pixService: pixServiceMock,
    });

    req = {
      params: {
        ispb: '12345678',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o participante quando encontrado', async () => {
    const participant = { ISPB: '12345678', Nome: 'Banco A' };
    pixServiceMock.getParticipantsByIspb.mockResolvedValue(participant);

    await pixController.getParticipantsByIspb(req, res);

    expect(pixServiceMock.getParticipantsByIspb).toHaveBeenCalledWith(
      '12345678'
    );

    expect(res.json).toHaveBeenCalledWith(participant);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('deve retornar 404 quando o participante não for encontrado', async () => {
    pixServiceMock.getParticipantsByIspb.mockResolvedValue(null);

    await pixController.getParticipantsByIspb(req, res);

    expect(pixServiceMock.getParticipantsByIspb).toHaveBeenCalledWith(
      '12345678'
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Participant not found',
    });
  });

  it('deve propagar erro caso o service lance exceção', async () => {
    const error = new Error('Unexpected error');
    pixServiceMock.getParticipantsByIspb.mockRejectedValue(error);

    await expect(
      pixController.getParticipantsByIspb(req, res)
    ).rejects.toThrow('Unexpected error');

    expect(pixServiceMock.getParticipantsByIspb).toHaveBeenCalledWith(
      '12345678'
    );

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
