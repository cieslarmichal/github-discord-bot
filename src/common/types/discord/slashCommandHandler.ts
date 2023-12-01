import { type ChatInputCommandInteraction } from 'discord.js';

export type SlashCommandHandler = (interaction: ChatInputCommandInteraction) => Promise<void>;
