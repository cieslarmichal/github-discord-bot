import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type GithubIssue } from '../../types/githubIssue.js';
import { type GithubUser } from '../../types/githubUser.js';

export interface SendIssueCreatedMessageCommandHandlerPayload {
  readonly issue: GithubIssue;
  readonly creator: GithubUser;
}

export type SendIssueCreatedMessageCommandHandler = CommandHandler<SendIssueCreatedMessageCommandHandlerPayload, void>;
