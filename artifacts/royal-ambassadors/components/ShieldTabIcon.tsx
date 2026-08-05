import React from "react";
import { Platform, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const NAVY = "#0B1B5E";
const GOLD = "#E8B800";
const WHITE = "#FFFFFF";

interface ShieldTabIconProps {
  focused: boolean;
  children: (color: string) => React.ReactNode;
}

/**
 * Each tab icon is wrapped in a navy shield that floats independently.
 * Active  → shiny gold icon
 * Inactive → white icon, slightly smaller shield with reduced opacity
 */
export function ShieldTabIcon({ focused, children }: ShieldTabIconProps) {
  const iconColor = focused ? GOLD : WHITE;
  const scale = focused ? 1 : 0.88;
  const opacity = focused ? 1 : 0.7;

  return (
    <View
      style={{
        width: 44,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ scale }],
        opacity,
        // Drop shadow makes each shield look like it's floating above the bar
        ...(Platform.OS !== "web"
          ? {
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: focused ? 0.32 : 0.16,
              shadowRadius: focused ? 8 : 4,
              elevation: focused ? 10 : 4,
            }
          : {}),
      }}
    >
      {/* Shield SVG */}
      <Svg
        width={44}
        height={48}
        viewBox="0 0 44 48"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <Path
          d="M22 1 L43 9 L43 26 C43 36.5 33.5 44.5 22 47 C10.5 44.5 1 36.5 1 26 L1 9 Z"
          fill={NAVY}
        />
      </Svg>

      {/* Icon centred inside the shield */}
      <View style={{ position: "absolute", top: 11 }}>
        {children(iconColor)}
      </View>
    </View>
  );
}
