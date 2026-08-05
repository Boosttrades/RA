const colors = {
  light: {
    // Light mode mirrors dark mode but INVERTED:
    // dark = navy cards + gold UI  →  light = gold cards + navy UI
    // background goes black→white, gold↔navy swap on cards/primary
    text: "#0B1B5E",
    tint: "#0B1B5E",
    background: "#EEF1FF",
    foreground: "#0B1B5E",
    // Cards are shiny bright gold — navy cards live in dark mode
    card: "#E8B800",
    cardForeground: "#0B1B5E",
    // Navy is the primary interactive colour in light mode
    primary: "#0B1B5E",
    primaryForeground: "#FFFFFF",
    secondary: "#C89A00",        // deeper gold for secondary fills
    secondaryForeground: "#0B1B5E",
    muted: "#FFF6CC",            // warm cream
    mutedForeground: "#7A5F00",
    accent: "#0B1B5E",
    accentForeground: "#FFFFFF",
    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",
    border: "#C89A00",
    input: "#D4A800",
    // Gold token — always the SHINY vivid gold
    gold: "#E8B800",
    goldLight: "#FFF9DA",
    navy: "#0B1B5E",
  },
  dark: {
    // Dark mode: navy cards + shiny gold UI — the inverse of light mode
    text: "#E6EAF8",
    tint: "#E8B800",
    background: "#05070D",
    foreground: "#E6EAF8",
    // Cards are navy — gold cards live in light mode
    card: "#0B1B5E",
    cardForeground: "#FFFFFF",
    // Gold is the primary interactive colour in dark mode
    primary: "#E8B800",
    primaryForeground: "#0B1B5E",
    secondary: "#142070",
    secondaryForeground: "#FFFFFF",
    muted: "#162258",
    mutedForeground: "#9CA3AF",
    accent: "#E8B800",
    accentForeground: "#0B1B5E",
    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",
    border: "#1A2E80",
    input: "#1A2E80",
    gold: "#E8B800",
    goldLight: "#241C04",
    navy: "#E6EAF8",
  },
  radius: 16,
};

export default colors;
