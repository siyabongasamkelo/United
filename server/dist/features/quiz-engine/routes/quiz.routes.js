"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quiz_controller_js_1 = require("../controllers/quiz.controller.js");
const quiz_validation_js_1 = require("../validatons/quiz.validation.js");
const validate_middleware_js_1 = require("../../../middleware/validate.middleware.js"); // Standard request validator middleware snippet
const router = (0, express_1.Router)();
const controller = new quiz_controller_js_1.QuizController();
// Use the local bouncer validation layer before execution maps to endpoints
router.post("/sessions", (0, validate_middleware_js_1.validate)(quiz_validation_js_1.CreateSessionSchema), controller.startSession);
router.patch("/sessions/:sessionId/answer", (0, validate_middleware_js_1.validate)(quiz_validation_js_1.SubmitAnswerSchema), controller.saveAnswer);
exports.default = router;
