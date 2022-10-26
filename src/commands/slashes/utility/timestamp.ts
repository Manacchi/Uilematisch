import { SlashCommand } from '#interfaces';
import { stripIndent } from 'common-tags';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('timestamp')
    .setDescription('Display the current timestamp or convert a given datetime into a timestamp')
    .addStringOption((option) => option
      .setName('datetime')
      .setDescription('The date and time to convert into a timestamp, format: "YYYY MM DD hh mm ss"')),
  async execute(interaction) {
    let givenDateAndTime;

    givenDateAndTime = interaction.options.getString('datetime');

    const timestampEmbed = new EmbedBuilder().setColor('#99aab5');

    if (givenDateAndTime) {
      givenDateAndTime = givenDateAndTime.split(' ');

      givenDateAndTime = new Date(
        Number(givenDateAndTime[0]),
        Number(givenDateAndTime[1]) - 1,
        Number(givenDateAndTime[2]),
        Number(givenDateAndTime[3] ?? 0),
        Number(givenDateAndTime[4] ?? 0),
        Number(givenDateAndTime[5] ?? 0),
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