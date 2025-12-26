import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/useAuthStore";
import { clearAuth } from "../store/secureStore";
import { resetAndNavigate } from "../navigation/navigationRef";
import { norm_colors as colors } from "../template/color";
import { useQuizStore } from "../store/quizStore";
import { useDocStore } from "../store/docStore";
import { useScheduleStore } from "../store/schedule";
import { useTranslation } from "../utils/i18n/useTranslation";

interface ProfileMenuItemProps {
  icon: any;
  title: string;
  onPress: () => void;
  isDestructive?: boolean;
}

const ProfileMenuItem = ({
  icon,
  title,
  onPress,
  isDestructive = false,
}: ProfileMenuItemProps) => {
  const iconColor = isDestructive ? colors.danger : colors.primary;
  const iconBgColor = isDestructive ? colors.dangerLight : colors.primaryLight;
  const textColor = isDestructive ? colors.danger : colors.text;

  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View
        style={[styles.menuIconContainer, { backgroundColor: iconBgColor }]}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <Text style={[styles.menuTitle, { color: textColor }]}>{title}</Text>
      {!isDestructive && (
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={colors.textSecondary}
        />
      )}
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert(t.logout, t.confirm_logout, [
      { text: t.cancel, style: "cancel" },
      {
        text: t.logout,
        style: "destructive",
        onPress: async () => {
          await clearAuth();
          useQuizStore.getState().clearQuizzes();
          useDocStore.getState().clearDocs();
          useScheduleStore.getState().clearSchedules();
          resetAndNavigate("Login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{t.profile_title}</Text>
        </View>
        <View style={styles.profileInfoContainer}>
          <Image
            source={{ uri: "https://picsum.photos/100/100" }}
            style={styles.profileAvatar}
          />
          <Text style={styles.profileName}>{user?.username || t.guest}</Text>
          <Text style={styles.profileEmail}>{user?.email || t.no_email}</Text>
        </View>
        <Text style={styles.sectionTitle}>{t.personal_info}</Text>
        <View style={styles.menuGroup}>
          <ProfileMenuItem
            icon="person-circle-outline"
            title={t.edit_profile}
            onPress={() =>
              Alert.alert(t.not_implemented, t.func_not_implemented)
            }
          />
          <ProfileMenuItem
            icon="time-outline"
            title={t.history}
            onPress={() =>
              Alert.alert(t.not_implemented, t.func_not_implemented)
            }
          />
          <ProfileMenuItem
            icon="settings-outline"
            title={t.settings}
            onPress={() => {
              navigation.navigate("Setting");
            }}
          />
        </View>

        <Text style={styles.sectionTitle}>{t.support}</Text>
        <View style={styles.menuGroup}>
          <ProfileMenuItem
            icon="help-circle-outline"
            title={t.help_support}
            onPress={() =>
              Alert.alert(t.not_implemented, t.func_not_implemented)
            }
          />
        </View>

        <Text style={styles.sectionTitle}>{t.actions}</Text>
        <View style={styles.menuGroup}>
          <ProfileMenuItem
            icon="log-out-outline"
            title={t.logout}
            onPress={handleLogout}
            isDestructive={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  scrollContainer: {
    padding: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  profileInfoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 15,
    color: colors.text,
  },
  menuGroup: {
    backgroundColor: colors.background,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.screenBackground,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
});
