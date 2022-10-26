import { ExtendedClient } from '#structures/Client.js';
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  InteractionResponse,
  Message,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  UserContextMenuCommandInteraction,
} from 'discord.js';

type CommandResponse =
  | void
  | InteractionResponse<boolean>
  | Message<boolean>;

export interface MessageContextMenuCommand {
  data: ContextMenuCommandBuilder;
  execute(interaction: MessageContextMenuCommandInteraction, client?: ExtendedClient): Promise<CommandResponse>;
}

export interface UserContextMenuCommand {
  data: ContextMenuCommandBuilder;
  execute(interaction: UserContextMenuCommandInteraction, client?: ExtendedClient): Promise<CommandResponse>;
}

export interface SlashCommand {
  data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | SlashCommandSubcommandsOnlyBuilder;
  autocomplete?(interaction: AutocompleteInteraction, client?: ExtendedClient): Promise<void>;
  execute(interaction: ChatInputCommandInteraction, client?: ExtendedClient): Promise<CommandResponse>;
}
