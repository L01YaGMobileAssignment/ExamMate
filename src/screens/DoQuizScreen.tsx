import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { norm_colors as colors } from "../template/color";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/HomeNavigator";
import { getQuizById } from "../services/quizzesService";
import { QuestionType, QuizzesType } from "../types/document";
import { Ionicons } from "@expo/vector-icons";
import { useQuizStore } from "../store/quizStore";

type Props = NativeStackScreenProps<HomeStackParamList, "DoQuiz">;
export default function QuizOverviewScreen({ route, navigation }: Props) {
    const { quiz } = route.params || {};
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [quiz_, setQuiz_] = useState<QuizzesType>();
    const [selectedAnswer, setSelectedAnswer] = useState<number[]>([-1]);
    const [isShowResult, setIsShowResult] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            if (quiz.questions.length !== 0) {
                setQuiz_(quiz);
                setIsLoading(false);
                return;
            }
            const res = await getQuizById(quiz?.quizz_id);
            if (res.status === 200) {
                const data = res.data;
                setQuiz_(data);
                useQuizStore.getState().updateQuiz(data.quiz_id, data.questions);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleAnswer = async (question_index: number, index: number) => {
        var newSelectedAnswer = [...selectedAnswer];
        newSelectedAnswer[question_index] = index;
        setSelectedAnswer(newSelectedAnswer);
    };
    const handleSubmitQuiz = async () => {
        setIsSubmit(true);
    };
    const handleNextQuestion = async () => {
        setIsShowResult(false);
        if (currentQuestion >= (quiz_?.questions?.length || 0) - 1) {
            handleSubmitQuiz();
            return;
        }
        setCurrentQuestion(currentQuestion + 1);
        const new_selectedAnswer = [...selectedAnswer, -1];
        setSelectedAnswer(new_selectedAnswer);
    };
    const handleSubmitQuestion = async () => {
        setIsShowResult(true);
        if (isShowResult) handleNextQuestion();
    };
    const handleTryAgain = async () => {
        setIsSubmit(false);
        setIsShowResult(false);
        setCurrentQuestion(0);
        setSelectedAnswer([-1]);
    };
    const getMark = () => {
        var mark = 0;
        selectedAnswer.forEach((answer, index) => {
            if (answer === quiz_?.questions[index].answer_index) {
                mark++;
            }
        });
        return mark;
    }
    const renderQuestion = (question: QuestionType) => {
        return (
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{question.question}</Text>
                <View style={styles.answerContainer}>
                    {question.options.map((option, index) => (
                        <TouchableOpacity key={question.id + "answer" + index} style={
                            !isShowResult ?
                                selectedAnswer[currentQuestion] === index ?
                                    styles.answerBtnSelected :
                                    styles.answerBtn :
                                question.answer_index === index ?
                                    styles.successBtn :
                                    selectedAnswer[currentQuestion] === index ?
                                        styles.failBtn :
                                        styles.answerBtn
                        } onPress={() => handleAnswer(currentQuestion, index)}
                            disabled={isShowResult}
                        >
                            <Ionicons name={selectedAnswer[currentQuestion] === index ? "radio-button-on" : "radio-button-off"} size={24} color={colors.primary} />
                            <Text style={styles.answerBtnText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };
    if (isLoading || !quiz_?.questions?.length) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            {!isSubmit ?
                <>
                    <View style={styles.header} >
                        <Text style={styles.title}>
                            {quiz_?.quiz_title}
                        </Text>
                    </View>
                    <View style={styles.processBarContainer}>
                        <Text style={styles.text}>Question {currentQuestion + 1}/{quiz_?.questions.length}</Text>
                        <View style={styles.processContainer}>
                            <View style={[styles.processBar, { width: `${((currentQuestion + 1) / (quiz_?.questions.length || 1)) * 100}%` }]} />
                        </View>
                    </View>
                    {renderQuestion(quiz_?.questions[currentQuestion])}
                    <TouchableOpacity onPress={() => handleSubmitQuestion()} style={selectedAnswer[currentQuestion] === -1 ? styles.disabledPrimaryBtn : styles.primaryBtn} disabled={selectedAnswer[currentQuestion] === -1}>
                        <Text style={selectedAnswer[currentQuestion] === -1 ? styles.disabledBtnText : styles.primaryBtnText}>{currentQuestion === quiz_?.questions.length - 1 ? "Submit" : "Next"}</Text>
                    </TouchableOpacity></> :
                <>
                    <View style={styles.header} >
                        <Text style={styles.subtitle}>
                            {quiz_?.quiz_title}
                        </Text>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Your score:</Text>
                            <Text style={styles.text}>{getMark()}/{quiz_?.questions.length}</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Estimate time:</Text>
                            <Text style={styles.text}>{quiz_?.questions.length} minutes</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => handleTryAgain()} style={styles.primaryBtn}>
                        <Text style={styles.primaryBtnText}>Try Again</Text>
                    </TouchableOpacity>
                </>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        position: "relative",
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
    questionContainer: {
        padding: 8,
        alignItems: "flex-start",
    },
    answerBtn: {
        backgroundColor: colors.primaryLight,
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        borderRadius: 8,
        paddingVertical: 8,
        width: "100%",
        paddingHorizontal: 8
    },
    answerBtnText: {
        fontSize: 16,
        maxWidth: "90%"
    },
    answerBtnSelected: {
        backgroundColor: colors.primaryLight,
        borderColor: colors.primary,
        borderWidth: 2,
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 8,
    },
    questionText: {
        fontSize: 20,
        color: colors.text,
        paddingVertical: 8,
        marginBottom: 8,
    },
    answerContainer: {
        width: "100%",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
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
        justifyContent: 'space-between',
        gap: 8,
        width: '100%',
        paddingVertical: 5,
    },
    primaryBtn: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginTop: 16,
        marginLeft: 8,
        marginRight: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    disabledPrimaryBtn: {
        backgroundColor: colors.primaryLight,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 20,
        margin: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    disabledBtnText: {
        color: colors.black,
        fontSize: 16,
        fontWeight: "600",
    },
    successBtn: {
        backgroundColor: colors.success,
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        borderRadius: 8,
        paddingVertical: 8,
        width: "100%",
        paddingHorizontal: 8
    },
    failBtn: {
        backgroundColor: colors.danger,
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        borderRadius: 8,
        paddingVertical: 8,
        width: "100%",
        paddingHorizontal: 8
    },
    primaryBtnText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "600",
    },
    separator: {
        height: 1,
        backgroundColor: colors.border,
        width: '100%',
        marginVertical: 5,
    },
    processContainer: {
        height: 16,
        backgroundColor: colors.primaryLight,
        marginTop: 0,
        borderRadius: 8,
        borderColor: colors.border,

    },
    processBar: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 8,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    processBarContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 8,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 8,
    },
});
