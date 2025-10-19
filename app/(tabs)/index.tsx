// // //file: app/(tabs)/index.tsx
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
import Hero from "@/components/hero";
import colors from "@/constants/Colors";
import { projects } from "@/constants/projects";
import { useAuth } from "@/hooks/useAuth";
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";


export default function HomeScreen() {
  // ✅ Fixed: Use 'user' instead of 'userToken'
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // ✅ This loading check might not be necessary since _layout.tsx handles it
  // But keeping it for safety in case this screen loads before auth resolves
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

  // ✅ Optional: Handle case where user somehow gets here without being authenticated
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

  return (
    <>
         <Hero />
      <View style={styles.container}>
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/project/[id]",
                    params: { id: item.id },
                  })
                }
                style={styles.card}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.title}>{item.title}</Text>
                  <AntDesign name="right" size={20} color={colors.bgFourth} />
                </View>
              </Pressable>
            );
          }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      </View></>
 
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: "BeVietnamPro-Bold",
    color: colors.text,
  },
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "red",
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    fontFamily: "BeVietnamPro-Bold",
  },
  card: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    marginBottom: 12,
    borderRadius: 22,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontFamily: "BeVietnamPro-Bold",
    color: colors.bgFourth,
  },
  blurBox: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  text: {
    fontSize: 18,
    color: "#000",
    fontFamily: "BeVietnamPro-Medium",
  },
});
