/* eslint-disable @typescript-eslint/naming-convention */

import { type Static, Type } from '@sinclair/typebox';

export const processGithubForkEventBodySchema = Type.Object({
  action: Type.String(),
  forkee: Type.Object({
    owner: Type.Object({
      login: Type.String(),
      html_url: Type.String(),
      avatar_url: Type.String(),
    }),
  }),
  repository: Type.Object({
    forks_count: Type.Number(),
    full_name: Type.String(),
  }),
});

export type ProcessGithubForkEventBody = Static<typeof processGithubForkEventBodySchema>;

export const processGithubForkEventResponseOkBodySchema = Type.Null();

export type ProcessGithubForkEventResponseOkBody = Static<typeof processGithubForkEventResponseOkBodySchema>;
