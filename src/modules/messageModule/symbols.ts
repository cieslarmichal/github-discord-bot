export const symbols = {
  messageModuleConfigProvider: Symbol('messageModuleConfigProvider'),
  sendIssueCreatedMessageCommandHandler: Symbol('sendIssueCreatedMessageCommandHandler'),
  sendPullRequestCreatedMessageCommandHandler: Symbol('sendPullRequestCreatedMessageCommandHandler'),
  sendPullRequestMergedMessageCommandHandler: Symbol('sendPullRequestMergedMessageCommandHandler'),
  sendStarCreatedMessageCommandHandler: Symbol('sendStarCreatedMessageCommandHandler'),
  githubService: Symbol('githubService'),
  messageHttpController: Symbol('messageHttpController'),
  guildMemberDiscordEventController: Symbol('guildMemberDiscordEventController'),
};

export const messageSymbols = {
  messageHttpController: symbols.messageHttpController,
  guildMemberDiscordEventController: symbols.guildMemberDiscordEventController,
};
