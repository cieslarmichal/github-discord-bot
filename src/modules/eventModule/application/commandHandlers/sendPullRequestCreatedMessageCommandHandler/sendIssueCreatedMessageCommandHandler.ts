import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type GithubPullRequest } from '../../types/githubPullRequest.js';
import { type GithubUser } from '../../types/githubUser.js';

export interface SendPullRequestCreatedMessageCommandHandlerPayload {
  readonly pullRequest: GithubPullRequest;
  readonly creator: GithubUser;
}

export type SendPullRequestCreatedMessageCommandHandler = CommandHandler<
  SendPullRequestCreatedMessageCommandHandlerPayload,
  void
>;
