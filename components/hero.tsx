// File : components/Hero.tsx
import { useAuth } from "@/hooks/useAuth";
import { useCustomDrawer } from "@/hooks/useCustomDrawer";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // ✅ correct
import { useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Hero = () => {
  const router = useRouter();
  const { user } = useAuth();
  const navigation = useNavigation();
   const { openDrawer } = useCustomDrawer();

  const handleProfilePress = () => {
    if (user) {
      try {
        openDrawer(); // ✅ works inside (drawer)
      } catch (e) {
        console.warn("Drawer not available here → redirecting to /auth");
        router.push("/auth");
      }
    } else {
      router.push("/auth");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/binyaminmellish.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.profileSection} onPress={handleProfilePress}>
        <View style={styles.profileIcon}>
          <Ionicons name="person-circle-outline" size={32} color="#fff" />
        </View>

        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userText} numberOfLines={1}>
              {user.displayName || user.email?.split("@")[0] || "User"}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default Hero;




const styles = StyleSheet.create({
  container: {
    height: 240,
    width: "100%",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    backgroundColor: "#fff",    
    overflow: "hidden",
    justifyContent: "space-between",
  },
  profileSection: {
    position: "absolute",
    top: 12,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  profileIcon: {
    marginRight: 4,
  },
  userInfo: {
    maxWidth: 120,
    marginLeft: 4,
  },
  userText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "BeVietnamPro-Medium",
  },
  heroContent: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "BeVietnamPro-Bold",
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "BeVietnamPro-Regular",
    marginTop: 8,
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
