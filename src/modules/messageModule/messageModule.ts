import { GuildMemberDiscordEventController } from './api/discordEventControllers/guildMemberDiscordEventController/guildMemberDiscordEventController.js';
import { InteractionDiscordEventController } from './api/discordEventControllers/interactionDiscordEventController/interactionDiscordEventController.js';
import { RandomIssueDiscordSlashCommand } from './api/discordSlashCommands/randomIssueDiscordSlashCommand/randomIssueDiscordSlashCommand.js';
import { type DiscordSlashCommandsRegistry } from './api/discordSlashCommandsRegistry/discordSlashCommandsRegistry.js';
import { DiscordSlashCommandsRegistryImpl } from './api/discordSlashCommandsRegistry/discordSlashCommandsRegistryImpl.js';
import { MessageHttpController } from './api/httpControllers/messageHttpController/messageHttpController.js';
import { type SendForkCreatedMessageCommandHandler } from './application/commandHandlers/sendForkCreatedMessageCommandHandler/sendForkCreatedMessageCommandHandler.js';
import { SendForkCreatedMessageCommandHandlerImpl } from './application/commandHandlers/sendForkCreatedMessageCommandHandler/sendForkCreatedMessageCommandHandlerImpl.js';
import { type SendIssueCreatedMessageCommandHandler } from './application/commandHandlers/sendIssueCreatedMessageCommandHandler/sendIssueCreatedMessageCommandHandler.js';
import { SendIssueCreatedMessageCommandHandlerImpl } from './application/commandHandlers/sendIssueCreatedMessageCommandHandler/sendIssueCreatedMessageCommandHandlerImpl.js';
import { type SendPullRequestCreatedMessageCommandHandler } from './application/commandHandlers/sendPullRequestCreatedMessageCommandHandler/sendPullRequestCreatedMessageCommandHandler.js';
import { SendPullRequestCreatedMessageCommandHandlerImpl } from './application/commandHandlers/sendPullRequestCreatedMessageCommandHandler/sendPullRequestCreatedMessageCommandHandlerImpl.js';
import { type SendPullRequestMergedMessageCommandHandler } from './application/commandHandlers/sendPullRequestMergedMessageCommandHandler/sendPullRequestMergedMessageCommandHandler.js';
import { SendPullRequestMergedMessageCommandHandlerImpl } from './application/commandHandlers/sendPullRequestMergedMessageCommandHandler/sendPullRequestMergedMessageCommandHandlerImpl.js';
import { type SendStarCreatedMessageCommandHandler } from './application/commandHandlers/sendStarCreatedMessageCommandHandler/sendStarCreatedMessageCommandHandler.js';
import { SendStarCreatedMessageCommandHandlerImpl } from './application/commandHandlers/sendStarCreatedMessageCommandHandler/sendStarCreatedMessageCommandHandlerImpl.js';
import { type SendWelcomeMessageCommandHandler } from './application/commandHandlers/sendWelcomeMessageCommandHandler/sendWelcomeMessageCommandHandler.js';
import { SendWelcomeMessageCommandHandlerImpl } from './application/commandHandlers/sendWelcomeMessageCommandHandler/sendWelcomeMessageCommandHandlerImpl.js';
import { type FindRandomUnassignedIssueQueryHandler } from './application/queryHandlers/findRandomUnassignedIssueQueryHandler/findRandomUnassignedIssueQueryHandler.js';
import { FindRandomUnassignedIssueQueryHandlerImpl } from './application/queryHandlers/findRandomUnassignedIssueQueryHandler/findRandomUnassignedIssueQueryHandlerImpl.js';
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

    container.bind<SendForkCreatedMessageCommandHandler>(
      symbols.sendForkCreatedMessageCommandHandler,
      () =>
        new SendForkCreatedMessageCommandHandlerImpl(
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
          container.get<SendForkCreatedMessageCommandHandler>(symbols.sendForkCreatedMessageCommandHandler),
        ),
    );

    container.bind<SendWelcomeMessageCommandHandler>(
      symbols.sendWelcomeMessageCommandHandler,
      () =>
        new SendWelcomeMessageCommandHandlerImpl(
          container.get<DiscordClient>(coreSymbols.discordClient),
          container.get<LoggerService>(coreSymbols.loggerService),
          container.get<MessageModuleConfigProvider>(symbols.messageModuleConfigProvider),
        ),
    );

    container.bind<GuildMemberDiscordEventController>(
      symbols.guildMemberDiscordEventController,
      () =>
        new GuildMemberDiscordEventController(
          container.get<SendWelcomeMessageCommandHandler>(symbols.sendWelcomeMessageCommandHandler),
        ),
    );

    container.bind<DiscordSlashCommandsRegistry>(
      symbols.discordSlashCommandsRegistry,
      () => new DiscordSlashCommandsRegistryImpl(),
    );

    container.bind<InteractionDiscordEventController>(
      symbols.interactionDiscordEventController,
      () =>
        new InteractionDiscordEventController(
          container.get<DiscordSlashCommandsRegistry>(symbols.discordSlashCommandsRegistry),
        ),
    );

    container.bind<FindRandomUnassignedIssueQueryHandler>(
      symbols.findRandomUnassignedIssueQueryHandler,
      () =>
        new FindRandomUnassignedIssueQueryHandlerImpl(
          container.get<GithubService>(coreSymbols.githubService),
          container.get<LoggerService>(coreSymbols.loggerService),
          container.get<MessageModuleConfigProvider>(symbols.messageModuleConfigProvider),
        ),
    );

    container.bind<RandomIssueDiscordSlashCommand>(
      symbols.randomIssueDiscordSlashCommand,
      () =>
        new RandomIssueDiscordSlashCommand(
          container.get<FindRandomUnassignedIssueQueryHandler>(symbols.findRandomUnassignedIssueQueryHandler),
        ),
    );
  }
}
