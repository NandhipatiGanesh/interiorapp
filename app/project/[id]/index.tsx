
// file: C:\Users\ganes\raghunewapp\app\project\[id]\index.tsx
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
import {
  addPhotosToCheck,
  Check,
  checkAndNotifyMainCheckCompletion,
  getProjectById,
  Project
} from "@/constants/projects";
import { useAuth } from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert, Animated,
  Dimensions, Image, Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text, TextInput, View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const project = id ? getProjectById(id) : null;
  const { user } = useAuth(); 
  // path holds breadcrumb → can contain Project or Check
  const [path, setPath] = useState<(Project | Check)[]>([]);
  const { height: screenHeight } = Dimensions.get('window');
  const headerHeight = 80;
  const availableHeight = screenHeight - headerHeight;

  // Modal states
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [passedCheckIds, setPassedCheckIds] = useState<string[]>([]);
  

  // Form states
  const [currentStep, setCurrentStep] = useState<'upload' | 'review' | 'form'>('upload');
  const [selectedStatus, setSelectedStatus] = useState<'pass' | 'fail' | null>(null);
  
  // Form fields
  const [reasonForFailure, setReasonForFailure] = useState('');
  const [showReasonField, setShowReasonField] = useState(false);
  const [processMiss, setProcessMiss] = useState(false);
  const [technicalMiss, setTechnicalMiss] = useState(false);
  const [correctiveMeasures, setCorrectiveMeasures] = useState('');
  const [showCorrectiveField, setShowCorrectiveField] = useState(false);
  const [uploadedImageUri, setUploadedImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (project) {
      setPath([project]); // reset to root
    }
  }, [project?.id]);

  if (!project) {
    return (
      <View style={styles.center}>
        <Text>Project not found</Text>
      </View>
    );
  }
  // Convert URI → Blob for Web
async function uriToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  return await response.blob();
}

const WP_UPLOAD_URL = "https://elementortemplates.in/wp-json/myapp/v1/upload-image";

 const uploadImage = async (projectId: string, checkId: string, userId: string) => {
  try {
    // 1. Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (result.canceled) return null;
    const asset = result.assets[0];

    // 2. Prepare formData
    const formData = new FormData();

    if (Platform.OS === "web") {
      const blob = await uriToBlob(asset.uri);
      formData.append("image", blob, "upload.jpg");
    } else {
      formData.append("image", {
        uri: asset.uri,
        type: "image/jpeg",
        name: "upload.jpg",
      } as any);
    }

    formData.append("user_id", userId ?? "guest");
    formData.append("project_id", projectId);
    formData.append("check_id", checkId);
    formData.append("status", "pending");

    // 3. Upload to WP
    const response = await fetch(WP_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Upload result:", data);

    if (!data.success) {
      Alert.alert("Upload failed", data.error || "Unknown error");
      return null;
    }

    // ✅ Return the WP Media Library URL
    return data.image_url;
  } catch (err: any) {
    Alert.alert("Error", err.message || "Upload failed");
    return null;
  }
};
  // Current project/check node
const current = path[path.length - 1] || project;
const currentCheck = (current as Check | Project) as Check;

// Child checks if not at final level
const children = "checks" in current
  ? current.checks
  : "subChecks" in current
  ? current.subChecks || []
  : [];

const isFinalLevel = children.length === 0;


  const goDeeper = (item: Check) => {
    setPath((prev) => [...prev, item]);
  };

  const goBack = () => {
    if (path.length > 1) {
      setPath((prev) => prev.slice(0, -1));
    } else {
      router.back();
    }
  };

// ------------------
// Open Modal
// ------------------
const openModal = (uri?: string) => {
  if (uri) setUploadedImageUri(uri);
  setModalVisible(true);
  setCurrentStep("review");



 
};


const pickImageAndOpen = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return; // user cancelled
    const uri = result.assets[0].uri;
    setUploadedImageUri(uri);
    openModal(uri);
  } catch (err) {
    console.warn("Image pick error", err);
  }
};

