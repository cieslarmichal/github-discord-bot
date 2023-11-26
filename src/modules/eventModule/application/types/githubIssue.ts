export interface GithubIssue {
  readonly title: string;
  readonly number: number;
  readonly url: string;
  readonly labels: { name: string }[];
}
