export const symbols = {
  loggerService: Symbol('loggerService'),
  discordClient: Symbol('discordClient'),
  configProvider: Symbol('configProvider'),
};

export const coreSymbols = {
  loggerService: symbols.loggerService,
  discordClient: symbols.discordClient,
  configProvider: symbols.configProvider,
};
