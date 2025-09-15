
// file: app/project/[id].tsx
/**
 * Project Detail Screen
 * Flow:
 * - User selects a project
 * - Project has multiple checks (sub tasks)
 * - Each check can have photos
 * - User uploads photo(s) for each check
 * - Each photo can be marked pass/fail
 * - Status is stored in Firestore (no WordPress dependency)
 *  - also i need like  if an all checks are completed i mean photos added for all checks then only show project as completed
 * - a button will show like mark as completed if all checks are done
 * - then after clicking on  completed button  need to send mail( using resend mailer) to the admin with a form  just name and email and project name
 * -  details  will be sent to the  client mail from the form 
 * - user can see the  completed project in the completed section ( it is in  ((tabs))/completed.tsx file) 
 * - so the current user  completed projects need to be shown in the completed section  so we need store the process  in the firestore   to use where we want
 * 
 * Note: This is a simplified example. In a real app, you'd handle errors,
 * loading states, and possibly use Firebase Storage for images.
 */
import { Check, projects } from "@/constants/projects";
import { app } from "@/firebaseConfig";
import { useAuth } from "@/hooks/useAuth";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Enable animation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  // @ts-ignore
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const db = getFirestore(app);
const functions = getFunctions(app);

type PhotoReview = {
  id?: string;
  url: string;
  status: "pass" | "fail" | null;
};

