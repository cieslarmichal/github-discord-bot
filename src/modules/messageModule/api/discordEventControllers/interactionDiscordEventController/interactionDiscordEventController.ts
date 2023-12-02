/* eslint-disable @typescript-eslint/no-explicit-any */

import { type Interaction } from 'discord.js';

import { DiscordEvent } from '../../../../../common/types/discord/discordEvent.js';
import { type DiscordEventController } from '../../../../../common/types/discord/discordEventController.js';
import { DiscordEventName } from '../../../../../common/types/discord/discordEventName.js';
import { type DiscordSlashCommandsRegistry } from '../../discordSlashCommandsRegistry/discordSlashCommandsRegistry.js';

export class InteractionDiscordEventController implements DiscordEventController {
  public constructor(private readonly discordSlashCommandsRegistry: DiscordSlashCommandsRegistry) {}

  public getDiscordEvents(): DiscordEvent<any>[] {
    return [
      new DiscordEvent({
        eventName: DiscordEventName.interactionCreate,
        handler: this.processInteractionCreateEvent.bind(this),
      }),
    ];
  }

  private async processInteractionCreateEvent(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const commandHandler = this.discordSlashCommandsRegistry.getSlashCommand({
      commandName: interaction.commandName,
    });

    if (!commandHandler) {
      return;
    }

    await commandHandler.handleInteraction(interaction);
  }
}
