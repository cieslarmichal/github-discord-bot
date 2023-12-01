import { beforeEach, expect, describe, it } from 'vitest';

import { GuildMemberDiscordEventController } from './api/discordEventControllers/guildMemberDiscordEventController/guildMemberDiscordEventController.js';
import { InteractionDiscordEventController } from './api/discordEventControllers/interactionDiscordEventController/interactionDiscordEventController.js';
import { RandomIssueDiscordSlashCommand } from './api/discordSlashCommands/randomIssueDiscordSlashCommand/randomIssueDiscordSlashCommand.js';
import { type DiscordSlashCommandsRegistry } from './api/discordSlashCommandsRegistry/discordSlashCommandsRegistry.js';
import { DiscordSlashCommandsRegistryImpl } from './api/discordSlashCommandsRegistry/discordSlashCommandsRegistryImpl.js';
import { MessageHttpController } from './api/httpControllers/messageHttpController/messageHttpController.js';
import { messageSymbols } from './symbols.js';
import { Application } from '../../core/application.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';

describe('MessageModule', () => {
  let container: DependencyInjectionContainer;

  beforeEach(async () => {
    container = Application.createContainer();
  });

  it('declares bindings', async () => {
    expect(container.get<MessageHttpController>(messageSymbols.messageHttpController)).toBeInstanceOf(
      MessageHttpController,
    );

    expect(
      container.get<GuildMemberDiscordEventController>(messageSymbols.guildMemberDiscordEventController),
    ).toBeInstanceOf(GuildMemberDiscordEventController);

    expect(
      container.get<InteractionDiscordEventController>(messageSymbols.interactionDiscordEventController),
    ).toBeInstanceOf(InteractionDiscordEventController);

    expect(container.get<DiscordSlashCommandsRegistry>(messageSymbols.discordSlashCommandsRegistry)).toBeInstanceOf(
      DiscordSlashCommandsRegistryImpl,
    );

    expect(container.get<RandomIssueDiscordSlashCommand>(messageSymbols.randomIssueDiscordSlashCommand)).toBeInstanceOf(
      RandomIssueDiscordSlashCommand,
    );
  });
});
