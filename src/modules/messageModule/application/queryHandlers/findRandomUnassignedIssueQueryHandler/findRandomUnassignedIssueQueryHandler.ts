import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type DifficultyLevel } from '../../../../../common/types/difficultyLevel.js';
import { type GithubIssue } from '../../../../../libs/github/types/githubIssue.js';

export interface FindRandomUnassignedIssueQueryHandlerPayload {
  readonly difficultyLevel: DifficultyLevel;
}

export interface FindRandomUnassignedIssueQueryHandlerResult {
  readonly issue: GithubIssue | null;
}

export type FindRandomUnassignedIssueQueryHandler = CommandHandler<
  FindRandomUnassignedIssueQueryHandlerPayload,
  FindRandomUnassignedIssueQueryHandlerResult
>;
