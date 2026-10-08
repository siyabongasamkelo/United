import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const userSelectionValidationSchema = z.object({
  questionId: z.string().min(1, "Question trace identifier is required"),
  selectedAnswer: z
    .string()
    .min(1, "An option selection must be provided")
    .toUpperCase()
    .trim(),
});

export const quizSubmissionPayloadSchema = z.object({
  quizTopicId: z
    .string()
    .min(1, "Target quiz topic identifier is mandatory")
    .regex(objectIdRegex, "Invalid database topic ID layout reference"),
  storeId: z
    .string()
    .min(1, "Store operational reference tracking is required")
    .regex(objectIdRegex, "Invalid database store ID reference"),
  branchId: z
    .string()
    .min(1, "Target operational branch boundary reference is required")
    .regex(objectIdRegex, "Invalid database branch ID reference"),
  digitalSignature: z
    .string()
    .min(
      5,
      "A handwritten signature confirmation string is legally required to finalize the audit log",
    ),
  answers: z
    .array(userSelectionValidationSchema)
    .min(
      1,
      "You must supply answer responses to evaluate the performance profile",
    ),
});

export type QuizSubmissionInput = z.infer<typeof quizSubmissionPayloadSchema>;
