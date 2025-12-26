import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { norm_colors as colors } from "../template/color";
import { useSettingStore } from "../store/settingStore";

export default function SettingScreen() {
    const navigation = useNavigation();
    const numberOfQuestions = useSettingStore(state => state.numberOfQuestions);
    const setNumberOfQuestions = useSettingStore(state => state.setNumberOfQuestions);

    const [tempNum, setTempNum] = useState(numberOfQuestions.toString());

    useEffect(() => {
        setTempNum(numberOfQuestions.toString());
    }, [numberOfQuestions]);

    const handleSave = () => {
        const num = parseInt(tempNum);
        if (!isNaN(num) && num > 0) {
            setNumberOfQuestions(num);
            Alert.alert("Success", "Settings saved successfully");
            navigation.goBack();
        } else {
            Alert.alert("Invalid input", "Please enter a valid number of questions");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.content}>
                    <View style={styles.settingItem}>
                        <Text style={styles.label}>Number of Questions per Quiz</Text>
                        <Text style={styles.description}>
                            Set the default number of questions generated for each quiz.
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={tempNum}
                            onChangeText={setTempNum}
                            keyboardType="numeric"
                            placeholder="e.g. 20"
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.background,
        backgroundColor: colors.white,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.text,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    settingItem: {
        marginBottom: 20,
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 15,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: colors.primaryLight,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: colors.text,
        backgroundColor: colors.background,
    },
    saveButton: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "bold",
    },
});
