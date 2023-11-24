import { type SendIssueCreatedMessageCommandHandler } from './application/commandHandlers/sendIssueCreatedMessageCommandHandler/sendIssueCreatedMessageCommandHandler.js';
import { SendIssueCreatedMessageCommandHandlerImpl } from './application/commandHandlers/sendIssueCreatedMessageCommandHandler/sendIssueCreatedMessageCommandHandlerImpl.js';
import { type IssueModuleConfigProvider } from './issueModuleConfigProvider.js';
import { symbols } from './symbols.js';
import { type ConfigProvider } from '../../core/configProvider.js';
import { coreSymbols } from '../../core/symbols.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';
import { type DependencyInjectionModule } from '../../libs/dependencyInjection/dependencyInjectionModule.js';
import { type LoggerService } from '../../libs/logger/services/loggerService/loggerService.js';

export class IssueModule implements DependencyInjectionModule {
  public declareBindings(container: DependencyInjectionContainer): void {
    container.bind<IssueModuleConfigProvider>(symbols.issueModuleConfigProvider, () =>
      container.get<ConfigProvider>(coreSymbols.configProvider),
    );

    container.bind<SendIssueCreatedMessageCommandHandler>(
      symbols.sendIssueCreatedMessageCommandHandler,
      () =>
        new SendIssueCreatedMessageCommandHandlerImpl(
          container.get<DiscordService>(coreSymbols.discordService),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );
  }
}
