// app/(tabs)/fails.tsx
import { useAuth } from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FailsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [checks, setChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<any | null>(null);
  const slideAnim = useState(new Animated.Value(SCREEN_HEIGHT))[0];
  const backdropAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`https://elementortemplates.in/wp-json/myapp/v1/check-results/${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", JSON.stringify(data, null, 2));
        // ✅ only keep failed checks
        setChecks((data || []).filter((c: any) => c.status === "fail"));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (selectedCheck) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedCheck]);

  const handleCloseModal = () => {
    setSelectedCheck(null);
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container]}> 
        <View style={styles.loadingContainer}>
          <Pressable onPress={() => router.push("/auth")}>
            <BlurView intensity={80} tint="light" style={styles.blurBox}>
              <Text style={styles.loginText}>Please log in to continue</Text>
            </BlurView>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading failed checks...</Text>
        </View>
      </SafeAreaView>
    );
  } 

  const failCount = checks.length;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Failed Checks</Text>
          <Text style={styles.headerSubtitle}>
            {failCount} failed check{failCount !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* List */}
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Recent Failures</Text>
          
          {checks.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="x-circle" size={48} color="#FF3B30" />
              <Text style={styles.emptyTitle}>No failed checks</Text>
              <Text style={styles.emptySubtitle}>Your failed checks will appear here</Text>
            </View>
          ) : (
            checks.map((check) => (
              <Pressable
                key={check.id}
                style={styles.checkItem}
                onPress={() => setSelectedCheck(check)}
                android_ripple={{ color: '#F0F0F0', borderless: false }}
              >
                <View style={styles.checkContent}>
                  <View style={styles.checkLeft}>
                    <View style={[styles.checkStatusIndicator, styles.failIndicator]} />
                    <View style={styles.checkInfo}>
                      <Text style={styles.checkTitle} numberOfLines={2}>
                        {check.check_name}
                      </Text>
                      <Text style={styles.checkMeta}>
                        {new Date(check.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.checkRight}>
                    <View style={[styles.statusBadge, styles.failBadge]}>
                      <Text style={styles.statusText}>FAIL</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#000000ff" />
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>

        {/* Modal (same as completed, only fail view is relevant) */}
        {selectedCheck && (
          <>
            <Animated.View
              style={[styles.backdrop, { opacity: backdropAnim }]}
            >
              <Pressable style={styles.backdropTouchable} onPress={handleCloseModal} />
            </Animated.View>

            <Animated.View
              style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <Pressable style={styles.closeButton} onPress={handleCloseModal}>
                  <Feather name="x" size={20} color="#8E8E93" />
                </Pressable>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                  {/* FAIL VIEW */}
                  <View style={styles.failView}>
                    {/* Breadcrumb */}
                    <View style={styles.breadcrumb}>
                      <Text style={styles.breadcrumbItem}>Checks</Text>
                      <Feather name="chevron-right" size={16} color="#8E8E93" />
                      <Text style={[styles.breadcrumbItem, styles.breadcrumbActive]}>
                        Failure Details
                      </Text>
                    </View>

                    {/* Status Header */}
                    <LinearGradient
                      colors={['#FF3B30', '#FF2D21']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.failHeader}
                    >
                      <Feather name="x-circle" size={32} color="#FFFFFF" />
                      <Text style={styles.failHeaderText}>FAILED</Text>
                    </LinearGradient>

                    {/* Check Name */}
                    <Text style={styles.failCheckName}>{selectedCheck.check_name}</Text>

                    {/* Details */}
                    <View style={styles.detailsCard}>
                      <Text style={styles.detailsTitle}>Failure Details</Text>
                      <DetailItem label="Path" value={selectedCheck.breadcrumb || 'Not specified'} />
                      <DetailItem label="Reason" value={selectedCheck.reason || 'Not specified'} />
                      <DetailItem label="Process Miss" value={selectedCheck.process_miss === "1" ? "Yes" : "No"} />
                      <DetailItem label="Technical Miss" value={selectedCheck.technical_miss === "1" ? "Yes" : "No"} />
                      <DetailItem label="Corrective Measure" value={selectedCheck.corrective || 'Not specified'} />
                    </View>

                    {/* Image */}
                    <View style={styles.imageCard}>
                      {selectedCheck.image_url ? (
                        <Image
                          source={{ uri: selectedCheck.image_url }}
                          style={{ width: "100%", height: 200, borderRadius: 16 }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.imageContainer}>
                          <Feather name="camera" size={40} color="#8E8E93" />
                          <Text style={styles.imageTitle}>Evidence Photo</Text>
                          <Text style={styles.imageSubtitle}>Tap to view full image</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </Animated.View>
          </>
        )}
      </SafeAreaView>
    </>
  );
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

// ✅ reuse same styles as completed.tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    color: "#8E8E93",
    fontFamily: "BeVietnamPro-Medium",
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
    fontFamily: "BeVietnamPro-Medium",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    fontFamily: "BeVietnamPro-Medium",
  },

  // Summary Cards
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
  },
  cardContent: {
    borderRadius: 20,
    padding: 24,

  },
  passCard: {
    backgroundColor: "#F8F9FA",
  },
  failCard: {
    backgroundColor: "#F8F9FA",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardIconContainer: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000ff",
    fontFamily: "BeVietnamPro-Medium",
  },
  cardNumber: {
    fontSize: 36,
    fontWeight: "700",
    color: "#000000ff",
    fontFamily: "BeVietnamPro-Medium",
  },

  // List
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 20,
    fontFamily: "BeVietnamPro-Medium",
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 16,
    marginBottom: 8,
    fontFamily: "BeVietnamPro-Medium",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#C7C7CC",
    fontFamily: "BeVietnamPro-Medium",
  },
  checkItem: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    marginBottom: 12,
  },
  checkContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  checkLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkStatusIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 16,
  },
  passIndicator: {
    backgroundColor: "#8effaaff",
  },
  failIndicator: {
    backgroundColor: "#FF3B30",
  },
  checkInfo: {
    flex: 1,
  },
  checkTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 10,
    fontFamily: "BeVietnamPro-Bold",
  },
  checkMeta: {
    fontSize: 14,
    color: "#8E8E93",
    fontFamily: "BeVietnamPro-Medium",
  },
  checkRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  passBadge: {
    backgroundColor: "#E8F5E8",
  },
  failBadge: {
    backgroundColor: "#FFE8E6",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "BeVietnamPro-Medium",
  },

  // Modal
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80%",
    zIndex: 1001,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 8,
  },
  modalHandle: {
    width: 36,
    height: 5,
    backgroundColor: "#C7C7CC",
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Pass View
  passView: {
    paddingTop: 40,
    paddingBottom: 40,
  },
  passContainer: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: "#30D158",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  passIcon: {
    marginBottom: 20,
  },
  passStatus: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: "BeVietnamPro-Bold",
  },
  passTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 32,
    fontFamily: "BeVietnamPro-Medium",
  },
  passImageContainer: {
    width: '100%',
  },
  imageBox: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  imageText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 8,
    fontFamily: "BeVietnamPro-Medium",
  },

  // Fail View
  failView: {
    paddingTop: 40,
    paddingBottom: 40,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  breadcrumbItem: {
    fontSize: 14,
    color: "#8E8E93",
    fontFamily: "BeVietnamPro-Medium",
  },
  breadcrumbActive: {
    color: "#000000",
    fontWeight: "600",
    fontFamily: "BeVietnamPro-Bold",
  },
  failHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 26,
    marginBottom: 24,
    gap: 12,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  failHeaderText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "BeVietnamPro-Bold",
  },
  failCheckName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 24,
    lineHeight: 32,
    fontFamily: "BeVietnamPro-Bold",
  },
  detailsCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 20,
    fontFamily: "BeVietnamPro-Bold",
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 4,
    fontFamily: "BeVietnamPro-Bold",
  },
  detailValue: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 22,
    fontFamily: "BeVietnamPro-Medium",
  },
  imageCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginTop: 12,
    fontFamily: "BeVietnamPro-Bold",
  },
  imageSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
    fontFamily: "BeVietnamPro-Medium",
  },
  blurBox: {
    padding: 20,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 18,
    color: "#000000",
    fontFamily: "BeVietnamPro-Medium",
  },
});
