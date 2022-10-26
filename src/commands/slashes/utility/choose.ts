import { SlashCommand } from '#interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription('Choose between up to 5 given choices')
    .addStringOption((option) => option
      .setName('choice1')
      .setDescription('The 1st choice to choose from')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('choice2')
      .setDescription('The 2nd choice to choose from')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('choice3')
      .setDescription('The 3rd choice to choose from'))
    .addStringOption((option) => option
      .setName('choice4')
      .setDescription('The 4th choice to choose from'))
    .addStringOption((option) => option
      .setName('choice5')
      .setDescription('The 5th choice to choose from')),
  async execute(interaction) {
    const givenChoices = [
      interaction.options.getString('choice1', true),
      interaction.options.getString('choice2', true),
      interaction.options.getString('choice3'),
      interaction.options.getString('choice4'),
      interaction.options.getString('choice5'),
    ].filter((choice) => choice);
    const chosenChoice = givenChoices[Math.floor(Math.random() * givenChoices.length)];

    const chooseEmbed = new EmbedBuilder()
      .setColor('#ffad32')
      .setDescription(`<@${interaction.user.id}> asked to choose between ${givenChoices.length} choices.`)
      .setThumbnail('https://images.emojiterra.com/twitter/512px/2696.png')
      .addFields(
        {
          name: 'Choices',
          value: givenChoices.join('\n'),
          inline: true,
        },
        {
          name: 'Chosen',
          value: chosenChoice,
          inline: true,
        },
      );

    return interaction.reply({ embeds: [chooseEmbed] });
  },
};
