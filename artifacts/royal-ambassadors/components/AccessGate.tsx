import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SettingsDrawer } from "@/components/SettingsDrawer";
import { APP_UNLOCK_PASSWORD } from "@/constants/access";
import { useColors } from "@/hooks/useColors";

interface Props {
  onUnlock: () => void;
}

export function AccessGate({ onUnlock }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [updatesOpen, setUpdatesOpen] = useState(false);

  const handleUnlock = () => {
    if (password === APP_UNLOCK_PASSWORD) {
      Keyboard.dismiss();
      setError("");
      onUnlock();
      return;
    }

    setError("Incorrect password. Please try again.");
    setPassword("");
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: Math.max(insets.top, Platform.OS === "web" ? 67 : 24),
            paddingBottom: Math.max(insets.bottom, Platform.OS === "web" ? 34 : 24),
          },
        ]}
      >
        <View style={styles.content}>
          <View style={[styles.iconBadge, { backgroundColor: colors.card }]}>
            <Feather name="lock" size={34} color={colors.primary} />
          </View>

          <Text style={[styles.eyebrow, { color: colors.primary }]}>
            ROYAL AMBASSADORS
          </Text>
          <Text style={[styles.title, { color: colors.navy }]}>
            App access temporarily locked
          </Text>
          <Text style={[styles.message, { color: colors.mutedForeground }]}>
            This app is temporarily locked. Please contact the developer to
            unlock app access.
          </Text>

          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Enter unlock password
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.card,
                  borderColor: error ? colors.destructive : colors.border,
                },
              ]}
            >
              <Ionicons name="key-outline" size={20} color={colors.primary} />
              <TextInput
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (error) setError("");
                }}
                onSubmitEditing={handleUnlock}
                placeholder="Password"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                style={[styles.input, { color: colors.cardForeground }]}
                accessibilityLabel="Unlock password"
                testID="unlock-password-input"
              />
            </View>
            {error ? (
              <Text style={[styles.error, { color: colors.destructive }]}>
                {error}
              </Text>
            ) : null}

            <Pressable
              onPress={handleUnlock}
              style={[styles.unlockButton, { backgroundColor: colors.primary }]}
              accessibilityRole="button"
              accessibilityLabel="Unlock app"
              testID="unlock-app-button"
            >
              <Text style={[styles.unlockButtonText, { color: colors.primaryForeground }]}>
                Unlock App
              </Text>
              <Feather name="arrow-right" size={19} color={colors.primaryForeground} />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => setUpdatesOpen(true)}
          style={[styles.updateButton, { borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Open app updates"
          testID="open-updates-button"
        >
          <Ionicons name="refresh-outline" size={19} color={colors.primary} />
          <Text style={[styles.updateButtonText, { color: colors.primary }]}>
            Check for Updates
          </Text>
        </Pressable>
      </View>

      <SettingsDrawer
        visible={updatesOpen}
        onClose={() => setUpdatesOpen(false)}
        lockedMode
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  content: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    alignItems: "center",
    paddingTop: 44,
  },
  iconBadge: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.8,
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
  },
  title: {
    fontSize: 27,
    lineHeight: 34,
    textAlign: "center",
    fontFamily: "Inter_700Bold",
  },
  message: {
    maxWidth: 340,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    marginTop: 14,
  },
  form: {
    width: "100%",
    marginTop: 34,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
  inputWrapper: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 52,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  error: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 7,
  },
  unlockButton: {
    minHeight: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 18,
  },
  unlockButtonText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  updateButton: {
    width: "100%",
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginBottom: 8,
  },
  updateButtonText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});