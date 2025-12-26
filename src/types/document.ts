export type DocumentType = {
  id: string;
  title?: string;
  filename: string;
  summary: string;
  content: string;
  fileType: string;
  created_at: string;
  updatedAt: string;
};

export type QuestionType = {
  id: string,
  question: string,
  options: [string],
  answer_index: number,
  correct_answer: string,
  why_correct: string,
}

export type QuizzesType = {
  quiz_id: string,
  owned_by: string,
  quiz_title: string,
  questions: QuestionType[],
  created_at: string,
}
