import { SlashCommand } from '#interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('coin')
    .setDescription('Toss one or up to 100 coins')
    .addIntegerOption((option) => option
      .setName('amount')
      .setDescription('How many coins to toss, maximum of 100')),
  async execute(interaction) {
    /**
     * Tosses a coin, or rather, randomly picks between `'Heads'` or `'Tails'`.
     *
     * @returns {string} The result of the coin toss.
     */
    function tossCoin(): string {
      const coinSides = [ 'Heads', 'Tails'];
      return coinSides[Math.floor(Math.random() * coinSides.length)];
    }

    const givenAmount = interaction.options.getInteger('amount') || 1;

    const coinEmbed = new EmbedBuilder()
      .setColor('#ffcd4d')
      .setThumbnail('https://images.emojiterra.com/twitter/v13.1/512px/1fa99.png');

    if (givenAmount === 1) {
      coinEmbed
        .setDescription(`<@${interaction.user.id}> tossed a coin.`)
        .addFields({
          name: 'Result',
          value: tossCoin(),
        });

      return interaction.reply({ embeds: [coinEmbed] });
    }
    else if (givenAmount > 1 && givenAmount < 101) {
      const results: string[] = [];

      for (let i = 0; i < givenAmount; i++) results.push(tossCoin());

      coinEmbed
        .setDescription(`<@${interaction.user.id}> tossed ${givenAmount} coins.`)
        .addFields(
          {
            name: 'Heads',
            value: results.filter((result) => result === 'Heads').length.toString(),
            inline: true,
          },
          {
            name: 'Tails',
            value: results.filter((result) => result === 'Tails').length.toString(),
            inline: true,
          },
        );

      return interaction.reply({ embeds: [coinEmbed] });
    }
    else {
      return interaction.reply({
        content: 'The amount of coins must be between `1` and `100`.',
        ephemeral: true,
      });
    }
  },
};
