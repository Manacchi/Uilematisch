import config from '#config';
import { SlashCommand } from '#interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Display the balance leaderboard'),
  async execute(interaction, client) {
    const leaderboardEmbed = new EmbedBuilder()
      .setColor(config.embedColors.bot)
      .setTitle('Leaderboard')
      .setDescription(client.currency
        .sort((a, b) => b.balance - a.balance)
        .filter((user) => client.users.cache.has(user.user_id))
        .first(10)
        .map((user, position) => `(${position + 1}). <@${user.user_id}>: $${user.balance}`)
        .join('\n'));

    return interaction.reply({ embeds: [leaderboardEmbed] });
  },
};
