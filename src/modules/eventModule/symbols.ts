export const symbols = {
  eventModuleConfigProvider: Symbol('eventModuleConfigProvider'),
  sendIssueCreatedMessageCommandHandler: Symbol('sendIssueCreatedMessageCommandHandler'),
  sendPullRequestCreatedMessageCommandHandler: Symbol('sendPullRequestCreatedMessageCommandHandler'),
  eventHttpController: Symbol('eventHttpController'),
};

export const eventSymbols = {
  eventHttpController: symbols.eventHttpController,
};
