import { SlashCommand } from '#interfaces';
import { stripIndent } from 'common-tags';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('timestamp')
    .setDescription('Display the current timestamp or convert a given datetime into a timestamp')
    .addIntegerOption((option) => option
      .setName('year')
      .setDescription('The year to convert into a timestamp, format: "YYYY"'))
    .addIntegerOption((option) => option
      .setName('month')
      .setDescription('The month to convert into a timestamp, format: "MM"'))
    .addIntegerOption((option) => option
      .setName('day')
      .setDescription('The day to convert into a timestamp, format: "DD"'))
    .addIntegerOption((option) => option
      .setName('hours')
      .setDescription('The hours to convert into a timestamp, format: "hh"'))
    .addIntegerOption((option) => option
      .setName('minutes')
      .setDescription('The minutes to convert into a timestamp, format: "mm"'))
    .addIntegerOption((option) => option
      .setName('seconds')
      .setDescription('The seconds to convert into a timestamp, format: "ss"')),
  async execute(interaction) {
    const givenYear = interaction.options.getInteger('year');
    const givenMonth = interaction.options.getInteger('month');
    const givenDay = interaction.options.getInteger('day');
    const givenHours = interaction.options.getInteger('hours');
    const givenMinutes = interaction.options.getInteger('minutes');
    const givenSeconds = interaction.options.getInteger('seconds');

    const timestampEmbed = new EmbedBuilder().setColor('#99aab5');

    if (givenYear || givenMonth || givenDay || givenHours || givenMinutes || givenSeconds) {
      const givenDateAndTime = new Date(
        Number(givenYear ?? 1970),
        Number(givenMonth ?? 1) - 1,
        Number(givenDay ?? 1),
        Number(givenHours ?? 0),
        Number(givenMinutes ?? 0),
        Number(givenSeconds ?? 0),
      );
      const givenISOTimestamp = givenDateAndTime.valueOf();
      const givenUNIXTimestamp = Math.floor(givenISOTimestamp / 1000);

      timestampEmbed
        .setTitle('Timestamp')
        .setDescription(stripIndent`
          Given Date and Time: ${givenDateAndTime.toLocaleString('en-GB')}
          Miliseconds: ${givenISOTimestamp}
          Seconds / UNIX: ${givenUNIXTimestamp} 
        `)
        .setFields(
          {
            name: 'Date',
            value: stripIndent`
              \`<t:${givenUNIXTimestamp}:d>\` » <t:${givenUNIXTimestamp}:d>
              \`<t:${givenUNIXTimestamp}:D>\` » <t:${givenUNIXTimestamp}:D>
            `,
          },
          {
            name: 'Time',
            value: stripIndent`
              \`<t:${givenUNIXTimestamp}:t>\` » <t:${givenUNIXTimestamp}:t>
              \`<t:${givenUNIXTimestamp}:T>\` » <t:${givenUNIXTimestamp}:T>
            `,
          },
          {
            name: 'Date & Time',
            value: stripIndent`
              \`<t:${givenUNIXTimestamp}:f>\` » <t:${givenUNIXTimestamp}:f>
              \`<t:${givenUNIXTimestamp}:F>\` » <t:${givenUNIXTimestamp}:F>
            `,
          },
          {
            name: 'Relative',
            value: `\`<t:${givenUNIXTimestamp}:R>\` » <t:${givenUNIXTimestamp}:R>`,
          },
        );

      return interaction.reply({ embeds: [timestampEmbed] });
    }
    else {
      const currentISOTimestamp = new Date().valueOf();
      const currentUNIXTimestamp = Math.floor(currentISOTimestamp / 1000);

      timestampEmbed
        .setTitle('Current Timestamp')
        .setDescription(stripIndent`
          Date and Time: ${new Date().toLocaleString('en-GB')}
          Miliseconds: ${currentISOTimestamp}
          Seconds / UNIX: ${currentUNIXTimestamp}
        `)
        .setThumbnail('https://images.emojiterra.com/twitter/512px/1f551.png')
        .setFields(
          {
            name: 'Date',
            value: stripIndent`
              \`<t:${currentUNIXTimestamp}:d>\` » <t:${currentUNIXTimestamp}:d>
              \`<t:${currentUNIXTimestamp}:D>\` » <t:${currentUNIXTimestamp}:D>
            `,
          },
          {
            name: 'Time',
            value: stripIndent`
              \`<t:${currentUNIXTimestamp}:t>\` » <t:${currentUNIXTimestamp}:t>
              \`<t:${currentUNIXTimestamp}:T>\` » <t:${currentUNIXTimestamp}:T>
            `,
          },
          {
            name: 'Date & Time',
            value: stripIndent`
              \`<t:${currentUNIXTimestamp}:f>\` » <t:${currentUNIXTimestamp}:f>
              \`<t:${currentUNIXTimestamp}:F>\` » <t:${currentUNIXTimestamp}:F>
            `,
          },
          {
            name: 'Relative',
            value: `\`<t:${currentUNIXTimestamp}:R>\` » <t:${currentUNIXTimestamp}:R>`,
          },
        );

      return interaction.reply({ embeds: [timestampEmbed] });
    }
  },
};