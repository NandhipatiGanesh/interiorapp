// File: components/CustomDrawer.tsx
import { useAuth } from "@/hooks/useAuth";
import { useCustomDrawer } from "@/hooks/useCustomDrawer";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";


const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CustomDrawer() {
  const { isOpen, closeDrawer } = useCustomDrawer();
  const { user, logout } = useAuth();
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current; // hidden off-screen

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  // drawer always mounts, just slides in/out
  return (
   
    <View style={styles.overlay} pointerEvents={isOpen ? "auto" : "none"}>
      {/* backdrop */}
      

      {/* sliding drawer */}
      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
      
    

          {/* ✅ Profile Header */}
          <View style={styles.profileHeader}>
            <Ionicons name="person-circle-outline" size={60} color="#000000ff" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.name}>{user?.displayName || "Guest"}</Text>
              <Text style={styles.subText}>{user?.email || "No email"}</Text>
            </View>
            <TouchableOpacity>
              <Feather name="edit-2" size={18} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Example items */}
          <Text style={styles.sectionTitle}>All checks</Text>
          <View style={styles.rowBoxContainer}>
            <TouchableOpacity style={styles.box}>
              <MaterialIcons name="restaurant" size={22} color="#4000ff" />
              <Text style={styles.boxText}>Finished </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.box}>
              <MaterialIcons name="local-movies" size={22} color="#4000ff" />
              <Text style={styles.boxText}>Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.box}>
              <MaterialIcons name="event" size={22} color="#4000ff" />
              <Text style={styles.boxText}>Fail</Text>
            </TouchableOpacity>
          </View>

          {/* ✅ Logout */}
          <TouchableOpacity style={styles.logoutRow} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="red" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutRow} onPress={closeDrawer}>
             <Ionicons name="close" size={28} color="#000" />
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
   
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    flex: 1,
    zIndex: 1000,
    width: '100%',
    paddingTop: 30, 
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawer: {
    width: SCREEN_WIDTH , // 80% screen width
    height: "100%",
    backgroundColor: "#fff",
    padding: 16,
  },
  closeBtn: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  name: { fontSize: 18, color: "#000", fontFamily: "BeVietnamPro-Medium" },
  subText: {
    fontSize: 14,
    color: "#000000ff",
    marginTop: 2,
    fontFamily: "BeVietnamPro-Medium",
  },
  sectionTitle: {
    fontSize: 15,
    color: "#000000ff",
    marginBottom: 10,
    marginTop: 20,
    fontFamily: "BeVietnamPro-Medium",
  },
  rowBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginHorizontal: 4,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 18,
  },
  boxText: {
    fontSize: 13,
    marginTop: 6,
    color: "#000000ff",
    textAlign: "center",
    fontFamily: "BeVietnamPro-Medium",
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 18,
    borderColor: "#f7f7f7",
    paddingHorizontal: 16,
  },
  logoutText: {
    marginLeft: 8,
    color: "red",
    fontSize: 15,
    fontFamily: "BeVietnamPro-Medium",
  },
  closeText : {
     marginLeft: 8,
    color: "black",
    fontSize: 15,
    fontFamily: "BeVietnamPro-Medium",
  }
});
