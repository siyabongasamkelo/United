import { Request, Response, NextFunction } from "express";
import logger from "../../utils/logger";
import { ZodError, ZodSchema } from "zod";

export const validate =
  (
    schema: ZodSchema<any>, // ✅ FIXED: Added <any> generic to let TypeScript inspect parsed properties
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
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
