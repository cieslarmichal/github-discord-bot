export const symbols = {
  loggerService: Symbol('loggerService'),
  discordClient: Symbol('discordClient'),
  discordService: Symbol('discordService'),
  configProvider: Symbol('configProvider'),
};

export const coreSymbols = {
  loggerService: symbols.loggerService,
  discordClient: symbols.discordClient,
  discordService: symbols.discordService,
  configProvider: symbols.configProvider,
};
