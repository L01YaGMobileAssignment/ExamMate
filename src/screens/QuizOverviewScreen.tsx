import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { norm_colors as colors } from "../template/color";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/HomeNavigator";
import { getQuizById } from "../services/quizzesService";
import { QuizzesType } from "../types/document";
import { useQuizStore } from "../store/quizStore";
import { useTranslation } from "../utils/i18n/useTranslation";

type Props = NativeStackScreenProps<HomeStackParamList, "QuizOverview">;
export default function QuizOverviewScreen({ route, navigation }: Props) {
    const { t } = useTranslation();
    const { quiz } = route.params || {};
    const [isLoading, setIsLoading] = useState(false);
    const [quiz_, setQuiz_] = useState<QuizzesType>();
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            if (!quiz?.questions?.length) {
                const res = await getQuizById(quiz?.quiz_id);
                if (res.status === 200) {
                    const data = res.data;
                    setQuiz_(data);
                    useQuizStore.getState().updateQuiz(data.quiz_id, data.questions);
                } else {
                    Alert.alert("Error", "Failed to get quiz data.");
                    navigation.navigate("Home");
                }
            }
            else {
                setQuiz_(quiz);
                setIsLoading(false);
                return;
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);
    const handleStartQuiz = async () => {
        navigation.navigate("DoQuiz", { quiz: quiz_ });
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header} >
                <Text style={styles.title}>
                    {t.quiz_overview}
                </Text>
                <Text style={styles.subtitle}>
                    {quiz_?.quiz_title || quiz_?.quiz_id}
                </Text>
            </View>
            <View style={styles.content}>
                {/* <Text style={styles.text}>Quiz ID: {quiz_?.quiz_id}</Text> */}
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{t.questions_count}: {quiz_?.questions?.length}</Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{t.estimate_time}: {quiz_?.questions?.length}{t.minutes}</Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{t.difficulty_easy}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleStartQuiz()} style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>{t.start_quiz}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        padding: 16,
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 8,
    },
    backButton: {
        marginRight: 16,
    },
    backButtonText: {
        color: colors.primary,
        fontSize: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.text,
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 10,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        paddingVertical: 5,
    },
    separator: {
        height: 1,
        backgroundColor: colors.border,
        width: '100%',
        marginVertical: 5,
    },
    primaryBtn: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryBtnText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "600",
    },
});
