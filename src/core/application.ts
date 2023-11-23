import { ConfigProvider } from './configProvider.js';
import { symbols } from './symbols.js';
import { type DependencyInjectionContainer } from '../libs/dependencyInjection/dependencyInjectionContainer.js';
import { DependencyInjectionContainerFactory } from '../libs/dependencyInjection/dependencyInjectionContainerFactory.js';
import { type DiscordClient } from '../libs/discord/clients/discordClient/discordClient.js';
import { DiscordClientFactory } from '../libs/discord/factories/discordClientFactory/discordClientFactory.js';
import { LoggerServiceFactory } from '../libs/logger/factories/loggerServiceFactory/loggerServiceFactory.js';
import { type LoggerService } from '../libs/logger/services/loggerService/loggerService.js';

export class Application {
  public static createContainer(): DependencyInjectionContainer {
    const container = DependencyInjectionContainerFactory.create();

    const loggerLevel = ConfigProvider.getLoggerLevel();

    container.bind<LoggerService>(symbols.loggerService, () =>
      LoggerServiceFactory.create({
        loggerLevel,
      }),
    );

    container.bind<DiscordClient>(symbols.discordClient, () => DiscordClientFactory.create());

    return container;
  }

  public static async start(): Promise<void> {
    const container = Application.createContainer();

    const loggerService = container.get<LoggerService>(symbols.loggerService);

    const discordClient = container.get<DiscordClient>(symbols.discordClient);

    const discordToken = ConfigProvider.getDiscordToken();

    discordClient.on('ready', () => {
      loggerService.debug({ message: 'Discord client is ready.' });
    });

    discordClient.on('guildMemberAdd', (member) => {
      loggerService.debug({
        message: 'New member joined the server.',
        context: { userTag: member.user.tag },
      });

      member.send('Welcome to the server!');

      loggerService.debug({
        message: 'Welcome message sent to the new member.',
        context: { userTag: member.user.tag },
      });

      console.log(`Sent welcome message to ${member.user.tag}`);
    });

    await discordClient.login(discordToken);
  }
}
