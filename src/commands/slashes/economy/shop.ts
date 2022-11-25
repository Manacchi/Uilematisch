import config from '#config';
import { addBalance } from '#helpers/addBalance.js';
import { getBalance } from '#helpers/getBalance.js';
import { SlashCommand } from '#interfaces';
import { CurrencyShop, Users } from '#models';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Op } from 'sequelize';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Buy an item from the shop')
    .addSubcommand((subcommand) => subcommand
      .setName('buy')
      .setDescription('Buy an item from the shop')
      .addStringOption((option) => option
        .setName('item')
        .setDescription('The item to buy')
        .setAutocomplete(true)
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('info')
      .setDescription('Display the shop\'s items for sale')),
  async autocomplete(interaction, client) {
    const focusedOption = interaction.options.getFocused(true);
    const userBalance = getBalance(client, interaction.user.id);
    const choices: string[] = [];

    if (userBalance >= 1) choices.push('Tea');

    if (userBalance >= 2) choices.push('Coffee');

    if (userBalance >= 5) choices.push('Cake');

    const filtered = choices.filter((choice) => choice.startsWith(focusedOption.value));

    return interaction.respond(filtered.map((choice) => ({
      name: choice,
      value: choice,
    })));
  },
  async execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'buy') {
      const selectedItem = interaction.options.getString('item');
      const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: selectedItem } } });
      const userBalance = getBalance(client, interaction.user.id);

      if (!item) {
        return interaction.reply({
          content: 'That item doesn\'t exist!',
          ephemeral: true,
        });
      }
      else if (item.cost > userBalance) {
        return interaction.reply({
          content: `\`${item.name}\` costs $${item.cost}, while you currently have $${userBalance}.`,
          ephemeral: true,
        });
      }

      const user = await Users.findOne({ where: { user_id: interaction.user.id } });

      await addBalance(client, interaction.user.id, -item.cost);

      await user.addItem(user, item);

      return interaction.reply({
        content: `You've bought: \`${item.name}\`.`,
        ephemeral: true,
      });
    }
    else if (subcommand === 'info') {
      const items = await CurrencyShop.findAll();

      const shopInfoEmbed = new EmbedBuilder()
        .setColor(config.embedColors.bot)
        .setTitle('Shop Items')
        .setDescription(items
          .map((i) => `${i.name}: $${i.cost}`)
          .join('\n'));

      return interaction.reply({ embeds: [shopInfoEmbed] });
    }
  },
};
