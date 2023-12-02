import { type ChatInputCommandInteraction, type SlashCommandBuilder } from 'discord.js';

export interface SlashCommand {
  getCommandName(): string;
  getSlashCommandBuilder(): Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  handleInteraction(interaction: ChatInputCommandInteraction): Promise<void>;
}
