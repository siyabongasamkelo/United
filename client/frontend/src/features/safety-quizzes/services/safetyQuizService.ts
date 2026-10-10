import { api } from "../../../shared/api/axiosInstance";

export interface IQuizQuestion {
  questionId: string;
  questionText: string;
  options: string[];
}

export interface IQuizTopicResponse {
  _id: string;
  title: string;
  description: string;
  hazardLevel: "LOW" | "MEDIUM" | "HIGH";
  passingScorePercentage: number;
  questions: IQuizQuestion[];
}

export interface IUserSelectionPayload {
  questionId: string;
  selectedAnswer: string;
}

export interface ISubmitQuizPayload {
  quizTopicId: string;
  storeId: string;
  branchId: string;
  digitalSignature: string;
  answers: IUserSelectionPayload[];
}

export interface IAnswerBreakdown {
  questionId: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface IQuizAttemptResponse {
  _id: string;
  quizTopic: string;
  score: number;
  totalQuestions: number;
  percentageScore: number;
  hasPassed: boolean;
  digitalSignature: string;
  breakdown: IAnswerBreakdown[];
  attemptDate: string;
}

export interface ICertificationResponse {
  _id: string;
  quizTopic: {
    _id: string;
    title: string;
    hazardLevel: "LOW" | "MEDIUM" | "HIGH";
  };
  quizAttempt: string;
  dateEarned: string;
  verificationHash: string;
}

export class SafetyQuizService {
  /**
   * GET: Fetches active questionnaires (Secure: Backend does not include answer keys)
   */
  static async getAvailableQuizzes(): Promise<IQuizTopicResponse[]> {
    const response = await api.get<{
      success: boolean;
      data: IQuizTopicResponse[];
    }>("/safety-quizzes/available");
    return response.data.data;
  }

  /**
   * POST: Transmits answers and signatures for server-side evaluation and recording
   */
  static async submitQuiz(
    payload: ISubmitQuizPayload,
  ): Promise<IQuizAttemptResponse> {
    const response = await api.post<{
      success: boolean;
      data: IQuizAttemptResponse;
    }>("/safety-quizzes/submit", payload);
    return response.data.data;
  }

  static async getMyCertificates(): Promise<ICertificationResponse[]> {
    const response = await api.get<{
      success: boolean;
      data: ICertificationResponse[];
    }>("/safety-quizzes/my-logs"); // Reusing your personal history logs which can populate certifications or create a separate backend route if desired

    // Alternative direct endpoint if your backend router introduces /certificates:
    // const response = await api.get<{ success: boolean; data: ICertificationResponse[] }>("/certificates/my-badges");
    return response.data.data;
  }
}
