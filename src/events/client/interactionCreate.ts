import { ClientEvent } from '#interfaces';
import chalk from 'chalk';
import { Events, Interaction } from 'discord.js';

export const event: ClientEvent = {
  name: Events.InteractionCreate,
  async execute(client, interaction: Interaction) {
    if (interaction.isAutocomplete()) {
      const slashCommand = client.slashCommands.get(interaction.commandName);

      if (!slashCommand || !slashCommand.autocomplete) return;

      try {
        await slashCommand.autocomplete(interaction, client);
      }
      catch (error) {
        console.error(`${chalk.red('ERROR')}:`, error);
      }
    }
    else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);

      if (!button) return;

      try {
        await button.execute(interaction, client);
      }
      catch (error) {
        console.error(`${chalk.red('ERROR')}:`, error);
      }
    }
    else if (interaction.isChatInputCommand()) {
      const slashCommand = client.slashCommands.get(interaction.commandName);

      if (!slashCommand) return;

      try {
        await slashCommand.execute(interaction, client);
      }
      catch (error) {
        console.error(`${chalk.red('ERROR')}:`, error);

        await interaction.reply({
          content: 'There was an error while executing this slash command...',
          ephemeral: true,
        });
      }
    }
    else if (interaction.isMessageContextMenuCommand()) {
      const messageContextMenuCommand = client.messageContextMenuCommands.get(interaction.commandName);

      if (!messageContextMenuCommand) return;

      try {
        await messageContextMenuCommand.execute(interaction, client);
      }
      catch (error) {
        console.error(`${chalk.red('ERROR')}:`, error);

        await interaction.reply({
          content: 'There was an error while executing this context menu command...',
          ephemeral: true,
        });
      }
    }
    else if (interaction.isModalSubmit()) {
      const modal = client.modals.get(interaction.customId);

      if (!modal) return;

      try {
        await modal.execute(interaction, client);
      }
      catch (error) {
        console.error(`${chalk.red('ERROR')}:`, error);
      }
    }
    else if (interaction.isSelectMenu()) {
      const selectMenu = client.selectMenus.get(interaction.customId);

      if (!selectMenu) return;

      try {
        await selectMenu.execute(interaction, client);
      }
      catch (error) {
        console.error(`${chalk.red('ERROR')}:`, error);
      }
    }
    else if (interaction.isUserContextMenuCommand()) {
      const userContextMenuCommand = client.userContextMenuCommands.get(interaction.commandName);

      if (!userContextMenuCommand) return;

      try {
        await userContextMenuCommand.execute(interaction, client);
      }
      catch (error) {
        console.error(`${chalk.red('ERROR')}:`, error);

        await interaction.reply({
          content: 'There was an error while executing this context menu command...',
          ephemeral: true,
        });
      }
    }
  },
};
