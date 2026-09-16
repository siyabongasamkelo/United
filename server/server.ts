import express from "express";
import quizRouter from "./features/quiz-engine/Quiz.routes";
import tutorialRouter from "./features/tutorials/Tutorial.routes";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// Mount the Feature-Driven Router
app.use("/api/v1/quiz", quizRouter);
app.use("/api/v1/tutorials", tutorialRouter);

// Global Error Handler catches all next(error) triggers from controllers perfectly
// app.use(globalErrorHandler);
export default app;
