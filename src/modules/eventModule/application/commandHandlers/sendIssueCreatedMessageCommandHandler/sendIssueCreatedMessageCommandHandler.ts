import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type Issue } from '../../types/issue.js';
import { type User } from '../../types/user.js';

export interface SendIssueCreatedMessageCommandHandlerPayload {
  readonly issue: Issue;
  readonly creator: User;
}

export type SendIssueCreatedMessageCommandHandler = CommandHandler<SendIssueCreatedMessageCommandHandlerPayload, void>;
