import { logger } from "../../../core/constant/logger.const.js";
import { CsvUtils } from "../../../common/utils/csv.util.js";
import { KeyCache } from "../../../common/constant/key-cache.constant.js";

export class PixService {

  BCB_PARTICIPANTES_URL = null;

  constructor({ configService, redisService }) {
    this.BCB_PARTICIPANTES_URL = configService.get('BCB_PARTICIPANTES_URL');
    this.redisService = redisService;
    this.configService = configService;
  }

  async getParticipantsByIspb(ispb) {
    let cache = await this.redisService.getKey(KeyCache.PARTICIPANTS);

    logger.info(cache);

    if (!cache) {
      logger.info(`requisitando participantes ao dataset dos dados abertos do BCB ${this.BCB_PARTICIPANTES_URL}`);
      cache = await CsvUtils.csvToJson(this.BCB_PARTICIPANTES_URL, 1);
      logger.info('guardando cache');
      await this.redisService.setKey(KeyCache.PARTICIPANTS, cache, this.configService.getNumber('CACHE_TTL_SECONDS'));
    }

    logger.info(`pesquisando participante com ispb: ${ispb}`);
    const participant = cache.find(p => p.ISPB === ispb);

    if (!participant) {
      logger.info(`nenhum particpante encontrado com o ispb: ${ispb}`);
      return null;
    }
  
    return participant;
  }
}