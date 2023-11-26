import { InfrastructureError } from '../../../common/errors/infrastructureError.js';

interface Context {
  readonly entity: string;
  readonly operation: string;
}

export class GithubServiceError extends InfrastructureError<Context> {
  public constructor(context: Context) {
    super('GithubServiceError', 'Github service error.', context);
  }
}
