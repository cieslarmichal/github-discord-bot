import { type DiscordEvent } from './discordEvent.js';

export abstract class DiscordEventController {
  public abstract getDiscordEvents(): DiscordEvent[];
}
