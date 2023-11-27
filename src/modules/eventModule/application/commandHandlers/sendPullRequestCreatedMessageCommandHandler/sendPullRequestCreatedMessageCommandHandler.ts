import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface SendPullRequestCreatedMessageCommandHandlerPayload {
  readonly pullRequest: {
    readonly title: string;
    readonly number: number;
    readonly url: string;
    readonly numberOfCommits: number;
    readonly commitsUrl: string;
    readonly sourceBranch: string;
    readonly targetBranch: string;
  };
  readonly creator: {
    readonly name: string;
    readonly profileUrl: string;
    readonly avatarUrl: string;
  };
}

export type SendPullRequestCreatedMessageCommandHandler = CommandHandler<
  SendPullRequestCreatedMessageCommandHandlerPayload,
  void
>;
