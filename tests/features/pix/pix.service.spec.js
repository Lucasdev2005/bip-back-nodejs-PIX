import { PixService } from '../../../src/features/pix/services/pix.service.js';
import { CsvUtils } from '../../../src/common/utils/csv.util.js';
import { logger } from '../../../src/core/constant/logger.const.js';
import { KeyCache } from '../../../src/common/constant/key-cache.constant.js';
import { jest } from '@jest/globals';

// mocks
CsvUtils.csvToJson = jest.fn();
logger.info = jest.fn();
logger.warn = jest.fn();
logger.error = jest.fn();

describe('PixService', () => {
  let pixService;
  let redisServiceMock;
  let configServiceMock;

  const BCB_PARTICIPANTES_URL =
    'http://fake-url.com/participants_DATA_ATUAL.csv';

  const CACHE_TTL_SECONDS = 3600;
  const MAX_RETRIES = 3;

  const fakeCache = [
    { ISPB: '12345678', Nome: 'Banco A' },
    { ISPB: '87654321', Nome: 'Banco B' },
  ];

  beforeEach(() => {
    redisServiceMock = {
      getKey: jest.fn(),
      setKey: jest.fn(),
    };

    configServiceMock = {
      get: jest.fn((key) => {
        if (key === 'BCB_PARTICIPANTES_URL') return BCB_PARTICIPANTES_URL;
        return null;
      }),
      getNumber: jest.fn((key) => {
        if (key === 'CACHE_TTL_SECONDS') return CACHE_TTL_SECONDS;
        if (key === 'MAX_RETRIES') return MAX_RETRIES;
        return null;
      }),
    };

    pixService = new PixService({
      redisService: redisServiceMock,
      configService: configServiceMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar no CSV e salvar no cache quando não houver cache', async () => {
    redisServiceMock.getKey.mockResolvedValue(null);
    CsvUtils.csvToJson.mockResolvedValue(fakeCache);

    const result = await pixService.getParticipantsByIspb('12345678');

    expect(redisServiceMock.getKey).toHaveBeenCalledWith(
      KeyCache.PARTICIPANTS
    );

    expect(CsvUtils.csvToJson).toHaveBeenCalledTimes(1);
    expect(CsvUtils.csvToJson).toHaveBeenCalledWith(
      expect.stringContaining('participants_'),
      1
    );

    expect(redisServiceMock.setKey).toHaveBeenCalledWith(
      KeyCache.PARTICIPANTS,
      fakeCache,
      CACHE_TTL_SECONDS
    );

    expect(result).toEqual({ ISPB: '12345678', Nome: 'Banco A' });
  });

  it('deve usar o cache se existir e não buscar no CSV', async () => {
    redisServiceMock.getKey.mockResolvedValue(fakeCache);

    const result = await pixService.getParticipantsByIspb('87654321');

    expect(result).toEqual({ ISPB: '87654321', Nome: 'Banco B' });
    expect(CsvUtils.csvToJson).not.toHaveBeenCalled();
    expect(redisServiceMock.setKey).not.toHaveBeenCalled();
  });

  it('deve retornar null se o participante não existir', async () => {
    redisServiceMock.getKey.mockResolvedValue(fakeCache);

    const result = await pixService.getParticipantsByIspb('00000000');

    expect(result).toBeNull();
    expect(logger.info).toHaveBeenCalled();
  });

  it('deve retornar null se não encontrar dataset válido após todas as tentativas', async () => {
    redisServiceMock.getKey.mockResolvedValue(null);
    CsvUtils.csvToJson.mockRejectedValue(new Error('404'));

    const result = await pixService.getParticipantsByIspb('12345678');

    expect(CsvUtils.csvToJson).toHaveBeenCalledTimes(MAX_RETRIES);
    expect(result).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(
      'não foi possível encontrar dataset válido do BCB'
    );
  });
});
