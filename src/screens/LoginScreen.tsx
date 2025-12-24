import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import InputText from "../components/input/inputText";
import { SignInService } from "../services/authService";
import { getUser, saveUser } from "../store/secureStore";
import { useAuthStore } from "../store/useAuthStore";
import { getUserInfor } from "../services/userServices";
import { resetAndNavigate } from "../navigation/navigationRef";
import { norm_colors as colors } from "../template/color";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;
const logo = require("../../assets/Figma/Logo_Text.png");

export default function LoginScreen({ navigation }: Props) {
  const setUser = useAuthStore(state => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser();
      if (user?.username) {
        setUser(user);
        resetAndNavigate("Main");
      }
    };
    fetchData();
  }, []);
  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await SignInService({
        username: email,
        password,
      });
      if (response.status === 200) {
        const user = await getUserInfor();
        saveUser(user.data);
        setUser(user.data);
        navigation.navigate("Main");
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.flexOne}>
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logoImage} />
            </View>
            <View style={styles.container}>
              <Text style={styles.text}>Sign In</Text>
              <View style={styles.inputContainer}>
                <InputText
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text: string) => setEmail(text)}
                  secure={false}
                  iconLeft="mail-outline"
                  autoCapitalize="none"
                  // iconRight="eye-off"
                  onRightPress={() => { }}
                />
                <InputText
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(text: string) => setPassword(text)}
                  secure={!showPassword}
                  iconLeft="lock-closed-outline"
                  iconRight={showPassword ? "eye-off" : "eye"}
                  autoCapitalize="none"
                  onRightPress={() => setShowPassword(!showPassword)}
                />
                <TouchableOpacity
                  style={[styles.loginButton, isLoading && styles.disabledButton]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.footerLink}>
                  <Text style={styles.footerText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.linkText}>Sign up</Text>
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
  container: {
    flex: 3,
    alignItems: "center",
  },
  logoContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: "100%",
    maxWidth: 300,
    height: "100%",
    maxHeight: 300,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "800",
    color: colors.text,
  },
  inputContainer: {
    margin: 20,
    width: "80%",
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: colors.primary + '80',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: colors.primary,
    fontWeight: "600",
  },
});
