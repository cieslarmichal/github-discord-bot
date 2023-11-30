import { REST, Routes } from 'discord.js';

import { ConfigProvider } from './configProvider.js';
import { HttpServer } from './httpServer/httpServer.js';
import { symbols } from './symbols.js';
import { type DependencyInjectionContainer } from '../libs/dependencyInjection/dependencyInjectionContainer.js';
import { DependencyInjectionContainerFactory } from '../libs/dependencyInjection/dependencyInjectionContainerFactory.js';
import { type DependencyInjectionModule } from '../libs/dependencyInjection/dependencyInjectionModule.js';
import { type DiscordClient } from '../libs/discord/clients/discordClient/discordClient.js';
import { DiscordClientFactory } from '../libs/discord/factories/discordClientFactory/discordClientFactory.js';
import { type DiscordService } from '../libs/discord/services/discordService/discordService.js';
import { DiscordServiceImpl } from '../libs/discord/services/discordService/discordServiceImpl.js';
import { GithubServiceFactory } from '../libs/github/factories/githubServiceFactory/githubServiceFactory.js';
import { type GithubService } from '../libs/github/services/githubService/githubService.js';
import { HttpServiceFactory } from '../libs/httpService/factories/httpServiceFactory/httpServiceFactory.js';
import { type HttpService } from '../libs/httpService/services/httpService/httpService.js';
import { LoggerServiceFactory } from '../libs/logger/factories/loggerServiceFactory/loggerServiceFactory.js';
import { type LoggerService } from '../libs/logger/services/loggerService/loggerService.js';
import { MessageModule } from '../modules/messageModule/messageModule.js';

export class Application {
  public static createContainer(): DependencyInjectionContainer {
    const configProvider = new ConfigProvider();

    const modules: DependencyInjectionModule[] = [new MessageModule()];

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

    container.bind<HttpService>(symbols.httpService, () => HttpServiceFactory.create());

    container.bind<GithubService>(symbols.githubService, () =>
      GithubServiceFactory.create(container.get<HttpService>(symbols.httpService)),
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

    const serverHost = configProvider.getServerHost();

    const serverPort = configProvider.getServerPort();

    const discordServerId = configProvider.getDiscordServerId();

    const discordClientId = configProvider.getDiscordClientId();

    const server = new HttpServer(container);

    await server.start({
      host: serverHost,
      port: serverPort,
    });

    loggerService.log({
      message: `Application started.`,
      context: {
        source: Application.name,
      },
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

    discordClient.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) {
        return;
      }

      loggerService.debug({
        message: 'Processing chat command...',
        context: {
          command: interaction.commandName,
          user: interaction.user.username,
        },
      });

      if (interaction.commandName === 'random') {
        interaction.reply('#324 Create person bio functionality');
      }
    });

    // TODO: add discord service method
    await discordClient.login(discordToken);

    const commands = [
      {
        name: 'random',
        description: 'Issue #242',
      },
    ];

    const rest = new REST({ version: '10' }).setToken(discordToken);

    try {
      console.log('Registering slash commands...');

      await rest.put(Routes.applicationGuildCommands(discordClientId, discordServerId), {
        body: commands,
      });

      console.log('Slash commands were registered successfully!');
    } catch (error) {
      console.log(`There was an error: ${error}`);
    }
  }
}
