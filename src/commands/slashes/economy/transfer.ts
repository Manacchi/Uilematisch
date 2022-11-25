import config from '#config';
import { addBalance } from '#helpers/addBalance.js';
import { getBalance } from '#helpers/getBalance.js';
import { SlashCommand } from '#interfaces';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer balance to another user')
    .addIntegerOption((option) => option
      .setName('amount')
      .setDescription('The amount to balance transfer')
      .setRequired(true))
    .addUserOption((option) => option
      .setName('user')
      .setDescription('The user to transfer the balance to')
      .setRequired(true)),
  async execute(interaction, client) {
    const givenAmount = interaction.options.getInteger('amount');

    if (givenAmount < 1) {
      return interaction.reply({
        content: 'The amount of balance to transfer must be greater than `0`.',
        ephemeral: true,
      });
    }

    const currentAmount = getBalance(client, interaction.user.id);

    if (givenAmount > currentAmount) {
      return interaction.reply({
        content: `Sorry, you only have ${currentAmount}.`,
        ephemeral: true,
      });
    }

    const selecteduser = await client.users.fetch(interaction.options.getUser('user'));

    await addBalance(client, interaction.user.id, -givenAmount);

    await addBalance(client, selecteduser.id, givenAmount);

    const recipientBalance = getBalance(client, selecteduser.id);

    const transferRecipientEmbed = new EmbedBuilder()
      .setColor(config.embedColors.bot)
      .setTitle(`${interaction.user.username} Transfered $${givenAmount}`)
      .setAuthor({
        name: selecteduser.username,
        iconURL: selecteduser.avatarURL({ size: 512 }),
      })
      .addFields(
        {
          name: 'Current Balance',
          value: `$${recipientBalance}`,
          inline: true,
        },
        {
          name: 'Former Balance',
          value: `$${recipientBalance - givenAmount}`,
          inline: true,
        },
      );

    await selecteduser.send({ embeds: [transferRecipientEmbed] });

    const senderBalance = getBalance(client, interaction.user.id);

    const transferSenderEmbed = new EmbedBuilder()
      .setColor(config.embedColors.bot)
      .setTitle(`Successfully Transfered $${givenAmount} to ${selecteduser.tag}`)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ size: 512 }),
      })
      .addFields(
        {
          name: 'Current Balance',
          value: `$${senderBalance}`,
          inline: true,
        },
        {
          name: 'Former Balance',
          value: `$${senderBalance + givenAmount}`,
          inline: true,
        },
      );

    return interaction.reply({ embeds: [transferSenderEmbed] });
  },
};
