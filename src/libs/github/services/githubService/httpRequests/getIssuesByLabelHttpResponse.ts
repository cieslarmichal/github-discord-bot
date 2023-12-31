/* eslint-disable @typescript-eslint/naming-convention */

export interface IssueBody {
  number: number;
  title: string;
  html_url: string;
  state: string;
  assignee: {
    login: string;
    avatar_url: string;
  } | null;
}

export interface GetIssuesByLabelHttpResponseBody {
  readonly items: IssueBody[];
}
