import {
  type SendPullRequestCreatedMessageCommandHandler,
  type SendPullRequestCreatedMessageCommandHandlerPayload,
} from './sendIssueCreatedMessageCommandHandler.js';
import {
  type SendEmbedMessagePayload,
  type DiscordService,
} from '../../../../../libs/discord/services/discordService/discordService.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type EventModuleConfigProvider } from '../../../eventModuleConfigProvider.js';

export class SendPullRequestCreatedMessageCommandHandlerImpl implements SendPullRequestCreatedMessageCommandHandler {
  public constructor(
    private readonly discordService: DiscordService,
    private readonly loggerService: LoggerService,
    private readonly eventModuleConfigProvider: EventModuleConfigProvider,
  ) {}

  public async execute(payload: SendPullRequestCreatedMessageCommandHandlerPayload): Promise<void> {
    const { pullRequest, creator } = payload;

    const pullRequestsChannelId = this.eventModuleConfigProvider.getDiscordPullRequestsChannelId();

    this.loggerService.debug({
      message: 'Sending message about created pull request...',
      context: {
        source: SendPullRequestCreatedMessageCommandHandlerImpl.name,
        pullRequestTitle: pullRequest.title,
        pullRequestUrl: pullRequest.url,
        creatorName: creator.name,
        pullRequestsChannelId,
      },
    });

    const messageColor = '#00CD2D';

    const messageTitle = `#${pullRequest.number}: ${pullRequest.title}`;

    const messageDescription = `Merge ${pullRequest.numberOfCommits} commits from \`${pullRequest.sourceBranch}\` into \`${pullRequest.targetBranch}\``;

    const embedMessageDraft: SendEmbedMessagePayload = {
      message: {
        color: messageColor,
        url: pullRequest.url,
        title: messageTitle,
        author: {
          name: creator.name,
          url: creator.profileUrl,
        },
        thumbnail: creator.avatarUrl,
        description: messageDescription,
      },
      channelId: pullRequestsChannelId,
    };

    await this.discordService.sendEmbedMessage(embedMessageDraft);

    this.loggerService.info({
      message: 'Message about created pull request sent.',
      context: {
        source: SendPullRequestCreatedMessageCommandHandlerImpl.name,
        pullRequestTitle: pullRequest.title,
        pullRequestUrl: pullRequest.url,
        creatorName: creator.name,
        pullRequestsChannelId,
      },
    });
  }
}
