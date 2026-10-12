"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizSubmissionPayloadSchema = exports.userSelectionValidationSchema = void 0;
const zod_1 = require("zod");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
exports.userSelectionValidationSchema = zod_1.z.object({
    questionId: zod_1.z.string().min(1, "Question trace identifier is required"),
    selectedAnswer: zod_1.z
        .string()
        .min(1, "An option selection must be provided")
        .toUpperCase()
        .trim(),
});
exports.quizSubmissionPayloadSchema = zod_1.z.object({
    quizTopicId: zod_1.z
        .string()
        .min(1, "Target quiz topic identifier is mandatory")
        .regex(objectIdRegex, "Invalid database topic ID layout reference"),
    storeId: zod_1.z
        .string()
        .min(1, "Store operational reference tracking is required")
        .regex(objectIdRegex, "Invalid database store ID reference"),
    branchId: zod_1.z
        .string()
        .min(1, "Target operational branch boundary reference is required")
        .regex(objectIdRegex, "Invalid database branch ID reference"),
    digitalSignature: zod_1.z
        .string()
        .min(5, "A handwritten signature confirmation string is legally required to finalize the audit log"),
    answers: zod_1.z
        .array(exports.userSelectionValidationSchema)
        .min(1, "You must supply answer responses to evaluate the performance profile"),
});
