export interface MessageModuleConfigProvider {
  getDiscordIssuesChannelId(): string;
  getDiscordPullRequestsChannelId(): string;
  getDiscordStarsChannelId(): string;
}
