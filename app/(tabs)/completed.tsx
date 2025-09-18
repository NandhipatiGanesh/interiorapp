// File: app/(tabs)/completed.tsx
import { app } from "@/firebaseConfig";
import { useAuth } from "@/hooks/useAuth";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WP_COMPLETED_URL = "https://elementortemplates.in/wp-json/myapp/v1/completed-projects";

type CompletedProject = {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  email: string;
  completedAt: Date;
  source: "firestore" | "wordpress";
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

        // ---- Fetch from Firestore ----
        const q = query(
          collection(db, "completedProjects"),
          where("userId", "==", user.uid)
        );
        const snap = await getDocs(q);

        const firestoreProjects: CompletedProject[] = snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            projectId: data.projectId,
            projectName: data.projectName,
            name: data.name,
            email: data.email,
            completedAt: data.completedAt?.toDate?.() ?? new Date(data.completedAt) ?? new Date(),
            source: "firestore",
          };
        });

        // ---- Fetch from WordPress ----
        const wpRes = await fetch(`${WP_COMPLETED_URL}/${user.uid}`);
        const wpData = await wpRes.json();

        const wpProjects: CompletedProject[] = wpData.map((item: any) => ({
          id: String(item.id),
          projectId: item.project_id,
          projectName: item.project_name,
          name: item.name,
          email: item.email,
          completedAt: new Date(item.completed_at),
          source: "wordpress",
        }));

        // ---- Merge both ----
        const combined = [...firestoreProjects, ...wpProjects];

        // Sort by date (newest first)
        combined.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());

        setProjects(combined);
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
        <Text style={{ fontFamily: "BeVietnamPro-Medium" }}>No completed projects yet.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "bottom"]}>
      <FlatList
        data={projects}
        keyExtractor={(item) => `${item.source}-${item.id}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.projectName}</Text>
            <Text style={styles.subText}>By: {item.name}</Text>
            <Text style={styles.subText}>Email: {item.email}</Text>
            <Text style={styles.subText}>
              Completed on:{" "}
              {item.completedAt.toLocaleDateString()} at{" "}
              {item.completedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
            <Text style={[styles.subText, { fontStyle: "italic", color: "#555" }]}>
              Source: {item.source}
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
  subText: {
    fontSize: 14,
    color: "#000000ff",
    marginTop: 4,
    fontFamily: "BeVietnamPro-Medium",
    marginBottom: 6,
  },
});
