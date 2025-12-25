import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { norm_colors as colors } from "../template/color";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { uploadDocument } from "../services/docApiService";
import { DocumentsStackParamList } from "../navigation/DocumentStackNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDocStore } from "../store/docStore";

const EntryModeButton = ({ icon, label, onPress }: any) => {
  return (
    <TouchableOpacity style={styles.optionButton} onPress={onPress}>
      <Ionicons name={icon} size={24} style={styles.optionIcon} />
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );
};
type Props = NativeStackScreenProps<DocumentsStackParamList, "DocumentUploadScreen">
export default function UploadDocumentScreen({ navigation }: Props) {
  const [selectedFile, setSelectedFile] = React.useState<any>(null);
  const [uploading, setUploading] = React.useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        let mimeType = result.assets[0].mimeType;
        if (!mimeType) {
          const name = result.assets[0].name.toLowerCase();
          if (name.endsWith('.pdf')) mimeType = 'application/pdf';
          else if (name.endsWith('.doc')) mimeType = 'application/msword';
          else if (name.endsWith('.docx')) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          else if (name.endsWith('.txt')) mimeType = 'text/plain';
          else mimeType = 'application/octet-stream';
        }

        setSelectedFile({
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: mimeType,
          file: result.assets[0].file
        });
      }
    } catch (err) {
      // console.log("Unknown Error: ", err);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission to access camera is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const name = uri.split('/').pop() || "camera_upload.jpg";
        const match = /\.(\w+)$/.exec(name);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        setSelectedFile({
          uri: uri,
          name: name,
          type: type,
        });
      }
    } catch (err) {
      // console.log("Unknown Error: ", err);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();

    if (Platform.OS === 'web') {
      if (selectedFile.file) {
        formData.append("file", selectedFile.file);
      } else {
        try {
          const res = await fetch(selectedFile.uri);
          const blob = await res.blob();
          formData.append("file", blob, selectedFile.name);
        } catch (e) {
          Alert.alert("Error", "Failed to process file for upload.");
          setUploading(false);
          return;
        }
      }
    } else {
      const fileToUpload = {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.type,
      };
      // @ts-ignore
      formData.append("file", fileToUpload);
    }

    try {
      const response = await uploadDocument(formData);
      if (response.status === 200 || response.status === 201) {
        // @ts-ignore
        setSelectedFile(null);
        useDocStore.getState().addDoc(response.data);
        navigation.navigate("DocumentDetail", { document: response.data });
      } else {
        Alert.alert("Error", "Failed to upload document.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Upload Document</Text>
          </View>

          <Text style={styles.sectionTitle}>Choose Entry Mode</Text>
          <EntryModeButton
            icon="document-text-outline"
            label="File Picker"
            onPress={pickDocument}
          />
          <EntryModeButton
            icon="camera"
            label="Camera"
            onPress={pickImage}
          />
          <EntryModeButton
            icon="cloud-upload-outline"
            label="Cloud Integrations"
            onPress={() =>
              Alert.alert("Not implemented", "Functionality not implemented.")
            }
          />

          <View style={styles.dropzone}>
            {selectedFile ? (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="document-attach" size={48} color={colors.primary} />
                <Text style={[styles.dropzoneTitle, { marginTop: 10, textAlign: 'center' }]}>
                  {selectedFile.name}
                </Text>
                <TouchableOpacity
                  style={[styles.browseButton, { marginTop: 20, backgroundColor: colors.danger }]}
                  onPress={() => setSelectedFile(null)}
                >
                  <Text style={styles.browseButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.dropzoneIconCircle}>
                  <Ionicons name="cloud-upload" size={28} color={colors.primary} />
                </View>
                <Text style={styles.dropzoneTitle}>Tap to upload a file</Text>
                <Text style={styles.dropzoneSupport}>
                  Supported: PDF, DOCX, TXT, Images. Max 20MB
                </Text>
                <TouchableOpacity
                  style={styles.browseButton}
                  onPress={pickDocument}
                >
                  <Text style={styles.browseButtonText}>Browse Files</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {selectedFile && (
            <TouchableOpacity
              style={[
                styles.uploadButton,
                uploading && { opacity: 0.7 }
              ]}
              onPress={handleUpload}
              disabled={uploading}
            >
              <Text style={styles.uploadButtonText}>
                {uploading ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.uploadButtonText}>Uploading...</Text>
                  </View>
                ) : "Upload Selected Document"}
              </Text>
            </TouchableOpacity>
          )}

        </ScrollView>
      </View>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    color: colors.text,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "500",
    color: colors.text,
  },
  dropzone: {
    marginTop: 20,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  dropzoneIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  dropzoneTitle: {
    fontSize: 18,
    fontWeight: "600",
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
    fontWeight: "600",
  },
  uploadButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
