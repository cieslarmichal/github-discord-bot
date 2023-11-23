import { Assert } from '../common/validation/assert.js';
import { Validator } from '../common/validation/validator.js';
import { EnvParser } from '../libs/envParser/envParser.js';
import { LoggerLevel } from '../libs/logger/types/loggerLevel.js';

export class ConfigProvider {
  private static getStringEnvVariable(envVariableName: string): string {
    const value = EnvParser.parseString({ name: envVariableName });

    Assert.isNotEmptyString(value);

    return value;
  }

  public static getLoggerLevel(): LoggerLevel {
    const value = EnvParser.parseString({ name: 'LOGGER_LEVEL' });

    if (value && Validator.isEnum(LoggerLevel, value)) {
      return value;
    }

    return LoggerLevel.debug;
  }

  public static getDiscordToken(): string {
    return this.getStringEnvVariable('DISCORD_TOKEN');
  }
}
