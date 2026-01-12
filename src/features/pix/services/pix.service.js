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
      logger.info('cache não encontrado, buscando dataset do BCB');

      const MAX_TENTATIVAS = 30;
      let tentativa = 0;
      let participantes = null;

      while (tentativa < MAX_TENTATIVAS && !participantes) {
        const date = new Date();
        date.setDate(date.getDate() - tentativa);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const currentDate = `${year}${month}${day}`;
        const url = this.BCB_PARTICIPANTES_URL.replace('DATA_ATUAL', currentDate);

        logger.info(url);

        try {
          logger.info(`tentando dataset do BCB para data: ${currentDate}`);
          const result = await CsvUtils.csvToJson(url, 1);

          if (Array.isArray(result) && result.length > 0) {
            participantes = result;

            logger.info(`dataset encontrado para data ${currentDate}, salvando cache`);
            await this.redisService.setKey(
              KeyCache.PARTICIPANTS,
              participantes,
              this.configService.getNumber('CACHE_TTL_SECONDS')
            );
          }
        } catch (err) {
          logger.warn(`falha ao buscar dataset para data ${currentDate}`);
        }

        tentativa++;
      }

      if (!participantes) {
        logger.error('não foi possível encontrar dataset válido do BCB');
        return null;
      }

      cache = participantes;
    }

    logger.info(`pesquisando participante com ispb: ${ispb}`);
    const participant = cache.find(p => p.ISPB === ispb);

    if (!participant) {
      logger.info(`nenhum participante encontrado com o ispb: ${ispb}`);
      return null;
    }

    return participant;
  }

}