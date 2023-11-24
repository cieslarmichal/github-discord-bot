/* eslint-disable @typescript-eslint/naming-convention */

import { type Static, Type } from '@sinclair/typebox';

export const processGithubIssueEventBodySchema = Type.Object({
  action: Type.String(),
  issue: Type.Object({
    title: Type.String(),
    number: Type.Number(),
    url: Type.String(),
  }),
  user: Type.Object({
    avatar_url: Type.String(),
    html_url: Type.String(),
    login: Type.String(),
  }),
});

export type ProcessGithubIssueEventBody = Static<typeof processGithubIssueEventBodySchema>;

export const processGithubIssueEventResponseOkBodySchema = Type.Null();

export type ProcessGithubIssueEventResponseOkBody = Static<typeof processGithubIssueEventResponseOkBodySchema>;
