export const symbols = {
  messageModuleConfigProvider: Symbol('messageModuleConfigProvider'),
  sendIssueCreatedMessageCommandHandler: Symbol('sendIssueCreatedMessageCommandHandler'),
  sendPullRequestCreatedMessageCommandHandler: Symbol('sendPullRequestCreatedMessageCommandHandler'),
  sendPullRequestMergedMessageCommandHandler: Symbol('sendPullRequestMergedMessageCommandHandler'),
  sendStarCreatedMessageCommandHandler: Symbol('sendStarCreatedMessageCommandHandler'),
  sendWelcomeMessageCommandHandler: Symbol('sendWelcomeMessageCommandHandler'),
  githubService: Symbol('githubService'),
  messageHttpController: Symbol('messageHttpController'),
  guildMemberDiscordEventController: Symbol('guildMemberDiscordEventController'),
  interactionDiscordEventController: Symbol('interactionDiscordEventController'),
  discordSlashCommandsRegistry: Symbol('discordSlashCommandsRegistry'),
  randomIssueDiscordSlashCommand: Symbol('randomIssueDiscordSlashCommand'),
  findRandomUnassignedIssueQueryHandler: Symbol('findRandomUnassignedIssueQueryHandler'),
};

export const messageSymbols = {
  messageHttpController: symbols.messageHttpController,
  guildMemberDiscordEventController: symbols.guildMemberDiscordEventController,
  interactionDiscordEventController: symbols.interactionDiscordEventController,
  discordSlashCommandsRegistry: symbols.discordSlashCommandsRegistry,
  randomIssueDiscordSlashCommand: symbols.randomIssueDiscordSlashCommand,
};
