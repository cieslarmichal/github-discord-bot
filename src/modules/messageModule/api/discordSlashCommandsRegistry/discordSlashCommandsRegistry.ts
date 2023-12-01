import { type SlashCommand } from '../../../../common/types/discord/slashCommand.js';

export interface RegisterSlashCommandPayload {
  readonly slashCommand: SlashCommand;
}

export interface GetSlashCommandPayload {
  readonly commandName: string;
}

export interface DiscordSlashCommandsRegistry {
  registerSlashCommand(payload: RegisterSlashCommandPayload): void;
  getSlashCommands(): SlashCommand[];
  getSlashCommand(payload: GetSlashCommandPayload): SlashCommand | undefined;
}
