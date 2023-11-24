import {
  type SendIssueCreatedMessageCommandHandler,
  type SendIssueCreatedMessageCommandHandlerPayload,
} from './sendIssueCreatedMessageCommandHandler.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';

export class SendIssueCreatedMessageCommandHandlerImpl implements SendIssueCreatedMessageCommandHandler {
  public constructor(
    private readonly discordService: DiscordService,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: SendIssueCreatedMessageCommandHandlerPayload): Promise<void> {
    const { issueTitle, issueUrl } = payload;

    this.loggerService.debug({
      message: 'Sending issue created message...',
      context: {
        issueTitle,
        issueUrl,
      },
    });

    const existingIssue = await this.issueRepository.findIssue({
      title,
      authorId,
    });

    if (existingIssue) {
      throw new ResourceAlreadyExistsError({
        name: 'Issue',
        id: existingIssue.id,
        title,
        authorId,
      });
    }

    const issue = await this.issueRepository.createIssue({
      title,
      releaseYear,
      authorId,
    });

    this.loggerService.info({
      message: 'Issue created.',
      context: {
        issueId: issue.id,
        title,
        releaseYear,
        authorId,
      },
    });

    return { issue };
  }
}
