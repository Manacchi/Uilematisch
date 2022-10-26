import { SlashCommand } from '#interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Display your or a selected user\'s global or server avatar')
    .setDMPermission(false)
    .addStringOption((option) => option
      .setName('type')
      .setDescription('The type of avatar to display')
      .setRequired(true)
      .addChoices(
        {
          name: 'Global',
          value: 'discord',
        },
        {
          name: 'Sever',
          value: 'guild',
        },
      ))
    .addUserOption((option) => option
      .setName('user')
      .setDescription('The user to display the avatar of')),
  async execute(interaction, client) {
    const chosenType = interaction.options.getString('type', true);
    const selectedUser = await client.users.fetch(interaction.options.getUser('user') ?? interaction.user, { force: true });

    const avatarEmbed = new EmbedBuilder().setAuthor({ name: selectedUser.tag });

    if (chosenType === 'discord') {
      avatarEmbed
        .setColor(selectedUser.hexAccentColor ?? 'Blurple')
        .setDescription(`[**Global Avatar URL**](${selectedUser.avatarURL({ size: 512 })})`)
        .setImage(selectedUser.avatarURL({ size: 512 }));

      return interaction.reply({ embeds: [avatarEmbed] });
    }
    else if (chosenType === 'guild') {
      const selectedMember = await interaction.guild.members.fetch(selectedUser);

      avatarEmbed
        .setColor(selectedMember.displayHexColor === '#000000'
          ? '#99a9b5'
          : selectedMember.displayHexColor)
        .setDescription(`[**Server Avatar URL**](${selectedUser.displayAvatarURL({ size: 512 })})`)
        .setImage(selectedUser.displayAvatarURL({ size: 512 }))
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ size: 512 }),
        });

      return interaction.reply({ embeds: [avatarEmbed] });
    }
  },
};
