export interface MessageModuleConfigProvider {
  getDiscordWelcomeChannelId(): string;
  getDiscordIssuesChannelId(): string;
  getDiscordPullRequestsChannelId(): string;
  getDiscordStarsChannelId(): string;
  getDiscordForksChannelId(): string;
  getGithubRepositoryName(): string;
}
