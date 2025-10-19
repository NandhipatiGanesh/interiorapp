import colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
export default function MinimalTabLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} >
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.bgSecondary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          height: 70,   
          elevation: 0     // WhatsApp style height
        
        },
        tabBarLabelStyle: {
          fontFamily: "BeVietnamPro-Medium",
          fontSize: 12,      // bigger text like WhatsApp
          marginTop: -2,     // move label closer to icon
        },
        // tabBarIconStyle: {
        //   marginTop: 4,      // push icon slightly down
        // },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Projects",
          tabBarIcon: ({ color }) => (
            <Ionicons name="briefcase-outline" color={color} size={20} /> // bigger
          ),
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: "Done",
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkmark-done-outline" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="fails"
        options={{
          title: "Fails",
          tabBarIcon: ({ color }) => (
            <Ionicons name="close-circle-outline" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="dlr"
        options={{
          title: "DLR",
          tabBarIcon: ({ color }) => (
            <Ionicons name="alert-circle-outline" color={color} size={20} />
          ),
        }}
      />
    </Tabs>
    </SafeAreaView>
  );
}
