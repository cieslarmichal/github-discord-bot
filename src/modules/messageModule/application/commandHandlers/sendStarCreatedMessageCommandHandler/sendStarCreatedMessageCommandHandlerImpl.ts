import {
  type SendStarCreatedMessageCommandHandler,
  type SendStarCreatedMessageCommandHandlerPayload,
} from './sendStarCreatedMessageCommandHandler.js';
import {
  type SendEmbedMessagePayload,
  type DiscordService,
} from '../../../../../libs/discord/services/discordService/discordService.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type MessageModuleConfigProvider } from '../../../messageModuleConfigProvider.js';

export class SendStarCreatedMessageCommandHandlerImpl implements SendStarCreatedMessageCommandHandler {
  private readonly githubBaseUrl = 'https://github.com';

  public constructor(
    private readonly discordService: DiscordService,
    private readonly loggerService: LoggerService,
    private readonly configProvider: MessageModuleConfigProvider,
  ) {}

  public async execute(payload: SendStarCreatedMessageCommandHandlerPayload): Promise<void> {
    const { stargazer, repository } = payload;

    const starsChannelId = this.configProvider.getDiscordStarsChannelId();

    this.loggerService.debug({
      message: 'Sending message about created star...',
      context: {
        source: SendStarCreatedMessageCommandHandlerImpl.name,
        repositoryName: repository.name,
        totalStars: repository.totalStars,
        stargazerName: stargazer.name,
        starsChannelId,
      },
    });

    const messageTitle = 'New stargazer!';

    const messageColor = '#F6E99D';

    const messageUrl = `${this.githubBaseUrl}/${repository.name}/stargazers`;

    const messageDescription = `${stargazer.name} starred a repository :star:`;

    const customFields = [
      {
        name: 'Total stars',
        value: String(repository.totalStars),
      },
    ];

    const embedMessageDraft: SendEmbedMessagePayload = {
      message: {
        title: messageTitle,
        color: messageColor,
        url: messageUrl,
        author: {
          name: stargazer.name,
          url: stargazer.profileUrl,
        },
        thumbnail: stargazer.avatarUrl,
        description: messageDescription,
        customFields,
      },
      channelId: starsChannelId,
    };

    await this.discordService.sendEmbedMessage(embedMessageDraft);

    this.loggerService.info({
      message: 'Message about created star sent.',
      context: {
        source: SendStarCreatedMessageCommandHandlerImpl.name,
        repositoryName: repository.name,
        totalStars: repository.totalStars,
        stargazerName: stargazer.name,
        starsChannelId,
      },
    });
  }
}
