import config from '#config';
import { DisTubeEvent } from '#interfaces';
import { EmbedBuilder } from 'discord.js';
import { Events, Queue, Song } from 'distube';

export const event: DisTubeEvent = {
  name: Events.ADD_SONG,
  async execute(queue: Queue, song: Song) {
    const addSongEmbed = new EmbedBuilder()
      .setColor(config.embedColors.distube)
      .setTitle(song.name)
      .setURL(song.url)
      .setAuthor({
        name: song.user.tag,
        iconURL: song.user.displayAvatarURL({ size: 512 }),
      })
      .setDescription(`Song length: ${queue.formattedDuration}`)
      .setThumbnail(song.thumbnail ?? 'https://images.emojiterra.com/mozilla/512px/1f4bf.png');

    await queue.textChannel.send({
      content: '**Added to queue:**',
      embeds: [addSongEmbed],
    });
  },
};
