import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef } from "react";
import {
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
import { useManualAppUpdate } from "@/context/ManualAppUpdateContext";
import { useColors } from "@/hooks/useColors";
import * as Application from "expo-application";

const DRAWER_WIDTH = Math.min(Dimensions.get("window").width * 0.82, 320);

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
  const checkForUpdates = useManualAppUpdate();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const installedVersionName = Application.nativeApplicationVersion ?? "—";
  const installedVersionCode = Application.nativeBuildVersion;
  const appVersion =
    installedVersionCode == null
      ? installedVersionName
      : `${installedVersionName} · build ${installedVersionCode}`;

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
    }
  }, [visible, slideAnim, fadeAnim]);

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
          <Text style={[styles.drawerTitle, { color: colors.navy }]}>
            Settings
          </Text>
          <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
            <Feather name="x" size={22} color={colors.mutedForeground} />
          </Pressable>
        </View>

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

        {Platform.OS === "android" && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              APP UPDATES
            </Text>
            <View
              style={[
                styles.optionGroup,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              <Pressable
                onPress={() => {
                  onClose();
                  checkForUpdates();
                }}
                style={styles.optionRow}
              >
                <Ionicons name="refresh-outline" size={20} color={colors.primary} />
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
          </View>
        )}

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
  versionText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: "auto",
    paddingBottom: 32,
  },
});
