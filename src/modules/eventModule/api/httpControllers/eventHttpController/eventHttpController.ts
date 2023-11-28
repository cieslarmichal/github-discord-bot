/* eslint-disable @typescript-eslint/naming-convention */

import {
  processGithubIssueEventBodySchema,
  processGithubIssueEventResponseOkBodySchema,
  type ProcessGithubIssueEventBody,
  type ProcessGithubIssueEventResponseOkBody,
} from './schemas/processGithubIssueEventSchema.js';
import {
  type ProcessGithubPullRequestEventBody,
  type ProcessGithubPullRequestEventResponseOkBody,
  processGithubPullRequestEventBodySchema,
  processGithubPullRequestEventResponseOkBodySchema,
} from './schemas/processGithubPullRequestEventSchema.js';
import { type HttpController } from '../../../../../common/types/http/httpController.js';
import { HttpMethodName } from '../../../../../common/types/http/httpMethodName.js';
import { type HttpRequest } from '../../../../../common/types/http/httpRequest.js';
import { type HttpOkResponse } from '../../../../../common/types/http/httpResponse.js';
import { HttpRoute } from '../../../../../common/types/http/httpRoute.js';
import { HttpStatusCode } from '../../../../../common/types/http/httpStatusCode.js';
import { type SendIssueCreatedMessageCommandHandler } from '../../../application/commandHandlers/sendIssueCreatedMessageCommandHandler/sendIssueCreatedMessageCommandHandler.js';
import { type SendPullRequestCreatedMessageCommandHandler } from '../../../application/commandHandlers/sendPullRequestCreatedMessageCommandHandler/sendPullRequestCreatedMessageCommandHandler.js';
import { type SendPullRequestMergedMessageCommandHandler } from '../../../application/commandHandlers/sendPullRequestMergedMessageCommandHandler/sendPullRequestMergedMessageCommandHandler.js';

export class EventHttpController implements HttpController {
  public readonly basePath = '/events/github';

  public constructor(
    private readonly sendIssueCreatedMessageCommandHandler: SendIssueCreatedMessageCommandHandler,
    private readonly sendPullRequestCreatedMessageCommandHandler: SendPullRequestCreatedMessageCommandHandler,
    private readonly sendPullRequestMergedMessageCommandHandler: SendPullRequestMergedMessageCommandHandler,
  ) {}

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        method: HttpMethodName.post,
        path: '/issues',
        handler: this.processGithubIssueEvent.bind(this),
        schema: {
          request: {
            body: processGithubIssueEventBodySchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: processGithubIssueEventResponseOkBodySchema,
              description: 'Issue event processed.',
            },
          },
        },
        tags: ['Issue', 'Github', 'Webhook'],
        description: 'Process github issue event.',
      }),
      new HttpRoute({
        method: HttpMethodName.post,
        path: '/pull-requests',
        handler: this.processGithubPullRequestEvent.bind(this),
        schema: {
          request: {
            body: processGithubPullRequestEventBodySchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: processGithubPullRequestEventResponseOkBodySchema,
              description: 'Pull request event processed.',
            },
          },
        },
        tags: ['Pull Request', 'Github', 'Webhook'],
        description: 'Process github pull request event.',
      }),
    ];
  }

  private async processGithubIssueEvent(
    request: HttpRequest<ProcessGithubIssueEventBody>,
  ): Promise<HttpOkResponse<ProcessGithubIssueEventResponseOkBody>> {
    const { action, issue, sender } = request.body;

    if (action === 'opened') {
      await this.sendIssueCreatedMessageCommandHandler.execute({
        issue: {
          title: issue.title,
          number: issue.number,
          url: issue.html_url,
          labels: issue.labels,
        },
        author: {
          name: sender.login,
          profileUrl: sender.html_url,
          avatarUrl: sender.avatar_url,
        },
      });
    }

    return {
      statusCode: HttpStatusCode.ok,
      body: null,
    };
  }

  private async processGithubPullRequestEvent(
    request: HttpRequest<ProcessGithubPullRequestEventBody>,
  ): Promise<HttpOkResponse<ProcessGithubPullRequestEventResponseOkBody>> {
    const { action, pull_request, repository } = request.body;

    if (action === 'opened') {
      await this.sendPullRequestCreatedMessageCommandHandler.execute({
        pullRequest: {
          title: pull_request.title,
          number: pull_request.number,
          url: pull_request.html_url,
          numberOfCommits: pull_request.commits,
          commitsUrl: pull_request.commits_url,
          sourceBranch: pull_request.head.label,
          targetBranch: pull_request.base.label,
        },
        author: {
          name: pull_request.user.login,
          profileUrl: pull_request.user.html_url,
          avatarUrl: pull_request.user.avatar_url,
        },
        repositoryName: repository.full_name,
      });
    } else if (action === 'closed' && pull_request.merged) {
      await this.sendPullRequestMergedMessageCommandHandler.execute({
        pullRequest: {
          title: pull_request.title,
          number: pull_request.number,
          url: pull_request.html_url,
        },
        author: {
          name: pull_request.user.login,
          profileUrl: pull_request.user.html_url,
          avatarUrl: pull_request.user.avatar_url,
        },
        repositoryName: repository.full_name,
      });
    }

    return {
      statusCode: HttpStatusCode.ok,
      body: null,
    };
  }
}
