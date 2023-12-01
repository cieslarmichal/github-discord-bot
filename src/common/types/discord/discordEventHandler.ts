export type DiscordEventHandler<T = unknown> = (payload: T) => Promise<void>;
