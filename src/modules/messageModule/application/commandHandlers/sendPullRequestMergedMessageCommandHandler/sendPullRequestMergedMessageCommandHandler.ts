import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface SendPullRequestMergedMessageCommandHandlerPayload {
  readonly pullRequest: {
    readonly title: string;
    readonly number: number;
    readonly url: string;
  };
  readonly author: {
    readonly name: string;
    readonly profileUrl: string;
    readonly avatarUrl: string;
  };
  readonly repositoryName: string;
}

export type SendPullRequestMergedMessageCommandHandler = CommandHandler<
  SendPullRequestMergedMessageCommandHandlerPayload,
  void
>;