// ------------------
// Close Modal
// ------------------
const closeModal = () => {
  setModalVisible(false);
  resetForm();
};


  const resetForm = () => {
    setCurrentStep('upload');
    setSelectedStatus(null);
    setReasonForFailure('');
    setShowReasonField(false);
    setProcessMiss(false);
    setTechnicalMiss(false);
    setCorrectiveMeasures('');
    setShowCorrectiveField(false);
    setPhotoUploaded(false);
    setUploadedImageUri(null);
  };

  const handlePassFail = (status: 'pass' | 'fail') => {
    setSelectedStatus(status);
    if (status === 'pass') {
      // For pass, submit immediately
      submitForm(status);
    } else {
      // For fail, show form
      setCurrentStep('form');
    }
  };

  const submitForm = (status: 'pass' | 'fail') => {
    // Get current check for photo submission
    const currentCheck = current as Check;
    
    // Simulate adding photo and reviewing it
    const photoUrls = ['dummy-photo-url']; // In real app, this would be the uploaded image
    
    // Add photo to check (you'll need to implement this)
    // addPhotosToCheck(project.id, currentCheck.id, photoUrls);
    
    // Review the photo with form data
    const formData = status === 'fail' ? {
      reasonForFailure: reasonForFailure || undefined,
      processMiss,
      technicalMiss,
      correctiveMeasure: correctiveMeasures || undefined,
    } : {};
    
    // reviewPhoto(project.id, currentCheck.id, 0, status, formData);
    
    console.log('Form submitted:', {
      status,
      checkId: currentCheck.id,
      formData: status === 'fail' ? formData : {}
    });

    Alert.alert(
      'Success',
      `Check marked as ${status.toUpperCase()}${status === 'fail' ? ' with details' : ''}`,
      [{ text: 'OK', onPress: closeModal }]
    );
  };
 //breadcrumb helper 
  const getBreadcrumb = (path: (Project | Check)[]) =>
  path.map((p) => ("title" in p ? p.title : p.label)).join(" > ");
  //last api call for submission
//    const submitProjectCheck = async (
//   status: "pass" | "fail",
//   formData?: {
//     reasonForFailure?: string;
//     processMiss?: boolean;
//     technicalMiss?: boolean;
//     correctiveMeasure?: string;
//   }
// ) => {
//   setIsSubmitting(true);
//   setIsSuccess(false);
//   setIsError(false);

//   const userId = user?.uid ?? "guest";
//   const username = user?.displayName ?? "Anonymous";
//   const breadcrumb = getBreadcrumb(path);
//   const now = new Date().toLocaleString();

//   try {
//     // 1. Save to DB
//     const dbRes = await fetch("https://elementortemplates.in/wp-json/myapp/v1/check-result", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         user_id: userId,
//         username,
//         project_id: project.id,
//         breadcrumb,
//         check_name: currentCheck.label,
//         status,
//         image_url: uploadedImageUri,
//         reason_for_failure: formData?.reasonForFailure,
//         process_miss: formData?.processMiss,
//         technical_miss: formData?.technicalMiss,
//         corrective_measure: formData?.correctiveMeasure,
//       }),
//     });

//     if (!dbRes.ok) throw new Error("DB save failed");

//     // 2. Send email
//     const subject = `Quality Check - ${currentCheck.label} (${status.toUpperCase()}) | ${now}`;
//     const html = `
//       <h2>${breadcrumb}</h2>
//       <p><strong>Status:</strong> ${status.toUpperCase()}</p>
//       ${uploadedImageUri ? `<p><img src="${uploadedImageUri}" style="max-width:100%"/></p>` : ""}
//       ${
//         status === "fail"
//           ? `<h3>Failure Details</h3>
//              <p><strong>Reason:</strong> ${formData?.reasonForFailure ?? "N/A"}</p>
//              <p><strong>Process Miss:</strong> ${formData?.processMiss ? "Yes" : "No"}</p>
//              <p><strong>Technical Miss:</strong> ${formData?.technicalMiss ? "Yes" : "No"}</p>
//              <p><strong>Corrective Measure:</strong> ${formData?.correctiveMeasure ?? "N/A"}</p>`
//           : `<h3>Result</h3><p>This quality check is done ✅</p>`
//       }
//     `;

//     const mailRes = await fetch("https://sendemailapi-seven.vercel.app/api/send-completion-email", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email: "ganeshwebby@gmail.com", subject, html }),
//     });

//     if (!mailRes.ok) throw new Error("Email failed");

//     setIsSuccess(true);
//      if (status === "pass") {
//       setPassedCheckIds(prev => [...prev, currentCheck.id]);
//     }
//     setTimeout(() => {
//       setIsSuccess(false);
//       setUploadedImageUri(null); // reset image
//       closeModal();
//     }, 1500);
//   } catch (err) {
//     console.error("Error:", err);
//     setIsError(true);
//   } finally {
//     setIsSubmitting(false);
//   }
// };

