import { ConfigProvider } from './configProvider.js';
import { type DiscordClient } from './discordClient/discordClient.js';
import { DiscordClientImpl } from './discordClient/discordClientImpl.js';
import { HttpServer } from './httpServer/httpServer.js';
import { symbols } from './symbols.js';
import { type DependencyInjectionContainer } from '../libs/dependencyInjection/dependencyInjectionContainer.js';
import { DependencyInjectionContainerFactory } from '../libs/dependencyInjection/dependencyInjectionContainerFactory.js';
import { type DependencyInjectionModule } from '../libs/dependencyInjection/dependencyInjectionModule.js';
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

    container.bind<DiscordClient>(symbols.discordClient, () => new DiscordClientImpl(container));

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

    // const discordServerId = configProvider.getDiscordServerId();

    // const discordClientId = configProvider.getDiscordClientId();

    const server = new HttpServer(container);

    await server.start({
      host: serverHost,
      port: serverPort,
    });

    await discordClient.start({
      token: discordToken,
    });

    loggerService.log({
      message: `Application started.`,
      context: {
        source: Application.name,
      },
    });

    //   discordClient.on('interactionCreate', async (interaction) => {
    //     if (!interaction.isChatInputCommand()) {
    //       return;
    //     }

    //     loggerService.debug({
    //       message: 'Processing chat command...',
    //       context: {
    //         command: interaction.commandName,
    //         user: interaction.user.username,
    //       },
    //     });

    //     if (interaction.commandName === 'random') {
    //       interaction.reply('#324 Create person bio functionality');
    //     }
    //   });

    //   const commands = [
    //     new SlashCommandBuilder()
    //       .setName('random-issue')
    //       .setDescription('Get random issue.')
    //       .addStringOption((option) =>
    //         option.setName('level').setDescription('The issue level.').setRequired(true).addChoices(
    //           {
    //             name: 'easy',
    //             value: 'easy',
    //           },
    //           {
    //             name: 'medium',
    //             value: 'medium',
    //           },
    //           {
    //             name: 'hard',
    //             value: 'hard',
    //           },
    //         ),
    //       )
    //       .toJSON(),
    //   ];

    //   const rest = new REST({ version: '10' }).setToken(discordToken);

    //   try {
    //     console.log('Registering slash commands...');

    //     await rest.put(Routes.applicationGuildCommands(discordClientId, discordServerId), {
    //       body: commands,
    //     });

    //     console.log('Slash commands were registered successfully!');
    //   } catch (error) {
    //     console.log(`There was an error: ${error}`);
    //   }
    // }
  }
}
