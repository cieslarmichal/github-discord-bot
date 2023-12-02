import { Client, EmbedBuilder, GatewayIntentBits, REST, type HexColorString, Routes } from 'discord.js';

import {
  type SendTextMessagePayload,
  type SendEmbedMessagePayload,
  type StartPayload,
  type DiscordClient,
} from './discordClient.js';
import { OperationNotValidError } from '../../common/errors/operationNotValidError.js';
import { ResourceNotFoundError } from '../../common/errors/resourceNotFoundError.js';
import { type DiscordEventController } from '../../common/types/discord/discordEventController.js';
import { type SlashCommand } from '../../common/types/discord/slashCommand.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';
import { type LoggerService } from '../../libs/logger/services/loggerService/loggerService.js';
import { type GuildMemberDiscordEventController } from '../../modules/messageModule/api/discordEventControllers/guildMemberDiscordEventController/guildMemberDiscordEventController.js';
import { type InteractionDiscordEventController } from '../../modules/messageModule/api/discordEventControllers/interactionDiscordEventController/interactionDiscordEventController.js';
import { type RandomIssueDiscordSlashCommand } from '../../modules/messageModule/api/discordSlashCommands/randomIssueDiscordSlashCommand/randomIssueDiscordSlashCommand.js';
import { type DiscordSlashCommandsRegistry } from '../../modules/messageModule/api/discordSlashCommandsRegistry/discordSlashCommandsRegistry.js';
import { messageSymbols } from '../../modules/messageModule/symbols.js';
import { DiscordRouter } from '../discordRouter/discordRouter.js';
import { coreSymbols } from '../symbols.js';

export class DiscordClientImpl implements DiscordClient {
  public readonly discordClientInstance: Client;
  private readonly container: DependencyInjectionContainer;
  private readonly loggerService: LoggerService;
  private readonly discordRouter: DiscordRouter;
  private readonly discordSlashCommandsRegistry: DiscordSlashCommandsRegistry;

  public constructor(container: DependencyInjectionContainer) {
    this.discordClientInstance = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    this.container = container;

    this.loggerService = this.container.get<LoggerService>(coreSymbols.loggerService);

    this.discordRouter = new DiscordRouter(this.discordClientInstance, container);

    this.discordSlashCommandsRegistry = this.container.get<DiscordSlashCommandsRegistry>(
      messageSymbols.discordSlashCommandsRegistry,
    );
  }

  public async start(payload: StartPayload): Promise<void> {
    const { token, clientId, serverId } = payload;

    this.discordRouter.registerControllers({
      controllers: this.getControllers(),
    });

    this.discordClientInstance.on('ready', () => {
      this.loggerService.info({
        message: `Discord Client started.`,
        context: {
          source: DiscordClientImpl.name,
          username: this.discordClientInstance.user?.username,
        },
      });
    });

    await this.discordClientInstance.login(token);

    const slashCommands = this.getSlashCommands();

    slashCommands.forEach((slashCommand) => {
      this.discordSlashCommandsRegistry.registerSlashCommand({
        slashCommand,
      });
    });

    const commandsBody = slashCommands.map((slashCommand) => slashCommand.getSlashCommandBuilder().toJSON());

    const rest = new REST({ version: '10' }).setToken(token);

    await rest.put(Routes.applicationGuildCommands(clientId, serverId), {
      body: commandsBody,
    });
  }

  private getControllers(): DiscordEventController[] {
    return [
      this.container.get<GuildMemberDiscordEventController>(messageSymbols.guildMemberDiscordEventController),
      this.container.get<InteractionDiscordEventController>(messageSymbols.interactionDiscordEventController),
    ];
  }

  private getSlashCommands(): SlashCommand[] {
    return [this.container.get<RandomIssueDiscordSlashCommand>(messageSymbols.randomIssueDiscordSlashCommand)];
  }

  public async sendTextMessage(payload: SendTextMessagePayload): Promise<void> {
    const { message, channelId } = payload;

    const channel = this.discordClientInstance.channels.cache.get(channelId);

    if (!channel) {
      throw new ResourceNotFoundError({
        name: 'Channel',
        channelId,
      });
    }

    if (channel.isTextBased()) {
      await channel.send(message);
    } else {
      throw new OperationNotValidError({
        reason: 'Channel does not support text messages.',
      });
    }
  }

  public async sendEmbedMessage(payload: SendEmbedMessagePayload): Promise<void> {
    const { message, channelId } = payload;

    const channel = this.discordClientInstance.channels.cache.get(channelId);

    if (!channel) {
      throw new ResourceNotFoundError({
        name: 'Channel',
        channelId,
      });
    }

    const embedMessage = new EmbedBuilder()
      .setColor(message.color as HexColorString)
      .setTitle(message.title)
      .setURL(message.url)
      .setAuthor({
        name: message.author.name,
        url: message.author.url,
      })
      .setThumbnail(message.thumbnail);

    if (message.description) {
      embedMessage.setDescription(message.description);
    }

    if (message.customFields?.length) {
      embedMessage.addFields(message.customFields);
    }

    if (channel.isTextBased()) {
      await channel.send({ embeds: [embedMessage] });
    } else {
      throw new OperationNotValidError({
        reason: 'Channel does not support text messages.',
      });
    }
  }
}
