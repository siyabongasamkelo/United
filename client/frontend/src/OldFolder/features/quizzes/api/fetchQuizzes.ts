// 1. Define the structural shape QuizAPI uses for its question objects
export interface QuizAPIQuestion {
  id: number;
  question: string;
  description: string | null;
  answers: {
    answer_a: string | null;
    answer_b: string | null;
    answer_c: string | null;
    answer_d: string | null;
    answer_e: string | null;
    answer_f: string | null;
  };
  multiple_correct_answers: "true" | "false";
  correct_answers: {
    answer_a_correct: "true" | "false";
    answer_b_correct: "true" | "false";
    answer_c_correct: "true" | "false";
    answer_d_correct: "true" | "false";
  };
  category: string;
  difficulty: string;
}

// 2. Define the clean, optimized format our frontend QuizCard actually needs
export interface CleanedQuizQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: string;
  answers: string[]; // Flat array of strings for our large tap buttons
  correct_answer: string; // The exact text string matching the right choice
}

/**
 * Fetches technical questions from QuizAPI and reformats them for optimal frontend execution.
 */
export const fetchQuizzes = async (
  category: string = "Code",
): Promise<CleanedQuizQuestion[]> => {
  // Replace with your real QuizAPI token key or route it through your fast backend proxy
  const API_KEY = "YOUR_QUIZAPI_KEY_HERE";
  const URL = `https://quizapi.io{API_KEY}&limit=5&category=${category}`;

  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error("Could not retrieve training questions. Please try again.");
  }

  const rawData: QuizAPIQuestion[] = await response.json();

  // 3. The Data Transformation Engine (Cleaning raw backend bloat)
  return rawData.map((item) => {
    // Collect only non-null multiple-choice answer strings
    const answersList = Object.values(item.answers).filter(
      (ans): ans is string => ans !== null,
    );

    // Find which key was marked true in the correct_answers mapping block
    let correctText = answersList[0]; // Fallback safety target

    if (
      item.correct_answers.answer_a_correct === "true" &&
      item.answers.answer_a
    )
      correctText = item.answers.answer_a;
    else if (
      item.correct_answers.answer_b_correct === "true" &&
      item.answers.answer_b
    )
      correctText = item.answers.answer_b;
    else if (
      item.correct_answers.answer_c_correct === "true" &&
      item.answers.answer_c
    )
      correctText = item.answers.answer_c;
    else if (
      item.correct_answers.answer_d_correct === "true" &&
      item.answers.answer_d
    )
      correctText = item.answers.answer_d;

    return {
      id: item.id,
      question: item.question,
      category: item.category || category,
      difficulty: item.difficulty,
      answers: answersList,
      correct_answer: correctText,
    };
  });
};
