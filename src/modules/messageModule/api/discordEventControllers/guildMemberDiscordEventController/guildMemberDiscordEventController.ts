/* eslint-disable @typescript-eslint/no-explicit-any */

import { type GuildMember } from 'discord.js';

import { DiscordEvent } from '../../../../../common/types/discord/discordEvent.js';
import { type DiscordEventController } from '../../../../../common/types/discord/discordEventController.js';
import { DiscordEventName } from '../../../../../common/types/discord/discordEventName.js';
import { type SendWelcomeMessageCommandHandler } from '../../../application/commandHandlers/sendWelcomeMessageCommandHandler/sendWelcomeMessageCommandHandler.js';

export class GuildMemberDiscordEventController implements DiscordEventController {
  public constructor(private readonly sendWelcomeMessageCommandHandler: SendWelcomeMessageCommandHandler) {}

  public getDiscordEvents(): DiscordEvent<any>[] {
    return [
      new DiscordEvent({
        eventName: DiscordEventName.guildMemberAdd,
        handler: this.processGuildMemberAddEvent.bind(this),
      }),
    ];
  }

  private async processGuildMemberAddEvent(member: GuildMember): Promise<void> {
    await this.sendWelcomeMessageCommandHandler.execute({
      user: member.user.toString(),
    });
  }
}
