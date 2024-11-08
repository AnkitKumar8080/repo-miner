import { Queue } from "bullmq";
import IORedis from "ioredis";
import { redisConnection } from "../config";

export const connection = new IORedis(redisConnection);
// console.log(connection);

// Queue for handling repository cloning tasks
export const cloneRepositoryQueue = new Queue("cloneRepositoryQueue", {
  connection: connection,
});

// Queue for handling tasks related to creating chunks from repository code
export const codeChunkingQueue = new Queue("codeChunkingQueue", {
  connection: connection,
});

// Queue for handling tasks related to generating embeddings for code chunks
export const embeddingCreationQueue = new Queue("embeddingCreationQueue", {
  connection: connection,
});

// Queue for handling tasks that push embeddings into ChromaDB
export const chromaDbQueue = new Queue("embeddingStorageQueue", {
  connection: connection,
});
