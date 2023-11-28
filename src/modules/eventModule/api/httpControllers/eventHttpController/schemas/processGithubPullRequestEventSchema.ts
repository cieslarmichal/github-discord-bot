/* eslint-disable @typescript-eslint/naming-convention */

import { type Static, Type } from '@sinclair/typebox';

export const processGithubPullRequestEventBodySchema = Type.Object({
  action: Type.String(),
  pull_request: Type.Object({
    title: Type.String(),
    number: Type.Number(),
    html_url: Type.String(),
    commits: Type.Number(),
    commits_url: Type.String(),
    merged: Type.Boolean(),
    base: Type.Object({ ref: Type.String() }),
    head: Type.Object({ ref: Type.String() }),
    user: Type.Object({
      avatar_url: Type.String(),
      html_url: Type.String(),
      login: Type.String(),
    }),
  }),
  repository: Type.Object({
    full_name: Type.String(),
  }),
});

export type ProcessGithubPullRequestEventBody = Static<typeof processGithubPullRequestEventBodySchema>;

export const processGithubPullRequestEventResponseOkBodySchema = Type.Null();

export type ProcessGithubPullRequestEventResponseOkBody = Static<
  typeof processGithubPullRequestEventResponseOkBodySchema
>;
