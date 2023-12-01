import { type DiscordEventHandler } from './discordEventHandler.js';
import { type DiscordEventName } from './discordEventName.js';

export interface DiscordEventDraft<T = unknown> {
  readonly eventName: DiscordEventName;
  readonly handler: DiscordEventHandler<T>;
}

export class DiscordEvent<T = unknown> {
  public readonly eventName: DiscordEventName;
  public readonly handler: DiscordEventHandler<T>;

  public constructor(draft: DiscordEventDraft<T>) {
    const { eventName, handler } = draft;

    this.eventName = eventName;

    this.handler = handler;
  }
}
