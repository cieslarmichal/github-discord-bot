import {
  type SendPullRequestCreatedMessageCommandHandler,
  type SendPullRequestCreatedMessageCommandHandlerPayload,
} from './sendPullRequestCreatedMessageCommandHandler.js';
import {
  type SendEmbedMessagePayload,
  type DiscordService,
} from '../../../../../libs/discord/services/discordService/discordService.js';
import { type GithubService } from '../../../../../libs/github/services/githubService/githubService.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type MessageModuleConfigProvider } from '../../../messageModuleConfigProvider.js';

export class SendPullRequestCreatedMessageCommandHandlerImpl implements SendPullRequestCreatedMessageCommandHandler {
  public constructor(
    private readonly discordService: DiscordService,
    private readonly loggerService: LoggerService,
    private readonly configProvider: MessageModuleConfigProvider,
    private readonly githubService: GithubService,
  ) {}

  public async execute(payload: SendPullRequestCreatedMessageCommandHandlerPayload): Promise<void> {
    const { pullRequest, author, repositoryName } = payload;

    const pullRequestsChannelId = this.configProvider.getDiscordPullRequestsChannelId();

    this.loggerService.debug({
      message: 'Sending message about created pull request...',
      context: {
        source: SendPullRequestCreatedMessageCommandHandlerImpl.name,
        pullRequestTitle: pullRequest.title,
        pullRequestUrl: pullRequest.url,
        authorName: author.name,
        pullRequestsChannelId,
      },
    });

    const messageColor = '#00CD2D';

    const messageTitle = `#${pullRequest.number}: ${pullRequest.title}`;

    const commitsForm = pullRequest.numberOfCommits === 1 ? 'commit' : 'commits';

    const messageDescription = `${author.name} wants to merge ${pullRequest.numberOfCommits} ${commitsForm} into ${pullRequest.targetBranch} from ${pullRequest.sourceBranch}`;

    const commits = await this.githubService.getPullRequestCommits({
      repositoryName,
      pullRequestNumber: pullRequest.number,
    });

    const customFields = commits.map((commit) => ({
      name: commit.sha.substring(0, 7),
      value: commit.message,
    }));

    const embedMessageDraft: SendEmbedMessagePayload = {
      message: {
        color: messageColor,
        url: pullRequest.url,
        title: messageTitle,
        author: {
          name: author.name,
          url: author.profileUrl,
        },
        thumbnail: author.avatarUrl,
        description: messageDescription,
        customFields,
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
        authorName: author.name,
        pullRequestsChannelId,
      },
    });
  }
}
