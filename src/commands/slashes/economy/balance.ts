import config from '#config';
import { getBalance } from '#helpers/getBalance.js';
import { SlashCommand } from '#interfaces';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Display your or a selected user\'s balance')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('The user to display the balance of')),
  async execute(interaction, client) {
    const selecteduser = interaction.options.getUser('user') ?? interaction.user;

    const balanceEmbed = new EmbedBuilder()
      .setColor(config.embedColors.bot)
      .setAuthor({
        name: selecteduser.username,
        iconURL: selecteduser.displayAvatarURL({ size: 512 }),
      })
      .addFields({
        name: 'Balance',
        value: `$${getBalance(client, selecteduser.id)}`,
      });

    return interaction.reply({ embeds: [balanceEmbed] });
  },
};
