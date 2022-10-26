import { SlashCommand } from '#interfaces';
import chalk from 'chalk';
import { stripIndent } from 'common-tags';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

export interface Define {
  readonly error?: 'An error occurred.' | 404;
  list?: {
    readonly definition: string;
    readonly permalink: string;
    readonly thumbs_up: number;
    readonly sound_urls: string[];
    readonly author: string;
    readonly word: string;
    readonly defid: number;
    readonly current_vote: string;
    readonly written_on: string;
    readonly example: string;
    readonly thumbs_down: number;
  }[];
}

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('urban')
    .setDescription('Search the Urban Dictionary definiton of a given word')
    .addStringOption((option) => option
      .setName('word')
      .setDescription('The word to search the definition of')
      .setRequired(true)),
  async execute(interaction) {
    const givenWord = interaction.options.getString('word', true);
    const response = await fetch(`http://api.urbandictionary.com/v0/define?term=${givenWord}`);
    const define = await response.json() as Define;

    if (define.error) {
      console.error(`${chalk.red('ERROR')}: Could not fetch Urban Dictionary entries.`);

      return interaction.reply({
        content: 'There was an error while fetching Urban Dictionary entries...',
        ephemeral: true,
      });
    }

    const entry = define.list[Math.floor(Math.random() * define.list.length)];

    if (!entry) {
      return interaction.reply({
        content: `There was no entry found for \`${givenWord}\`.`,
        ephemeral: true,
      });
    }

    const urbanEmbed = new EmbedBuilder()
      .setColor('#1b2936')
      .setTitle(entry.word
        .split(' ')
        .map((word) => word
          .charAt(0)
          .toUpperCase() + word.substring(1))
        .join(' '))
      .setURL(entry.permalink)
      .setAuthor({
        name: 'Urban Dictionary',
        iconURL: 'https://avatars.githubusercontent.com/u/80348?s=200&v=4',
      })
      .setDescription(stripIndent`
        **Definition**
        \`\`\`${entry.definition.replace(/\[|\]/g, '')}\`\`\`
      `)
      .setFields(
        {
          name: 'Author',
          value: entry.author || 'Anonymous',
          inline: true,
        },
        {
          name: 'ID',
          value: entry.defid.toString(),
          inline: true,
        },
        {
          name: 'Rating',
          value: `👍 ${entry.thumbs_up} | 👎 ${entry.thumbs_down}`,
          inline: true,
        },
        {
          name: 'Example',
          value: entry.example.replace(/\[|\]/g, '') || 'No example given.',
        },
      )
      .setTimestamp(new Date(entry.written_on));

    return interaction.reply({ embeds: [urbanEmbed] });
  },
};
