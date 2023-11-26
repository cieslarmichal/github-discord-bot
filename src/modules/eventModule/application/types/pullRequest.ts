export interface PullRequest {
  readonly title: string;
  readonly number: number;
  readonly url: string;
  readonly numberOfCommits: number;
  readonly commitsUrl: string;
  readonly sourceBranch: string;
  readonly targetBranch: string;
}
