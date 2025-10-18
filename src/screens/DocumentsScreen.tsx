import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
};

const EntryModeButton = ({ icon, label }) => {
  return (
    <TouchableOpacity 
      style={styles.optionButton}
      onPress={() => Alert.alert('Not implemented', 'Functionality not implemented.')}
    >
      <Ionicons name={icon} size={24} style={styles.optionIcon} />
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function DocumentsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.sectionTitle}>Choose Entry Mode</Text>
          <EntryModeButton
            icon="document-text-outline"
            label="File Picker"
          />
          <EntryModeButton
            icon="camera"
            label="Camera"
          />
          <EntryModeButton
            icon="cloud-upload-outline"
            label="Cloud Integrations"
          />
          <View style={styles.dropzone}>
            <View style={styles.dropzoneIconCircle}>
              {/* Use the color from the library */}
              <Ionicons name="cloud-upload" size={28} color={colors.primary} />
            </View>
            <Text style={styles.dropzoneTitle}>Tap to upload a file</Text>
            <Text style={styles.dropzoneSupport}>
              Supported: PDF, DOCX, TXT. Max 20MB
            </Text>
            <TouchableOpacity 
              style={styles.browseButton} 
              onPress={() => Alert.alert('Not implemented', 'Functionality not implemented.')}
            >
              <Text style={styles.browseButtonText}>Browse Files</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.screenBackground, 
  },
  scrollContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: colors.text, 
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background, 
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  optionIcon: {
    marginRight: 15,
    color: colors.primary, 
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text, 
  },
  dropzone: {
    marginTop: 20,
    backgroundColor: colors.background, 
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border, 
    borderStyle: 'dashed',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropzoneIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight, 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  dropzoneTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text, 
  },
  dropzoneSupport: {
    fontSize: 13,
    color: colors.textSecondary, 
    marginTop: 4,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: colors.primary, 
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  browseButtonText: {
    color: colors.white, 
    fontSize: 16,
    fontWeight: '600',
  },
});