import { useState, useEffect, useRef } from "react";
import { useUser } from "../../users/context/UserContext"; // Aligned with user context usage
// import {
//   SafetyQuizService,
//   IQuizTopicResponse,
//   IQuizAttemptResponse,
//   IUserSelectionPayload,
// } from "../services/safetyQuizService";

import { SafetyQuizService } from "../services/safetyQuizService";
import type {
  IQuizTopicResponse,
  IQuizAttemptResponse,
  IUserSelectionPayload,
} from "../services/safetyQuizService";

export function useSafetyQuizEngine(quizTopicId: string | undefined) {
  const { currentUser } = useUser(); // Pulls secure company indices

  // Signature Drawing References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  // Core Engine States
  const [quizData, setQuizData] = useState<IQuizTopicResponse | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0); // Loops 0 to N-1 (Questions), N (Signature), N+1 (Results)
  const [selections, setSelections] = useState<IUserSelectionPayload[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Status & Telemetry Pipelines
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const [quizResult, setQuizResult] = useState<IQuizAttemptResponse | null>(
    null,
  );

  // Load target safety module details on focus
  useEffect(() => {
    async function loadQuizModule() {
      if (!quizTopicId) return;
      try {
        setIsLoading(true);
        const lists = await SafetyQuizService.getAvailableQuizzes();
        const match = lists.find((q) => q._id === quizTopicId);
        if (match) {
          setQuizData(match);
        } else {
          setFeedback({
            type: "error",
            msg: "Safety quiz template could not be resolved.",
          });
        }
      } catch (err: any) {
        setFeedback({
          type: "error",
          msg: err.message || "Network execution connection failure.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadQuizModule();
  }, [quizTopicId]);

  const handleOptionSelect = (optionLetter: string) => {
    if (!quizData) return;
    setSelectedOption(optionLetter);

    const activeQuestionId = quizData.questions[currentStep].questionId;
    setSelections((prev) => {
      const clean = prev.filter((item) => item.questionId !== activeQuestionId);
      return [
        ...clean,
        { questionId: activeQuestionId, selectedAnswer: optionLetter },
      ];
    });
  };

  const advanceEngine = () => {
    if (!quizData) return;
    setFeedback(null);

    // Guard Check: Ensure an option was selected before stepping forward
    if (currentStep < quizData.questions.length && !selectedOption) {
      setFeedback({
        type: "error",
        msg: "Compliance Guard: You must select an option to continue.",
      });
      return;
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    // Resolve next step selection if worker is navigating back/forth
    if (nextStep < quizData.questions.length) {
      const nextQuestionId = quizData.questions[nextStep].questionId;
      const existing = selections.find((s) => s.questionId === nextQuestionId);
      setSelectedOption(existing ? existing.selectedAnswer : null);
    } else {
      setSelectedOption(null);
    }
  };

  // 📝 SIGNATURE CANVAS OPERATIONS
  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isDrawingRef.current = true;
    ctx.beginPath();

    // Abstract coordinates handling for touch vs mouse input devices
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const drawVector = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#1e1b4b"; // Matches your deep corporate indigo palette signature
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFeedback(null);
  };

  // 🚀 SUBMIT ENGINE TRANSACTION PIPELINE
  const executeFinalSubmission = async () => {
    if (!quizData || !currentUser) return;
    setFeedback(null);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert drawn canvas signature index cleanly into base64 payload strings
    const sigDataUrl = canvas.toDataURL("image/png");

    // Check for empty/untouched signature pads to maintain compliance constraints
    const blank = document.createElement("canvas");
    blank.width = canvas.width;
    blank.height = canvas.height;
    if (sigDataUrl === blank.toDataURL("image/png")) {
      setFeedback({
        type: "error",
        msg: "Legal Requirement: You must provide a physical signature confirmation.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const outcome = await SafetyQuizService.submitQuiz({
        quizTopicId: quizData._id,
        storeId:
          currentUser.assignedStores[0]?.storeId || "651f1234567890abcdef0001", // Context tracking
        branchId: currentUser.branchId || "651f1234567890abcdef0002",
        digitalSignature: sigDataUrl,
        answers: selections,
      });

      setQuizResult(outcome);
      setCurrentStep(quizData.questions.length + 1); // Move directly to evaluation layout view panels
    } catch (err: any) {
      setFeedback({
        type: "error",
        msg: err.message || "Server transmission execution failure.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentUser,
    quizData,
    currentStep,
    selectedOption,
    isLoading,
    isSubmitting,
    feedback,
    quizResult,
    canvasRef,
    handleOptionSelect,
    advanceEngine,
    startDrawing,
    drawVector,
    stopDrawing,
    clearCanvas,
    executeFinalSubmission,
  };
}
