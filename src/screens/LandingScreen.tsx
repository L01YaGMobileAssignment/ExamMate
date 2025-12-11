import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');

const features = [
  {
    title: "Upload tài liệu dễ dàng",
    description: "Tải tài liệu từ thư viện hoặc chụp trực tiếp bằng camera.",
    image: require('../../assets/Figma/UploadPage.png'),
  },
  {
    title: "Scan tài liệu thông minh",
    description: "Nhận dạng chữ và trích xuất nội dung tự động.",
    image: require('../../assets/Figma/Camera.png'),
  },
  {
    title: "Làm Quiz hiệu quả",
    description: "Ôn tập bằng hệ thống quiz thông minh và sinh động.",
    image: require('../../assets/Figma/QuizPage.png'),
  },
  {
    title: "Tóm tắt & tạo quiz từ tài liệu",
    description: "AI tóm tắt nội dung và tạo câu hỏi tự động.",
    image: require('../../assets/Figma/SumaryPage.png'),
  },
  {
    title: "Lên lịch học thông minh",
    description: "Nhắc nhở và sắp xếp thời gian học phù hợp.",
    image: require('../../assets/Figma/Schedule.png'),
  },
];

const logo = require('../../assets/Figma/Logo.png');
type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export default function LandingScreen({ navigation }:Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerContainer}>
          <View style={styles.logoRow}>
            <Image source={logo} style={styles.logoImage} />
            <Text style={styles.logoText}>Exam<Text style={styles.logoHighlight}>Mate</Text></Text>
          </View>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroHeadline}>Học Thông Minh Hơn{"\n"}Không Phải Chăm Chỉ Hơn</Text>
          <Text style={styles.heroSubline}>
            Biến tài liệu thành kiến thức và bài tập ôn luyện chỉ trong vài giây với AI.
          </Text>
          
          <TouchableOpacity 
            style={styles.heroBtn} 
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Text style={styles.heroBtnText}>Bắt đầu ngay</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={{marginLeft: 8}} />
          </TouchableOpacity>
        </View>

      {features.map((item, index) => (
        <View key={index} style={styles.featureCard}>
          <View style={styles.textContainer}>
            <Text style={styles.featureTitle}>{item.title}</Text>
            <Text style={styles.featureDesc}>{item.description}</Text>
          </View>
          <Image source={item.image} style={styles.featureImage} />
        </View>
      ))}

        {/* Bottom CTA */}
        <View style={styles.bottomCta}>
          <Text style={styles.ctaText}>Sẵn sàng cho những điểm số chót vót?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  logoImage:{
    width: 50,
    height: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },

  featureCard: {
    marginBottom: 25,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  featureImage: {
    width: '100%',
    maxWidth: 200,
    height: 300,
    borderRadius: 12,
    resizeMode: 'contain',
  },

  textContainer: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },

  featureDesc: {
    fontSize: 14,
    color: '#555',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  
  // Header
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
  },
  logoHighlight: {
    color: '#4A90E2',
  },

  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  heroHeadline: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 12,
  },
  heroSubline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: '90%',
  },
  heroBtn: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 40,
  },
  heroBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  imageContainer: {
    width: width * 0.7,
    height: 350,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 40,
    backgroundColor: '#f0f0f0',
  },
  heroImage: {
    width: 'auto',
    height: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },

  // Features
  featuresSection: {
    paddingHorizontal: 20,
    backgroundColor: '#FAFAFA',
    paddingVertical: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
 
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: '#EDE7F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  
  bottomCta: {
    alignItems: 'center',
    marginTop: 20,
  },
  ctaText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A90E2',
  },
});