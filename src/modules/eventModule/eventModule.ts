import { EventHttpController } from './api/httpControllers/eventHttpController/eventHttpController.js';
import { type SendIssueCreatedMessageCommandHandler } from './application/commandHandlers/sendIssueCreatedMessageCommandHandler/sendIssueCreatedMessageCommandHandler.js';
import { SendIssueCreatedMessageCommandHandlerImpl } from './application/commandHandlers/sendIssueCreatedMessageCommandHandler/sendIssueCreatedMessageCommandHandlerImpl.js';
import { type SendPullRequestCreatedMessageCommandHandler } from './application/commandHandlers/sendPullRequestCreatedMessageCommandHandler/sendPullRequestCreatedMessageCommandHandler.js';
import { SendPullRequestCreatedMessageCommandHandlerImpl } from './application/commandHandlers/sendPullRequestCreatedMessageCommandHandler/sendPullRequestCreatedMessageCommandHandlerImpl.js';
import { type EventModuleConfigProvider } from './eventModuleConfigProvider.js';
import { symbols } from './symbols.js';
import { type ConfigProvider } from '../../core/configProvider.js';
import { coreSymbols } from '../../core/symbols.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';
import { type DependencyInjectionModule } from '../../libs/dependencyInjection/dependencyInjectionModule.js';
import { type DiscordService } from '../../libs/discord/services/discordService/discordService.js';
import { type LoggerService } from '../../libs/logger/services/loggerService/loggerService.js';

export class EventModule implements DependencyInjectionModule {
  public declareBindings(container: DependencyInjectionContainer): void {
    container.bind<EventModuleConfigProvider>(symbols.eventModuleConfigProvider, () =>
      container.get<ConfigProvider>(coreSymbols.configProvider),
    );

    container.bind<SendIssueCreatedMessageCommandHandler>(
      symbols.sendIssueCreatedMessageCommandHandler,
      () =>
        new SendIssueCreatedMessageCommandHandlerImpl(
          container.get<DiscordService>(coreSymbols.discordService),
          container.get<LoggerService>(coreSymbols.loggerService),
          container.get<EventModuleConfigProvider>(symbols.eventModuleConfigProvider),
        ),
    );

    container.bind<SendPullRequestCreatedMessageCommandHandler>(
      symbols.sendPullRequestCreatedMessageCommandHandler,
      () =>
        new SendPullRequestCreatedMessageCommandHandlerImpl(
          container.get<DiscordService>(coreSymbols.discordService),
          container.get<LoggerService>(coreSymbols.loggerService),
          container.get<EventModuleConfigProvider>(symbols.eventModuleConfigProvider),
        ),
    );

    container.bind<EventHttpController>(
      symbols.eventHttpController,
      () =>
        new EventHttpController(
          container.get<SendIssueCreatedMessageCommandHandler>(symbols.sendIssueCreatedMessageCommandHandler),
        ),
    );
  }
}
