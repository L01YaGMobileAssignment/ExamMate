import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { norm_colors as colors } from '../template/color';
import { DocumentType } from '../types/document';
import { Ionicons } from '@expo/vector-icons';
import { docIconName } from '../const/iconName';
import InputText from '../components/input/inputText';
import { getDocuments, getDocumentsByTitleKey } from '../services/docApiService';
import { useNavigation } from '@react-navigation/native';

export default function DocumentsScreen() {
  const [listDocument, setListDocument] = useState<DocumentType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(2);
  const [pageSize, setPageSize] = useState(8);
  const [documentDetail, setDocumentDetail] = useState<DocumentType>();
  const [hasMounted, setHasMounted] = useState(false);

  const [onLoading, setOnLoading] = useState(false);
  const [onRefresh, setOnRefresh] = useState(false);
  const [onLoadMore, setOnLoadMore] = useState(false);

  const navigation = useNavigation();

  const handleSearch = async (title_key: string) => {
    if (title_key.length > 0) {
      const new_list = await getDocumentsByTitleKey(title_key);
      setListDocument(new_list.data);
    } else {
      const new_list = await getDocuments(currentPage,pageSize);
      setListDocument(new_list.data);
    }
  }

  const handleRefresh = async () => {
  if (onRefresh || onLoading || onLoadMore || !hasMounted) return;
  setOnRefresh(true);
  setCurrentPage(1);
  const res = await getDocuments(1, pageSize);
  setListDocument(res.data);
  setOnRefresh(false);
};


  const handleLoadMore = async () => {
    if (currentPage >= totalPage) return;
    if (onLoading || onRefresh || onLoadMore) return;
    setOnLoadMore(true);
    const new_list = await getDocuments(currentPage+1,pageSize);
    var temp = listDocument;
    temp = temp.concat(new_list.data);
    setCurrentPage(currentPage + 1);
    setListDocument(temp);
    setOnLoadMore(false);
  }

  const handleDetail = (document: DocumentType) => {
    setDocumentDetail(document);
    navigation.navigate('DocumentDetail', { document });
  }

  useEffect(() => {
    const fetchData = async () => {
      setOnLoading(true);
      const new_list = await getDocuments(currentPage,pageSize);
      setListDocument(new_list.data);
      setHasMounted(true);
      setOnLoading(false);
    }
    fetchData();
  }, []);

  const renderDocument = (document: DocumentType) => {
    const icon:any = docIconName[document.fileType as keyof typeof docIconName];
    return (
        <View style={styles.docCard}>
          <Ionicons name={icon} size={36} style={styles.optionIcon} />
          <View style = {{flexDirection: "row", 
                justifyContent: "space-between",
                width: "90%",
                alignItems: "center"}}>
            <View>
              <Text style={styles.docTitle}>{document.title}</Text>
              <Text style={styles.docUploadTime}>{document.createdAt}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDetail(document)}>
              <Text style={styles.docButton}>Detail</Text>
            </TouchableOpacity> 
          </View>
        </View>
    )
  }
  if (onLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      {listDocument?
      <View>
        <InputText
          placeholder="Enter your document title"
          iconLeft='search-outline'
          style={styles.searchDoc}
          onChangeText={(title_key:string)=>handleSearch(title_key)}
        >
        </InputText>
        <FlatList
          data={listDocument}
          renderItem={({ item }) => renderDocument(item)}
          keyExtractor={(item,index) => "doc-"+item.id.toString()+index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshing={onRefresh}
          onRefresh={handleRefresh}
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: 120 }]}
          ListFooterComponent={
          onLoadMore ? <ActivityIndicator size="small" /> : null
          }
        />
      </View>
      :
      <Text>No document</Text>
    }
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.screenBackground, 
  },
  scrollContainer: {
    padding: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docCard: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    marginVertical: 5,
    marginHorizontal: 2,
    padding: 10,
    borderRadius: 12,
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
    fontWeight: '600',
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
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 8,
    color: colors.white,
  },
  searchDoc: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});