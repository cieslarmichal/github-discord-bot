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
      message: 'Fetching random unassigned open issue...',
      context: {
        source: FindRandomUnassignedIssueQueryHandlerImpl.name,
        repositoryName,
        difficultyLevel,
      },
    });

    const issues = await this.githubService.getIssuesByLabel({
      label: difficultyLevel,
      repositoryName,
    });

    const unassignedIssues = issues.filter((issue) => issue.assignee === null);

    const unassignedOpenIssues = unassignedIssues.filter((issue) => issue.state === 'open');

    const randomIndex = Math.floor(Math.random() * unassignedOpenIssues.length);

    const issue = unassignedOpenIssues[randomIndex];

    if (!issue) {
      this.loggerService.info({
        message: 'No random unassigned open issue found.',
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
      message: 'Random unassigned open issue fetched.',
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
