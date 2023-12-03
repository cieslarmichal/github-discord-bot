import {
  type SendForkCreatedMessageCommandHandler,
  type SendForkCreatedMessageCommandHandlerPayload,
} from './sendForkCreatedMessageCommandHandler.js';
import { type DiscordClient, type SendEmbedMessagePayload } from '../../../../../core/discordClient/discordClient.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type MessageModuleConfigProvider } from '../../../messageModuleConfigProvider.js';

export class SendForkCreatedMessageCommandHandlerImpl implements SendForkCreatedMessageCommandHandler {
  private readonly githubBaseUrl = 'https://github.com';

  public constructor(
    private readonly discordClient: DiscordClient,
    private readonly loggerService: LoggerService,
    private readonly configProvider: MessageModuleConfigProvider,
  ) {}

  public async execute(payload: SendForkCreatedMessageCommandHandlerPayload): Promise<void> {
    const { forkOwner, repository } = payload;

    const forksChannelId = this.configProvider.getDiscordForksChannelId();

    this.loggerService.debug({
      message: 'Sending message about created fork...',
      context: {
        source: SendForkCreatedMessageCommandHandlerImpl.name,
        repositoryName: repository.name,
        totalForks: repository.totalForks,
        forkOwnerName: forkOwner.name,
        channelId: forksChannelId,
      },
    });

    const messageTitle = 'New fork!';

    const messageUrl = `${this.githubBaseUrl}/${repository.name}/forks`;

    const messageDescription = `${forkOwner.name} forked a repository :rocket:`;

    const customFields = [
      {
        name: 'Total forks',
        value: String(repository.totalForks),
      },
    ];

    const embedMessageDraft: SendEmbedMessagePayload = {
      message: {
        title: messageTitle,
        url: messageUrl,
        author: {
          name: forkOwner.name,
          url: forkOwner.profileUrl,
        },
        thumbnail: forkOwner.avatarUrl,
        description: messageDescription,
        customFields,
      },
      channelId: forksChannelId,
    };

    await this.discordClient.sendEmbedMessage(embedMessageDraft);

    this.loggerService.info({
      message: 'Message about created fork sent.',
      context: {
        source: SendForkCreatedMessageCommandHandlerImpl.name,
        repositoryName: repository.name,
        totalForks: repository.totalForks,
        forkOwnerName: forkOwner.name,
        channelId: forksChannelId,
      },
    });
  }
}
