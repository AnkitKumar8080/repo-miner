import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { corsUrl } from "./config";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { mineRouter } from "./routes/mine.routes";
import { repoRouter } from "./routes/repo.routes";
import { startWorkers } from "./workers/workerManger";

const app = express();

// main app level middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: corsUrl,
  })
);

app.get("/health", (_req: Request, res: Response) => {
  res.send(200);
});

// handle routes

// routes
app.use("/auth", authRouter);
app.use("/mine", mineRouter);
app.use("/repo", repoRouter);

// configure the error handler
app.use(errorHandler);

// start all the workers
startWorkers();

// create a http server
const httpServer = createServer(app);

export default httpServer;
