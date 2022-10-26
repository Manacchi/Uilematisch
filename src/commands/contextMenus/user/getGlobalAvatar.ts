import { UserContextMenuCommand } from '#interfaces';
import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } from 'discord.js';

export const command: UserContextMenuCommand = {
  data: new ContextMenuCommandBuilder()
    .setName('Get Global Avatar')
    .setType(ApplicationCommandType.User),
  async execute(interaction, client) {
    const targetUser = await client.users.fetch(interaction.targetUser, { force: true });

    const getGlobalAvatarEmbed = new EmbedBuilder()
      .setColor(targetUser.hexAccentColor ?? 'Blurple')
      .setAuthor({ name: interaction.targetUser.tag })
      .setDescription(`[**Global Avatar URL**](${interaction.targetUser.avatarURL({ size: 512 })})`)
      .setImage(interaction.targetUser.avatarURL({ size: 512 }));

    return interaction.reply({
      embeds: [getGlobalAvatarEmbed],
      ephemeral: true,
    });
  },
};
