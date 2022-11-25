import config from '#config';
import { Button } from '#interfaces';
import { stripIndent } from 'common-tags';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export const component: Button = {
  customId: 'helpCommandsList',
  async execute(interaction) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder()
      .setCustomId('helpOriginal')
      .setLabel('General Information')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('ℹ️'));

    const helpEmbed = new EmbedBuilder()
      .setColor(config.embedColors.bot)
      .setTitle('Commands List')
      .setDescription('A list of all available commands from this bot!')
      .addFields(
        {
          name: 'Bot',
          value: '</feedback:1015631971617091615> </help:1015631971617091616> </ping:1015631971617091617>',
          inline: true,
        },
        {
          name: 'Bot',
          value: stripIndent`
            </balance:1044914902340481095> </inventory:1044914902340481096> </leaderboard:1044914902340481097>
            </shop:1044914902340481098> </transfer:1044914902340481099>
          `,
          inline: true,
        },
        {
          name: 'Fun',
          value: stripIndent`
            </8ball:1015631971617091620> </coin:1015631971617091621> </dice:1015631971617091622>
            </meow:1015631971617091623>
          `,
          inline: true,
        },
        {
          name: 'Information',
          value: '</avatar:1015631971617091624> </info:1015631971680014376>',
          inline: true,
        },
        {
          name: 'Moderator',
          value: '</prune:1015631971680014377> </role:1015631971680014378>',
          inline: true,
        },
        {
          name: 'Utility',
          value: stripIndent`
            </choose:1015631971680014379> </music:1019763672131834007> </pokémon:1043729683407179826>
            </timestamp:1015631971680014380> </urban:1015631971680014381>
          `,
          inline: true,
        },
        {
          name: 'Context Menu Commands',
          value: '`Get Global Avatar` `Get Server Avatar`',
        },
      );

    return interaction.update({
      embeds: [helpEmbed],
      components: [row],
    });
  },
};
