import {
  type SendIssueCreatedMessageCommandHandler,
  type SendIssueCreatedMessageCommandHandlerPayload,
} from './sendIssueCreatedMessageCommandHandler.js';
import { type DiscordService } from '../../../../../libs/discord/services/discordService/discordService.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type EventModuleConfigProvider } from '../../../eventModuleConfigProvider.js';

export class SendIssueCreatedMessageCommandHandlerImpl implements SendIssueCreatedMessageCommandHandler {
  public constructor(
    private readonly discordService: DiscordService,
    private readonly loggerService: LoggerService,
    private readonly eventModuleConfigProvider: EventModuleConfigProvider,
  ) {}

  public async execute(payload: SendIssueCreatedMessageCommandHandlerPayload): Promise<void> {
    const { issueTitle, issueUrl, issueNumber, issueLabels, creatorName, creatorAvatarUrl, creatorHtmlUrl } = payload;

    const issuesChannelId = this.eventModuleConfigProvider.getDiscordIssuesChannelId();

    this.loggerService.debug({
      message: 'Sending message about created issue...',
      context: {
        source: SendIssueCreatedMessageCommandHandlerImpl.name,
        issueTitle,
        issueUrl,
        issuesChannelId,
      },
    });

    const issueLabel = issueLabels[0];

    const messageColor = issueLabel ? issueLabel.color : '#00CD2D';

    const messageTitle = `#${issueNumber}: ${issueTitle}`;

    const customFields = issueLabel
      ? [
          {
            name: 'label',
            value: issueLabel.name,
          },
        ]
      : [];

    await this.discordService.sendEmbedMessage({
      message: {
        color: messageColor,
        url: issueUrl,
        title: messageTitle,
        author: {
          name: creatorName,
          url: creatorHtmlUrl,
        },
        thumbnail: creatorAvatarUrl,
        customFields,
      },
      channelId: issuesChannelId,
    });

    this.loggerService.info({
      message: 'Message about created issue sent.',
      context: {
        source: SendIssueCreatedMessageCommandHandlerImpl.name,
        issueTitle,
        issueUrl,
        issuesChannelId,
      },
    });
  }
}
