export const symbols = {
  loggerService: Symbol('loggerService'),
  discordClient: Symbol('discordClient'),
  discordService: Symbol('discordService'),
  configProvider: Symbol('configProvider'),
  httpService: Symbol('httpService'),
  githubService: Symbol('githubService'),
};

export const coreSymbols = {
  loggerService: symbols.loggerService,
  discordClient: symbols.discordClient,
  discordService: symbols.discordService,
  configProvider: symbols.configProvider,
  httpService: symbols.httpService,
  githubService: symbols.githubService,
};
