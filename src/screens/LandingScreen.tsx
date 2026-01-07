import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { saveIsFirstUse } from "../store/secureStore";

const { width } = Dimensions.get("window");
const COLORS = {
  primary: "#0056D2",
  accent: "#00C897",
  darkText: "#1A1A1A",
  lightText: "#666666",
  background: "#FFFFFF",
  secondaryBackground: "#F8F9FA",
  futureBackground: "#1E2A38",
};

const heroImageSource = require("../../assets/Figma/OnBoarding.png");
const logoSource = require("../../assets/Figma/Logo.png");

const showcaseImages = [
  {
    id: 1,
    src: require("../../assets/Figma/UploadPage.png"),
    caption: "Upload tài liệu",
  },
  {
    id: 2,
    src: require("../../assets/Figma/QuizPage.png"),
    caption: "Ôn tập chủ động",
  },
  {
    id: 3,
    src: require("../../assets/Figma/SumaryPage.png"),
    caption: "Tóm tắt và tạo câu hỏi bằng AI",
  },
  {
    id: 4,
    src: require("../../assets/Figma/Schedule.png"),
    caption: "Lịch học",
  },
];

const mvpFeatures = [
  {
    icon: "cloud-upload-outline",
    title: "Kho tài liệu cá nhân",
    description: "Lưu trữ tài liệu để sẵn sàng ôn tập.",
  },
  {
    icon: "sync-outline",
    title: "Đồng bộ thông tin",
    description: "Dữ liệu học tập luôn sẵn sàng trên mọi thiết bị.",
  },
  {
    icon: "alarm-outline",
    title: "Nhắc nhở thông minh",
    description: "Xây dựng thói quen ôn bài hàng ngày bền vững.",
  },
  {
    icon: "share-social-outline",
    title: "Chia sẻ kiến thức",
    description: "Lưu và chia sẻ các bộ câu hỏi với bạn bè.",
  },
];

const EXTERNAL_LINKS = {
  behance: "https://www.behance.net/gallery/240281337/ExamMate",
  figma:
    "https://www.figma.com/design/7y9XieNmZtEyXsYLoDtYLw/Examate?node-id=0-1&p=f&t=WCHvyjrg5O4MeB9y-0",
};

type Props = NativeStackScreenProps<RootStackParamList, "Landing">;

