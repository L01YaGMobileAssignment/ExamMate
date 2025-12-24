import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { norm_colors as colors } from "../template/color";
import { DocumentType } from "../types/document";
import { Ionicons } from "@expo/vector-icons";
import { docIconName } from "../const/iconName";
import { Latex } from '../components/Latex';
import { getDocumentById, getDocumentSummary, removeDocument, viewFullDocument } from "../services/docApiService";
import { Platform } from "react-native";
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DocumentsStackParamList } from "../navigation/DocumentStackNavigator";
import { generateQuiz } from "../services/quizzesService";

import { RootStackParamList } from "../navigation/AppNavigator";
import { useQuizStore } from "../store/quizStore";
import { useDocStore } from "../store/docStore";

type Props = NativeStackScreenProps<DocumentsStackParamList | RootStackParamList, "DocumentDetail">;
export default function DocumentsDetailScreen({ route, navigation }: Props) {
  const [document, setDocument] = useState<DocumentType>(route.params.document);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (document.summary !== null) { return; }
      const res = await getDocumentById(document.id);
      if (res.status === 200) {
        if (res.data.summary === null) {
          const res2 = await getDocumentSummary(document.id);
          setDocument(res2.data);
          return;
        }
        setDocument(res.data);
      }
    };
    fetchData();
  }, []);
  if (!document) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No document data</Text>
      </SafeAreaView>
    );
  }
  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    try {
      const res = await generateQuiz(document.id);
      if (res.status === 200) {
        useQuizStore.getState().addQuiz(res.data);
        // @ts-ignore
        navigation.navigate("Main", {
          screen: "HomeTab",
          params: {
            screen: "QuizOverview",
            params: { quiz: res.data }
          }
        });
      }
    } catch (error) {
      console.error("Quiz generation failed:", error);
      Alert.alert("Error", "Failed to generate quiz. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      "Are you sure?",
      "This will delete the document and all its quizzes. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              const res = await removeDocument(document.id);
              if (res.status === 200) {
                useDocStore.getState().removeDoc(document.id);
                navigation.navigate("Documents");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete document");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };


  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const res = await viewFullDocument(document.id);
      if (Platform.OS === 'web') {
        const contentType = res.headers['content-type'] || 'application/octet-stream';
        const blob = new Blob([res.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);

        const a = window.document.createElement('a');
        a.href = url;
        a.download = document.filename || document.title || 'downloaded_file';

        window.document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        window.document.body.removeChild(a);
      } else {
        const fileReader = new FileReader();
        fileReader.onload = async () => {
          try {
            const base64Data = (fileReader.result as string).split(',')[1];
            // @ts-ignore
            const fileUri = `${FileSystem.cacheDirectory}${document.filename || document.title || 'downloaded_file'}`;

            // @ts-ignore
            await FileSystem.writeAsStringAsync(fileUri, base64Data, {
              // @ts-ignore
              encoding: "base64",
            });

            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(fileUri);
            } else {
              Alert.alert("Error", "Sharing is not available on this device");
            }
          } catch (e) {
            console.error("File save error:", e);
            Alert.alert("Error", "Failed to save file");
          }
        };

        fileReader.readAsDataURL(new Blob([res.data]));
      }
    } catch (error) {
      console.error("Download failed:", error);
      Alert.alert("Error", "Failed to download document.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          // @ts-ignore
          name={docIconName[document.fileType] || "document-text-outline"}
          size={32}
          color={colors.primary}
        />
        <Text style={styles.title} numberOfLines={3} ellipsizeMode="tail">{document.title || document.filename}</Text>
      </View>

      <ScrollView style={styles.contentWrapper}>
        {document.summary ?
          <Latex textColor={colors.text} style={{ marginTop: 10 }}>
            {document.summary}
          </Latex> :
          <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", height: 500 }}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text>Loading summary</Text>
          </View>

        }
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleGenerateQuiz} style={[styles.primaryBtn, styles.witdhFull]} disabled={isLoading}>
          {isLoading ? (
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.primaryBtnText}>Generating...</Text>
            </View>
          ) : <Text style={styles.primaryBtnText}>Generate Quiz</Text>}
        </TouchableOpacity>
        <View style={styles.footerBottom}>
          <TouchableOpacity onPress={handleDownload} style={styles.primaryBtn} disabled={isLoading}>
            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.primaryBtnText}>Download</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRemove()} style={styles.errBtn} disabled={isLoading}>
            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.primaryBtnText}>Remove</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
    color: colors.primary,
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  contentWrapper: {
    flex: 1,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.primary,
  },
  footer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    gap: 8,
  },
  footerBottom: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  errBtn: {
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  witdhFull: {
    width: "100%",
  }
});
