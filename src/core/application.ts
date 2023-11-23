import { ConfigProvider } from './configProvider.js';
import { symbols } from './symbols.js';
import { type DependencyInjectionContainer } from '../libs/dependencyInjection/dependencyInjectionContainer.js';
import { DependencyInjectionContainerFactory } from '../libs/dependencyInjection/dependencyInjectionContainerFactory.js';
import { LoggerServiceFactory } from '../libs/logger/factories/loggerServiceFactory/loggerServiceFactory.js';
import { type LoggerService } from '../libs/logger/services/loggerService/loggerService.js';

export class Application {
  public static createContainer(): DependencyInjectionContainer {
    const container = DependencyInjectionContainerFactory.create();

    const loggerLevel = ConfigProvider.getLoggerLevel();

    const discordToken = ConfigProvider.getDiscordToken();

    container.bind<LoggerService>(symbols.loggerService, () =>
      LoggerServiceFactory.create({
        loggerLevel,
      }),
    );

    container.bind<S3Service>(symbols.s3Service, () =>
      S3ServiceFactory.create({
        region: awsRegion,
        endpoint: awsEndpoint,
      }),
    );

    return container;
  }

  public static async start(): Promise<void> {
    const container = Application.createContainer();

    const commandHandler = container.get<UploadResizedVideoCommandHandler>(
      videoSymbols.uploadResizedVideoCommandHandler,
    );

    await commandHandler.execute({
      s3VideosBucket,
      s3VideoKey,
      resolution,
    });
  }
}
/**
 * @description A Discord bot that sends a welcome message when a new member joins a server.
 */

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// Event listener for when the bot is ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Event listener for when a new member joins the server
client.on('guildMemberAdd', (member) => {
  // Send a welcome message to the new member
  member.send('Welcome to the server!');

  // Log the welcome message in the console
  console.log(`Sent welcome message to ${member.user.tag}`);
});

// Log in to Discord using the bot token
client.login('YOUR_BOT_TOKEN');
