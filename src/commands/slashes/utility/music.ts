import config from '#config';
import { SlashCommand } from '#interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('.')
    .setDMPermission(false)
    .addSubcommand((subcommand) => subcommand
      .setName('back')
      .setDescription('Play the previous song in the queue'))
    .addSubcommand((subcommand) => subcommand
      .setName('filter')
      .setDescription('Apply a filter to the queue')
      .addStringOption((option) => option
        .setName('type')
        .setDescription('The type of filter to apply')
        .setRequired(true)
        .addChoices(
          {
            name: '3D',
            value: '3d',
          },
          {
            name: 'BassBoost',
            value: 'bassboost',
          },
          {
            name: 'Echo',
            value: 'Echo',
          },
          {
            name: 'Earwax',
            value: 'earwax',
          },
          {
            name: 'Flanger',
            value: 'flanger',
          },
          {
            name: 'Gate',
            value: 'gate',
          },
          {
            name: 'Haas',
            value: 'haas',
          },
          {
            name: 'Karaoke',
            value: 'karaoke',
          },
          {
            name: 'mcompand',
            value: 'mcompand',
          },
          {
            name: 'Nightcore',
            value: 'nightcore',
          },
          {
            name: 'Off',
            value: 'off',
          },
          {
            name: 'Phaser',
            value: 'phaser',
          },
          {
            name: 'Reverse',
            value: 'reverse',
          },
          {
            name: 'Surround',
            value: 'surround',
          },
          {
            name: 'Tremolo',
            value: 'tremolo',
          },
          {
            name: 'Vaporwave',
            value: 'vaporwave',
          },
        )))
    .addSubcommand((subcommand) => subcommand
      .setName('leave')
      .setDescription('Make the bot leave the voice channel that it\'s currently in'))
    .addSubcommand((subcommand) => subcommand
      .setName('loop')
      .setDescription('Loop the song that\'s currently playing or the entire queue')
      .addIntegerOption((option) => option
        .setName('mode')
        .setDescription('The repeat mode to apply')
        .setRequired(true)
        .addChoices(
          {
            name: 'Off',
            value: 0,
          },
          {
            name: 'This song',
            value: 1,
          },
          {
            name: 'All Queue',
            value: 2,
          },
        )))
    .addSubcommand((subcommand) => subcommand
      .setName('pause')
      .setDescription('Pause the song that\'s currently playing'))
    .addSubcommand((subcommand) => subcommand
      .setName('play')
      .setDescription('Play a song in the voice channel you\'re currently in')
      .addStringOption((option) => option
        .setName('song')
        .setDescription('The song to play, song name or URL')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('queue')
      .setDescription('Display the current queue'))
    .addSubcommand((subcommand) => subcommand
      .setName('resume')
      .setDescription('Resume the paused song'))
    .addSubcommand((subcommand) => subcommand
      .setName('skip')
      .setDescription('Play the next song in the queue'))
    .addSubcommand((subcommand) => subcommand
      .setName('stop')
      .setDescription('Stop the queue.'))
    .addSubcommand((subcommand) => subcommand
      .setName('time')
      .setDescription('Display the song\'s progress'))
    .addSubcommand((subcommand) => subcommand
      .setName('volume')
      .setDescription('Adjust the queue\'s volume')
      .addIntegerOption((option) => option
        .setName('percentage')
        .setDescription('The percentage to set the volume to')
        .setRequired(true))),
  async execute(interaction, client) {
    const member = await interaction.guild.members.fetch(interaction.user);

    if (!member.voice.channel) {
      return interaction.reply({
        content: 'You must be in a voice channel to use this command.',
        ephemeral: true,
      });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'leave') {
      client.distube.voices.leave(interaction.guildId);

      return interaction.reply(`Left <#${member.voice.channelId}>.`);
    }
    else if (subcommand === 'play') {
      const givenSong = interaction.options.getString('song', true);

      await interaction.reply(`<@${interaction.user.id}>, please wait...`);

      await client.distube.play(member.voice.channel, givenSong, {
        member: member,
        textChannel: interaction.channel,
      });

      return interaction.deleteReply();
    }

    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({
        content: 'There is nothing in the queue right now.',
        ephemeral: true,
      });
    }

    if (subcommand === 'back') {
      if (queue.previousSongs.length < 1) {
        return interaction.reply({
          content: 'There are no previous songs in the queue',
          ephemeral: true,
        });
      }

      await queue.previous();

      return interaction.reply(':previous_track: Backed!');
    }
    else if (subcommand === 'filter') {
      const chosenFilter = interaction.options.getString('type', true);

      if (chosenFilter === 'off') {
        queue.filters.clear();

        await interaction.reply(`<@${interaction.user.id}> removed all filters.`);
      }
      else if (queue.filters.has(chosenFilter)) {
        queue.filters.remove(chosenFilter);

        await interaction.reply(`<@${interaction.user.id}> removed the \`${chosenFilter}\` filter.`);
      }
      else {
        queue.filters.add(chosenFilter);

        await interaction.reply(`<@${interaction.user.id}> applied the \`${chosenFilter}\` filter.`);
      }

      return await interaction.followUp(`Current Queue Filters: \`${queue.filters.names.join(', ') || 'None'}\``);
    }
    else if (subcommand === 'loop') {
      let chosenMode;

      chosenMode = interaction.options.getInteger('mode', true);

      queue.setRepeatMode(chosenMode);

      chosenMode = chosenMode
        ? (chosenMode === 2
          ? 'Repeat queue'
          : 'Repeat song')
        : 'Off';

      return interaction.reply(`<@${interaction.user.id}> set repeat mode to \`${chosenMode}\``);
    }
    else if (subcommand === 'pause') {
      queue.pause();

      return interaction.reply(':pause_button: Paused!');
    }
    else if (subcommand === 'queue') {
      const currentSong = queue.songs[0];
      const queueSongsList = queue.songs
        .slice(1)
        .map((song, position) => `${position}. \`${song.name}\` - \`${song.formattedDuration}\``)
        .join('\n');

      const musicQueueEmbed = new EmbedBuilder()
        .setColor(config.embedColors.distube)
        .addFields(
          {
            name: 'Currently Playing',
            value: `\`${currentSong.name}\` - \`${currentSong.formattedDuration}\``,
          },
          {
            name: 'Queue',
            value: queueSongsList || 'No more songs',
          },
        );

      return interaction.reply({ embeds: [musicQueueEmbed] });
    }
    else if (subcommand === 'resume') {
      queue.resume();

      return interaction.reply(':arrow_forward: Resumed!');
    }
    else if (subcommand === 'skip') {
      if (queue.songs.length <= 1) {
        return interaction.reply({
          content: 'There are no more songs in the queue.',
          ephemeral: true,
        });
      }

      await queue.skip();

      return interaction.reply(':next_track: Skipped!');
    }
    else if (subcommand === 'stop') {
      await queue.stop();

      return interaction.reply(`<@${interaction.user.id}> stopped the queue.`);
    }
    else if (subcommand === 'time') {
      const song = queue.songs[0];
      const queuePercentDuration = Math.round(queue.currentTime / (queue.duration / 100));

      const musicTimeEmbed = new EmbedBuilder()
        .setColor(config.embedColors.distube)
        .setTitle(song.name)
        .setURL(song.url)
        .setAuthor({
          name: song.user.tag,
          iconURL: song.user.displayAvatarURL({ size: 512 }),
        })
        .setDescription(`**${queue.formattedCurrentTime} / ${queue.formattedDuration} (${queuePercentDuration}%)**`)
        .setThumbnail(song.thumbnail ?? 'https://images.emojiterra.com/mozilla/512px/1f4bf.png');

      return interaction.reply({ embeds: [musicTimeEmbed] });
    }
    else if (subcommand === 'volume') {
      const volume = interaction.options.getInteger('percentage', true);

      if (volume < 0 || volume > 100) {
        return interaction.reply({
          content: 'The percentage must be between `0` and `100`.',
          ephemeral: true,
        });
      }
      else if (volume === queue.volume) {
        return interaction.reply({
          content: `The queue's volume is already at \`${volume}%\``,
          ephemeral: true,
        });
      }

      queue.setVolume(volume);

      return interaction.reply(`${volume < 50
        ? (volume === 0
          ? ':mute:'
          : ':sound:')
        : ':loud_sound:'} Adjusted! - Volume: \`${queue.volume}%\``);
    }
  },
};
