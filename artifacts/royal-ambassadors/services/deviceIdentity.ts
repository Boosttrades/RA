import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";
import { Platform } from "react-native";

import { WEB_DEVICE_ID_STORAGE_KEY } from "@/services/deviceUnlock";

export async function getDeviceIdentity(): Promise<string> {
  if (Platform.OS === "android") {
    const androidId = Application.getAndroidId();
    if (!androidId) {
      throw new Error("Android did not provide a device identifier.");
    }
    return `android:${androidId}`;
  }

  if (Platform.OS === "ios") {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const vendorId = await Application.getIosIdForVendorAsync();
      if (vendorId) return `ios:${vendorId}`;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error("iOS did not provide a device identifier.");
  }

  if (Platform.OS === "web") {
    let browserId = await AsyncStorage.getItem(WEB_DEVICE_ID_STORAGE_KEY);
    if (!browserId) {
      browserId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      await AsyncStorage.setItem(WEB_DEVICE_ID_STORAGE_KEY, browserId);
    }
    return `web:${browserId}`;
  }

  throw new Error(`Device-specific unlock is not supported on ${Platform.OS}.`);
}
