import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type PullRequest } from '../../types/pullRequest.js';
import { type User } from '../../types/user.js';

export interface SendPullRequestMergedMessageCommandHandlerPayload {
  readonly pullRequest: PullRequest;
  readonly creator: User;
}

export type SendPullRequestMergedMessageCommandHandler = CommandHandler<
  SendPullRequestMergedMessageCommandHandlerPayload,
  void
>;
