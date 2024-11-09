import { Worker } from "bullmq";
import { getEmbeddings } from "../utils/embeddingsGen";
import { chromaDbQueue, connection } from "../queues/queues";
import { RepositoryModel } from "../models/repository.model";
import { RepositoryStatus } from "@prisma/client";
export const embeddingsGenWorker = new Worker(
  "embeddingCreationQueue",
  async (job) => {
    try {
      const { repoId, fileChunksArr } = job.data;

      // arr to store embeddings
      const embeddings = [];

      // generate embeddings for each chunk
      console.log("generating embeddings for chunks...");
      for (const chunk of fileChunksArr) {
        const { startLine, endLine, filePath, content } = chunk;

        const { embedding } = (await getEmbeddings(
          JSON.stringify(content)
        )) as any;

        embeddings.push({
          startLine,
          endLine,
          filePath,
          content,
          embedding,
        });
      }

      console.log(
        "embeddings generated successfully, total size: " + embeddings.length
      );

      // push all the embeddings to chromaDbQueue to be pushed into the chroma db
      const psRes = await chromaDbQueue.add(
        "pushEmbToChromaDb",
        {
          repoId,
          embeddings,
        },
        { jobId: repoId }
      );
      console.log("embeddings pushed to chromaDbQueue, id: " + psRes.id);
    } catch (error) {
      console.log("error while generating chunks " + error);
    }
  },
  { connection, autorun: false }
);
