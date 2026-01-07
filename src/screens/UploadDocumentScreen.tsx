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
import { useTranslation } from "../utils/i18n/useTranslation";

const EntryModeButton = ({ icon, label, onPress, disabled }: any) => {
  return (
    <TouchableOpacity
      style={[styles.optionButton, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name={icon} size={24} style={styles.optionIcon} />
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );
};
type Props = NativeStackScreenProps<DocumentsStackParamList, "DocumentUploadScreen">
export default function UploadDocumentScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = React.useState<any>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/png", "image/jpeg", "text/plain"],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        let mimeType = result.assets[0].mimeType;
        if (!mimeType) {
          const name = result.assets[0].name.toLowerCase();
          if (name.endsWith('.pdf')) mimeType = 'application/pdf';
          else if (name.endsWith('.png')) mimeType = 'image/png';
          else if (name.endsWith('.jpg') || name.endsWith('.jpeg')) mimeType = 'image/jpeg';
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
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(t.camera_permission_required);
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
          Alert.alert(t.error, t.failed_process_file);
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
      const response = await uploadDocument(formData, (percent) => {
        setProgress(percent);
      });
      if (response.status === 200 || response.status === 201) {
        // @ts-ignore
        setSelectedFile(null);
        useDocStore.getState().addDoc(response.data);
        navigation.navigate("DocumentDetail", { document: response.data });
      } else {
        Alert.alert(t.error, t.failed_upload);
      }
    } catch (error: any) {
      if (error?.message?.includes("Invalid server response")) {
        if (error?.response?.data && error.response.data.includes("413 Request Entity Too Large")) {
          Alert.alert(t.error, t.file_too_large);
        } else {
          Alert.alert(t.error, t.server_error_retry);
        }
      } else {
        Alert.alert(t.error, error?.message || t.error_uploading);
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{t.upload_document}</Text>
          </View>

          <Text style={styles.sectionTitle}>{t.choose_entry_mode}</Text>
          <EntryModeButton
            icon="document-text-outline"
            label={t.file_picker}
            onPress={pickDocument}
            disabled={uploading}
          />
          <EntryModeButton
            icon="camera"
            label={t.camera}
            onPress={pickImage}
            disabled={uploading}
          />
          <EntryModeButton
            icon="cloud-upload-outline"
            label={t.cloud_integrations}
            onPress={() =>
              Alert.alert(t.not_implemented, t.func_not_implemented)
            }
            disabled={uploading}
          />

          <View style={styles.dropzone}>
            {selectedFile ? (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="document-attach" size={48} color={colors.primary} />
                <Text style={[styles.dropzoneTitle, { marginTop: 10, textAlign: 'center' }]}>
                  {selectedFile.name}
                </Text>
                <TouchableOpacity
                  style={[styles.browseButton, { marginTop: 20, backgroundColor: colors.danger }, uploading && { opacity: 0.5 }]}
                  onPress={() => setSelectedFile(null)}
                  disabled={uploading}
                >
                  <Text style={styles.browseButtonText}>{t.remove}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.dropzoneIconCircle}>
                  <Ionicons name="cloud-upload" size={28} color={colors.primary} />
                </View>
                <Text style={styles.dropzoneTitle}>{t.tap_to_upload}</Text>
                <Text style={styles.dropzoneSupport}>
                  {t.supported_files}
                </Text>
                <TouchableOpacity
                  style={[styles.browseButton, uploading && { opacity: 0.5 }]}
                  onPress={pickDocument}
                  disabled={uploading}
                >
                  <Text style={styles.browseButtonText}>{t.browse_files}</Text>
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
                    <Text style={styles.uploadButtonText}>{t.uploading} {progress}%...</Text>
                  </View>
                ) : t.upload_selected}
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
