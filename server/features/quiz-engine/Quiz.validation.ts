import { z } from "zod";

export const SubmitAnswerSchema = z.object({
  body: z.object({
    testId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Test ID format"),
    answers: z.array(
      z.object({
        questionId: z
          .string()
          .regex(/^[0-9a-fA-F]{24}$/, "Invalid Question ID format"),
        selectedPayload: z.unknown(), // Can be string index, array, or coordinates
      }),
    ),
  }),
});

export type SubmitAnswerInput = z.infer<typeof SubmitAnswerSchema>;
