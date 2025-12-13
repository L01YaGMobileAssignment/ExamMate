export const apiEndpoints = {
  health: "/health",



  getAllQuizzes: "/quizzes", // lấy tất cả các quizzes
  genQuiz: "/quizzes/generate", // tạo một quiz từ document
  getQuizById: "/quizzes/:id", // lấy một quiz theo id của quiz



  getDocuments: "/documents",  // lấy tất cả các document ở dạng meta data
  getDocumentById: "/documents/:id", // lấy một document theo id của document
  uploadDocument: "/documents", // upload một document
  getDocumentByTitle: "/documents/title/:title", // lấy một document theo title
};
