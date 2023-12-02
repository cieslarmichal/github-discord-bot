import {
  type DiscordSlashCommandsRegistry,
  type RegisterSlashCommandPayload,
  type GetSlashCommandPayload,
} from './discordSlashCommandsRegistry.js';
import { type SlashCommand } from '../../../../common/types/discord/slashCommand.js';

export class DiscordSlashCommandsRegistryImpl implements DiscordSlashCommandsRegistry {
  private readonly slashCommands: SlashCommand[] = [];

  public registerSlashCommand(payload: RegisterSlashCommandPayload): void {
    const { slashCommand } = payload;

    const slashCommandAlreadyExists = this.getSlashCommand({ commandName: slashCommand.getCommandName() });

    if (slashCommandAlreadyExists) {
      return;
    }

    this.slashCommands.push(slashCommand);
  }

  public getSlashCommands(): SlashCommand[] {
    return this.slashCommands;
  }

  public getSlashCommand(payload: GetSlashCommandPayload): SlashCommand | undefined {
    const { commandName } = payload;

    return this.slashCommands.find((existingSlashCommand) => existingSlashCommand.getCommandName() === commandName);
  }
}
