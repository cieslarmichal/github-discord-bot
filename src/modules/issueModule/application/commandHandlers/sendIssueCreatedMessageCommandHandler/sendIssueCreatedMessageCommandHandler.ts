import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface SendIssueCreatedMessageCommandHandlerPayload {
  readonly issueTitle: string;
  readonly issueUrl: string;
}

export type SendIssueCreatedMessageCommandHandler = CommandHandler<SendIssueCreatedMessageCommandHandlerPayload, void>;
