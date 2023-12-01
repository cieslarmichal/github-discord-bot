import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface SendWelcomeMessageCommandHandlerPayload {
  readonly user: string;
}

export type SendWelcomeMessageCommandHandler = CommandHandler<SendWelcomeMessageCommandHandlerPayload, void>;
