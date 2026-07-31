/**
 * components/UpdateDialog.tsx
 * Modal dialog for the in-app update flow.
 * Renders nothing on non-Android platforms.
 */

import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { UpdateManifest, UpdateState } from "@/services/update";
import Constants from "expo-constants";

interface Props {
  state: UpdateState;
  onUpdate: (manifest: UpdateManifest) => void;
  onCancel: () => void;
  onDismiss: () => void;
  onRetry: () => void;
}

/** Reads the installed version string. */
function getInstalledVersion(): string {
  return Constants.expoConfig?.version ?? "—";
}

export function UpdateDialog({
  state,
  onUpdate,
  onCancel,
  onDismiss,
  onRetry,
}: Props) {
  // This component is Android-only.
  if (Platform.OS !== "android") return null;

  const visible =
    state.status === "update-available" ||
    state.status === "downloading" ||
    state.status === "verifying" ||
    state.status === "installing" ||
    state.status === "error";

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
      onRequestClose={
        state.status === "update-available" || state.status === "error"
          ? onDismiss
          : undefined
      }
    >
      <View style={styles.overlay}>
        <DialogContent
          state={state}
          onUpdate={onUpdate}
          onCancel={onCancel}
          onDismiss={onDismiss}
          onRetry={onRetry}
        />
      </View>
    </Modal>
  );
}

function DialogContent({ state, onUpdate, onCancel, onDismiss, onRetry }: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state.status === "downloading" && state.progress.percentage >= 0) {
      Animated.timing(progressAnim, {
        toValue: state.progress.percentage / 100,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }, [state]);

  const cardStyle = [
    styles.card,
    {
      backgroundColor: c.card,
      borderColor: c.border,
      marginBottom: insets.bottom + 24,
    },
  ];

  // ── Update Available ──────────────────────────────────────────────────────
  if (state.status === "update-available") {
    return (
      <View style={cardStyle}>
        <View style={[styles.iconBadge, { backgroundColor: c.goldLight }]}>
          <Text style={[styles.iconText, { color: c.gold }]}>↑</Text>
        </View>
        <Text style={[styles.title, { color: c.text }]}>Update Available</Text>
        <Text style={[styles.body, { color: c.mutedForeground }]}>
          A new version of the Royal Ambassadors Guide is ready.
        </Text>
        <View style={styles.versionRow}>
          <VersionChip label="Installed" version={getInstalledVersion()} color={c.mutedForeground} bg={c.muted} />
          <Text style={[styles.arrow, { color: c.mutedForeground }]}>→</Text>
          <VersionChip label="New" version={state.manifest.version} color={c.primaryForeground} bg={c.primary} />
        </View>
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.btn, styles.btnOutline, { borderColor: c.border }]}
            onPress={onDismiss}
          >
            <Text style={[styles.btnText, { color: c.mutedForeground }]}>Later</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.btnPrimary, { backgroundColor: c.primary }]}
            onPress={() => onUpdate(state.manifest)}
          >
            <Text style={[styles.btnText, { color: c.primaryForeground }]}>
              Update Now
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Downloading ───────────────────────────────────────────────────────────
  if (state.status === "downloading") {
    const { percentage, totalBytesWritten } = state.progress;
    const mb = (totalBytesWritten / 1_048_576).toFixed(1);
    const pctLabel = percentage >= 0 ? `${percentage}%` : "…";

    return (
      <View style={cardStyle}>
        <Text style={[styles.title, { color: c.text }]}>Downloading Update</Text>
        <Text style={[styles.body, { color: c.mutedForeground }]}>
          {mb} MB downloaded — {pctLabel}
        </Text>
        <View style={[styles.progressTrack, { backgroundColor: c.muted }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: c.primary,
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
        <Pressable
          style={[styles.btn, styles.btnOutline, { borderColor: c.border, alignSelf: "center" }]}
          onPress={onCancel}
        >
          <Text style={[styles.btnText, { color: c.mutedForeground }]}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  // ── Verifying ─────────────────────────────────────────────────────────────
  if (state.status === "verifying") {
    return (
      <View style={cardStyle}>
        <Text style={[styles.title, { color: c.text }]}>Verifying Update</Text>
        <Text style={[styles.body, { color: c.mutedForeground }]}>
          Checking the downloaded file before installation…
        </Text>
      </View>
    );
  }

  // ── Installing ────────────────────────────────────────────────────────────
  if (state.status === "installing") {
    return (
      <View style={cardStyle}>
        <Text style={[styles.title, { color: c.text }]}>Opening Installer</Text>
        <Text style={[styles.body, { color: c.mutedForeground }]}>
          The Android installer is opening. Follow the on-screen prompts to complete the update.
        </Text>
      </View>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (state.status === "error") {
    return (
      <View style={cardStyle}>
        <View style={[styles.iconBadge, { backgroundColor: "#FEF2F2" }]}>
          <Text style={[styles.iconText, { color: "#EF4444" }]}>!</Text>
        </View>
        <Text style={[styles.title, { color: c.text }]}>Update Failed</Text>
        <Text style={[styles.body, { color: c.mutedForeground }]}>
          {state.message}
        </Text>
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.btn, styles.btnOutline, { borderColor: c.border }]}
            onPress={onDismiss}
          >
            <Text style={[styles.btnText, { color: c.mutedForeground }]}>Dismiss</Text>
          </Pressable>
          {state.retryable && (
            <Pressable
              style={[styles.btn, styles.btnPrimary, { backgroundColor: c.primary }]}
              onPress={onRetry}
            >
              <Text style={[styles.btnText, { color: c.primaryForeground }]}>Retry</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  return null;
}

function VersionChip({
  label,
  version,
  color,
  bg,
}: {
  label: string;
  version: string;
  color: string;
  bg: string;
}) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.chipLabel, { color }]}>{label}</Text>
      <Text style={[styles.chipVersion, { color }]}>{version}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 16,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  iconText: {
    fontSize: 24,
    fontWeight: "700",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
  },
  versionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    opacity: 0.7,
  },
  chipVersion: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  arrow: {
    fontSize: 18,
    fontWeight: "600",
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnOutline: {
    borderWidth: 1,
  },
  btnPrimary: {},
  btnText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});
