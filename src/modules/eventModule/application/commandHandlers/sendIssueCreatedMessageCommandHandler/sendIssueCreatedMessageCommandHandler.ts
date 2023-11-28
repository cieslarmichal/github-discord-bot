import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface SendIssueCreatedMessageCommandHandlerPayload {
  readonly issue: {
    readonly title: string;
    readonly number: number;
    readonly url: string;
    readonly labels: { name: string }[];
  };
  readonly author: {
    readonly name: string;
    readonly profileUrl: string;
    readonly avatarUrl: string;
  };
}

export type SendIssueCreatedMessageCommandHandler = CommandHandler<SendIssueCreatedMessageCommandHandlerPayload, void>;