const submitProjectCheck = async (
  status: "pass" | "fail",
  formData?: {
    reasonForFailure?: string;
    processMiss?: boolean;
    technicalMiss?: boolean;
    correctiveMeasure?: string;
  }
) => {
  setIsSubmitting(true);
  setIsSuccess(false);
  setIsError(false);

  const userId = user?.uid ?? "guest";
  const username = user?.displayName ?? "Anonymous";
  const breadcrumb = getBreadcrumb(path);
  const now = new Date().toLocaleString();

  try {
    // 1. Save to DB
    const dbRes = await fetch("https://elementortemplates.in/wp-json/myapp/v1/check-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        username,
        project_id: project.id,
        breadcrumb,
        check_name: currentCheck.label,
        status,
        image_url: uploadedImageUri,
        reason_for_failure: formData?.reasonForFailure,
        process_miss: formData?.processMiss,
        technical_miss: formData?.technicalMiss,
        corrective_measure: formData?.correctiveMeasure,
      }),
    });

    if (!dbRes.ok) throw new Error("DB save failed");

    // ✨✨✨ NEW CODE: Mark check as completed locally ✨✨✨
    if (uploadedImageUri) {
      const added = addPhotosToCheck(project.id, currentCheck.id, [uploadedImageUri]);
      console.log("✅ Check marked as completed:", currentCheck.id, "Success:", added);
    }

    // 2. Send email for individual check
    const subject = `Quality Check - ${currentCheck.label} (${status.toUpperCase()}) | ${now}`;
    const html = `
      <h2>${breadcrumb}</h2>
      <p><strong>Status:</strong> ${status.toUpperCase()}</p>
      ${uploadedImageUri ? `<p><img src="${uploadedImageUri}" style="max-width:100%"/></p>` : ""}
      ${
        status === "fail"
          ? `<h3>Failure Details</h3>
             <p><strong>Reason:</strong> ${formData?.reasonForFailure ?? "N/A"}</p>
             <p><strong>Process Miss:</strong> ${formData?.processMiss ? "Yes" : "No"}</p>
             <p><strong>Technical Miss:</strong> ${formData?.technicalMiss ? "Yes" : "No"}</p>
             <p><strong>Corrective Measure:</strong> ${formData?.correctiveMeasure ?? "N/A"}</p>`
          : `<h3>Result</h3><p>This quality check is done ✅</p>`
      }
    `;

    const mailRes = await fetch("https://sendemailapi-seven.vercel.app/api/send-completion-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "ganeshwebby@gmail.com", subject, html }),
    });

    if (!mailRes.ok) throw new Error("Email failed");

    console.log("✅ Individual check email sent");

    // ✨✨✨ NEW CODE: Check if main check is complete ✨✨✨
    console.log("🔍 Checking if main check is complete...");
    await checkAndNotifyMainCheckCompletion(
      project.id, 
      currentCheck.id, 
      username
    );

    setIsSuccess(true);
    if (status === "pass") {
      setPassedCheckIds(prev => [...prev, currentCheck.id]);
    }
    
    setTimeout(() => {
      setIsSuccess(false);
      setUploadedImageUri(null);
      closeModal();
    }, 1500);
  } catch (err) {
    console.error("❌ Error:", err);
    setIsError(true);
  } finally {
    setIsSubmitting(false);
  }
};






  const renderModalContent = () => {
  switch (currentStep) {
    // fallback: if somehow we're at upload, let user pick here too
    case "upload":
      return (
        <View style={{ padding: 20 }}>
          <Text style={styles.modalTitle}>{(current as Check).label}</Text>
          <Pressable
            style={styles.uploadButton}
            onPress={pickImageAndOpen}
          >
            <Feather name="camera" size={20} color="#fff" />
            <Text style={styles.uploadText}>Select Photo</Text>
          </Pressable>
        </View>
      );

    // REVIEW: show uploaded image preview + Pass / Fail buttons
    case "review":
      return (
        <View style={{ padding: 20 }}>
          <Text style={styles.modalTitle}>{(current as Check).label}</Text>

          {uploadedImageUri ? (
               <Image source={{ uri: uploadedImageUri }} style={{ width: "100%", height: 200, borderRadius: 12 }} />
             ) : (
               <Text style={{ textAlign: "center", color: "black", fontFamily: "BeVietnamPro-Medium", }}>
                 Uploading image...
               </Text>
             )}
             
          <View style={styles.buttonContainer}>
            <Pressable
                style={[styles.uploadButton, styles.passButton]}
                disabled={isSubmitting}
                onPress={() =>
                  submitProjectCheck("pass", {
                    reasonForFailure: undefined,
                    processMiss: false,
                    technicalMiss: false,
                    correctiveMeasure: undefined,
                  })
                }
              >
                <Text style={styles.uploadText}>
                  {isSubmitting ? "Submitting..." : isSuccess ? "Sent" : "Pass"}
                </Text>
              </Pressable>


            {/* For Fail -> go to the form (do NOT submit yet) */}
            <Pressable
              style={[styles.uploadButtonTwo, styles.failButton]}
              onPress={() => setCurrentStep("form")}
            >
              <Text style={styles.uploadTextTwo}>Fail</Text>
            </Pressable>
          </View>
        </View>
      );

    // FORM: only shown when user clicked Fail
    case "form":
      return (
        <ScrollView style={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            <Text style={styles.modalTitle}>Failure Details</Text>

            {/* Reason for Failure */}
            <Pressable
              style={styles.formOption}
              onPress={() => setShowReasonField(!showReasonField)}
            >
              <Text style={styles.formOptionText}>Reason for failure</Text>
              <Feather
                name={showReasonField ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
              />
            </Pressable>

            {showReasonField && (
              <TextInput
                style={styles.textArea}
                placeholder="Enter reason for failure..."
                multiline
                numberOfLines={3}
                value={reasonForFailure}
                onChangeText={setReasonForFailure}
              />
            )}

            {/* Process Miss Checkbox */}
            <Pressable
              style={styles.checkboxOption}
              onPress={() => setProcessMiss(!processMiss)}
            >
              <View style={[styles.checkbox, processMiss && styles.checkboxChecked]}>
                {processMiss && <Feather name="check" size={16} color="#fff" />}
              </View>
              <Text style={styles.checkboxText}>Process Miss</Text>
            </Pressable>

            {/* Technical Miss Checkbox */}
            <Pressable
              style={styles.checkboxOption}
              onPress={() => setTechnicalMiss(!technicalMiss)}
            >
              <View style={[styles.checkbox, technicalMiss && styles.checkboxChecked]}>
                {technicalMiss && <Feather name="check" size={16} color="#fff" />}
              </View>
              <Text style={styles.checkboxText}>Technical Miss</Text>
            </Pressable>

            {/* Corrective Measures */}
            <Pressable
              style={styles.formOption}
              onPress={() => setShowCorrectiveField(!showCorrectiveField)}
            >
              <Text style={styles.formOptionText}>Corrective measures</Text>
              <Feather
                name={showCorrectiveField ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
              />
            </Pressable>

            {showCorrectiveField && (
              <TextInput
                style={styles.textArea}
                placeholder="Enter corrective measures..."
                multiline
                numberOfLines={3}
                value={correctiveMeasures}
                onChangeText={setCorrectiveMeasures}
              />
            )}

            {/* Submit Button */}
            <Pressable
              style={[styles.uploadButton, { marginTop: 20 }]}
              disabled={isSubmitting}
              onPress={() =>
                submitProjectCheck("fail", {
                  reasonForFailure,
                  processMiss,
                  technicalMiss,
                  correctiveMeasure: correctiveMeasures,
                })
              }
            >
              <Text style={styles.uploadText}>
                {isSubmitting
                  ? "Submitting..."
                  : isError
                  ? "Retry "
                  : isSuccess
                  ? "Done "
                  : "Submit"}
              </Text>
            </Pressable>

          </View>
        </ScrollView>
      );

    default:
      return null;
  }
};


  return (
    <SafeAreaView style={styles.container}>
      {/* Header with breadcrumb */}
      <View style={styles.header}>
        <Pressable onPress={goBack} style={{ marginRight: 12 }}>
          <Feather name="arrow-left" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {path.map((p) => ("title" in p ? p.title : p.label)).join(" > ")}
        </Text>
      </View>

      {/* Content section */}
      <View style={{ height: availableHeight }}>
        {!isFinalLevel ? (      
<ScrollView
    style={{ height: availableHeight }}
    contentContainerStyle={{ paddingBottom: 40 }}
    showsVerticalScrollIndicator={true}
  >
    {children
      .filter(item => !passedCheckIds.includes(item.id))  // ✅ Hide passed checks
      .map((item) => (
        <Pressable 
          key={item.id} 
          style={styles.checkCard}
          onPress={() => goDeeper(item)}
        >
          <View style={styles.checkRow}>
            <Text style={styles.checkItem}>{item.label}</Text>
            <Feather
              name="arrow-right"
              size={18}
              color="black"
              style={{ marginLeft: "auto" }}
            />
          </View>
        </Pressable>
      ))
    }
  </ScrollView>
        ) : (
          //in final check
          <ScrollView
            style={{ height: availableHeight }}
            contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
            showsVerticalScrollIndicator={true}
          >
            <Text style={{ fontSize: 16, marginBottom: 10, fontFamily: "BeVietnamPro-Medium", }}>
              {(current as Check).label}
            </Text>
            <Pressable
              style={styles.uploadButton}
              onPress={async () => {
                setModalVisible(true);           // always open modal
                setCurrentStep("review");        // jump to review (preview step)
            
                try {
                  const url = await uploadImage(
                    project.id,
                    (current as Check).id,
                    user?.uid ?? ""
                  );
            
                  if (url) {
                    setUploadedImageUri(url);    // store WP media URL
                  } else {
                    Alert.alert("Upload failed", "No URL returned from server");
                  }
                } catch (err: any) {
                  console.error("Upload error:", err);
                  Alert.alert("Upload failed", err.message || "Unknown error");
                }
              }}
            >
              <Feather name="camera" size={20} color="#fff" />
              <Text style={styles.uploadText}>Upload Photo</Text>
            </Pressable>

          </ScrollView>
        )}
      </View>

     {/* Animated Modal */}
<Modal
  transparent={false}   // ✅ full screen, not transparent overlay
  visible={modalVisible}
  animationType="slide" // ✅ simple slide transition
  onRequestClose={closeModal}
  style={styles.fullModal}
>
  <Animated.View style={styles.modalContent}>
  <View style={styles.modalOverlay}>
    <Pressable style={styles.modalBackdrop} onPress={closeModal} />

    
      <View style={styles.modalHeader}>
        <Pressable style={styles.closeButton} onPress={closeModal}>
          <Feather name="x" size={24} color="#000" />
        </Pressable>
      </View>

      {/* ✅ Ensure children expand inside modal */}
      <View style={{ flex: 1 }}>
        {renderModalContent()}
      </View>
   
  </View>
  </Animated.View>
</Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullModal: {
  flex: 1,
  backgroundColor: "#fff",   // ✅ full screen background
},
  center: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 20, 
    width: '90%' 
  },
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#ffffffff" 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight:29,
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
  checkRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 4 
  },
  checkItem: { 
    marginLeft: 10, 
    fontSize: 14, 
    lineHeight: 29,
    fontFamily: "BeVietnamPro-Medium" 
  },
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
  uploadButtonTwo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 160,
    alignSelf: "flex-start",
    width: "100%",
    justifyContent: "center",
    marginTop: 10,
    borderColor: "#d3d3d3ff",
    borderWidth: 2
  },
  uploadText: {
    color: "#ffffffff",
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "BeVietnamPro-Medium",
  },
  uploadTextTwo: {
    color: "#2600ffff",
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "BeVietnamPro-Medium",
  },
  photoContainer: {
    height: 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  passButton: {
    backgroundColor: '#2600ffff',
    flex: 1,
  },
  failButton: {
    backgroundColor: '#ffffffff',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 244, 244, 1)',
    justifyContent: 'flex-end',
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    shadowColor: '#ffffffff',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'flex-end',
    paddingTop: 15,
    paddingRight: 15,
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "BeVietnamPro-Medium",
   
  },
  formOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  formOptionText: {
    fontSize: 16,
    fontFamily: "BeVietnamPro-Medium",
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 15,
    fontSize: 14,
    fontFamily: "BeVietnamPro-Regular",
    minHeight: 80,
    textAlignVertical: 'top',
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0d00ffe6',
    borderColor: '#0d00ffe6',
  },
  checkboxText: {
    fontSize: 16,
    fontFamily: "BeVietnamPro-Medium",
  },
  checkCardPassed: {
    borderColor: '#22c55e',  // ✅ Green border
    borderWidth: 2.5,
    backgroundColor: '#f0fdf4',  // Light green background
    opacity: 0.7,
  },
  checkItemPassed: {
    color: '#999',  // Gray text
    textDecorationLine: 'line-through',  // Optional: strikethrough
  },
});
