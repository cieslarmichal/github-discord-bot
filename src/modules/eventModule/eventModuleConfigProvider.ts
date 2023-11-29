export interface EventModuleConfigProvider {
  getDiscordIssuesChannelId(): string;
  getDiscordPullRequestsChannelId(): string;
  getDiscordStarsChannelId(): string;
  getDiscordForksChannelId(): string;
}
