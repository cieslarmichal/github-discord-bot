import { type SlashCommandBuilder } from 'discord.js';

import { type SlashCommandHandler } from './slashCommandHandler.js';

export interface SlashCommand {
  getCommandName(): string;
  getSlashCommandBuilder(): Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  getHandler(): SlashCommandHandler;
}
