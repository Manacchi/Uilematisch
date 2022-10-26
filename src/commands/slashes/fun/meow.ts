import { SlashCommand } from '#interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('meow')
    .setDescription('Reply with a random meow GIF'),
  async execute(interaction) {
    const GIFURLs = [
      'https://c.tenor.com/ePfH8A35PegAAAAC/anime-meow.gif',
      'https://c.tenor.com/LIZuLPxdJGoAAAAd/high-schoold-xd-koneko.gif',
      'https://c.tenor.com/pam7PPaRqIYAAAAC/anime-anime-girl.gif',
      'https://c.tenor.com/J-EdXr2wtZAAAAAC/meow-anime.gif',
      'https://c.tenor.com/V5DaoiUkD_gAAAAC/anime-cat.gif',
    ];
    const randomGIFURL = GIFURLs[Math.floor(Math.random() * GIFURLs.length)];

    const meowEmbed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('Nya :3')
      .setImage(randomGIFURL);

    return interaction.reply({ embeds: [meowEmbed] });
  },
};