export default function ProjectDetail() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const project = projects.find((p) => p.id === id);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploadingCheckId, setUploadingCheckId] = useState<string | null>(null);
  const [checks, setChecks] = useState<Check[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");

  useEffect(() => {
    if (!project) return;
    setChecks(project.checks.map((c) => ({ ...c, photos: [] })));
    fetchReviews();
  }, []);

  if (!project) {
    return (
      <View>
        <Text>Project not found</Text>
      </View>
    );
  }

  // -----------------------------
  // Fetch reviews from Firestore
  // -----------------------------
  const fetchReviews = async () => {
    const q = query(
      collection(db, "reviews"),
      where("projectId", "==", project.id)
    );
    const snap = await getDocs(q);
    const reviews = snap.docs.map((doc) => doc.data());

    setChecks((prev) =>
      prev.map((check) => ({
        ...check,
        photos: reviews
          .filter((r: any) => r.checkId === check.id)
          .map((r: any) => ({
            id: r.id,
            url: r.localUri,
            status: r.status,
          })),
        completed: reviews.some((r: any) => r.checkId === check.id),
      }))
    );
  };

  // -----------------------------
  // Update status
  // -----------------------------
  const updatePhotoStatus = async (
    checkId: string,
    photoUrl: string,
    status: "pass" | "fail"
  ) => {
    setChecks((prev) =>
      prev.map((check) =>
        check.id === checkId
          ? {
              ...check,
              photos: check.photos.map((photo) =>
                photo.url === photoUrl ? { ...photo, status } : photo
              ),
            }
          : check
      )
    );

    const q = query(
      collection(db, "reviews"),
      where("projectId", "==", project.id),
      where("checkId", "==", checkId),
      where("localUri", "==", photoUrl)
    );

    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(snap.docs[0].ref, { status });
    } else {
      await addDoc(collection(db, "reviews"), {
        projectId: project.id,
        checkId,
        localUri: photoUrl,
        status,
        createdAt: new Date(),
      });
    }
  };

  // -----------------------------
  // Upload photo
  // -----------------------------
  const uploadImage = async (checkId: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
      });
      if (result.canceled) return;
      const asset = result.assets[0];

      setUploadingCheckId(checkId);
      await addDoc(collection(db, "reviews"), {
        projectId: project.id,
        checkId,
        localUri: asset.uri,
        status: null,
        createdAt: new Date(),
      });

      setChecks((prev) =>
        prev.map((check) =>
          check.id === checkId
            ? {
                ...check,
                completed: true,
                photos: [...check.photos, { url: asset.uri, status: null }],
              }
            : check
        )
      );
      setUploadingCheckId(null);
    } catch (err: any) {
      setUploadingCheckId(null);
      Alert.alert("Error", err?.message ?? "Something went wrong");
    }
  };

  // -----------------------------
  // Mark Project as Completed
  // -----------------------------
  const handleCompleteProject = async () => {
    if (!formName || !formEmail) {
      Alert.alert("Error", "Please fill in name and email");
      return;
    }

    try {
      // Save to Firestore
      await addDoc(collection(db, "completedProjects"), {
        projectId: project.id,
        projectName: project.title,
        userId: user?.uid ?? "guest",
        name: formName,
        email: formEmail,
        completedAt: new Date(),
      });

      // Trigger Resend via Firebase Function
      const sendEmail = httpsCallable(functions, "sendCompletionEmail");
      await sendEmail({
        name: formName,
        email: formEmail,
        projectName: project.title,
      });

      setShowDrawer(false);
      Alert.alert("Success", "Project marked as completed and email sent");
      router.push("/(tabs)/completed");
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to complete project");
    }
  };

  // -----------------------------
  // Accordion toggle
  // -----------------------------
  const toggleAccordion = (checkId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === checkId ? null : checkId);
  };

  const allChecksCompleted = checks.every((c) => c.photos.length > 0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.push("/"))}
          style={{ marginRight: 12 }}
        >
          <Feather name="arrow-left" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>{project.title}</Text>
      </View>

      {/* description */}
      <Text style={styles.description}>{project.description}</Text>

      {/* checks */}
      <FlatList
        data={checks}
        extraData={checks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
          return (
            <View style={styles.checkCard}>
              <Pressable
                style={styles.checkRow}
                onPress={() => toggleAccordion(item.id)}
              >
                <MaterialIcons
                  name={item.completed ? "check-circle" : "cancel"}
                  size={18}
                  color={item.completed ? "green" : "red"}
                />
                <Text style={styles.checkItem}>{item.label}</Text>
                <MaterialIcons
                  name={isExpanded ? "expand-less" : "expand-more"}
                  size={18}
                  style={{ marginLeft: "auto" }}
                />
              </Pressable>

              {isExpanded && (
                <View>
                  {item.photos.length === 0 ? (
                    uploadingCheckId === item.id ? (
                      <ActivityIndicator size="small" color="#007AFF" />
                    ) : (
                      <Pressable style={styles.uploadButton} onPress={() => uploadImage(item.id)}>
                        <Text style={styles.uploadText}>Upload Photos</Text>
                      </Pressable>
                    )
                  ) : (
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {item.photos.map((photo, idx) => (
                        <View key={`${item.id}-${idx}`} style={{ margin: 4 }}>
                          <Image
                            source={{ uri: photo.url }}
                            style={{ width: 40, height: 40 }}
                          />
                          <View style={{ flexDirection: "row", marginTop: 4 }}>
                           <Pressable
                             style={{
                               padding: 4,
                               backgroundColor: photo.status === "pass" ? "green" : "#ddd",
                               borderRadius: 4,
                               marginRight: 4,
                             }}
                             onPress={() => updatePhotoStatus(item.id, photo.url, "pass")}
                           >
                             <MaterialIcons name="check" size={12} color="#fff" />
                           </Pressable>
                           <Pressable
                             style={{
                               padding: 4,
                               backgroundColor: photo.status === "fail" ? "red" : "#ddd",
                               borderRadius: 4,
                             }}
                             onPress={() => updatePhotoStatus(item.id, photo.url, "fail")}
                           >
                             <MaterialIcons name="close" size={12} color="#fff" />
                           </Pressable>
                         </View>

                        </View>
                      ))}
                      <Pressable style={styles.uploadPlus} onPress={() => uploadImage(item.id)}>
                        <Feather name="plus" size={20} color="#007AFF" />
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        }}
      />

      {/* Complete project button */}
      {allChecksCompleted && (
        <Pressable style={styles.uploadButton} onPress={() => setShowDrawer(true)}>
          <Text style={styles.uploadText}>Mark as Completed</Text>
        </Pressable>
      )}

      {/* Bottom drawer form */}
      <Modal
        animationType="slide"
        transparent
        visible={showDrawer}
        onRequestClose={() => setShowDrawer(false)}
        style={styles.Modeldrawer}
      >
        <View style={styles.drawer}>
          <Text style={styles.completText}>Complete Project</Text>
          <TextInput
           style={styles.input} 
            placeholder="Name"
            value={formName}
            onChangeText={setFormName}
          />
          <TextInput
          style={styles.input}  
            placeholder="Email"
            value={formEmail}
            onChangeText={setFormEmail}
          />
          <Pressable style={styles. uploadButton} onPress={handleCompleteProject}>
            <Text style={styles.uploadText}>Submit</Text>
          </Pressable>
          <Pressable style={styles. CancelButton} onPress={() => setShowDrawer(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "BeVietnamPro-Medium",
  },
  description: {
    marginBottom: 8,
    color: "#000000ff",
    fontFamily: "BeVietnamPro-Medium",
  },
  subTitle: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8,
    fontFamily: "BeVietnamPro-Medium",
  },
  checkCard: {
    backgroundColor: "#fff",
    borderColor: "#f7f7f7",
    borderWidth: 2,
    shadowColor: "#000",
    padding: 12,
    marginBottom: 10,
    borderRadius: 22,
  },
  checkRow: { flexDirection: "row", alignItems: "center", paddingVertical: 4 },
  checkItem: { marginLeft: 10, fontSize: 15, fontFamily: "BeVietnamPro-Medium" },
  accordionContent: { marginTop: 12 },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#0d00ffe6",
    borderRadius: 160,
    alignSelf: "flex-start",
    width: "100%",
    justifyContent: "center",
    marginTop: 10,
  },
  uploadText: {
    color: "#ffffffff",
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "BeVietnamPro-Medium",
  },
  cancelText: {
    color: "#000000e6",
    fontSize: 14,
    fontFamily: "BeVietnamPro-Medium",
  },
  drawer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f7f7f7",
    padding: 20,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
     transitionProperty: "transform",
  transitionDuration: "300ms",
  transitionTimingFunction: "ease-in-out",
  },
  uploadPlus: {
    width: 40,
    height: 40, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF", 
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
  },
  CancelButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderColor: "#000000e6",
    borderWidth: 1,
    borderRadius: 160,
    alignSelf: "flex-start",
    width: "100%",
    justifyContent: "center",
    marginTop: 10,
  },
  
   input: {
    borderWidth: 2,
    borderColor: "#ffffffff",
    height: 50,
    paddingLeft: 15,
    marginBottom: 15,
    borderRadius: 18,
    fontSize: 14,
    width: "100%",
    fontFamily: "BeVietnamPro-Regular",
  },
  Modeldrawer: {
    backgroundColor  :'#f7f7f7',
    flex:1,
    justifyContent:'flex-end',
    alignItems:'center',
    width: '100%',
    height: '100%',
    padding:10,
    borderTopEndRadius:20,
    borderTopStartRadius:20,
    borderTopColor:'#00000020', borderTopWidth:2
  },
  completText : { fontSize: 18, fontWeight: "500", marginBottom: 22, fontFamily: "BeVietnamPro-Medium" },
});
