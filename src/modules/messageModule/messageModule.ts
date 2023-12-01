import { GuildMemberDiscordEventController } from './api/discordEventControllers/guildMemberDiscordEventController/guildMemberDiscordEventController.js';
import { MessageHttpController } from './api/httpControllers/messageHttpController/messageHttpController.js';
import { type SendIssueCreatedMessageCommandHandler } from './application/commandHandlers/sendIssueCreatedMessageCommandHandler/sendIssueCreatedMessageCommandHandler.js';
import { SendIssueCreatedMessageCommandHandlerImpl } from './application/commandHandlers/sendIssueCreatedMessageCommandHandler/sendIssueCreatedMessageCommandHandlerImpl.js';
import { type SendPullRequestCreatedMessageCommandHandler } from './application/commandHandlers/sendPullRequestCreatedMessageCommandHandler/sendPullRequestCreatedMessageCommandHandler.js';
import { SendPullRequestCreatedMessageCommandHandlerImpl } from './application/commandHandlers/sendPullRequestCreatedMessageCommandHandler/sendPullRequestCreatedMessageCommandHandlerImpl.js';
import { type SendPullRequestMergedMessageCommandHandler } from './application/commandHandlers/sendPullRequestMergedMessageCommandHandler/sendPullRequestMergedMessageCommandHandler.js';
import { SendPullRequestMergedMessageCommandHandlerImpl } from './application/commandHandlers/sendPullRequestMergedMessageCommandHandler/sendPullRequestMergedMessageCommandHandlerImpl.js';
import { type SendStarCreatedMessageCommandHandler } from './application/commandHandlers/sendStarCreatedMessageCommandHandler/sendStarCreatedMessageCommandHandler.js';
import { SendStarCreatedMessageCommandHandlerImpl } from './application/commandHandlers/sendStarCreatedMessageCommandHandler/sendStarCreatedMessageCommandHandlerImpl.js';
import { type MessageModuleConfigProvider } from './messageModuleConfigProvider.js';
import { symbols } from './symbols.js';
import { type ConfigProvider } from '../../core/configProvider.js';
import { type DiscordClient } from '../../core/discordClient/discordClient.js';
import { coreSymbols } from '../../core/symbols.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';
import { type DependencyInjectionModule } from '../../libs/dependencyInjection/dependencyInjectionModule.js';
import { type GithubService } from '../../libs/github/services/githubService/githubService.js';
import { type LoggerService } from '../../libs/logger/services/loggerService/loggerService.js';

export class MessageModule implements DependencyInjectionModule {
  public declareBindings(container: DependencyInjectionContainer): void {
    container.bind<MessageModuleConfigProvider>(symbols.messageModuleConfigProvider, () =>
      container.get<ConfigProvider>(coreSymbols.configProvider),
    );

    container.bind<SendIssueCreatedMessageCommandHandler>(
      symbols.sendIssueCreatedMessageCommandHandler,
      () =>
        new SendIssueCreatedMessageCommandHandlerImpl(
          container.get<DiscordClient>(coreSymbols.discordClient),
          container.get<LoggerService>(coreSymbols.loggerService),
          container.get<MessageModuleConfigProvider>(symbols.messageModuleConfigProvider),
        ),
    );

    container.bind<SendPullRequestCreatedMessageCommandHandler>(
      symbols.sendPullRequestCreatedMessageCommandHandler,
      () =>
        new SendPullRequestCreatedMessageCommandHandlerImpl(
          container.get<DiscordClient>(coreSymbols.discordClient),
          container.get<LoggerService>(coreSymbols.loggerService),
          container.get<MessageModuleConfigProvider>(symbols.messageModuleConfigProvider),
          container.get<GithubService>(coreSymbols.githubService),
        ),
    );

    container.bind<SendPullRequestMergedMessageCommandHandler>(
      symbols.sendPullRequestMergedMessageCommandHandler,
      () =>
        new SendPullRequestMergedMessageCommandHandlerImpl(
          container.get<DiscordClient>(coreSymbols.discordClient),
          container.get<LoggerService>(coreSymbols.loggerService),
          container.get<MessageModuleConfigProvider>(symbols.messageModuleConfigProvider),
          container.get<GithubService>(coreSymbols.githubService),
        ),
    );

    container.bind<SendStarCreatedMessageCommandHandler>(
      symbols.sendStarCreatedMessageCommandHandler,
      () =>
        new SendStarCreatedMessageCommandHandlerImpl(
          container.get<DiscordClient>(coreSymbols.discordClient),
          container.get<LoggerService>(coreSymbols.loggerService),
          container.get<MessageModuleConfigProvider>(symbols.messageModuleConfigProvider),
        ),
    );

    container.bind<MessageHttpController>(
      symbols.messageHttpController,
      () =>
        new MessageHttpController(
          container.get<SendIssueCreatedMessageCommandHandler>(symbols.sendIssueCreatedMessageCommandHandler),
          container.get<SendPullRequestCreatedMessageCommandHandler>(
            symbols.sendPullRequestCreatedMessageCommandHandler,
          ),
          container.get<SendPullRequestMergedMessageCommandHandler>(symbols.sendPullRequestMergedMessageCommandHandler),
          container.get<SendStarCreatedMessageCommandHandler>(symbols.sendStarCreatedMessageCommandHandler),
        ),
    );

    container.bind<GuildMemberDiscordEventController>(
      symbols.guildMemberDiscordEventController,
      () => new GuildMemberDiscordEventController(container.get<LoggerService>(coreSymbols.loggerService)),
    );
  }
}
