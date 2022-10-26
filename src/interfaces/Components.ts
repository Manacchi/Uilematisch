import { ExtendedClient } from '#structures/Client.js';
import {
  ButtonInteraction,
  InteractionResponse,
  Message,
  ModalSubmitInteraction,
  SelectMenuInteraction,
} from 'discord.js';

type ComponentResponse =
  | void
  | InteractionResponse<boolean>
  | Message<boolean>;

export interface Button {
  customId: string;
  execute(interaction: ButtonInteraction, client?: ExtendedClient): Promise<ComponentResponse>;
}

export interface Modal {
  customId: string;
  execute(interaction: ModalSubmitInteraction, client?: ExtendedClient): Promise<ComponentResponse>;
}

export interface SelectMenu {
  customId: string;
  execute(interaction: SelectMenuInteraction, client?: ExtendedClient): Promise<ComponentResponse>;
}
