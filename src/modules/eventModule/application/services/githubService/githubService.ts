import { type GithubCommit } from '../../types/githubCommit.js';

export interface GetPullRequestCommitsPayload {
  readonly repositoryName: string;
  readonly pullRequestNumber: number;
}

export interface GetNumberOfPullRequestsByAuthorPayload {
  readonly repositoryName: string;
  readonly author: string;
}

export interface GithubService {
  getPullRequestCommits(payload: GetPullRequestCommitsPayload): Promise<GithubCommit[]>;
  getNumberOfPullRequestsByAuthor(payload: GetNumberOfPullRequestsByAuthorPayload): Promise<number>;
}
