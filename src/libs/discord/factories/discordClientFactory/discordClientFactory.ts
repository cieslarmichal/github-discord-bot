import { Client, GatewayIntentBits } from 'discord.js';

import { type DiscordClient } from '../../clients/discordClient/discordClient.js';

export class DiscordClientFactory {
  public static create(): DiscordClient {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    client.on('ready', () => {
      console.log(`Discord client ${client.user?.tag} is ready.`);
    });

    return client;
  }
}
