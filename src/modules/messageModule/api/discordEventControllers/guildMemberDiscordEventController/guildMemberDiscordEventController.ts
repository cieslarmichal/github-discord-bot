/* eslint-disable @typescript-eslint/no-explicit-any */

import { type GuildMember } from 'discord.js';

import { DiscordEvent } from '../../../../../common/types/discord/discordEvent.js';
import { type DiscordEventController } from '../../../../../common/types/discord/discordEventController.js';
import { DiscordEventName } from '../../../../../common/types/discord/discordEventName.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';

export class GuildMemberDiscordEventController implements DiscordEventController {
  public constructor(private readonly loggerService: LoggerService) {}

  public getDiscordEvents(): DiscordEvent<any>[] {
    return [
      new DiscordEvent({
        eventName: DiscordEventName.guildMemberAdd,
        handler: this.processGuildMemberAddEvent.bind(this),
      }),
    ];
  }

  private async processGuildMemberAddEvent(member: GuildMember): Promise<void> {
    this.loggerService.debug({
      message: 'New user joined the server.',
      context: { user: member.user.username },
    });

    const welcomeChannelName = 'welcome';

    const welcomeChannel = member.guild.channels.cache.find((channel) => channel.name === welcomeChannelName);

    if (!welcomeChannel) {
      throw new Error('Welcome channel not found.');
    }

    if (welcomeChannel.isTextBased()) {
      await welcomeChannel.send(`Welcome to the server ${member.user}!`);
    }

    this.loggerService.debug({
      message: 'Welcome message sent.',
      context: {
        user: member.user.username,
        channel: welcomeChannelName,
      },
    });
  }
}
