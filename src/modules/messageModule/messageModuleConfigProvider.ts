export interface MessageModuleConfigProvider {
  getDiscordWelcomeChannelId(): string;
  getDiscordIssuesChannelId(): string;
  getDiscordPullRequestsChannelId(): string;
  getDiscordStarsChannelId(): string;
  getGithubRepositoryName(): string;
}
