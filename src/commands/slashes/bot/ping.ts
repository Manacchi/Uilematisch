import config from '#config';
import { SlashCommand } from '#interfaces';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s response time'),
  async execute(interaction, client) {
    const message = await interaction.reply({
      content: 'Calculating ping...',
      fetchReply: true,
    });

    const pingEmbed = new EmbedBuilder()
      .setColor(config.embedColors.bot)
      .addFields(
        {
          name: 'API Latency',
          value: `${client.ws.ping}ms`,
        },
        {
          name: 'Bot Latency',
          value: `${message.createdTimestamp - interaction.createdTimestamp}ms`,
        },
      );

    return interaction.editReply({
      content: '',
      embeds: [pingEmbed],
    });
  },
};
