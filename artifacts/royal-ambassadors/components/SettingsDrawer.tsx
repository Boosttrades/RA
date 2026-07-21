import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { type ThemePreference, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const DRAWER_WIDTH = Math.min(Dimensions.get("window").width * 0.82, 320);

type UpdateState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "up-to-date" }
  | { status: "available" }
  | { status: "downloading" }
  | { status: "applied" }
  | { status: "dev" }
  | { status: "error"; message: string };

interface Props {
  visible: boolean;
  onClose: () => void;
}

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: string }[] =
  [
    { value: "light", label: "Light", icon: "sunny-outline" },
    { value: "dark", label: "Dark", icon: "moon-outline" },
    { value: "system", label: "System", icon: "phone-portrait-outline" },
  ];

export function SettingsDrawer({ visible, onClose }: Props) {
  const colors = useColors();
  const { themePreference, setThemePreference } = useApp();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [updateState, setUpdateState] = useState<UpdateState>({ status: "idle" });
  const [appVersion, setAppVersion] = useState<string>("1.0.0");

  // Load app version
  useEffect(() => {
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Constants = require("expo-constants").default;
        const v = Constants.expoConfig?.version ?? Constants.manifest?.version ?? "1.0.0";
        setAppVersion(v);
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
      setUpdateState({ status: "idle" });
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleCheckForUpdates = useCallback(async () => {
    setUpdateState({ status: "checking" });
    try {
      // expo-updates is only functional in production/preview builds
      // In Expo Go / development it gracefully reports the dev mode
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Updates = require("expo-updates");

      if (__DEV__ || Updates.isEmbeddedLaunch === undefined) {
        setUpdateState({ status: "dev" });
        return;
      }

      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        setUpdateState({ status: "available" });
        setUpdateState({ status: "downloading" });
        await Updates.fetchUpdateAsync();
        setUpdateState({ status: "applied" });
        // Reload after a brief pause so the user can read the message
        setTimeout(() => {
          Updates.reloadAsync();
        }, 1500);
      } else {
        setUpdateState({ status: "up-to-date" });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      // Common in dev / Expo Go — show a friendly message instead
      if (
        msg.includes("not available") ||
        msg.includes("development") ||
        msg.includes("expo-updates")
      ) {
        setUpdateState({ status: "dev" });
      } else {
        setUpdateState({ status: "error", message: msg });
      }
    }
  }, []);

  const updateStatusText = (): { text: string; color: string } => {
    switch (updateState.status) {
      case "checking":
        return { text: "Checking for updates…", color: colors.mutedForeground };
      case "up-to-date":
        return { text: "You're on the latest version.", color: "#22C55E" };
      case "available":
        return { text: "Update found! Downloading…", color: colors.gold };
      case "downloading":
        return { text: "Downloading update…", color: colors.gold };
      case "applied":
        return { text: "Update ready — restarting app…", color: "#22C55E" };
      case "dev":
        return {
          text: "Updates are checked in production builds (APK/EAS).",
          color: colors.mutedForeground,
        };
      case "error":
        return {
          text: `Could not check: ${updateState.message}`,
          color: colors.destructive,
        };
      default:
        return { text: "", color: colors.mutedForeground };
    }
  };

  const { text: statusText, color: statusColor } = updateStatusText();
  const isChecking =
    updateState.status === "checking" ||
    updateState.status === "downloading";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Scrim */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.scrim, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            backgroundColor: colors.card,
            transform: [{ translateX: slideAnim }],
            paddingTop:
              Platform.OS === "android"
                ? (StatusBar.currentHeight ?? 0) + 16
                : 56,
          },
        ]}
      >
        {/* Header */}
        <View style={[styles.drawerHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.drawerTitle, { color: colors.navy }]}>Settings</Text>
          <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
            <Feather name="x" size={22} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            APPEARANCE
          </Text>
          <View
            style={[
              styles.optionGroup,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            {THEME_OPTIONS.map((opt, i) => {
              const active = themePreference === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setThemePreference(opt.value)}
                  style={[
                    styles.optionRow,
                    i < THEME_OPTIONS.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    },
                    active && { backgroundColor: colors.secondary },
                  ]}
                >
                  <Ionicons
                    name={opt.icon as never}
                    size={20}
                    color={active ? colors.primary : colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: active ? colors.primary : colors.foreground },
                      active && { fontFamily: "Inter_600SemiBold" },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {active && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.primary}
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Updates */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            APP
          </Text>
          <View
            style={[
              styles.optionGroup,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            <Pressable
              onPress={handleCheckForUpdates}
              disabled={isChecking || updateState.status === "applied"}
              style={[
                styles.optionRow,
                (isChecking || updateState.status === "applied") && {
                  opacity: 0.6,
                },
              ]}
            >
              {isChecking ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons
                  name="refresh-outline"
                  size={20}
                  color={colors.primary}
                />
              )}
              <Text style={[styles.optionLabel, { color: colors.foreground }]}>
                Check for Updates
              </Text>
              <Feather
                name="chevron-right"
                size={18}
                color={colors.mutedForeground}
                style={{ marginLeft: "auto" }}
              />
            </Pressable>
          </View>
          {statusText !== "" && (
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>
          )}
        </View>

        {/* Version */}
        <Text style={[styles.versionText, { color: colors.mutedForeground }]}>
          Version {appVersion}
        </Text>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 20,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  drawerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  optionGroup: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 12,
  },
  optionLabel: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
    marginLeft: 4,
    lineHeight: 17,
  },
  versionText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: "auto",
    paddingBottom: 32,
  },
});
