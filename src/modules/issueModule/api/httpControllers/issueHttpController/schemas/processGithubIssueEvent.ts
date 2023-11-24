import { type Static, Type } from '@sinclair/typebox';

export const processGithubIssueEventBodySchema = Type.Object({
  action: Type.String(),
  issue: Type.Object({
    title: Type.String(),
    url: Type.String(),
  }),
});

export type ProcessGithubIssueEventBody = Static<typeof processGithubIssueEventBodySchema>;

export const processGithubIssueEventResponseOkBodySchema = Type.Null();

export type ProcessGithubIssueEventResponseOkBody = Static<typeof processGithubIssueEventResponseOkBodySchema>;
