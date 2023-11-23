import { Client, GatewayIntentBits } from 'discord.js';

import { type DiscordClient } from '../../clients/discordClient/discordClient.js';

export class DiscordClientFactory {
  public static create(): DiscordClient {
    const client = new Client({
      intents:
        GatewayIntentBits.Guilds |
        GatewayIntentBits.GuildMembers |
        GatewayIntentBits.MessageContent |
        GatewayIntentBits.GuildMessages,
    });

    return client;
  }
}
