import { SlashCommand } from '#interfaces';
import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('feedback')
    .setDescription('Provide feedback about the bot')
    .addSubcommand((subcommand) => subcommand
      .setName('issue')
      .setDescription('Report an issue encountered with the bot'))
    .addSubcommand((subcommand) => subcommand
      .setName('suggestion')
      .setDescription('Provide a suggestion regarding the bot')),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'issue') {
      const feedbackIssueModal = new ModalBuilder()
        .setCustomId('feedbackIssue')
        .setTitle('Report an Issue')
        .addComponents(
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(new TextInputBuilder()
            .setCustomId('commandInput')
            .setLabel('What command are you having trouble with?')
            .setStyle(TextInputStyle.Short)
            .setMinLength(5)
            .setPlaceholder('e.g. /8ball')
            .setRequired(false)),
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(new TextInputBuilder()
            .setCustomId('issueInput')
            .setLabel('What\'s the issue/s you\'ve encountered?')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Describe your issue/s in detail...')
            .setRequired(true)),
        );

      await interaction.showModal(feedbackIssueModal);

      return interaction.reply({
        content: 'Modal shown, awaiting response...',
        ephemeral: true,
      });
    }
    else if (subcommand === 'suggestion') {
      const feedbackSuggestionModal = new ModalBuilder()
        .setCustomId('feedbackSuggestion')
        .setTitle('Provide a Suggestion')
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(new TextInputBuilder()
          .setCustomId('suggestionInput')
          .setLabel('What suggestion do you have?')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Describe your suggestion in detail...')
          .setRequired(true)));

      await interaction.showModal(feedbackSuggestionModal);

      return interaction.reply({
        content: 'Modal shown, awaiting response...',
        ephemeral: true,
      });
    }
  },
};
