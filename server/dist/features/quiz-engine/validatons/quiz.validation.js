"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitAnswerSchema = exports.CreateSessionSchema = void 0;
const zod_1 = require("zod");
exports.CreateSessionSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z
            .string()
            .min(1, "User ID is required to track who is writing the test."),
        quizId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid Quiz ObjectId format."),
    }),
});
exports.SubmitAnswerSchema = zod_1.z.object({
    params: zod_1.z.object({
        sessionId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid Session ObjectId format."),
    }),
    body: zod_1.z.object({
        questionId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid Question ObjectId format."),
        selectedOptions: zod_1.z
            .array(zod_1.z.string())
            .min(1, "At least one option must be selected."),
        timeSpentSeconds: zod_1.z.number().min(0, "Time spent cannot be negative."),
    }),
});
