"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const zod_1 = require("zod");
const validate = (schema) => async (req, res, next) => {
    try {
        // Pass an object containing Express request properties
        const validatedFields = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        // Now TypeScript safely allows reading these properties instead of marking them unknown!
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
            logger_1.default.error(`[Zod Middleware] Input field verification failed. Rejecting incoming request body.`);
            return res.status(400).json({
                status: "fail",
                errors: formattedErrors,
            });
        }
        next(error);
    }
};
exports.validate = validate;
