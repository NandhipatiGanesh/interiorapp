// File: app/auth/index.tsx
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  // from useAuth
  const { signIn, signUp, loading: authLoading, user } = useAuth();

  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Navigate if user already logged in
  useEffect(() => {
    if (user) {
      router.replace("/"); // prevent back to auth
    }
  }, [user, router]);

  // Toggle login/signup mode
  const toggleAuthMode = () => {
    setIsSignup(!isSignup);
    setErrorMessage("");
    setSuccessMessage("");
    setName("");
  };

  const clearMessages = () => {
    if (errorMessage || successMessage) {
      setErrorMessage("");
      setSuccessMessage("");
    }
  };

  const validateForm = () => {
    if (!email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    if (!password.trim()) {
      setErrorMessage("Password is required");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return false;
    }
    if (isSignup && !name.trim()) {
      setErrorMessage("Full name is required for signup");
      return false;
    }
    return true;
  };

  const handleAuth = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      setFormLoading(true);

      if (isSignup) {
        await signUp(email.trim(), password);
        if (name.trim()) {
          setSuccessMessage("Account created successfully!");
        }
      } else {
        await signIn(email.trim(), password);
        setSuccessMessage("Logged in successfully!");
      }
    } catch (error: any) {
      console.error("Auth error:", error);

      let message = "An error occurred. Please try again.";
      if (error.code === "auth/user-not-found") {
        message = "No account found with this email. Please sign up first.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password. Please try again.";
      } else if (error.code === "auth/email-already-in-use") {
        message = "An account with this email already exists. Please login instead.";
      } else if (error.code === "auth/weak-password") {
        message = "Password is too weak. Please use at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Please try again later.";
      } else {
        message = error.message || message;
      }
      setErrorMessage(message);
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Image
          source={require("../../assets/images/binyaminmellish.jpg")}
          style={styles.banner}
        />
        <Text style={styles.title}>{isSignup ? "Sign Up" : "Login"}</Text>

        {isSignup && (
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={name}
            onChangeText={(text) => {
              setName(text);
              clearMessages();
            }}
          />
        )}

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            clearMessages();
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            style={[
              styles.passwordinput,
              {
                borderColor: isFocused ? "#007bff" : "#f7f7f7",
              },
            ]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearMessages();
            }}
            secureTextEntry={secureText}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => setSecureText(!secureText)}
            style={styles.showHideBtn}
          >
            <Text style={styles.showHideText}>
              {secureText ? "Show" : "Hide"}
            </Text>
          </TouchableOpacity>
        </View>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        {successMessage ? (
          <Text style={styles.success}>{successMessage}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, { opacity: formLoading ? 0.7 : 1 }]}
          onPress={handleAuth}
          disabled={formLoading}
        >
          {formLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isSignup ? "Sign Up" : "Login"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleAuthMode} disabled={formLoading}>
          <Text style={styles.link}>
            {isSignup
              ? "Already have an account? Login"
              : "New user? Sign Up"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    width: "100%",
    backgroundColor: "#fff",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "BeVietnamPro-Bold",
  },
  input: {
    borderWidth: 2,
    borderColor: "#f7f7f7",
    height: 50,
    paddingLeft: 15,
    marginBottom: 15,
    borderRadius: 18,
    fontSize: 14,
    width: "100%",
    fontFamily: "BeVietnamPro-Regular",
  },
  banner: {
    width: 100,
    height: 100,
    borderRadius: 50, // ✅ fixed bug
    marginBottom: 20,
    alignSelf: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#f7f7f7",
    height: 50,
    borderRadius: 18,
    paddingRight: 10,
    width: "100%",
  },
  passwordinput: {
    flex: 1,
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 18,
    fontFamily: "BeVietnamPro-Medium",
    borderWidth: 0,
  },
  showHideBtn: {
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  showHideText: {
    color: "#007bff",
    fontWeight: "bold",
    fontFamily: "BeVietnamPro-Medium",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 180,
    marginBottom: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "BeVietnamPro-Medium",
  },
  link: {
    color: "#000000ff",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    fontFamily: "BeVietnamPro-Medium",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "BeVietnamPro-Medium",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "BeVietnamPro-Medium",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "BeVietnamPro-Medium",
  },
});
