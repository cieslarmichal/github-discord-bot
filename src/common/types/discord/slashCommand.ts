import { type SlashCommandBuilder } from 'discord.js';

import { type SlashCommandHandler } from './slashCommandHandler.js';

export abstract class SlashCommand {
  public abstract readonly commandName: string;
  public abstract readonly slashCommandBuilder: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  public abstract readonly handler: SlashCommandHandler;
}
