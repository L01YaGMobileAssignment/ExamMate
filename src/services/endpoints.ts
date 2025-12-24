export const apiEndpoints = {
  health: "/health",

  register: "/register",
  signin: "/token",

  getUserInfor: "/users/me",

  getAllQuizzes: "/quizzes", // lấy tất cả các quizzes
  genQuiz: "/quizzes/generate", // tạo một quiz từ document
  getQuizById: "/quizzes/:id", // lấy một quiz theo id của quiz
  searchQuizzes: "/quizzes/search", // lấy một quiz theo title

  getDocuments: "/documents", // lấy tất cả các document ở dạng meta data
  getDocumentById: "/documents/:id", // lấy một document theo id của document
  uploadDocument: "/documents", // upload một document
  searchDocumentByKey: "/documents/search", // lấy một document theo title
  summaryDocument: "/documents/:id/summary", // lấy tóm tắt của document
  deleteDocument: "/documents/:id", // xóa một document
  viewFullDocument: "/documents/:id/view-full", // xem một document đầy đủ
  downloadDocument: "/documents/:id/download", // download một document
};
