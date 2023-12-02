import {
  type GithubService,
  type GetPullRequestCommitsPayload,
  type GetNumberOfPullRequestsByAuthorPayload,
  type GetIssuesByLabelPayload,
} from './githubService.js';
import { type GetAuthorPullRequestsHttpResponseBody } from './httpRequests/getAuthorPullRequestsHttpResponse.js';
import { type GetIssuesByLabelHttpResponseBody } from './httpRequests/getIssuesByLabelHttpResponse.js';
import { type GetPullRequestCommitsHttpResponseBody } from './httpRequests/getPullRequestCommitsHttpResponse.js';
import { HttpMethodName } from '../../../../common/types/http/httpMethodName.js';
import { HttpStatusCode } from '../../../../common/types/http/httpStatusCode.js';
import { type HttpService } from '../../../httpService/services/httpService/httpService.js';
import { GithubServiceError } from '../../errors/githubServiceError.js';
import { type GithubCommit } from '../../types/githubCommit.js';
import { type GithubIssue } from '../../types/githubIssue.js';

export class GithubServiceImpl implements GithubService {
  private readonly githubBaseUrl = 'https://api.github.com';

  public constructor(private readonly httpService: HttpService) {}

  public async getPullRequestCommits(payload: GetPullRequestCommitsPayload): Promise<GithubCommit[]> {
    const { pullRequestNumber, repositoryName } = payload;

    const commitsUrl = `${this.githubBaseUrl}/repos/${repositoryName}/pulls/${pullRequestNumber}/commits`;

    const commitsResponse = await this.httpService.sendRequest<GetPullRequestCommitsHttpResponseBody>({
      method: HttpMethodName.get,
      url: commitsUrl,
    });

    if (commitsResponse.statusCode !== HttpStatusCode.ok) {
      throw new GithubServiceError({
        entity: 'PullRequestCommits',
        operation: 'get',
      });
    }

    const commits = commitsResponse.body.map((commitBody) => ({
      sha: commitBody.sha,
      message: commitBody.commit.message,
    }));

    return commits;
  }

  public async getNumberOfPullRequestsByAuthor(payload: GetNumberOfPullRequestsByAuthorPayload): Promise<number> {
    const { repositoryName, author } = payload;

    const issuesSearchUrl = `${this.githubBaseUrl}/search/issues?q=is:pr+repo:${repositoryName}+author:${author}`;

    const response = await this.httpService.sendRequest<GetAuthorPullRequestsHttpResponseBody>({
      method: HttpMethodName.get,
      url: issuesSearchUrl,
    });

    if (response.statusCode !== HttpStatusCode.ok) {
      throw new GithubServiceError({
        entity: 'PullRequests',
        operation: 'get',
      });
    }

    return response.body.total_count;
  }

  public async getIssuesByLabel(payload: GetIssuesByLabelPayload): Promise<GithubIssue[]> {
    const { label } = payload;

    const issuesSearchUrl = `${this.githubBaseUrl}/search/issues?q=label:${label}`;

    const response = await this.httpService.sendRequest<GetIssuesByLabelHttpResponseBody>({
      method: HttpMethodName.get,
      url: issuesSearchUrl,
    });

    if (response.statusCode !== HttpStatusCode.ok) {
      throw new GithubServiceError({
        entity: 'Issues',
        operation: 'get',
      });
    }

    const issues = response.body.map((issueBody) => ({
      number: issueBody.number,
      title: issueBody.title,
      url: issueBody.html_url,
      assignee: issueBody.assignee
        ? {
            name: issueBody.assignee.login,
            avatarUrl: issueBody.assignee.avatar_url,
          }
        : null,
    }));

    return issues;
  }
}
