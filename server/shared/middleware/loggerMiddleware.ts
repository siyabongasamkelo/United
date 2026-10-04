import { Request, Response, NextFunction } from "express";

interface LoggerRequest extends Request {
  auth?: {
    userId: string;
  };
}

export const requestLogger = (
  req: LoggerRequest,
  res: Response,
  next: NextFunction,
): void => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get("user-agent") || "Unknown Device";

  // Intercept the request start
  console.log(`[${timestamp}] 📡 ${method} request initiated on path: ${url}`);
  console.log(`📱 Hardware Signatures: ${userAgent}`);

  // Hook into response completion to calculate performance metrics later if needed
  res.on("finish", () => {
    const operator = req.auth?.userId
      ? `ClerkId: ${req.auth.userId}`
      : "Anonymous/Unauthenticated";
    console.log(
      `[${new Date().toISOString()}] ✅ Status ${res.statusCode} returned for ${method} ${url} | Actor: ${operator}\n`,
    );
  });

  next();
};
