import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const colors = {
  primary: '#007AFF',
  primaryLight: '#dceaffff',
  background: '#FFFFFF',
  text: '#111827',
  textSecondary: '#696969ff',
  border: '#b6b6b6ff',
  white: '#FFFFFF',
  screenBackground: '#F8F8F8',
  docBgTan: '#f7e8d3',
  docBgPink: '#fbe5e1',
};

const RecentDocumentCard = ({ title, iconName, bgColor, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.docCard, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      <Ionicons name={iconName} size={40} color={colors.text} />
      <Text style={styles.docTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const UpcomingSessionItem = ({ icon, title, subject, time, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.sessionItem}
      onPress={onPress}
    >
      <View style={styles.sessionIconContainer}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.sessionTextContainer}>
        <Text style={styles.sessionTitle}>{title}</Text>
        <Text style={styles.sessionSubject}>{subject}</Text>
      </View>
      <Text style={styles.sessionTime}>{time}</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: 'https://picsum.photos/40/40' }} 
              style={styles.headerAvatar}
            />
            <Text style={styles.headerTitle}>ExamMate</Text>
          </View>
        </View>
        <View style={styles.welcomeContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/100/100' }} 
            style={styles.profileAvatar}
          />
          <Text style={styles.welcomeTitle}>Hello, Sophia!</Text>
          <Text style={styles.welcomeSubtitle}>Welcome back!</Text>
        </View>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={[styles.quickButton, styles.quickButtonPrimary]}
            onPress={() => Alert.alert('Not implemented', 'Functionality not implemented.')}
          >
            <Text style={styles.quickButtonTextPrimary}>Create Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickButton, styles.quickButtonSecondary]}
            onPress={() => Alert.alert('Not implemented', 'Functionality not implemented.')}
          >
            <Text style={styles.quickButtonTextSecondary}>New Document</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Recent Documents</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.recentDocsScroller}>
          <RecentDocumentCard
            title="Math Notes"
            iconName="document-text-outline"
            bgColor={colors.docBgTan}
            onPress={() => Alert.alert('Not implemented', 'Functionality not implemented.')}
          />
          <RecentDocumentCard
            title="History Essay"
            iconName="document-text-outline"
            bgColor={colors.docBgPink}
            onPress={() => Alert.alert('Not implemented', 'Functionality not implemented.')}
          />
          <RecentDocumentCard
            title="Science Report"
            iconName="document-text-outline"
            bgColor={colors.docBgTan}
            onPress={() => Alert.alert('Not implemented', 'Functionality not implemented.')}
          />
        </ScrollView>
        <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
        <UpcomingSessionItem
          icon="book-outline"
          title="Chapter 3 Review"
          subject="Math"
          time="Tomorrow, 2 PM"
          onPress={() => Alert.alert('Not implemented', 'Functionality not implemented.')}
        />
        <UpcomingSessionItem
          icon="book-outline"
          title="Essay Outline"
          subject="History"
          time="Next Week, 10 AM"
          onPress={() => Alert.alert('Not implemented', 'Functionality not implemented.')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40, 
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 15,
    color: colors.text,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickButtonPrimary: {
    backgroundColor: colors.primary,
  },
  quickButtonTextPrimary: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  quickButtonSecondary: {
    backgroundColor: colors.primaryLight,
  },
  quickButtonTextSecondary: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  recentDocsScroller: {
    marginHorizontal: -5,
  },
  docCard: {
    width: 130,
    height: 130,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    justifyContent: 'flex-start', 
    alignItems: 'flex-start', 
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  docTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginTop: 'auto', 
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3, 
  },
  sessionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  sessionTextContainer: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  sessionSubject: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sessionTime: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});