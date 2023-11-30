/* eslint-disable @typescript-eslint/naming-convention */

import { type Static, Type } from '@sinclair/typebox';

export const processGithubStarEventBodySchema = Type.Object({
  action: Type.String(),
  sender: Type.Object({
    avatar_url: Type.String(),
    html_url: Type.String(),
    login: Type.String(),
  }),
  repository: Type.Object({
    stargazers_count: Type.Number(),
    full_name: Type.String(),
  }),
});

export type ProcessGithubStarEventBody = Static<typeof processGithubStarEventBodySchema>;

export const processGithubStarEventResponseOkBodySchema = Type.Null();

export type ProcessGithubStarEventResponseOkBody = Static<typeof processGithubStarEventResponseOkBodySchema>;
