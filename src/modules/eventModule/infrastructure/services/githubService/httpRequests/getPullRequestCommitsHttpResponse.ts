export interface CommitBody {
  sha: string;
  commit: { message: string };
}

export type GetPullRequestCommitsHttpResponseBody = CommitBody[];
