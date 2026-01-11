export class ConfigService {

  env = process.env;

  get(key, defaultValue = undefined) {
    return this.env[key] ?? defaultValue;
  }

  getNumber(key, defaultValue) {
    const value = this.env[key];
    return value ? Number(value) : defaultValue;
  }

  getBoolean(key, defaultValue = false) {
    return this.env[key] === 'true' || defaultValue;
  }
}
