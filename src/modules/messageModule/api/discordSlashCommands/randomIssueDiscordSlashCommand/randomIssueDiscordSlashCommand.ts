import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { DifficultyLevel } from '../../../../../common/types/difficultyLevel.js';
import { type SlashCommand } from '../../../../../common/types/discord/slashCommand.js';
import { type FindRandomUnassignedIssueQueryHandler } from '../../../application/queryHandlers/findRandomUnassignedIssueQueryHandler/findRandomUnassignedIssueQueryHandler.js';

export class RandomIssueDiscordSlashCommand implements SlashCommand {
  private readonly commandName = 'random-issue';

  public constructor(private readonly findRandomUnassignedIssueQueryHandler: FindRandomUnassignedIssueQueryHandler) {}

  public getCommandName(): string {
    return this.commandName;
  }

  public getSlashCommandBuilder(): Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> {
    return new SlashCommandBuilder()
      .setName(this.commandName)
      .setDescription('Get random issue by difficulty.')
      .addStringOption((option) =>
        option.setName('difficulty').setDescription('The difficulty level.').setRequired(true).addChoices(
          {
            name: DifficultyLevel.easy,
            value: DifficultyLevel.easy,
          },
          {
            name: DifficultyLevel.medium,
            value: DifficultyLevel.medium,
          },
          {
            name: DifficultyLevel.hard,
            value: DifficultyLevel.hard,
          },
        ),
      );
  }

  public async handleInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
    const difficulty = interaction.options.getString('difficulty');

    if (!difficulty) {
      throw new OperationNotValidError({
        reason: 'Difficulty level not provided required.',
      });
    }

    const { issue } = await this.findRandomUnassignedIssueQueryHandler.execute({
      difficultyLevel: difficulty as DifficultyLevel,
    });

    if (!issue) {
      await interaction.reply(`No issue found with ${difficulty} difficulty level.`);

      return;
    }

    const embedMessage = new EmbedBuilder().setTitle(`#${issue.number}: ${issue.title}`).setURL(issue.url);

    await interaction.reply({ embeds: [embedMessage] });
  }
}
