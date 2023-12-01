import {
  type SendIssueCreatedMessageCommandHandler,
  type SendIssueCreatedMessageCommandHandlerPayload,
} from './sendIssueCreatedMessageCommandHandler.js';
import { type DiscordClient, type SendEmbedMessagePayload } from '../../../../../core/discordClient/discordClient.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type MessageModuleConfigProvider } from '../../../messageModuleConfigProvider.js';

export class SendIssueCreatedMessageCommandHandlerImpl implements SendIssueCreatedMessageCommandHandler {
  public constructor(
    private readonly discordClient: DiscordClient,
    private readonly loggerService: LoggerService,
    private readonly configProvider: MessageModuleConfigProvider,
  ) {}

  public async execute(payload: SendIssueCreatedMessageCommandHandlerPayload): Promise<void> {
    const { issue, author } = payload;

    const issuesChannelId = this.configProvider.getDiscordIssuesChannelId();

    this.loggerService.debug({
      message: 'Sending message about created issue...',
      context: {
        source: SendIssueCreatedMessageCommandHandlerImpl.name,
        issueTitle: issue.title,
        issueUrl: issue.url,
        authorName: author.name,
        issuesChannelId,
      },
    });

    const messageColor = '#00CD2D';

    const messageTitle = `#${issue.number}: ${issue.title}`;

    let embedMessageDraft: SendEmbedMessagePayload = {
      message: {
        color: messageColor,
        url: issue.url,
        title: messageTitle,
        author: {
          name: author.name,
          url: author.profileUrl,
        },
        thumbnail: author.avatarUrl,
      },
      channelId: issuesChannelId,
    };

    if (issue.labels.length) {
      const labelNames = issue.labels.map((label) => label.name).join(', ');

      const messageDescription = `${labelNames}`;

      embedMessageDraft = {
        ...embedMessageDraft,
        message: {
          ...embedMessageDraft.message,
          description: messageDescription,
        },
      };
    }

    await this.discordClient.sendEmbedMessage(embedMessageDraft);

    this.loggerService.info({
      message: 'Message about created issue sent.',
      context: {
        source: SendIssueCreatedMessageCommandHandlerImpl.name,
        issueTitle: issue.title,
        issueUrl: issue.url,
        authorName: author.name,
        issuesChannelId,
      },
    });
  }
}
