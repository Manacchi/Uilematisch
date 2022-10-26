import { SlashCommand } from '#interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8 ball a question')
    .addStringOption((option) => option
      .setName('question')
      .setDescription('The question to ask the 8 ball')
      .setAutocomplete(true)
      .setRequired(true)),
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    const choices = [
      'Does my future hold anything big?',
      'Should I trust the Magic 8 Ball?',
      'Will it rain today?',
    ];
    const filtered = choices.filter((choice) => choice.startsWith(focusedOption.value));

    return interaction.respond(filtered.map((choice) => ({
      name: choice,
      value: choice,
    })));
  },
  async execute(interaction) {
    const givenQuestion = interaction.options.getString('question', true);
    const responses = [
      'Yes',
      'No',
      'Why are you even trying?',
      'What do you think? NO',
      'Maybe',
      'Never',
      'Yep',
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const eightBallEmbed = new EmbedBuilder()
      .setColor('#31373d')
      .setTitle(givenQuestion)
      .setAuthor({
        name: '8 Ball',
        iconURL: 'https://images.emojiterra.com/twitter/v14.0/512px/1f3b1.png',
      })
      .setDescription(`${randomResponse}, <@${interaction.user.id}>.`);

    return interaction.reply({ embeds: [eightBallEmbed] });
  },
};
