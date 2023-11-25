import { EmbedBuilder, type HexColorString } from 'discord.js';

import { type SendTextMessagePayload, type DiscordService, type SendEmbedMessagePayload } from './discordService.js';
import { OperationNotValidError } from '../../../../common/errors/operationNotValidError.js';
import { ResourceNotFoundError } from '../../../../common/errors/resourceNotFoundError.js';
import { type DiscordClient } from '../../clients/discordClient/discordClient.js';
export class DiscordServiceImpl implements DiscordService {
  public constructor(private readonly discordClient: DiscordClient) {}

  public async sendTextMessage(payload: SendTextMessagePayload): Promise<void> {
    const { message, channelId } = payload;

    const channel = this.discordClient.channels.cache.get(channelId);

    if (!channel) {
      throw new ResourceNotFoundError({
        name: 'Channel',
        channelId,
      });
    }

    if (channel.isTextBased()) {
      await channel.send(message);
    } else {
      throw new OperationNotValidError({
        reason: 'Channel does not support text messages.',
      });
    }
  }

  public async sendEmbedMessage(payload: SendEmbedMessagePayload): Promise<void> {
    const { message, channelId } = payload;

    const channel = this.discordClient.channels.cache.get(channelId);

    if (!channel) {
      throw new ResourceNotFoundError({
        name: 'Channel',
        channelId,
      });
    }

    const embedMessage = new EmbedBuilder()
      .setColor(message.color as HexColorString)
      .setTitle(message.title)
      .setURL(message.url)
      .setAuthor({
        name: message.author.name,
        url: message.author.url,
      })
      .setThumbnail(message.thumbnail);

    if (message.description) {
      embedMessage.setDescription(message.description);
    }

    if (message.customFields?.length) {
      embedMessage.addFields(message.customFields);
    }

    if (channel.isTextBased()) {
      await channel.send({ embeds: [embedMessage] });
    } else {
      throw new OperationNotValidError({
        reason: 'Channel does not support text messages.',
      });
    }
  }
}