export default function LandingScreen({ navigation }: Props) {
  const openLink = (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={COLORS.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.logoRow}>
            <Image source={logoSource} style={styles.logoImage} />
            <Text style={styles.logoText}>
              Exam<Text style={styles.logoHighlight}>Mate</Text>
            </Text>
          </View>
          <Text style={styles.sloganText}>More than a study partner</Text>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroHeadline}>
            Chinh phục kỳ thi với người bạn đồng hành thông minh.
          </Text>
          <Text style={styles.heroSubline}>
            Công cụ giúp sinh viên tổ chức việc ôn thi, tạo bài luyện tập và
            nhắc nhở tiến độ hiệu quả.
          </Text>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={async () => {
              await saveIsFirstUse();
              navigation.navigate("Login");
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>Tham gia trải nghiệm ngay</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>

          <View style={styles.heroImageContainer}>
            <Image
              source={heroImageSource}
              style={styles.heroImageDisplay}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.problemSection}>
          <Ionicons
            name="help-buoy-outline"
            size={40}
            color={COLORS.accent}
            style={{ marginBottom: 10 }}
          />
          <Text style={styles.sectionTitle}>
            Việc ôn thi không cần phải là gánh nặng
          </Text>
          <Text style={styles.sectionBodyText}>
            Bạn bị choáng ngợp bởi có quá nhiều tài liệu? Bạn muốn nắm được nội
            dung của tài liệu một cách nhanh chóng? ExamMate giúp chuyển đổi tài
            liệu thành các phiên ôn tập thú vị, nắm bắt kiến thức nhanh chóng.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { marginBottom: 30 }]}>
            Xây dựng nền tảng vững chắc
          </Text>
          <View style={styles.featureGrid}>
            {mvpFeatures.map((item, index) => (
              <View key={index} style={styles.featureGridItem}>
                <View style={styles.featureIconBox}>
                  <Ionicons
                    name={item.icon as any}
                    size={28}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.featureGridTitle}>{item.title}</Text>
                <Text style={styles.featureGridDesc}>{item.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.showcaseSection}>
          <Text
            style={[
              styles.sectionTitle,
              { textAlign: "left", paddingHorizontal: 20 },
            ]}
          >
            Trải nghiệm học tập trực quan
          </Text>
          <Text
            style={[
              styles.heroSubline,
              { textAlign: "left", paddingHorizontal: 20, marginBottom: 20 },
            ]}
          >
            Giao diện tối giản, tập trung tối đa vào nội dung.
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 15 }}
          >
            {showcaseImages.map(item => (
              <View key={item.id} style={styles.showcaseItem}>
                <Image
                  source={item.src}
                  style={styles.showcaseImage}
                  resizeMode="contain"
                />
                <Text style={styles.showcaseCaption}>{item.caption}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerHeading}>Khám phá quy trình thiết kế</Text>

          <View style={styles.linkButtonsContainer}>
            <TouchableOpacity
              style={[styles.designLinkBtn, { backgroundColor: "#1769ff" }]}
              onPress={() => openLink(EXTERNAL_LINKS.behance)}
            >
              <FontAwesome5
                name="behance"
                size={24}
                color="#fff"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.designLinkText}>Xem trên Behance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.designLinkBtn,
                {
                  backgroundColor: "#333",
                  borderWidth: 1,
                  borderColor: "#555",
                },
              ]}
              onPress={() => openLink(EXTERNAL_LINKS.figma)}
            >
              <FontAwesome5
                name="figma"
                size={24}
                color="#fff"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.designLinkText}>Xem Design System</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.copyrightArea}>
            <Text style={styles.copyrightText}>
              © 2025 ExamMate. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.stickyBottomBar}>
        <TouchableOpacity
          style={styles.stickyBtn}
          onPress={async () => {
            await saveIsFirstUse();
            navigation.navigate("Login");
          }}
        >
          <Text style={styles.stickyBtnText}>Bắt đầu học ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },

  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.darkText,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  logoHighlight: {
    color: COLORS.primary,
  },
  sloganText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 5,
    textTransform: "uppercase",
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.darkText,
    marginBottom: 15,
    textAlign: "center",
    lineHeight: 32,
  },
  sectionBodyText: {
    fontSize: 16,
    color: COLORS.lightText,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: "90%",
  },

  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 40,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
      android: {
        elevation: 2,
        borderBottomWidth: 1,
        borderColor: "#eee",
      },
    }),
    zIndex: 10,
  },
  heroHeadline: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.darkText,
    textAlign: "center",
    lineHeight: 38,
    marginBottom: 16,
  },
  heroSubline: {
    fontSize: 17,
    color: COLORS.lightText,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 24,
    maxWidth: "95%",
  },
  primaryBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryBtnText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },
  trustSignal: {
    fontSize: 13,
    color: "#888",
    marginBottom: 30,
    fontStyle: "italic",
  },
  heroImageContainer: {
    width: width * 0.85,
    height: width * 1.2,
    borderRadius: 24,
    backgroundColor: "#E8F1FF",
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  heroImageDisplay: {
    width: "100%",
    height: "100%",
  },

  problemSection: {
    paddingVertical: 50,
    paddingHorizontal: 25,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  featuresSection: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: COLORS.secondaryBackground,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureGridItem: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#eee",
  },
  featureIconBox: {
    width: 50,
    height: 50,
    backgroundColor: "#E8F1FF",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  featureGridTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.darkText,
    marginBottom: 8,
  },
  featureGridDesc: {
    fontSize: 14,
    color: COLORS.lightText,
    lineHeight: 20,
  },

  showcaseSection: {
    paddingVertical: 50,
    backgroundColor: "#fff",
  },
  showcaseItem: {
    marginHorizontal: 10,
    alignItems: "center",
  },
  showcaseImage: {
    width: width * 0.65,
    height: width * 0.65 * 1.8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#f0f0f0",
    marginBottom: 15,
    backgroundColor: "#FAFAFA",
  },
  showcaseCaption: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
  },

  futureSection: {
    paddingVertical: 60,
    paddingHorizontal: 30,
    backgroundColor: COLORS.futureBackground,
    alignItems: "center",
  },
  futureTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 15,
    textAlign: "center",
  },
  futureBodyText: {
    fontSize: 16,
    color: "#B0B8C4",
    textAlign: "center",
    lineHeight: 24,
  },

  footerSection: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: "#121212",
    alignItems: "center",
  },
  footerHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 25,
  },
  linkButtonsContainer: {
    width: "100%",
    marginBottom: 40,
  },
  designLinkBtn: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  designLinkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  copyrightArea: {
    alignItems: "center",
    opacity: 0.6,
  },
  copyrightText: {
    color: "#fff",
    fontSize: 12,
  },

  stickyBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  stickyBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  stickyBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  sentryTestButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 15,
  },
  sentryTestButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
