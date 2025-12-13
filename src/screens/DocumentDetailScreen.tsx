import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { norm_colors as colors } from '../template/color';
import { DocumentType } from '../types/document';
import { Ionicons } from '@expo/vector-icons';
import { docIconName } from '../const/iconName';
import InputText from '../components/input/inputText';

export default function DocumentsDetailScreen({ route }) {
    const { document }:{document:DocumentType} = route.params;
    if (!document) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No document data</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name={docIconName[document.fileType] || 'document-text-outline'}
          size={24}
          color={colors.primary}
        />
        <Text style={styles.title}>{document.title}</Text>
      </View>

      {/* Meta info */}
      <Text style={styles.meta}>
        Type: {document.fileType}
      </Text>

      {/* Content */}
      <ScrollView style={styles.contentWrapper}>
        <Text style={styles.content}>
          {document.content}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
    color: colors.primary
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12
  },
  contentWrapper: {
    flex: 1
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.primary
  }
});
