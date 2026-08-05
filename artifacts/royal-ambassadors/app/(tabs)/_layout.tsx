import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TAB_DEFS = [
  {
    name: "index",
    label: "Home",
    icon: (focused: boolean, color: string) =>
      <Feather name="home" size={20} color={color} />,
  },
  {
    name: "manual",
    label: "Manual",
    icon: (focused: boolean, color: string) =>
      <Feather name="book-open" size={20} color={color} />,
  },
  {
    name: "ranks",
    label: "Ranks",
    icon: (focused: boolean, color: string) =>
      <MaterialCommunityIcons name="shield-crown-outline" size={22} color={color} />,
  },
  {
    name: "quiz",
    label: "Quiz",
    icon: (focused: boolean, color: string) =>
      <Ionicons name={focused ? "trophy" : "trophy-outline"} size={20} color={color} />,
  },
  {
    name: "profile",
    label: "Profile",
    icon: (focused: boolean, color: string) =>
      <Feather name="user" size={20} color={color} />,
  },
];

// ─── Floating Tab Bar ─────────────────────────────────────────────────────────

function FloatingTabBar({ state, navigation }: any) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const bottomInset = Platform.OS === "web" ? 0 : insets.bottom;

  // Bar background: white in light, deep navy in dark
  const barBg = isDark ? "#080F2B" : "#FFFFFF";
  const barBorder = isDark ? colors.border : "#E8EBF5";

  return (
    <View
      style={[
        tabStyles.bar,
        {
          paddingBottom: bottomInset + 6,
          backgroundColor: barBg,
          borderTopColor: barBorder,
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const tab = TAB_DEFS[index];
        const focused = state.index === index;

        const handlePress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const activeIconColor = isDark ? "#FFFFFF" : "#FFFFFF";
        const inactiveIconColor = isDark ? "#6B7FAB" : "#9BA8C8";

        return (
          <Pressable
            key={route.key}
            onPress={handlePress}
            style={[
              tabStyles.tabBtn,
              focused
                ? [
                    tabStyles.tabBtnActive,
                    {
                      backgroundColor: colors.navy,
                      // Drop shadow — feels elevated above the bar
                      shadowColor: colors.navy,
                      shadowOffset: { width: 0, height: -3 },
                      shadowOpacity: isDark ? 0.4 : 0.18,
                      shadowRadius: 10,
                      elevation: 8,
                    },
                  ]
                : {
                    backgroundColor: "transparent",
                  },
            ]}
          >
            {tab.icon(focused, focused ? activeIconColor : inactiveIconColor)}
            <Text
              style={[
                tabStyles.tabLabel,
                {
                  color: focused ? activeIconColor : inactiveIconColor,
                  fontFamily: focused ? "Inter_600SemiBold" : "Inter_400Regular",
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    paddingTop: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 9,
    borderRadius: 14,
  },
  tabBtnActive: {
    // filled active state — elevated above bar
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
});

// ─── Native layout (iOS Liquid Glass) ────────────────────────────────────────

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="manual">
        <Icon sf={{ default: "book", selected: "book.fill" }} />
        <Label>Manual</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="ranks">
        <Icon sf={{ default: "shield", selected: "shield.fill" }} />
        <Label>Ranks</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="quiz">
        <Icon sf={{ default: "trophy", selected: "trophy.fill" }} />
        <Label>Quiz</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

// ─── Classic layout (web / Android) ──────────────────────────────────────────

function ClassicTabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="manual" options={{ title: "Manual" }} />
      <Tabs.Screen name="ranks" options={{ title: "Ranks" }} />
      <Tabs.Screen name="quiz" options={{ title: "Quiz" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
