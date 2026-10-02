import express from "express";
import tutorialRouter from "./features/tutorials/Tutorial.routes";
import jobRouter from "./features/job-portal/Job.routes";
import quizRouter from "./features/quiz-engine/routes/quiz.routes";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// Mount the Feature-Driven Router
app.use("/api/v1/tutorials", tutorialRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/quiz", quizRouter);

// Global Error Handler catches all next(error) triggers from controllers perfectly
// app.use(globalErrorHandler);
export default app;
