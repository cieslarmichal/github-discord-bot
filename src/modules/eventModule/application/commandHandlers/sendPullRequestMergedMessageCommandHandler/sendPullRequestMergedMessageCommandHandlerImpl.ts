import {
  type SendPullRequestMergedMessageCommandHandler,
  type SendPullRequestMergedMessageCommandHandlerPayload,
} from './sendPullRequestMergedMessageCommandHandler.js';
import {
  type SendEmbedMessagePayload,
  type DiscordService,
} from '../../../../../libs/discord/services/discordService/discordService.js';
import { type GithubService } from '../../../../../libs/github/services/githubService/githubService.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type EventModuleConfigProvider } from '../../../eventModuleConfigProvider.js';

export class SendPullRequestMergedMessageCommandHandlerImpl implements SendPullRequestMergedMessageCommandHandler {
  public constructor(
    private readonly discordService: DiscordService,
    private readonly loggerService: LoggerService,
    private readonly configProvider: EventModuleConfigProvider,
    private readonly githubService: GithubService,
  ) {}

  public async execute(payload: SendPullRequestMergedMessageCommandHandlerPayload): Promise<void> {
    const { pullRequest, author, repositoryName } = payload;

    const pullRequestsChannelId = this.configProvider.getDiscordPullRequestsChannelId();

    this.loggerService.debug({
      message: 'Sending message about merged pull request...',
      context: {
        source: SendPullRequestMergedMessageCommandHandlerImpl.name,
        pullRequestTitle: pullRequest.title,
        pullRequestUrl: pullRequest.url,
        authorName: author.name,
        pullRequestsChannelId,
        repositoryName,
      },
    });

    const messageColor = '#8d56e4';

    const messageTitle = `Merged #${pullRequest.number}: ${pullRequest.title}`;

    const numberOfUserPullRequests = await this.githubService.getNumberOfPullRequestsByAuthor({
      repositoryName,
      author: author.name,
    });

    let messageDescription;

    if (numberOfUserPullRequests === 1) {
      messageDescription = `${author.name} merged his first pull request!`;
    } else {
      messageDescription = `${author.name} merged his ${numberOfUserPullRequests} pull request.`;
    }

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
        authorName: author.name,
        pullRequestsChannelId,
        repositoryName,
      },
    });
  }
}
