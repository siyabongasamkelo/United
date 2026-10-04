import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.js";
import { ZodError, ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (error) {
      if (error instanceof ZodError) {
        // Formats errors beautifully for the client output payload
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message || "Validation constraint error occurred",
          status: "false",
        }));

        logger.error(
          `[Zod Middleware] Input field verification failed. Rejecting incoming request body.`,
        );

        return res.status(400).json({
          status: "fail",
          errors: formattedErrors,
        });
      }
      next(error);
    }
  };
