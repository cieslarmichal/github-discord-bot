import { type GithubCommit } from '../../types/githubCommit.js';

export interface GetPullRequestCommitsPayload {
  readonly repositoryName: string;
  readonly repositoryOwnerName: string;
  readonly pullRequestNumber: number;
}

export interface GithubService {
  getPullRequestCommits(payload: GetPullRequestCommitsPayload): Promise<GithubCommit[]>;
}
