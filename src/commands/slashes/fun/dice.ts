import { SlashCommand } from '#interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Roll one or up to 100 dice')
    .addIntegerOption((option) => option
      .setName('sides')
      .setDescription('How many sides the die/dice should have'))
    .addIntegerOption((option) => option
      .setName('amount')
      .setDescription('How many dice to roll, maximum of 100')),
  async execute(interaction) {
    const givenSideAmount = interaction.options.getInteger('sides') || 6;

    if (givenSideAmount < 3 || givenSideAmount > 144) {
      return interaction.reply({
        content: 'The number of sides must be between `3` and `144`.',
        ephemeral: true,
      });
    }

    /**
     * Rolls a die, or rather, randomly picks a number from the given amount of sides.
     *
     * @returns {number} The result of the die roll.
     */
    function rollDie(): number {
      return 1 + Math.floor(Math.random() * givenSideAmount);
    }

    const givenAmount = interaction.options.getInteger('amount') || 1;

    const diceEmbed = new EmbedBuilder()
      .setColor('#ea596f')
      .setThumbnail('https://images.emojiterra.com/twitter/512px/1f3b2.png');

    if (givenAmount === 1) {
      diceEmbed
        .setDescription(`<@${interaction.user.id}> rolled a die with ${givenSideAmount} sides.`)
        .addFields({
          name: 'Result',
          value: rollDie().toString(),
        });

      return interaction.reply({ embeds: [diceEmbed] });
    }
    else if (givenAmount > 1 && givenAmount < 101) {
      const results: number[] = [];

      for (let i = 0; i < givenAmount; i++) results.push(rollDie());

      diceEmbed
        .setDescription(`<@${interaction.user.id}> rolled ${givenAmount} dice with ${givenSideAmount} sides.`)
        .addFields(
          {
            name: 'Individual',
            value: results.join(', '),
          },
          {
            name: 'Total',
            value: results
              .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
              .toString(),
          },
        );

      return interaction.reply({ embeds: [diceEmbed] });
    }
    else {
      return interaction.reply({
        content: 'The amount of dice must be between `1` and `100`.',
        ephemeral: true,
      });
    }
  },
};
