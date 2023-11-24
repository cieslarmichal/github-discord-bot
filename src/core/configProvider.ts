import { Assert } from '../common/validation/assert.js';
import { Validator } from '../common/validation/validator.js';
import { EnvParser } from '../libs/envParser/envParser.js';
import { LoggerLevel } from '../libs/logger/types/loggerLevel.js';

export class ConfigProvider {
  private getStringEnvVariable(envVariableName: string): string {
    const value = EnvParser.parseString({ name: envVariableName });

    Assert.isNotEmptyString(value);

    return value;
  }

  public getLoggerLevel(): LoggerLevel {
    const value = EnvParser.parseString({ name: 'LOGGER_LEVEL' });

    if (value && Validator.isEnum(LoggerLevel, value)) {
      return value;
    }

    return LoggerLevel.debug;
  }

  public getDiscordToken(): string {
    return this.getStringEnvVariable('DISCORD_TOKEN');
  }

  public getDiscordWelcomeChannelId(): string {
    return this.getStringEnvVariable('DISCORD_WELCOME_CHANNEL_ID');
  }

  public getDiscordIssuesChannelId(): string {
    return this.getStringEnvVariable('DISCORD_ISSUES_CHANNEL_ID');
  }
}
