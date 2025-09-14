//file: app/project/[id].tsx
/**
 * Data Structures for project whole functionality of the app
 *here step changed like this way
 * intially project name will display   consider as project id page with title name will display in  index page
 *  after clicking on index page project name it will navigate to project id page
 * there project  sub checks  will display like  checks [] array items  
 * for each check user will upload photos user will  review the each photo and submit the project 
 *      inside the each quality check like   photo with two options  1. fail(design failed)  2. pass(design passed)
 * after submitting the project  project will be marked as completed true ( after clicking on submit button a form will open ask for  enter email id and name    after entering  project status will go to mail  to the entered email id )
 * after completing the project  it will display in completed project page
 */ 
// file: app/project/[id].tsx
// file: app/project/[id].tsx
import { Check, projects } from "@/constants/projects";
import { useAuth } from "@/hooks/useAuth";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import {
  Alert,
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Enable animation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  // @ts-ignore
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type PhotoReview = {
  id?: number; // WP attachment ID
  url: string;
  status: "pass" | "fail" | null;
};

declare module "expo-file-system" {
  export const cacheDirectory: string;
}
export default function ProjectDetail() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const project = projects.find((p) => p.id === id);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploadingCheckId, setUploadingCheckId] = useState<string | null>(null);

  const [checks, setChecks] = useState<Check[]>(() => {
    if (!project) return [];
    return project.checks.map((c) => ({
      ...c,
      photos: (c.photos as any[] | undefined)?.map((p) =>
        typeof p === "string"
          ? { url: p, status: null }
          : { id: p?.id, url: String(p?.url ?? ""), status: p?.status ?? null }
      ) ?? [],
    }));
  });

  if (!project) {
    return (
      <View>
        <Text>Project not found</Text>
      </View>
    );
  }

  // -----------------------------
  // Fetch images from WP Media
  // -----------------------------
  const fetchImages = async () => {
    try {
      const response = await fetch("https://elementortemplates.in/wp-json/wp/v2/media");
      const media = await response.json();

      const projectImages =
        (media || [])
          .filter(
            (m: any) =>
              m &&
              m.media_type === "image" &&
              m.source_url &&
              m.title?.rendered?.startsWith(project.id)
          )
          .map((m: any) => ({
            id: m.id,
            url: String(m.source_url),
            title: String(m.title.rendered),
          })) ?? [];

      const updatedChecks = project.checks.map((check) => {
        const checkImages = projectImages
          .filter((img: any) => img.title.includes(check.id))
          .map((img : any) => ({ id: img.id, url: img.url, status: null }));

        const existingPhotos =
          (check.photos as any[] | undefined)?.map((p) =>
            typeof p === "string"
              ? { url: p, status: null }
              : { id: p?.id, url: String(p?.url ?? ""), status: p?.status ?? null }
          ) ?? [];

        const mergedUrls = [
          ...existingPhotos.map((p) => p.url),
          ...checkImages.map((p: any) => p.url).filter((u: any) => !existingPhotos.some((ep) => ep.url === u)),
        ];

        const mergedPhotos: PhotoReview[] = mergedUrls.map((u) => {
          const match = [...existingPhotos, ...checkImages].find((p) => p.url === u);
          return { id: match?.id, url: u, status: match?.status ?? null };
        });

        return {
          ...check,
          photos: mergedPhotos,
          completed: mergedPhotos.length > 0,
        };
      });

      setChecks(updatedChecks);
    } catch (err) {
      console.error("Fetch images error:", err);
    }
  };

  // -----------------------------
  // Fetch review statuses from DB
  // -----------------------------
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `https://elementortemplates.in/wp-json/custom-api/v1/reviews?project_id=${project.id}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setChecks((prev) =>
          prev.map((check) => ({
            ...check,
            photos: check.photos.map((p: PhotoReview) => {
              const dbReview = data.find(
                (r: any) => r.image_url === p.url && r.check_id === check.id
              );
              return dbReview
                ? {
                    ...p,
                    id: Number(dbReview.image_id) || p.id,
                    status: dbReview.status as "pass" | "fail",
                  }
                : p;
            }),
          }))
        );
      }
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  };

  // -----------------------------
  // Save pass/fail to DB
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
              photos: check.photos.map((photo: PhotoReview) =>
                photo.url === photoUrl ? { ...photo, status } : photo
              ),
            }
          : check
      )
    );

    try {
      const check = checks.find((c) => c.id === checkId);
      if (!check) return;

      const photo = check.photos.find((p: PhotoReview) => p.url === photoUrl);

      await fetch("https://elementortemplates.in/wp-json/custom-api/v1/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project.id,
          check_id: check.id,
          check_label: check.label,
          image_id: photo?.id ?? 0,
          image_url: photoUrl,
          status,
        }),
      });
    } catch (err) {
      console.error("Save review error:", err);
    }
  };

  // -----------------------------
  // Upload image
  // -----------------------------
  const uploadImage = async (checkId: string) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Media library permission is needed to upload images.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
      });

      if (result.canceled) return;
      const asset = result.assets[0];
      let fileUri = asset.uri;

      setUploadingCheckId(checkId);

      if (fileUri.startsWith("ph://")) {
        const newUri = FileSystem.cacheDirectory + `${Date.now()}.jpg`;
        await FileSystem.copyAsync({ from: fileUri, to: newUri });
        fileUri = newUri;
      }

      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        name: `${project.id}_${checkId}_${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);

      const response = await fetch(
        "https://elementortemplates.in/wp-json/custom-api/v1/upload",
        { method: "POST", body: formData }
      );

      const data = await response.json();

      if (data?.url) {
        setChecks((prev) =>
          prev.map((check) =>
            check.id === checkId
              ? {
                  ...check,
                  completed: true,
                  photos: [
                    ...check.photos,
                    {
                      id: data.id,
                      url: String(data.url),
                      status: null,
                    }
                    
                
                  ],
                }
              : check
          )
        );
      }

      setUploadingCheckId(null);
      Alert.alert("Upload successful");
    } catch (err: any) {
      setUploadingCheckId(null);
      Alert.alert("Upload Error", err?.message ?? "Something went wrong");
    }
  };

  // -----------------------------
  // Accordion toggle
  // -----------------------------
  const toggleAccordion = (checkId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === checkId ? null : checkId);
  };

  // -----------------------------
  // Initial load
  // -----------------------------
  useEffect(() => {
    const load = async () => {
      await fetchImages();
      await fetchReviews();
    };
    load();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push("/"); // 👈 fallback if no history
            }
          }}
          style={{ marginRight: 12 }}
        >
          <Feather name="arrow-left" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>{project.title}</Text>
      </View>

      <Text style={styles.description}>{project.description}</Text>
      <Text style={styles.subTitle}>Progress:</Text>

      <FlatList
        data={checks}
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
                <View style={styles.accordionContent}>
                  {item.photos.length === 0 ? (
                    uploadingCheckId === item.id ? (
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <ActivityIndicator size="small" color="#007AFF" />
                        <Text style={{ marginLeft: 6 }}>Uploading...</Text>
                      </View>
                    ) : (
                      <Pressable
                        style={styles.uploadButton}
                        onPress={() => uploadImage(item.id)}
                      >
                        <Text style={styles.uploadText}>Upload Photos</Text>
                      </Pressable>
                    )
                  ) : (
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {item.photos.map((photo, idx) => (
                        <View key={`${item.id}-${idx}`} style={{ margin: 4 }}>
                          <Image
                            source={{ uri: photo.url }}
                            style={{ width: 40, height: 40, borderRadius: 6 }}
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
                              <MaterialIcons name="check" size={10} color="#fff" />
                            </Pressable>
                            <Pressable
                              style={{
                                padding: 4,
                                backgroundColor: photo.status === "fail" ? "red" : "#ddd",
                                borderRadius: 4,
                              }}
                              onPress={() => updatePhotoStatus(item.id, photo.url, "fail")}
                            >
                              <MaterialIcons name="close" size={10} color="#fff" />
                            </Pressable>
                          </View>
                        </View>
                      ))}

                      <Pressable
                        style={{
                          width: 40,
                          height: 40,
                          borderWidth: 1,
                          borderColor: "#007AFF",
                          borderRadius: 6,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => uploadImage(item.id)}
                      >
                        <Feather name="plus" size={20} color="#007AFF" />
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
      <View>
       <Text>
         {user
           ? user.displayName || user.email?.split("@")[0] || "User"
           : "Guest"}
       </Text>
     </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    paddingBottom: 6,
  },
  backButton: {
    padding: 6,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: 'BeVietnamPro-Medium',
  },
  description: {
    marginBottom: 8,
    color: "#000000ff",
    fontFamily: 'BeVietnamPro-Medium',
  },
  subTitle: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8,
    fontFamily: 'BeVietnamPro-Medium',
  },
  checkCard: {
    backgroundColor: "#fff",
    borderColor: "#f7f7f7",
    borderWidth: 2,
     shadowColor: "#000",
    padding: 12,
    marginBottom: 10,
    borderRadius:22,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  checkItem: {
    marginLeft: 10,
    fontSize: 15,
     fontFamily: 'BeVietnamPro-Medium',
  },
  accordionContent: {
    marginTop: 12,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#0d00ffe6",
    borderRadius: 160,
    alignSelf: "flex-start",
    fontFamily: 'BeVietnamPro-Medium',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10,

  },
  uploadText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14, 
    fontFamily: 'BeVietnamPro-Medium',
  },
  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  photoContainer: {
    width: 120,
    marginRight: 12,
  },
  photoThumb: {
    width: 120,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  actionButton: {
    padding: 6,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: "#888",
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    marginLeft: 6,
  },
  passSelected: {
    backgroundColor: "green",
  },
  failSelected: {
    backgroundColor: "red",
  },
  addMore: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f0ff",
  },
  error: {
    color: "red",
  },
});
