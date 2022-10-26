/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import config from '#config';
import {
  Button,
  ClientEvent,
  DisTubeEvent,
  MessageContextMenuCommand,
  Modal,
  SelectMenu,
  SlashCommand,
  UserContextMenuCommand,
} from '#interfaces';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { SpotifyPlugin } from '@distube/spotify';
import { YtDlpPlugin } from '@distube/yt-dlp';
import chalk from 'chalk';
import {
  ApplicationCommandDataResolvable,
  Client,
  Collection,
  REST,
  Routes,
} from 'discord.js';
import { DisTube } from 'distube';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class ExtendedClient extends Client {
  public readonly distube = new DisTube(this, {
    emitAddListWhenCreatingQueue: false,
    emitAddSongWhenCreatingQueue: false,
    emitNewSongOnly: true,
    leaveOnEmpty: false,
    leaveOnFinish: false,
    leaveOnStop: false,
    plugins: [
      new SoundCloudPlugin(),
      new SpotifyPlugin({ emitEventsAfterFetching: true }),
      new YtDlpPlugin(),
    ],
    searchCooldown: 30,
    searchSongs: 5,
  });

  public buttons: Collection<string, Button> = new Collection();
  public messageContextMenuCommands: Collection<string, MessageContextMenuCommand> = new Collection();
  public modals: Collection<string, Modal> = new Collection();
  public selectMenus: Collection<string, SelectMenu> = new Collection();
  public slashCommands: Collection<string, SlashCommand> = new Collection();
  public userContextMenuCommands: Collection<string, UserContextMenuCommand> = new Collection();

  /**
   * Loads the application command files and sets them into their own Collections.
   *
   * @param {boolean} register The commands will also be registered to Discord.
   */
  public async loadCommands(register: boolean): Promise<void> {
    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFolders = fs.readdirSync(commandsPath);
    const commands: ApplicationCommandDataResolvable[] = [];

    for (const folder of commandFolders) {
      const folderPath = path.join(commandsPath, folder);
      const commandSubfolders = fs.readdirSync(folderPath);

      switch (folder) {
        case 'contexts':
          for (const subfolder of commandSubfolders) {
            const subfolderPath = path.join(commandsPath, folder, subfolder);
            const commandFiles = fs
              .readdirSync(subfolderPath)
              .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

            switch (subfolder) {
              case 'user':
                for (const file of commandFiles) {
                  const filePath = path.join(commandsPath, folder, subfolder, file);
                  const command: UserContextMenuCommand = (await import(filePath)).command;

                  this.userContextMenuCommands.set(command.data.name, command);

                  commands.push(command.data.toJSON());
                }

                break;

              case 'message':
                for (const file of commandFiles) {
                  const filePath = path.join(commandsPath, folder, subfolder, file);
                  const command: MessageContextMenuCommand = (await import(filePath)).command;

                  this.messageContextMenuCommands.set(command.data.name, command);

                  commands.push(command.data.toJSON());
                }

                break;
            }
          }

          break;

        case 'slashes':
          for (const subfolder of commandSubfolders) {
            const subfolderPath = path.join(commandsPath, folder, subfolder);
            const commandFiles = fs
              .readdirSync(subfolderPath)
              .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

            for (const file of commandFiles) {
              const filePath = path.join(commandsPath, folder, subfolder, file);
              const command: SlashCommand = (await import(filePath)).command;

              this.slashCommands.set(command.data.name, command);

              commands.push(command.data.toJSON());
            }
          }

          break;
      }
    }

    if (!register) return;

    const rest = new REST({ version: '10' }).setToken(config.token);

    try {
      console.info(`${chalk.blue('INFO')}: Started refreshing ${commands.length} application (/) commands.`);

      const data = await rest.put(Routes.applicationCommands(config.clientId), { body: commands }) as unknown[];

      console.log(`${chalk.green('SUCCESS')}: Successfully reloaded ${data.length} application (/) commands.`);
    }
    catch (error) {
      console.error(`${chalk.red('ERROR')}:`, error);
    }
  }
  /** Loads the component files and sets them into their own Collections. */
  public async loadComponents(): Promise<void> {
    const componentsPath = path.join(__dirname, '..', 'components');
    const componentFolders = fs.readdirSync(componentsPath);

    for (const folder of componentFolders) {
      const folderPath = path.join(componentsPath, folder);
      const componentFiles = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

      switch (folder) {
        case 'buttons':
          for (const file of componentFiles) {
            const filePath = path.join(componentsPath, folder, file);
            const component: Button = (await import(filePath)).component;

            this.buttons.set(component.customId, component);
          }

          break;

        case 'modals':
          for (const file of componentFiles) {
            const filePath = path.join(componentsPath, folder, file);
            const component: Modal = (await import(filePath)).component;

            this.modals.set(component.customId, component);
          }

          break;

        case 'selectMenus':
          for (const file of componentFiles) {
            const filePath = path.join(componentsPath, folder, file);
            const component: SelectMenu = (await import(filePath)).component;

            this.selectMenus.set(component.customId, component);
          }

          break;
      }
    }
  }
  /** Loads the event files and adds listener functions for them. */
  public async loadEvents(): Promise<void> {
    const eventsPath = path.join(__dirname, '..', 'events');
    const eventFolders = fs.readdirSync(eventsPath);

    for (const folder of eventFolders) {
      const folderPath = path.join(eventsPath, folder);
      const eventFiles = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

      switch (folder) {
        case 'client':
          for (const file of eventFiles) {
            const filePath = path.join(eventsPath, folder, file);
            const event: ClientEvent = (await import(filePath)).event;

            if (event.once) this.once(event.name, (...args: unknown[]) => event.execute(this, ...args));
            else this.on(event.name, (...args: unknown[]) => event.execute(this, ...args));
          }

          break;

        case 'distube':
          for (const file of eventFiles) {
            const filePath = path.join(eventsPath, folder, file);
            const event: DisTubeEvent = (await import(filePath)).event;

            this.distube.on(event.name, (...args: unknown[]) => event.execute(...args));
          }

          break;
      }
    }
  }
}
