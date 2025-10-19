import { useAuth } from "@/hooks/useAuth";
import { BlurView } from "expo-blur";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function DLRScreen() {
  const [loading, setLoading] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const { user } = useAuth(); // 👤 get logged-in user
  const router = useRouter(); 
  
    if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: '#fff' 
      }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10, fontFamily: "BeVietnamPro-Medium", }}>Loading...</Text>
      </View>
    );
  }

   if (!user) {
      return (
        
        <View style={{ 
          flex: 1, 
          justifyContent: "center", 
          alignItems: "center",
          backgroundColor: '#e7e7e7ff' 
        }}>
                 <Pressable onPress={() => router.push("/auth")}>
          <BlurView intensity={80} tint="light" style={styles.blurBox}>
            <Text style={styles.text}>Please log in to continue</Text>
          </BlurView>
        </Pressable>
        </View>
      );
    }
  const allowedLocation = {
    latitude: 17.311696,
    longitude: 78.533182,
    radius: 200, // meters
  };

  async function handleCheckInOut() {
    setLoading(true);

    try {
      // 📍 Ask for permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        await sendEmail(false, "Permission denied");
        setLoading(false);
        return Alert.alert("Permission denied", "Location access is required for check-in.");
      }

      // 📍 Get current position
      const loc = await Location.getCurrentPositionAsync({});
      const distance = getDistanceFromLatLonInM(
        loc.coords.latitude,
        loc.coords.longitude,
        allowedLocation.latitude,
        allowedLocation.longitude
      );

      // ❌ If outside radius
      if (distance > allowedLocation.radius) {
        await sendEmail(false, `Outside allowed radius (${Math.round(distance)}m)`);
        setLoading(false);
        return Alert.alert("Error", "You must be inside the site location to check-in/out.");
      }

      // ✅ Inside location → do check-in/out
      if (!isCheckedIn) {
        // ✅ Do Check-In
        setIsCheckedIn(true);
        const time = new Date().toLocaleTimeString();
        setCheckInTime(time);
        Alert.alert("Success", "Checked in successfully");
        await sendEmail(true, `Checked in at ${time}`);
      } else {
        // ✅ Do Check-Out
        setIsCheckedIn(false);
        const time = new Date().toLocaleTimeString();
        setCheckOutTime(time);
        Alert.alert("Success", "Checked out successfully");
        await sendEmail(true, `Checked out at ${time}`);
      }
    } catch (err) {
      console.error("❌ Error during check-in/out:", err);
      await sendEmail(false, "Exception occurred");
      Alert.alert("Error", "Something went wrong during check-in/out.");
    } finally {
      setLoading(false);
    }
  }

  // 📏 Calculate distance between two points
  function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // 📧 Send email notification
  async function sendEmail(success: boolean, details: string) {
    const username = user?.displayName || user?.email || "Unknown User";
    const statusText = success ? "successfully" : "unsuccessfully";
    const subject = `Check-In Status: ${success ? "Success" : "Failed"}`;
    const html = `
      <h2>Check-In Status Update</h2>
      <p><strong>${username}</strong> has ${statusText} checked in at the location.</p>
      <p><strong>Details:</strong> ${details}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    `;

    try {
      const mailRes = await fetch(
        "https://sendemailapi-seven.vercel.app/api/send-completion-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "ganeshwebby@gmail.com", // 📤 change this to your target email
            subject,
            html,
          }),
        }
      );

      if (!mailRes.ok) {
        console.warn("⚠️ Email API response not OK");
      } else {
        console.log("📧 Email sent successfully");
      }
    } catch (err) {
      console.error("❌ Failed to send email:", err);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>DLR Reports</Text>

      {checkInTime && <Text>Check-In: {checkInTime}</Text>}
      {checkOutTime && <Text>Check-Out: {checkOutTime}</Text>}

      <Pressable
        style={[styles.button, isCheckedIn ? styles.checkout : styles.checkin]}
        onPress={handleCheckInOut}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>{isCheckedIn ? "Check Out" : "Check In"}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  text: { fontSize: 20, marginBottom: 20 },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 120,
    marginTop: 20,
  },
  checkin: { backgroundColor: "#34C759" },
  checkout: { backgroundColor: "#FF3B30" },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "600", fontFamily: "BeVietnamPro-Bold" },
  blurBox: {
    padding: 20,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
