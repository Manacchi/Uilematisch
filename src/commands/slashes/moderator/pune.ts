import { SlashCommand } from '#interfaces';
import {
  Collection,
  EmbedBuilder,
  Message,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('prune')
    .setDescription('Prune up to 99 messages')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) => option
      .setName('amount')
      .setDescription('How many messages to prune')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('type')
      .setDescription('The type of messages to prune')
      .setRequired(true)
      .addChoices(
        {
          name: 'All Messages',
          value: 'all',
        },
        {
          name: 'Messages with Attachments',
          value: 'attachment',
        },

        {
          name: 'Bot Messages',
          value: 'bot',
        },
        {
          name: 'Messages with a Specific Word',
          value: 'oneWord',
        },
        {
          name: 'Specific User\'s Messages',
          value: 'user',
        },
      ))
    .addStringOption((option) => option
      .setName('arguments')
      .setDescription('The specific word or user\'s ID')),
  async execute(interaction, client) {
    const botMember = await interaction.guild.members.fetch(client.user);

    if (!botMember
      .permissionsIn(interaction.channel)
      .has('ManageMessages')) {
      return interaction.reply({
        content: 'I need the permission `Manage Messages` to prune messages.',
        ephemeral: true,
      });
    }

    const givenAmount = interaction.options.getInteger('amount', true);

    if (givenAmount < 1 || givenAmount > 99) {
      return interaction.reply({
        content: 'The amount of messages to prune must be between `1` and  `99`.',
        ephemeral: true,
      });
    }

    const messages = await interaction.channel.messages.fetch({
      limit: givenAmount,
      cache: false,
    });
    const prunableMessages: Collection<string, Message> = new Collection();
    const chosenType = interaction.options.getString('type', true);
    const givenArguments = interaction.options.getString('arguments');

    for (const message of messages.values()) {
      if (prunableMessages.size >= givenAmount) break;
      else if (!message.deletable) continue;
      else if (Math.ceil(Math.abs(Math.abs((new Date()).valueOf() - message.createdTimestamp) / (1000 * 3600 * 24))) > 14) continue;

      if (chosenType === 'all') {
        prunableMessages.set(message.id, message);
      }
      else if (chosenType === 'attachment') {
        if (message.attachments.size > 0) prunableMessages.set(message.id, message);
      }
      else if (chosenType === 'bot') {
        if (message.author.bot) prunableMessages.set(message.id, message);
      }
      else if (chosenType === 'oneWord') {
        if (message.content.includes(givenArguments)) prunableMessages.set(message.id, message);
      }
      else if (chosenType === 'user') {
        if (message.author.id === givenArguments) prunableMessages.set(message.id, message);
      }
    }

    const deletedMessages = await interaction.channel.bulkDelete(prunableMessages, true);

    const pruneEmbed = new EmbedBuilder()
      .setColor('Blurple')
      .setTitle('Successfully Purged Message/s')
      .addFields(
        {
          name: 'Number of Messages to Prune',
          value: givenAmount.toString(),
        },
        {
          name: 'Number of Prunable Messages',
          value: prunableMessages.size.toString(),
        },
        {
          name: 'Number of Messages Pruned',
          value: deletedMessages.size.toString(),
        },
      );

    return interaction.reply({
      embeds: [pruneEmbed],
      ephemeral: true,
    });
  },
};
