import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface SendStarCreatedMessageCommandHandlerPayload {
  readonly stargazer: {
    readonly name: string;
    readonly profileUrl: string;
    readonly avatarUrl: string;
  };
  readonly repository: {
    readonly totalStars: number;
    readonly name: string;
  };
}

export type SendStarCreatedMessageCommandHandler = CommandHandler<SendStarCreatedMessageCommandHandlerPayload, void>;
