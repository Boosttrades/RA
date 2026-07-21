import { useContext } from "react";
import { useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { AppContext } from "@/context/AppContext";

/**
 * Returns the design tokens for the active color scheme.
 *
 * Respects the user's themePreference from AppContext:
 *  - "light"  → always light palette
 *  - "dark"   → always dark palette
 *  - "system" → follows the device appearance setting (default)
 */
export function useColors() {
  const ctx = useContext(AppContext);
  const deviceScheme = useColorScheme();
  const pref = ctx?.themePreference ?? "system";
  const effectiveScheme = pref === "system" ? deviceScheme : pref;
  const palette =
    effectiveScheme === "dark"
      ? colors.dark
      : colors.light;
  return { ...palette, radius: colors.radius };
}
