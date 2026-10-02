import { z } from "zod";

export const CreateSessionSchema = z.object({
  body: z.object({
    userId: z
      .string()
      .min(1, "User ID is required to track who is writing the test."),
    quizId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Quiz ObjectId format."),
  }),
});

export const SubmitAnswerSchema = z.object({
  params: z.object({
    sessionId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Session ObjectId format."),
  }),
  body: z.object({
    questionId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Question ObjectId format."),
    selectedOptions: z
      .array(z.string())
      .min(1, "At least one option must be selected."),
    timeSpentSeconds: z.number().min(0, "Time spent cannot be negative."),
  }),
});
