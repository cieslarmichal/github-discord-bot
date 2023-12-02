import {
  type FindRandomUnassignedIssueQueryHandlerResult,
  type FindRandomUnassignedIssueQueryHandler,
  type FindRandomUnassignedIssueQueryHandlerPayload,
} from './findRandomUnassignedIssueQueryHandler.js';
import { type GithubService } from '../../../../../libs/github/services/githubService/githubService.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type MessageModuleConfigProvider } from '../../../messageModuleConfigProvider.js';

export class FindRandomUnassignedIssueQueryHandlerImpl implements FindRandomUnassignedIssueQueryHandler {
  public constructor(
    private readonly githubService: GithubService,
    private readonly loggerService: LoggerService,
    private readonly configProvider: MessageModuleConfigProvider,
  ) {}

  public async execute(
    payload: FindRandomUnassignedIssueQueryHandlerPayload,
  ): Promise<FindRandomUnassignedIssueQueryHandlerResult> {
    const { difficultyLevel } = payload;

    const repositoryName = this.configProvider.getGithubRepositoryName();

    this.loggerService.debug({
      message: 'Fetching random unassigned issue...',
      context: {
        source: FindRandomUnassignedIssueQueryHandlerImpl.name,
        repositoryName,
        difficultyLevel,
      },
    });

    const issues = await this.githubService.getIssuesByLabel({
      label: difficultyLevel,
    });

    const unassignedIssues = issues.filter((issue) => issue.assignee === null);

    const randomIndex = Math.floor(Math.random() * unassignedIssues.length);

    const issue = unassignedIssues[randomIndex];

    if (!issue) {
      this.loggerService.info({
        message: 'No random unassigned issue found.',
        context: {
          source: FindRandomUnassignedIssueQueryHandlerImpl.name,
          repositoryName,
          difficultyLevel,
        },
      });

      return {
        issue: null,
      };
    }

    this.loggerService.info({
      message: 'Random unassigned issue fetched.',
      context: {
        source: FindRandomUnassignedIssueQueryHandlerImpl.name,
        issueTitle: issue.title,
        issueUrl: issue.url,
        repositoryName,
        difficultyLevel,
      },
    });

    return { issue };
  }
}
