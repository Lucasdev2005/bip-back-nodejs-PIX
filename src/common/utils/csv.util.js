import csv from 'csvtojson';
import axios from 'axios';
import iconv from 'iconv-lite';

export class CsvUtils {
  static async csvToJson(source, skipLines = 0) {
    const isUrl = /^https?:\/\//i.test(source);

    let csvString;

    if (isUrl) {
      const response = await axios.get(source, { responseType: 'arraybuffer' });
      csvString = iconv.decode(Buffer.from(response.data), 'latin1');
    } else {
      csvString = iconv.decode(Buffer.from(fs.readFileSync(source)), 'latin1');
    }

    if (skipLines > 0) {
      csvString = csvString.split('\n').slice(skipLines).join('\n');
    }

    return csv({
      delimiter: ';',
      trim: true,
    }).fromString(csvString);
  }
}
