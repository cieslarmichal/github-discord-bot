import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';

import { SlashCommand } from '../../../../../common/types/discord/slashCommand.js';

export class RandomIssueDiscordSlashCommand extends SlashCommand {
  public override commandName = 'random-issue';
  public override slashCommandBuilder = new SlashCommandBuilder()
    .setName(this.commandName)
    .setDescription('Get random issue.')
    .addStringOption((option) =>
      option.setName('level').setDescription('The issue level.').setRequired(true).addChoices(
        {
          name: 'easy',
          value: 'easy',
        },
        {
          name: 'medium',
          value: 'medium',
        },
        {
          name: 'hard',
          value: 'hard',
        },
      ),
    );

  public override handler = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    interaction.reply('#324 Create person bio functionality');
  };
}
