"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const logger_js_1 = __importDefault(require("../utils/logger.js"));
const zod_1 = require("zod");
const validate = (schema) => async (req, res, next) => {
    try {
        // 🚀 The Architectural Fix: Pass an object containing Express request properties
        // This matches the z.object({ body, params, query }) structure used across your features!
        const validatedFields = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        // Assign the safely parsed and formatted fields back to the Express request object context
        req.body = validatedFields.body;
        req.query = validatedFields.query;
        req.params = validatedFields.params;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            // Formats errors beautifully for the client output payload
            const formattedErrors = error.issues.map((err) => ({
                field: err.path.join("."),
                message: err.message || "Validation constraint error occurred",
                status: "false",
            }));
            logger_js_1.default.error(`[Zod Middleware] Input field verification failed. Rejecting incoming request body.`);
            return res.status(400).json({
                status: "fail",
                errors: formattedErrors,
            });
        }
        next(error);
    }
};
exports.validate = validate;
