export const symbols = {
  eventModuleConfigProvider: Symbol('eventModuleConfigProvider'),
  sendIssueCreatedMessageCommandHandler: Symbol('sendIssueCreatedMessageCommandHandler'),
  sendPullRequestCreatedMessageCommandHandler: Symbol('sendPullRequestCreatedMessageCommandHandler'),
  sendPullRequestMergedMessageCommandHandler: Symbol('sendPullRequestMergedMessageCommandHandler'),
  sendStarCreatedMessageCommandHandler: Symbol('sendStarCreatedMessageCommandHandler'),
  githubService: Symbol('githubService'),
  eventHttpController: Symbol('eventHttpController'),
};

export const eventSymbols = {
  eventHttpController: symbols.eventHttpController,
};
