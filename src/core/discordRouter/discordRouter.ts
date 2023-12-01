import { type Client } from 'discord.js';

import { type DiscordEventController } from '../../common/types/discord/discordEventController.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';
import { type LoggerService } from '../../libs/logger/services/loggerService/loggerService.js';
import { coreSymbols } from '../symbols.js';

export interface RegisterControllersPayload {
  controllers: DiscordEventController[];
}

export class DiscordRouter {
  private readonly loggerService: LoggerService;

  public constructor(
    private readonly discordClientInstance: Client,
    private readonly container: DependencyInjectionContainer,
  ) {
    this.loggerService = this.container.get<LoggerService>(coreSymbols.loggerService);
  }

  public registerControllers(payload: RegisterControllersPayload): void {
    const { controllers } = payload;

    controllers.forEach((controller) => {
      const discordEvents = controller.getDiscordEvents();

      discordEvents.map((discordEvent) => {
        this.discordClientInstance.on(discordEvent.eventName, discordEvent.handler);

        this.loggerService.info({
          message: 'Registered a Discord event handler.',
          context: {
            source: DiscordRouter.name,
            eventName: discordEvent.eventName,
          },
        });
      });
    });
  }
}
