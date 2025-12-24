import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import InputText from "../components/input/inputText";
import { SignUpService } from "../services/authService";
import { norm_colors as colors } from "../template/color";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleRegister = async () => {
    if (isLoading) return;
    if (!userName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (!isAgreed) {
      Alert.alert("Error", "Please agree to the Terms and Conditions.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await SignUpService({
        username: userName,
        password: password,
        email: email,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Account created successfully. Please login.", [
          { text: "OK", onPress: () => navigation.navigate("Login") }
        ]);
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }

    } catch (error: any) {
      console.log(error);
      const msg = error.response?.data?.detail || "Registration failed. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.flexOne}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Sign up</Text>
              <Text style={styles.headerSubtitle}>Create an account to get started</Text>
            </View>

            <View style={styles.container}>
              <View style={styles.inputContainer}>
                <InputText
                  label="Username"
                  placeholder="Enter your username"
                  value={userName}
                  onChangeText={setUserName}
                  secure={false}
                // iconLeft="person-outline"
                />
                <InputText
                  label="Email Address"
                  placeholder="name@email.com"
                  value={email}
                  onChangeText={setEmail}
                  secure={false}
                // iconLeft="mail-outline"
                />
                <InputText
                  label="Password"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secure={!isPasswordVisible}
                  // iconLeft="lock-closed-outline"
                  iconRight={isPasswordVisible ? "eye-off" : "eye"}
                  onRightPress={togglePasswordVisibility}
                />
                <InputText
                  label="Confirm Password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secure={!isConfirmPasswordVisible}
                  // iconLeft="lock-closed-outline"
                  iconRight={isConfirmPasswordVisible ? "eye-off" : "eye"}
                  onRightPress={toggleConfirmPasswordVisibility}
                />

                <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsAgreed(!isAgreed)}>
                  <Ionicons
                    name={isAgreed ? "checkbox" : "square-outline"}
                    size={24}
                    color={isAgreed ? colors.primary : colors.textSecondary}
                  />
                  <Text style={styles.checkboxText}>
                    I've read and agree with the <Text style={styles.linkText}>Terms and Conditions</Text> and the <Text style={styles.linkText}>Privacy Policy</Text>.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (!userName || !email || !password || !confirmPassword || !isAgreed || isLoading) && styles.disabledButton
                  ]}
                  onPress={handleRegister}
                  disabled={!userName || !email || !password || !confirmPassword || !isAgreed || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={[
                      styles.primaryButtonText,
                      (!userName || !email || !password || !confirmPassword || !isAgreed) && styles.disabledButtonText
                    ]}>Sign up</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.footerLink}>
                  <Text style={styles.footerText}>Already have account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.linkText}>Sign in</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    marginBottom: 20,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  container: {
    flex: 4,
    alignItems: "center",
  },
  inputContainer: {
    width: "85%",
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
  checkboxText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  linkText: {
    color: colors.primary,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: colors.primaryLight,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: colors.black,
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  }
});
