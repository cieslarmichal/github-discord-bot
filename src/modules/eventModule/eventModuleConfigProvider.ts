export interface EventModuleConfigProvider {
  getDiscordIssuesChannelId(): string;
  getDiscordPullRequestsChannelId(): string;
  getGithubRepositoryName(): string;
}
