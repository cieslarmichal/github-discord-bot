import {
  type SendIssueCreatedMessageCommandHandler,
  type SendIssueCreatedMessageCommandHandlerPayload,
} from './sendIssueCreatedMessageCommandHandler.js';
import {
  type SendEmbedMessagePayload,
  type DiscordService,
} from '../../../../../libs/discord/services/discordService/discordService.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type EventModuleConfigProvider } from '../../../eventModuleConfigProvider.js';

export class SendIssueCreatedMessageCommandHandlerImpl implements SendIssueCreatedMessageCommandHandler {
  public constructor(
    private readonly discordService: DiscordService,
    private readonly loggerService: LoggerService,
    private readonly configProvider: EventModuleConfigProvider,
  ) {}

  public async execute(payload: SendIssueCreatedMessageCommandHandlerPayload): Promise<void> {
    const { issue, creator } = payload;

    const issuesChannelId = this.configProvider.getDiscordIssuesChannelId();

    this.loggerService.debug({
      message: 'Sending message about created issue...',
      context: {
        source: SendIssueCreatedMessageCommandHandlerImpl.name,
        issueTitle: issue.title,
        issueUrl: issue.url,
        creatorName: creator.name,
        issuesChannelId,
      },
    });

    const issueLabel = issue.labels[0];

    const messageColor = '#00CD2D';

    const messageTitle = `#${issue.number}: ${issue.title}`;

    let embedMessageDraft: SendEmbedMessagePayload = {
      message: {
        color: messageColor,
        url: issue.url,
        title: messageTitle,
        author: {
          name: creator.name,
          url: creator.profileUrl,
        },
        thumbnail: creator.avatarUrl,
      },
      channelId: issuesChannelId,
    };

    if (issueLabel) {
      embedMessageDraft = {
        ...embedMessageDraft,
        message: {
          ...embedMessageDraft.message,
          description: issueLabel.name,
        },
      };
    }

    await this.discordService.sendEmbedMessage(embedMessageDraft);

    this.loggerService.info({
      message: 'Message about created issue sent.',
      context: {
        source: SendIssueCreatedMessageCommandHandlerImpl.name,
        issueTitle: issue.title,
        issueUrl: issue.url,
        creatorName: creator.name,
        issuesChannelId,
      },
    });
  }
}
