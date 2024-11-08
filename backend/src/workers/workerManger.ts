// src/workers/workerManager.ts
import { codeChunkWorker } from "./codeChunking.worker";
import { embeddingsGenWorker } from "./embeddingsCreation.worker";
import { embProcessor } from "./embProc.worker";
import { repoCloneWorker } from "./repoClone.worker";

let isWorkerInitialized = false;

export const startWorkers = () => {
  if (!isWorkerInitialized) {
    try {
      // Initialize and start the worker
      repoCloneWorker.run();
      codeChunkWorker.run();
      embeddingsGenWorker.run();
      embProcessor.run();
      isWorkerInitialized = true;
      console.log("Workers started.");
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Worker is already running.");
  }
};
