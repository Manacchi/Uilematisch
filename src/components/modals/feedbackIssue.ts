import config from '#config';
import { Modal } from '#interfaces';
import { ChannelType, EmbedBuilder } from 'discord.js';

export const component: Modal = {
  customId: 'feedbackIssue',
  async execute(interaction, client) {
    const supportGuild = client.guilds.cache.get(config.guild.id);

    if (!supportGuild) {
      await interaction.editReply('There was an error while processing your report...');

      throw new Error('The given guild id does not exist.');
    }

    const feedbackChannel = supportGuild.channels.cache.get(config.guild.feedbackChannelId);

    if (!feedbackChannel || feedbackChannel.type !== ChannelType.GuildText) {
      await interaction.editReply('There was an error while processing your report...');

      if (!feedbackChannel) throw new Error('The given channel id does not exist.');
      else throw new Error('The given channel is not a text channel.');
    }

    const botOwner = await client.users.fetch(config.ownerId);

    if (!botOwner) {
      await interaction.editReply('There was an error while processing your report...');

      throw new Error('The given user id does not exist.');
    }

    const feedbackIssueEmbed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Bug Report')
      .setAuthor({
        name: `${interaction.user.tag} (${interaction.user.id})`,
        iconURL: interaction.user.avatarURL({ size: 512 }),
      })
      .addFields(
        {
          name: 'Command',
          value: interaction.fields.getTextInputValue('commandInput') || 'No command inputted.',
        },
        {
          name: 'Report',
          value: `\`\`\`${interaction.fields.getTextInputValue('issueInput')}\`\`\``,
        },
      )
      .setTimestamp();

    if (interaction.guild) {
      feedbackIssueEmbed.setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ size: 512 }),
      });
    }
    else {
      feedbackIssueEmbed.setFooter({ text: 'DM' });
    }

    await feedbackChannel.send({ embeds: [feedbackIssueEmbed] });

    await botOwner.send({ embeds: [feedbackIssueEmbed] });

    return interaction.editReply('Your bug report has been received!');
  },
};
