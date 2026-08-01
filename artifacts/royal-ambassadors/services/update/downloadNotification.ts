/**
 * update/downloadNotification.ts
 * Posts and updates an Android notification that tracks APK download progress.
 *
 * This lets the user background the app during a download and still see
 * progress in the notification shade. The notification is dismissed
 * automatically when the download finishes or fails.
 *
 * Note: expo-notifications v0.32 NotificationContentInput does not accept
 * an `android` key — Android behaviour is controlled by the channel settings
 * set in setNotificationChannelAsync (LOW importance = no sound, no vibration,
 * shows silently in the shade). Progress text is conveyed via the body string.
 */

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { updateLogger } from "./logger";

const CHANNEL_ID = "ra-update-download";
const NOTIFICATION_ID = "ra-update-progress";

/** Set up the Android notification channel once on app start. */
export async function setupUpdateNotificationChannel(): Promise<void> {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "App Updates",
    importance: Notifications.AndroidImportance.LOW,
    description: "Shows progress while downloading app updates.",
    enableVibrate: false,
    showBadge: false,
  });
}

/** Request notification permissions. Returns true if granted. */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS !== "android") return false;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

/** Post the initial "Downloading…" notification. */
export async function postDownloadStartNotification(): Promise<void> {
  if (Platform.OS !== "android") return;

  try {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: {
        title: "Downloading Update",
        body: "Starting download…",
        data: { type: "update-download" },
        sticky: true,
      },
      trigger: null,
    });
  } catch (err) {
    // Notification failure must never break the download itself.
    updateLogger.warn("Failed to post download start notification", err);
  }
}

/** Update the notification with current download progress. */
export async function updateDownloadProgressNotification(
  percentage: number,
  mb: string
): Promise<void> {
  if (Platform.OS !== "android") return;

  try {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: {
        title: "Downloading Update",
        body: percentage >= 0 ? `${mb} MB — ${percentage}%` : `${mb} MB downloaded…`,
        data: { type: "update-download" },
        sticky: true,
      },
      trigger: null,
    });
  } catch {
    // Silently ignore — a missed progress tick doesn't matter.
  }
}

/** Replace the progress notification with a "Ready to install" notice. */
export async function postDownloadCompleteNotification(version: string): Promise<void> {
  if (Platform.OS !== "android") return;

  try {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: {
        title: "Update Ready",
        body: `Version ${version} downloaded. Open the app to install.`,
        data: { type: "update-ready", version },
      },
      trigger: null,
    });
  } catch (err) {
    updateLogger.warn("Failed to post download complete notification", err);
  }
}

/** Dismiss the download notification entirely. */
export async function dismissDownloadNotification(): Promise<void> {
  if (Platform.OS !== "android") return;

  try {
    await Notifications.dismissNotificationAsync(NOTIFICATION_ID);
  } catch {
    // Already gone — fine.
  }
}
