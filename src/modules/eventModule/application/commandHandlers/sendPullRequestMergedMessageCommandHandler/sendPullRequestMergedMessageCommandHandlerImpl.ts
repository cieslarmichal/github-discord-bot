import {
  type SendPullRequestMergedMessageCommandHandler,
  type SendPullRequestMergedMessageCommandHandlerPayload,
} from './sendPullRequestMergedMessageCommandHandler.js';
import {
  type SendEmbedMessagePayload,
  type DiscordService,
} from '../../../../../libs/discord/services/discordService/discordService.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type EventModuleConfigProvider } from '../../../eventModuleConfigProvider.js';
import { type GithubService } from '../../services/githubService/githubService.js';

export class SendPullRequestMergedMessageCommandHandlerImpl implements SendPullRequestMergedMessageCommandHandler {
  public constructor(
    private readonly discordService: DiscordService,
    private readonly loggerService: LoggerService,
    private readonly configProvider: EventModuleConfigProvider,
    private readonly githubService: GithubService,
  ) {}

  public async execute(payload: SendPullRequestMergedMessageCommandHandlerPayload): Promise<void> {
    const { pullRequest, creator } = payload;

    const pullRequestsChannelId = this.configProvider.getDiscordPullRequestsChannelId();

    const repositoryName = this.configProvider.getGithubRepositoryName();

    this.loggerService.debug({
      message: 'Sending message about merged pull request...',
      context: {
        source: SendPullRequestMergedMessageCommandHandlerImpl.name,
        pullRequestTitle: pullRequest.title,
        pullRequestUrl: pullRequest.url,
        creatorName: creator.name,
        pullRequestsChannelId,
        repositoryName,
      },
    });

    const messageColor = '#8d56e4';

    const messageTitle = `Merged #${pullRequest.number}: ${pullRequest.title}`;

    const numberOfUserPullRequests = 2;

    let messageDescription;

    if (numberOfUserPullRequests === 1) {
      messageDescription = `${creator.name} merged this first pull request!`;
    } else {
      messageDescription = `${creator.name} merged this ${numberOfUserPullRequests} pull requests.`;
    }

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
          name: creator.name,
          url: creator.profileUrl,
        },
        thumbnail: creator.avatarUrl,
        description: messageDescription,
        customFields,
      },
      channelId: pullRequestsChannelId,
    };

    await this.discordService.sendEmbedMessage(embedMessageDraft);

    this.loggerService.info({
      message: 'Message about merged pull request sent.',
      context: {
        source: SendPullRequestMergedMessageCommandHandlerImpl.name,
        pullRequestTitle: pullRequest.title,
        pullRequestUrl: pullRequest.url,
        creatorName: creator.name,
        pullRequestsChannelId,
        repositoryName,
      },
    });
  }
}
