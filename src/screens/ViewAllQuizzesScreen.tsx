import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { norm_colors as colors } from "../template/color";
import { QuizzesType } from "../types/document";
import { Ionicons } from "@expo/vector-icons";
import { docIconName } from "../const/iconName";
import InputText from "../components/input/inputText";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getQuizByTitle, getQuizzes } from "../services/quizzesService";
import { HomeStackParamList } from "../navigation/HomeNavigator";
import { useQuizStore } from "../store/quizStore";
import { normTime } from "../utils/normTime";
import { useTranslation } from "../utils/i18n/useTranslation";

type Props = NativeStackScreenProps<HomeStackParamList, "ViewAllQuizzes">;
export default function ViewAllQuizzesScreen({ navigation }: Props) {
    const { t } = useTranslation();
    const [listQuizzes, setListQuizzes] = useState<QuizzesType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [pageSize, setPageSize] = useState(8);
    const [quizDetail, setQuizDetail] = useState<QuizzesType>();
    const [hasMounted, setHasMounted] = useState(false);

    const [onLoading, setOnLoading] = useState(false);
    const [onRefresh, setOnRefresh] = useState(false);
    const [onLoadMore, setOnLoadMore] = useState(false);

    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleSearch = (title_key: string) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(async () => {
            if (title_key.length > 0) {
                const new_list = await getQuizByTitle(title_key);
                setListQuizzes(new_list.data);
            } else {
                const new_list = await getQuizzes(currentPage, pageSize);
                setListQuizzes(new_list.data);
            }
        }, 500);

        setSearchTimeout(timeout);
    };

    const handleRefresh = async () => {
        if (onRefresh || onLoading || onLoadMore || !hasMounted) return;
        setOnRefresh(true);
        setCurrentPage(1);
        const res = await getQuizzes(1, pageSize, true);
        setListQuizzes(res.data);
        setOnRefresh(false);
    };

    const handleLoadMore = async () => {
        if (currentPage >= totalPage) return;
        if (onLoading || onRefresh || onLoadMore) return;
        setOnLoadMore(true);
        const new_list = await getQuizzes(currentPage + 1, pageSize);
        var temp = listQuizzes;
        temp = temp.concat(new_list.data);
        setCurrentPage(currentPage + 1);
        setListQuizzes(temp);
        setOnLoadMore(false);
    };

    const handleDetail = (quiz: QuizzesType) => {
        setQuizDetail(quiz);
        navigation.navigate("QuizOverview", { quiz });
    };

    useEffect(() => {
        const fetchData = async () => {
            setOnLoading(true);
            const new_list = await getQuizzes(currentPage, pageSize);
            setListQuizzes(new_list.data);
            setHasMounted(true);
            setOnLoading(false);
        };
        fetchData();
    }, [useQuizStore((state) => state.quizzes.length)]);

    const renderQuiz = (quiz: QuizzesType) => {
        const icon: any = docIconName.pdf;
        return (
            <View style={styles.docCard}>
                <Ionicons name={icon} size={36} style={styles.optionIcon} />
                <View style={styles.docContent}>
                    <View style={styles.docTextContainer}>
                        <Text style={styles.docTitle} numberOfLines={1} ellipsizeMode="tail">
                            {quiz.quiz_title}
                        </Text>
                        <Text style={styles.docUploadTime}>{normTime(quiz.created_at)}</Text>
                    </View>
                    <TouchableOpacity style={styles.docButton} onPress={() => handleDetail(quiz)}>
                        <Text style={styles.docButtonText}>{t.detail}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    if (onLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <View style={styles.headerLeft}></View>
                <View>
                    <Text style={styles.title}>{t.my_quizzes}</Text>
                </View>
                {/* @ts-ignore */}
                <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate("DocumentsTab", {
                    screen: "Documents"
                })}>
                    <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
                    <Text style={styles.headerRightText}>{t.new}</Text>
                </TouchableOpacity>
            </View>
            <InputText
                placeholder={t.search_quiz_placeholder}
                iconLeft="search-outline"
                style={styles.searchDoc}
                borderRadius={30}
                onChangeText={(title_key: string) => handleSearch(title_key)}
            ></InputText>
            {listQuizzes && listQuizzes.length > 0 ? (
                <View>
                    <FlatList
                        data={listQuizzes}
                        renderItem={({ item }) => renderQuiz(item)}
                        keyExtractor={(item, index) =>
                            "quiz-" + item?.quiz_id?.toString() + index.toString()
                        }
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                        refreshing={onRefresh}
                        onRefresh={handleRefresh}
                        contentContainerStyle={[
                            styles.scrollContainer,
                            { paddingBottom: 150 },
                        ]}
                        ListFooterComponent={
                            onLoadMore ? <ActivityIndicator size="small" /> : null
                        }
                    />
                </View>
            ) : (
                <View style={styles.noDocumentContainer}>
                    <Text style={styles.noDocument}>{t.no_quizzes_found}</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: 8,
        padding: 8,
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 8,
    },
    headerRightText: {
        fontSize: 16,
        padding: 4,
        fontWeight: "600",
    },
    title: {
        fontSize: 20,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "600",
        color: colors.text,
    },
    scrollContainer: {
        padding: 15,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    docCard: {
        width: "100%",
        height: 100,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginVertical: 5,
        marginHorizontal: 2,
        padding: 10,
        borderRadius: 15,
        borderColor: colors.border,
        borderWidth: 1,
        boxShadow: "2px 3px 1px #959595ff",
    },
    optionIcon: {
        marginRight: 15,
        color: colors.primary,
    },
    docTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
    },
    docUploadTime: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
        marginBottom: 10,
    },
    docButton: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        color: colors.white,
    },
    docButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.white,
    },
    searchDoc: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.text,
        marginTop: 8,
        marginBottom: 8,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        marginHorizontal: 2,
        borderRadius: 30,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    docContent: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    docTextContainer: {
        flex: 1,
        paddingRight: 10,
    },
    noDocumentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noDocument: {
        fontSize: 16,
        color: colors.textSecondary,
    },
});
