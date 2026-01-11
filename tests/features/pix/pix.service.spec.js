import { PixService } from '../../../src/features/pix/services/pix.service.js';
import{ CsvUtils } from '../../../src/common/utils/csv.util.js';
import { logger } from '../../../src/core/constant/logger.const.js';
import { KeyCache } from '../../../src/common/constant/key-cache.constant.js';
import { jest } from '@jest/globals';

// Sobrescrevendo funções para mock
CsvUtils.csvToJson = jest.fn();
logger.info = jest.fn();

describe('PixService', () => {
  let pixService;
  let redisServiceMock;
  let configServiceMock;

  const BCB_PARTICIPANTES_URL = 'http://fake-url.com/participants.csv';
  const CACHE_TTL_SECONDS = 3600;

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
      get: jest.fn((key) => (key === 'BCB_PARTICIPANTES_URL' ? BCB_PARTICIPANTES_URL : null)),
      getNumber: jest.fn((key) => (key === 'CACHE_TTL_SECONDS' ? CACHE_TTL_SECONDS : null)),
    };

    pixService = new PixService({ redisService: redisServiceMock, configService: configServiceMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar no CSV e guardar no cache se não houver cache', async () => {
    redisServiceMock.getKey.mockResolvedValue(null);
    CsvUtils.csvToJson.mockResolvedValue(fakeCache);

    const result = await pixService.getParticipantsByIspb('12345678');

    expect(redisServiceMock.getKey).toHaveBeenCalledWith(KeyCache.PARTICIPANTS);
    expect(CsvUtils.csvToJson).toHaveBeenCalledWith(BCB_PARTICIPANTES_URL);
    expect(redisServiceMock.setKey).toHaveBeenCalledWith(KeyCache.PARTICIPANTS, fakeCache, CACHE_TTL_SECONDS);
    expect(result).toEqual({ ISPB: '12345678', Nome: 'Banco A' });
    expect(logger.info).toHaveBeenCalled();
  });

  it('deve usar o cache se existir', async () => {
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
});
