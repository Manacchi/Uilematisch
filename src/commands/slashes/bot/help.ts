import config from '#config';
import { SlashCommand } from '#interfaces';
import { stripIndent } from 'common-tags';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import ms from 'ms';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Provide general information about the bot'),
  async execute(interaction, client) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('helpCommandsList')
        .setLabel('Commands List')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🔡'),
      new ButtonBuilder()
        .setLabel('Invite the Bot to Your Server')
        .setURL(config.links.invite)
        .setStyle(ButtonStyle.Link),
    );

    const botOwner = await client.users.fetch(config.clientId);

    if (!botOwner) throw new Error('The given user id does not exist.');

    const helpEmbed = new EmbedBuilder()
      .setColor(config.embedColors.bot)
      .setTitle(client.user.tag)
      .setAuthor({
        name: botOwner.tag,
        iconURL: botOwner.displayAvatarURL({ size: 512 }),
      })
      .setDescription('A bot that I code when I\'ve got nothing to do, therefore the command list is quite limited.')
      .setThumbnail(client.user.displayAvatarURL({ size: 512 }))
      .addFields(
        {
          name: 'Uptime',
          value: ms(client.uptime, { long: true }),
        },
        {
          name: 'Commands',
          value: stripIndent`
            ${client.slashCommands.size} Slash Commands
            ${client.messageContextMenuCommands.size + client.userContextMenuCommands.size} Context Menu Commands
          `,
          inline: true,
        },
        {
          name: 'Servers',
          value: client.guilds.cache.size.toString(),
          inline: true,
        },
        {
          name: 'Owner',
          value: `<@${botOwner.id}>`,
        },
        {
          name: 'Creation Date',
          value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}:F>`,
        },
      );

    return interaction.reply({
      components: [row],
      embeds: [helpEmbed],
    });
  },
};
