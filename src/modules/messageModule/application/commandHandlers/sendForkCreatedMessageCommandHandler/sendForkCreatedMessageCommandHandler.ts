import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface SendForkCreatedMessageCommandHandlerPayload {
  readonly forkOwner: {
    readonly name: string;
    readonly profileUrl: string;
    readonly avatarUrl: string;
  };
  readonly repository: {
    readonly totalForks: number;
    readonly name: string;
  };
}

export type SendForkCreatedMessageCommandHandler = CommandHandler<SendForkCreatedMessageCommandHandlerPayload, void>;
