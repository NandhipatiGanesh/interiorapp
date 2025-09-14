// app/_layout.tsx
import { AuthProvider } from "@/hooks/useAuth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DrawerProvider } from "@/hooks/useCustomDrawer";
import { useState } from "react";
import {
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
  useFonts,
} from "@expo-google-fonts/be-vietnam-pro";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Text, View } from "react-native";
import "react-native-reanimated";
import CustomDrawer from "@/components/CustomDrawer";

function LoadingScreen({ message }: { message: string }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={{ marginTop: 10, fontFamily: "BeVietnamPro-Medium" }}>{message}</Text>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
    const [drawerOpen, setDrawerOpen] = useState(false);
  const [fontsLoaded] = useFonts({
    "BeVietnamPro-Regular": BeVietnamPro_400Regular,
    "BeVietnamPro-Medium": BeVietnamPro_500Medium,
    "BeVietnamPro-SemiBold": BeVietnamPro_600SemiBold,
    "BeVietnamPro-Bold": BeVietnamPro_700Bold,
  });

  if (!fontsLoaded) {
    return <LoadingScreen message="Loading " />;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <DrawerProvider>
        {/* Slot = render whatever route user navigates to */}
        <Slot />
        <CustomDrawer  />
        </DrawerProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
