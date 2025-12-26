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
import { useTranslation } from "../utils/i18n/useTranslation";

export default function SettingScreen() {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const numberOfQuestions = useSettingStore(state => state.numberOfQuestions);
    const notifyTime = useSettingStore(state => state.notifyTime);
    const language = useSettingStore(state => state.language);
    const setNumberOfQuestions = useSettingStore(state => state.setNumberOfQuestions);
    const setNotifyTime = useSettingStore(state => state.setNotifyTime);
    const setLanguage = useSettingStore(state => state.setLanguage);

    const [tempNum, setTempNum] = useState(numberOfQuestions.toString());
    const [tempNotifyTime, setTempNotifyTime] = useState(notifyTime.toString());
    const [tempLanguage, setTempLanguage] = useState(language);

    useEffect(() => {
        setTempNum(numberOfQuestions.toString());
        setTempNotifyTime(notifyTime.toString());
        setTempLanguage(language);
    }, [numberOfQuestions, notifyTime, language]);
    // ...
    const handleSave = async () => {
        const num = parseInt(tempNum);
        const time = parseInt(tempNotifyTime);

        let isValid = true;
        let errorMessage = "";

        if (isNaN(num) || num <= 0) {
            isValid = false;
            errorMessage = t.error_num_questions;
        } else if (isNaN(time) || time <= 0) {
            isValid = false;
            errorMessage = t.error_notify_time;
        }

        if (isValid) {
            await Promise.all([
                setNumberOfQuestions(num),
                setNotifyTime(time),
                setLanguage(tempLanguage)
            ]);
            Alert.alert(t.success, t.settings_saved);
            navigation.goBack();
        } else {
            Alert.alert(t.invalid_input, errorMessage);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t.settings_title}</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.content}>
                    <View style={styles.settingItem}>
                        <Text style={styles.label}>{t.language}</Text>
                        <View style={styles.languageContainer}>
                            <TouchableOpacity
                                style={[styles.langButton, tempLanguage === 'en' && styles.langButtonActive]}
                                onPress={() => setTempLanguage('en')}
                            >
                                <Text style={[styles.langText, tempLanguage === 'en' && styles.langTextActive]}>{t.english || "English"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.langButton, tempLanguage === 'vi' && styles.langButtonActive]}
                                onPress={() => setTempLanguage('vi')}
                            >
                                <Text style={[styles.langText, tempLanguage === 'vi' && styles.langTextActive]}>{t.vietnamese || "Tiếng Việt"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.settingItem}>
                        <Text style={styles.label}>{t.num_questions}</Text>
                        <Text style={styles.description}>
                            {t.desc_num_questions}
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={tempNum}
                            onChangeText={setTempNum}
                            keyboardType="numeric"
                            placeholder={t.input_placeholder_questions}
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <Text style={styles.label}>{t.notify_before}</Text>
                        <Text style={styles.description}>
                            {t.desc_notify_before}
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={tempNotifyTime}
                            onChangeText={setTempNotifyTime}
                            keyboardType="numeric"
                            placeholder={t.input_placeholder_notify}
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>{t.save_changes}</Text>
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
    languageContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    langButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    langButtonActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
    },
    langText: {
        fontSize: 16,
        color: colors.text,
    },
    langTextActive: {
        color: colors.primary,
        fontWeight: "600",
    },
});
