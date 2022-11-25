import config from '#config';
import { SlashCommand } from '#interfaces';
import { Users } from '#models';
import { stripIndent } from 'common-tags';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Display your or a selected user\'s inventory')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('The user to display the inventory of')),
  async execute(interaction) {
    const selecteduser = interaction.options.getUser('user') ?? interaction.user;
    const user = await Users.findOne({ where: { user_id: selecteduser.id } });
    const items = await user.getItems(user);

    if (!items.length) return interaction.reply(`<@${selecteduser.id}> has nothing.`);

    const inventoryEmbed = new EmbedBuilder()
      .setColor(config.embedColors.bot)
      .setTitle('Inventory')
      .setAuthor({
        name: selecteduser.username,
        iconURL: selecteduser.avatarURL({ size: 512 }),
      })
      .setDescription(stripIndent`
        **Items**
        \`\`\`${items
    .map((item) => `${item.amount} ${item.item.name}`)
    .join('\n')}\`\`\`
      `);

    return interaction.reply({ embeds: [inventoryEmbed] });
  },
};
