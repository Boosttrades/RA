import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";
import { setupUpdateNotificationChannel } from "@/services/update";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AccessGate } from "@/components/AccessGate";
import { UpdateDialog } from "@/components/UpdateDialog";
import { AppProvider } from "@/context/AppContext";
import { useAppUpdate } from "@/hooks/useAppUpdate";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
const APP_UNLOCK_STORAGE_KEY = "@ra_app_unlocked_v1";

function RootLayoutNav() {
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const [unlockStateLoaded, setUnlockStateLoaded] = React.useState(false);
  const {
    state,
    startUpdate,
    cancelUpdate,
    resumeInstall,
    cancelPendingInstall,
    dismiss,
    checkNow,
  } = useAppUpdate();

  useEffect(() => {
    let isMounted = true;

    const restoreUnlockState = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(APP_UNLOCK_STORAGE_KEY);
        if (isMounted) setIsUnlocked(storedValue === "true");
      } catch (error) {
        console.error("Unable to restore the saved app unlock state.", error);
      } finally {
        if (isMounted) setUnlockStateLoaded(true);
      }
    };

    void restoreUnlockState();
    return () => {
      isMounted = false;
    };
  }, []);

  const unlockApp = async () => {
    await AsyncStorage.setItem(APP_UNLOCK_STORAGE_KEY, "true");
    setIsUnlocked(true);
  };

  // Set up the Android notification channel for download progress notifications.
  useEffect(() => {
    if (Platform.OS === "android") {
      void setupUpdateNotificationChannel();
    }
  }, []);

  return (
    <>
      {!unlockStateLoaded ? null : isUnlocked ? (
        <Stack screenOptions={{ headerBackTitle: "Back" }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      ) : (
        <AccessGate onUnlock={unlockApp} />
      )}
      <UpdateDialog
        state={state}
        onUpdate={startUpdate}
        onCancel={cancelUpdate}
        onDismiss={dismiss}
        onRetry={checkNow}
        onResumeInstall={resumeInstall}
        onCancelPendingInstall={cancelPendingInstall}
      />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <KeyboardProvider>
              <AppProvider>
                <RootLayoutNav />
              </AppProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
