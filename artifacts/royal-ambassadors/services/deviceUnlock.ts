export const APP_UNLOCK_STORAGE_KEY = "@ra_app_unlock_device_v1";
export const LEGACY_APP_UNLOCK_STORAGE_KEY = "@ra_app_unlocked_v1";
export const WEB_DEVICE_ID_STORAGE_KEY = "@ra_app_device_identity_v1";

interface DeviceUnlockState {
  version: 1;
  unlocked: true;
  deviceId: string;
}

export function createDeviceUnlockState(deviceId: string): string {
  const state: DeviceUnlockState = {
    version: 1,
    unlocked: true,
    deviceId,
  };
  return JSON.stringify(state);
}

export function isUnlockedForDevice(
  storedValue: string | null,
  deviceId: string,
): boolean {
  if (!storedValue || !deviceId) return false;

  try {
    const state = JSON.parse(storedValue) as Partial<DeviceUnlockState>;
    return (
      state.version === 1 &&
      state.unlocked === true &&
      state.deviceId === deviceId
    );
  } catch {
    return false;
  }
}
