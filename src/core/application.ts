import { ConfigProvider } from './configProvider.js';
import { symbols } from './symbols.js';
import { type DependencyInjectionContainer } from '../libs/dependencyInjection/dependencyInjectionContainer.js';
import { DependencyInjectionContainerFactory } from '../libs/dependencyInjection/dependencyInjectionContainerFactory.js';
import { type DependencyInjectionModule } from '../libs/dependencyInjection/dependencyInjectionModule.js';
import { type DiscordClient } from '../libs/discord/clients/discordClient/discordClient.js';
import { DiscordClientFactory } from '../libs/discord/factories/discordClientFactory/discordClientFactory.js';
import { type DiscordService } from '../libs/discord/services/discordService/discordService.js';
import { DiscordServiceImpl } from '../libs/discord/services/discordService/discordServiceImpl.js';
import { LoggerServiceFactory } from '../libs/logger/factories/loggerServiceFactory/loggerServiceFactory.js';
import { type LoggerService } from '../libs/logger/services/loggerService/loggerService.js';
import { IssueModule } from '../modules/issueModule/issueModule.js';

export class Application {
  public static createContainer(): DependencyInjectionContainer {
    const configProvider = new ConfigProvider();

    const modules: DependencyInjectionModule[] = [new IssueModule()];

    const container = DependencyInjectionContainerFactory.create({ modules });

    const loggerLevel = configProvider.getLoggerLevel();

    container.bind<LoggerService>(symbols.loggerService, () =>
      LoggerServiceFactory.create({
        loggerLevel,
      }),
    );

    container.bind<DiscordClient>(symbols.discordClient, () => DiscordClientFactory.create());

    container.bind<DiscordService>(
      symbols.discordService,
      () => new DiscordServiceImpl(container.get<DiscordClient>(symbols.discordClient)),
    );

    container.bind<ConfigProvider>(symbols.configProvider, () => configProvider);

    return container;
  }

  public static async start(): Promise<void> {
    const container = Application.createContainer();

    const loggerService = container.get<LoggerService>(symbols.loggerService);

    const discordClient = container.get<DiscordClient>(symbols.discordClient);

    const configProvider = container.get<ConfigProvider>(symbols.configProvider);

    const discordToken = configProvider.getDiscordToken();

    discordClient.on('ready', () => {
      loggerService.debug({
        message: 'Discord client is ready.',
        context: { user: discordClient.user?.tag },
      });
    });

    discordClient.on('guildMemberAdd', async (member) => {
      loggerService.debug({
        message: 'New user joined the server.',
        context: { user: member.user.username },
      });

      const welcomeChannelName = 'welcome';

      const welcomeChannel = member.guild.channels.cache.find((channel) => channel.name === welcomeChannelName);

      if (!welcomeChannel) {
        throw new Error('Welcome channel not found.');
      }

      if (welcomeChannel.isTextBased()) {
        await welcomeChannel.send(`Welcome to the server ${member.user}!`);
      }

      loggerService.debug({
        message: 'Welcome message sent.',
        context: {
          user: member.user.username,
          channel: welcomeChannelName,
        },
      });
    });

    await discordClient.login(discordToken);
  }
}
