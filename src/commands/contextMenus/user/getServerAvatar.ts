import { UserContextMenuCommand } from '#interfaces';
import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } from 'discord.js';

export const command: UserContextMenuCommand = {
  data: new ContextMenuCommandBuilder()
    .setName('Get Server Avatar')
    .setType(ApplicationCommandType.User)
    .setDMPermission(false),
  async execute(interaction) {
    const targetMember = await interaction.guild.members.fetch(interaction.targetUser);

    const getServerAvatarEmbed = new EmbedBuilder()
      .setColor(targetMember.displayHexColor === '#000000'
        ? '#99a9b5'
        : targetMember.displayHexColor)
      .setAuthor({ name: interaction.targetUser.tag })
      .setDescription(`[**Server Avatar URL**](${interaction.targetUser.displayAvatarURL({ size: 512 })})`)
      .setImage(interaction.targetUser.displayAvatarURL({ size: 512 }))
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ size: 512 }),
      });

    return interaction.reply({
      embeds: [getServerAvatarEmbed],
      ephemeral: true,
    });
  },
};
