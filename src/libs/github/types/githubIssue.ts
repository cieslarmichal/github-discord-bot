import { type GithubUser } from './githubUser.js';

export interface GithubIssue {
  readonly title: string;
  readonly number: number;
  readonly url: string;
  readonly assignee: GithubUser | null;
  readonly state: string;
}
