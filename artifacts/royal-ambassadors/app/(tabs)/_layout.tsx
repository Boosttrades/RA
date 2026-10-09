import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";

import { useColors } from "@/hooks/useColors";
import { ShieldTabIcon } from "@/components/ShieldTabIcon";

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
      <NativeTabs.Trigger name="tools">
        <Icon
          sf={{
            default: "wrench.and.screwdriver",
            selected: "wrench.and.screwdriver.fill",
          }}
        />
        <Label>Tools</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile" hidden>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="notes" hidden>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="bible" hidden>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 10,
          marginTop: 2,
        },
        tabBarStyle: {
          // Fully transparent — each shield floats independently, no bar behind them
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          // Give shields enough vertical room
          height: Platform.OS === "web" ? 84 : 84,
        },
        // No background panel at all — pure transparency
        tabBarBackground: () => null,
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <ShieldTabIcon focused={focused}>
              {(color) =>
                isIOS ? (
                  <SymbolView name="house.fill" tintColor={color} size={22} />
                ) : (
                  <Feather name="home" size={22} color={color} />
                )
              }
            </ShieldTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="manual"
        options={{
          title: "Manual",
          tabBarIcon: ({ focused }) => (
            <ShieldTabIcon focused={focused}>
              {(color) =>
                isIOS ? (
                  <SymbolView name="book.fill" tintColor={color} size={22} />
                ) : (
                  <Feather name="book-open" size={22} color={color} />
                )
              }
            </ShieldTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="ranks"
        options={{
          title: "Ranks",
          tabBarIcon: ({ focused }) => (
            <ShieldTabIcon focused={focused}>
              {(color) =>
                isIOS ? (
                  <SymbolView name="shield.fill" tintColor={color} size={22} />
                ) : (
                  <MaterialCommunityIcons name="shield-crown-outline" size={24} color={color} />
                )
              }
            </ShieldTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: "Quiz",
          tabBarIcon: ({ focused }) => (
            <ShieldTabIcon focused={focused}>
              {(color) =>
                isIOS ? (
                  <SymbolView name="trophy.fill" tintColor={color} size={22} />
                ) : (
                  <Ionicons name="trophy-outline" size={22} color={color} />
                )
              }
            </ShieldTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: "Tools",
          tabBarIcon: ({ focused }) => (
            <ShieldTabIcon focused={focused}>
              {(color) =>
                isIOS ? (
                  <SymbolView
                    name="wrench.and.screwdriver.fill"
                    tintColor={color}
                    size={22}
                  />
                ) : (
                  <Feather name="tool" size={22} color={color} />
                )
              }
            </ShieldTabIcon>
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="notes" options={{ href: null }} />
      <Tabs.Screen name="bible" options={{ href: null }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
