import { SlashCommand } from '#interfaces';
import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Give or remove a role from a selected member')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((subcommand) => subcommand
      .setName('give')
      .setDescription('Give a role to a selected member')
      .addRoleOption((option) => option
        .setName('role')
        .setDescription('The role to give')
        .setRequired(true))
      .addUserOption((option) => option
        .setName('member')
        .setDescription('The member to give the role to')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('remove')
      .setDescription('remove a role from a selected member')
      .addRoleOption((option) => option
        .setName('role')
        .setDescription('The role to remove')
        .setRequired(true))
      .addUserOption((option) => option
        .setName('member')
        .setDescription('The member to give the role to')
        .setRequired(true))),
  async execute(interaction, client) {
    const botMember = await interaction.guild.members.fetch(client.user);

    if (!botMember.permissions.has('ManageRoles')) {
      return interaction.reply({
        content: 'I need the permission `Manage Roles` to give/remove a role from a member.',
        ephemeral: true,
      });
    }

    const selectedRole = await interaction.guild.roles.fetch(interaction.options.getRole('role', true).id);

    if (selectedRole.managed) {
      return interaction.reply({
        content: `<@&${selectedRole.id}> is managed by an external service.`,
        ephemeral: true,
      });
    }
    else if (!selectedRole.editable) {
      return interaction.reply({
        content: `<@&${selectedRole.id}> is higher than my highest role in the server hierarchy.`,
        ephemeral: true,
      });
    }

    const subcommand = interaction.options.getSubcommand();
    const selectedMember = await interaction.guild.members.fetch(interaction.options.getUser('member', true).id);

    const roleEmbed = new EmbedBuilder().setColor('Blurple');

    if (subcommand === 'give') {
      if (selectedMember.roles.cache.some((memberRole) => memberRole.name === selectedRole.name)) {
        return interaction.reply({
          content: `<@${selectedMember.id}> already has the <@&${selectedRole.id}> role.`,
          ephemeral: true,
        });
      }

      await selectedMember.roles.add(selectedRole);

      roleEmbed
        .setTitle('Successfully Given a Role')
        .addFields(
          {
            name: 'Target Member',
            value: `<@${selectedMember.id}>`,
          },
          {
            name: 'Given Role',
            value: `<@&${selectedRole.id}>`,
          },
          {
            name: 'Member\'s Role/s',
            value: selectedMember.roles.cache
              .filter((role) => role.id !== interaction.guildId)
              .map((role) => role.toString())
              .join(', '),
          },
        );

      return interaction.reply({
        embeds: [roleEmbed],
        ephemeral: true,
      });
    }
    else if (subcommand === 'remove') {
      if (!selectedMember.roles.cache.some((memberRole) => memberRole.name === selectedRole.name)) {
        return interaction.reply({
          content: `<@${selectedMember.id}> doesn't have the <@&${selectedRole.id}> role.`,
          ephemeral: true,
        });
      }

      await selectedMember.roles.remove(selectedRole);

      roleEmbed
        .setTitle('Successfully Removed a Role')
        .addFields(
          {
            name: 'Target Member',
            value: `<@${selectedMember.id}>`,
          },
          {
            name: 'Removed Role',
            value: `<@&${selectedRole.id}>`,
          },
          {
            name: 'Member\'s Role/s',
            value: selectedMember.roles.cache
              .filter((role) => role.id !== interaction.guildId)
              .map((role) => role.toString())
              .join(', '),
          },
        );

      return interaction.reply({
        embeds: [roleEmbed],
        ephemeral: true,
      });
    }
  },
};
