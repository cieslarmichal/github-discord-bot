import {
  type SendWelcomeMessageCommandHandler,
  type SendWelcomeMessageCommandHandlerPayload,
} from './sendWelcomeMessageCommandHandler.js';
import { type DiscordClient } from '../../../../../core/discordClient/discordClient.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type MessageModuleConfigProvider } from '../../../messageModuleConfigProvider.js';

export class SendWelcomeMessageCommandHandlerImpl implements SendWelcomeMessageCommandHandler {
  public constructor(
    private readonly discordClient: DiscordClient,
    private readonly loggerService: LoggerService,
    private readonly configProvider: MessageModuleConfigProvider,
  ) {}

  public async execute(payload: SendWelcomeMessageCommandHandlerPayload): Promise<void> {
    const { user } = payload;

    const welcomeChannelId = this.configProvider.getDiscordWelcomeChannelId();

    this.loggerService.debug({
      message: 'Sending welcome message...',
      context: {
        source: SendWelcomeMessageCommandHandlerImpl.name,
        user,
        channelId: welcomeChannelId,
      },
    });

    const messageBody = `Welcome to the server ${user}!`;

    await this.discordClient.sendTextMessage({
      message: messageBody,
      channelId: welcomeChannelId,
    });

    this.loggerService.info({
      message: 'Welcome message sent.',
      context: {
        source: SendWelcomeMessageCommandHandlerImpl.name,
        user,
        channelId: welcomeChannelId,
      },
    });
  }
}
