import { SlashCommand } from '#interfaces';
import { Canvas, createCanvas } from 'canvas';
import { stripIndent } from 'common-tags';
import {
  AttachmentBuilder,
  ChannelType,
  EmbedBuilder,
  GuildExplicitContentFilter,
  GuildVerificationLevel,
  SlashCommandBuilder,
} from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Display information about a channel / role / server / user')
    .setDMPermission(false)
    .addSubcommand((subcommand) => subcommand
      .setName('channel')
      .setDescription('Display information about a selected channel or the one you\'re currently in')
      .addChannelOption((option) => option
        .setName('channel')
        .setDescription('The channel to obtain the info from')))
    .addSubcommand((subcommand) => subcommand
      .setName('role')
      .setDescription('Display information about a selected role')
      .addRoleOption((option) => option
        .setName('role')
        .setDescription('The role to obtain the info from')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('server')
      .setDescription('Display information about this server'))
    .addSubcommand((subcommand) => subcommand
      .setName('user')
      .setDescription('Display information about you or a selected user')
      .addUserOption((option) => option
        .setName('user')
        .setDescription('The user to obtain the info from'))),
  async execute(interaction, client) {
    /**
     * Creates a Canvas image from a given color's hexadecimal value.
     *
     * @param {string} hexadecimal The color's hexadecimal value.
     * @param {number} width The width of the Canvas image.
     * @param {number} height The height of the Canvas image.
     * @returns {Canvas} The Canvas image.
     */
    function createColorImage(hexadecimal: string, width: number, height: number): Canvas {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = hexadecimal;

      ctx.fillRect(0, 0, width, height);

      return canvas;
    }

    /**
     * Converts a color's decimal value into its RGB values.
     *
     * @param {number} decimal The color's decimal value.
     * @returns {string} The RGB values.
     */
    function convertToRGB(decimal: number): string {
      const red = (decimal >> 16) & 255;
      const green = (decimal >> 8) & 255;
      const blue = decimal & 255;

      return `(${red}, ${green}, ${blue})`;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'channel') {
      const selectedChannel = await interaction.guild.channels.fetch((interaction.options.getChannel('channel') ?? interaction.channel).id);

      const infoChannelEmbed = new EmbedBuilder()
        .setColor('Blurple')
        .setTitle(selectedChannel.name)
        .setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ size: 512 }),
        })
        .setDescription(`ID: ${selectedChannel.id}`)
        .setFooter({ text: 'If any of the information are wrong, report it via /feedback issue' });

      if (selectedChannel.type === ChannelType.GuildCategory) {
        infoChannelEmbed
          .addFields(
            {
              name: 'Type',
              value: 'Category',
            },
            {
              name: 'Position',
              value: selectedChannel.rawPosition.toString(),
            },
            {
              name: 'Creation Date',
              value: `<t:${Math.floor(selectedChannel.createdTimestamp / 1000)}:F>`,
            },
          );

        return interaction.reply({ embeds: [infoChannelEmbed] });
      }
      else if (selectedChannel.type === ChannelType.GuildAnnouncement || selectedChannel.type === ChannelType.GuildText) {
        infoChannelEmbed
          .addFields(
            {
              name: 'Category',
              value: selectedChannel.parent
                ? selectedChannel.parent.name
                : 'Not in a Category',
            },
            {
              name: 'Topic',
              value: selectedChannel.topic ?? 'None',
            },
            {
              name: 'Type',
              value: selectedChannel.type
                ? 'Announcement'
                : 'Text',
              inline: true,
            },
            {
              name: 'NSFW',
              value: selectedChannel.nsfw
                ? 'Yes'
                : 'No',
              inline: true,
            },
            {
              name: 'Position',
              value: selectedChannel.rawPosition.toString(),
            },
            {
              name: 'Slow Mode',
              value: `${selectedChannel.rateLimitPerUser} seconds`,
            },
            {
              name: 'Creation Date',
              value: `<t:${Math.floor(selectedChannel.createdTimestamp / 1000)}:F>`,
            },
          );

        return interaction.reply({ embeds: [infoChannelEmbed] });
      }
      else if (selectedChannel.type === ChannelType.GuildStageVoice) {
        infoChannelEmbed
          .addFields(
            {
              name: 'Category',
              value: selectedChannel.parent
                ? selectedChannel.parent.name
                : 'Not in a Category',
            },
            {
              name: 'Topic',
              value: selectedChannel.topic ?? 'None',
            },
            {
              name: 'Type',
              value: 'Stage',
            },
            {
              name: 'Position',
              value: selectedChannel.rawPosition.toString(),
            },
            {
              name: 'Bitrate',
              value: selectedChannel.bitrate.toString(),
            },
            {
              name: 'User Limit',
              value: selectedChannel.userLimit.toString(),
            },
            {
              name: 'Creation Date',
              value: `<t:${Math.floor(selectedChannel.createdTimestamp / 1000)}:F>`,
            },
          );

        return interaction.reply({ embeds: [infoChannelEmbed] });
      }
      else if (selectedChannel.type === ChannelType.GuildVoice) {
        infoChannelEmbed
          .addFields(
            {
              name: 'Category',
              value: selectedChannel.parent
                ? selectedChannel.parent.name
                : 'Not in a Category',
            },
            {
              name: 'Type',
              value: 'Voice',
            },
            {
              name: 'Position',
              value: selectedChannel.rawPosition.toString(),
            },
            {
              name: 'Bitrate',
              value: selectedChannel.bitrate.toString(),
            },
            {
              name: 'User Limit',
              value: selectedChannel.userLimit.toString(),
            },
            {
              name: 'Creation Date',
              value: `<t:${Math.floor(selectedChannel.createdTimestamp / 1000)}:F>`,
            },
          );

        return interaction.reply({ embeds: [infoChannelEmbed] });
      }
    }
    else if (subcommand === 'role') {
      const selectedRole = await interaction.guild.roles.fetch(interaction.options.getRole('role', true).id);

      const infoRoleEmbed = new EmbedBuilder()
        .setColor(selectedRole.color)
        .setTitle(selectedRole.name)
        .setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ size: 512 }),
        })
        .setDescription(`ID: ${selectedRole.id}`)
        .addFields(
          {
            name: 'Managed',
            value: selectedRole.managed
              ? 'Yes'
              : 'No',
          },
          {
            name: 'Mentionable',
            value: selectedRole.mentionable
              ? 'Yes'
              : 'No',
            inline: true,
          },
          {
            name: 'Hoisted',
            value: selectedRole.hoist
              ? 'Yes'
              : 'No',
            inline: true,
          },
          {
            name: 'Position',
            value: selectedRole.rawPosition.toString(),
          },
          {
            name: 'Color',
            value: stripIndent`
              Hex: ${selectedRole.hexColor}
              RGB: ${convertToRGB(selectedRole.color)}
              Decimal: ${selectedRole.color}
            `,
          },
          {
            name: 'Creation Date',
            value: `<t:${Math.floor(selectedRole.createdTimestamp / 1000)}:F>`,
          },
        )
        .setFooter({ text: 'If any of the information are wrong, report it via /feedback issue' });

      if (selectedRole.icon) {
        infoRoleEmbed.setThumbnail(selectedRole.iconURL({ size: 512 }));

        return interaction.reply({ embeds: [infoRoleEmbed] });
      }
      else {
        const roleIcon = new AttachmentBuilder(createColorImage(selectedRole.hexColor, 512, 512).toBuffer(), { name: 'roleIcon.png' });

        infoRoleEmbed.setThumbnail('attachment://roleIcon.png');

        return interaction.reply({
          embeds: [infoRoleEmbed],
          files: [roleIcon],
        });
      }
    }
    else if (subcommand === 'server') {
      const guildMembers = await interaction.guild.members.fetch();

      const infoServerEmbed = new EmbedBuilder()
        .setColor('Blurple')
        .setTitle(interaction.guild.name)
        .setDescription(`ID: ${interaction.guildId}`)
        .setThumbnail(interaction.guild.iconURL({ size: 512 }))
        .addFields(
          {
            name: 'Preferred Locale',
            value: interaction.guild.preferredLocale,
          },
          {
            name: 'Verification Level',
            value: interaction.guild.verificationLevel
              ? (interaction.guild.verificationLevel === GuildVerificationLevel.VeryHigh
                ? 'Highest'
                : (interaction.guild.verificationLevel === GuildVerificationLevel.High
                  ? 'High'
                  : (interaction.guild.verificationLevel === GuildVerificationLevel.Medium
                    ? 'Medium'
                    : 'Low')))
              : 'None',
            inline: true,
          },
          {
            name: 'Explicit Content Filter',
            value: interaction.guild.explicitContentFilter
              ? (interaction.guild.explicitContentFilter === GuildExplicitContentFilter.AllMembers
                ? 'All Memmbers'
                : 'Members Without Roles')
              : 'Disabled',
            inline: true,
          },
          {
            name: 'Multi-Factor Authentication',
            value: interaction.guild.mfaLevel
              ? 'Yes'
              : 'No',
            inline: true,
          },
          {
            name: 'Members',
            value: guildMembers.filter((member) => !member.user.bot).size.toString(),
            inline: true,
          },
          {
            name: 'Bots',
            value: guildMembers.filter((member) => member.user.bot).size.toString(),
            inline: true,
          },
          {
            name: 'Category(ies)',
            value: interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildCategory).size.toString(),
          },
          {
            name: 'Threads',
            value: stripIndent`
              Public Threads: ${interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.PublicThread).size}
              Private Threads: ${interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.PrivateThread).size}
              Announcement Threads: ${interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.AnnouncementThread).size}
            `,
            inline: true,
          },
          {
            name: 'Text Channels',
            value: stripIndent`
              Text Channels: ${interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).size}
              Announcement Channels: ${interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildAnnouncement).size}
            `,
            inline: true,
          },
          {
            name: 'Voice Channels',
            value: stripIndent`
              Voice Channels: ${interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).size}
              Stage Channels: ${interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildStageVoice).size}
            `,
            inline: true,
          },
          {
            name: 'Emojis & Stickers',
            value: stripIndent`
              Animated Emojis: ${interaction.guild.emojis.cache.filter((emoji) => emoji.animated).size}
              Static Emojis: ${interaction.guild.emojis.cache.filter((emoji) => !emoji.animated).size}
              Stickers: ${interaction.guild.stickers.cache.size}
            `,
          },
          {
            name: 'Nitro',
            value: stripIndent`
              Tier: ${interaction.guild.premiumTier}
              No. of Boosts: ${interaction.guild.premiumSubscriptionCount}
            `,
          },
          {
            name: 'Owner',
            value: `<@${interaction.guild.ownerId}>`,
          },
          {
            name: 'Creation Date',
            value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:F>`,
          },
        )
        .setImage(interaction.guild.bannerURL({ size: 512 }))
        .setTimestamp()
        .setFooter({ text: 'If any of the information are wrong, report it via /feedback issue' });

      return interaction.reply({ embeds: [infoServerEmbed] });
    }
    else if (subcommand === 'user') {
      const selectedUser = await client.users.fetch(interaction.options.getUser('user') ?? interaction.user, { force: true });
      const selectedMember = await interaction.guild.members.fetch(selectedUser);

      const infoUserEmbed = new EmbedBuilder()
        .setColor(selectedMember.displayHexColor === '#000000'
          ? '#99a9b5'
          : selectedMember.displayHexColor)
        .setTitle(selectedUser.tag)
        .setDescription(`ID: ${selectedUser.id}`)
        .setThumbnail(selectedUser.displayAvatarURL({ size: 512 }))
        .addFields(
          {
            name: 'Nickname',
            value: selectedMember.nickname ?? 'None',
          },
          {
            name: 'Bot',
            value: selectedUser.bot
              ? 'Yes'
              : 'No',
            inline: true,
          },
          {
            name: 'System',
            value: selectedUser.system
              ? 'Yes'
              : 'No',
            inline: true,
          },
          {
            name: 'Creation Date',
            value: `<t:${Math.floor(selectedUser.createdTimestamp / 1000)}:F>`,
          },
          {
            name: 'Join Date',
            value: `<t:${Math.floor(selectedMember.joinedTimestamp / 1000)}:F>`,
          },
          {
            name: 'Roles',
            value: selectedMember.roles.cache
              .filter((role) => role.id !== interaction.guildId)
              .map((role) => role.toString())
              .join(', '),
          },
        )
        .setFooter({ text: 'If any of the information are wrong, report it via /feedback issue' });

      if (selectedUser.bot) return interaction.reply({ embeds: [infoUserEmbed] });

      infoUserEmbed.addFields({
        name: 'Accent Color',
        value: stripIndent`
          Hex: ${selectedUser.hexAccentColor ?? '#5865F2'}
          RGB: ${convertToRGB(selectedUser.accentColor ?? 5793266)}
          Decimal: ${selectedUser.accentColor ?? 5793266}
        `,
      });

      if (selectedUser.banner) {
        infoUserEmbed.setImage(selectedUser.bannerURL({ size: 512 }));

        return interaction.reply({ embeds: [infoUserEmbed] });
      }
      else {
        const userBanner = new AttachmentBuilder(createColorImage(selectedUser.hexAccentColor, 512, 201).toBuffer(), { name: 'userBanner.png' });

        infoUserEmbed.setImage('attachment://userBanner.png');

        return interaction.reply({
          embeds: [infoUserEmbed],
          files: [userBanner],
        });
      }
    }
  },
};
