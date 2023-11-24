import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface SendIssueCreatedMessageCommandHandlerPayload {
  readonly issueTitle: string;
  readonly issueUrl: string;
  readonly issueNumber: number;
  readonly creatorAvatarUrl: string;
  readonly creatorHtmlUrl: string;
  readonly creatorName: string;
}

export type SendIssueCreatedMessageCommandHandler = CommandHandler<SendIssueCreatedMessageCommandHandlerPayload, void>;
