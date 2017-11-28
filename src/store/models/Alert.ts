import { AppVersionType, LatestAppVersion } from "./AppVersion";

export type AppUpdateAlertType = "RegularUpdate" | "ForcedUpdate" | "NoUpdate";

export const transfromAppVersionsToAlertType = (
  appVersions: { [k in AppVersionType]?: string | LatestAppVersion }
): AppUpdateAlertType => {
  const hasLatest =
    !!appVersions.LatestAppVersion &&
    !!(<LatestAppVersion>appVersions.LatestAppVersion).version;

  if (hasLatest) {
    const latest = (<LatestAppVersion>appVersions.LatestAppVersion).version;
    const forced = (<LatestAppVersion>appVersions.LatestAppVersion).forced;
    const isHigherThanNotified = latest > appVersions.NotifiedAppVersion;
    const isNewerVersion = latest > appVersions.ThisAppVersion;
    if (forced && isNewerVersion) {
      return "ForcedUpdate";
    } else if (isNewerVersion && isHigherThanNotified) {
      return "RegularUpdate";
    }
  }

  return "NoUpdate";
};
