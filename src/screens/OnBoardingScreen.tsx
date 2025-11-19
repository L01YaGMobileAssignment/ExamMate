import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons , MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
export default function OnboardingScreen({navigation}) {
  const permissions = [
    {
      id: 1,
      icon: 'document-text-outline',
      title: 'Storage',
      subtitle: 'Access your study materials',
    },
    {
      id: 2,
      icon: 'camera-outline',
      title: 'Camera',
      subtitle: 'Capture notes and documents',
    },
    {
      id: 3,
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Get reminders for study sessions',
    },
  ];

  return (
    <SafeAreaView style={styles.container}> 
        <ScrollView>
        {/* App Title */}
        <Text style={styles.appName}>ExamMate</Text>

        {/* Illustration Image */}
        <Image
            source={require('../../assets/background.png')}
            style={styles.image}
            resizeMode="contain"
        />

        {/* Welcome Block */}
        <Text style={styles.title}>Welcome to ExamMate</Text>
        <Text style={styles.subtitle}>
            Organize your study sessions, manage documents, and create quizzes with ease.
        </Text>

        {/* Permissions List */}
        <View style={styles.card}>
            {permissions.map((item) => (
            <View key={item.id} style={styles.permissionRow}>
                <Ionicons name={item.icon} size={26} color="#1C64F2" />
                <View style={{ marginLeft: 14 }}>
                <Text style={styles.permissionTitle}>{item.title}</Text>
                <Text style={styles.permissionSubtitle}>{item.subtitle}</Text>
                </View>
            </View>
            ))}
        </View>

        {/* Button */}
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MainApp')}
        >
            <Text style={styles.buttonText}>Grant Permissions</Text>
        </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  appName: {
    marginTop: 36,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1C1C1E',
  },
  image: {
    width: '100%',
    height: 220,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    marginTop: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    color: '#6B7280',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 18,
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  permissionRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  permissionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    maxWidth: 250,
  },
  button: {
    backgroundColor: '#1C64F2',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 32,
    marginBottom: 40,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
