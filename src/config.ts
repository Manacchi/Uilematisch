import { ColorResolvable } from 'discord.js';
import 'dotenv/config';

interface Config {
  readonly clientId: string;
  embedColors: {
    [name: string]: ColorResolvable;
    readonly bot: ColorResolvable;
    readonly distube: ColorResolvable;
  };
  links: { readonly invite: string };
  readonly ownerId: string;
  guild: {
    readonly id: string;
    readonly feedbackChannelId: string;
  };
  readonly token: string;
}

export default {
  clientId: process.env.CLIENT_ID || '',
  embedColors: {
    bot: '#ff6600',
    distube: '#ed4245',
  },
  links: { invite: process.env.INVITE_LINK || '' },
  ownerId: process.env.OWNER_ID || '',
  guild: {
    id: process.env.GUILD_ID || '',
    feedbackChannelId: process.env.FEEDBACK_CHANNEL_ID || '',
  },
  token: process.env.DISCORD_TOKEN || '',
} as Config;
