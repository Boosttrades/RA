import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const NAVY = "#0B1B5E";
const GOLD = "#D4A217";
const WHITE = "#FFFFFF";

interface ShieldTabIconProps {
  focused: boolean;
  children: (color: string) => React.ReactNode;
}

/**
 * Wraps a tab icon in a navy-blue shield.
 * Active  → gold icon
 * Inactive → white icon
 */
export function ShieldTabIcon({ focused, children }: ShieldTabIconProps) {
  const iconColor = focused ? GOLD : WHITE;

  return (
    <View style={{ width: 44, height: 48, alignItems: "center", justifyContent: "center" }}>
      {/* Shield background */}
      <Svg
        width={44}
        height={48}
        viewBox="0 0 44 48"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Classic shield path: flat top, tapered sides, pointed bottom */}
        <Path
          d="M22 1 L43 9 L43 26 C43 36.5 33.5 44.5 22 47 C10.5 44.5 1 36.5 1 26 L1 9 Z"
          fill={NAVY}
        />
      </Svg>

      {/* Icon sits centred inside the shield */}
      <View style={{ position: "absolute", top: 11 }}>
        {children(iconColor)}
      </View>
    </View>
  );
}
