import csv from 'csvtojson';
import axios from 'axios';
import fs from 'fs';

export class CsvUtils {
  static async csvToJson(source) {
    const isUrl = /^https?:\/\//i.test(source);

    if (isUrl) {
      const response = await axios.get(source, {
        responseType: 'stream',
      });

      return csv({
        delimiter: ',',
      }).fromStream(response.data);
    }

    // arquivo local
    if (!fs.existsSync(source)) {
      throw new Error(`Arquivo não encontrado: ${source}`);
    }

    return csv({
      delimiter: ',',
    }).fromFile(source);
  }
}
