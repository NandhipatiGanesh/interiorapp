// File: app/(tabs)/completed.tsx
import { app } from "@/firebaseConfig";
import { useAuth } from "@/hooks/useAuth";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CompletedProject = {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  email: string;
  completedAt: Date;
};

export default function CompletedScreen() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<CompletedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        if (!user?.uid) return;
        const q = query(
          collection(db, "completedProjects"),
          where("userId", "==", user.uid)
        );
        const snap = await getDocs(q);

        const list: CompletedProject[] = snap.docs.map((doc) => ({
          id: doc.id,
          projectId: doc.data().projectId,
          projectName: doc.data().projectName,
          name: doc.data().name,
          email: doc.data().email,
          completedAt: doc.data().completedAt?.toDate?.() ?? new Date(),
        }));

        setProjects(list);
      } catch (err) {
        console.error("Error fetching completed projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (projects.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{fontFamily: "BeVietnamPro-Medium"}}>No completed projects yet.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "bottom"]}>
    <FlatList
      data={projects}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.projectName}</Text>
          <Text style={styles.subText}>By: {item.name}</Text>
          <Text style={styles.subText}>Email: {item.email}</Text>
          <Text style={styles.subText}>
            Completed: {item.completedAt.toLocaleDateString()}
          </Text>
        </View>
      )}
      contentContainerStyle={{ padding: 16 }}
     
    />
     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#f7f7f7",
  },
  title: { fontSize: 16, fontFamily: "BeVietnamPro-Medium", marginBottom: 12 },
  subText: { fontSize: 14, color: "#000000ff", marginTop: 4,  fontFamily: "BeVietnamPro-Medium",  marginBottom: 6 },
});
