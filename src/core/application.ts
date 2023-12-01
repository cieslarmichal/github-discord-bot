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

    const serverHost = configProvider.getServerHost();

    const serverPort = configProvider.getServerPort();

    const discordToken = configProvider.getDiscordToken();

    const discordClientId = configProvider.getDiscordClientId();

    const discordServerId = configProvider.getDiscordServerId();

    const server = new HttpServer(container);

    await server.start({
      host: serverHost,
      port: serverPort,
    });

    await discordClient.start({
      token: discordToken,
      clientId: discordClientId,
      serverId: discordServerId,
    });

    loggerService.log({
      message: `Application started.`,
      context: {
        source: Application.name,
      },
    });
  }
}
