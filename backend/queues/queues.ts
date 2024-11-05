import { Queue } from "bullmq";
import { redisConnection } from "../src/config";

// queue for storing urls to be cloned
export const gitQueue = new Queue("gitQueue", {
  connection: redisConnection,
});

// queue for storing jobs, to create chunks of the code in repo
export const repoQueue = new Queue("repoQueue", {
  connection: redisConnection,
});

// queue for storing jobs to create embeddings of chunks
export const chunkQueue = new Queue("chunkQueue", {
  connection: redisConnection,
});

// queue for storing jobs to push embeddings into chromadb
export const embeddingQueue = new Queue("embeddingQueue", {
  connection: redisConnection,
});
