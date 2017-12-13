export type AppVersionType =
  | "ThisAppVersion"
  | "NotifiedAppVersion"
  | "LatestAppVersion";

export interface LatestAppVersion {
  version: string;
  forced: boolean;
}
