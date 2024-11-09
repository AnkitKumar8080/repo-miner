import { Worker } from "bullmq";
import { connection } from "../queues/queues";
import { addEmbChunkContentToCollection } from "../database/chromadb";
import { RepositoryStatus } from "@prisma/client";
import { RepositoryModel } from "../models/repository.model";

export const embProcessor = new Worker(
  "embeddingStorageQueue",
  async (job) => {
    const { repoId, embeddings } = job.data;

    try {
      // process the embeddings and push to chroma db
      for (const emb of embeddings) {
        const { startLine, endLine, filePath, content, embedding } = emb;

        await addEmbChunkContentToCollection(
          repoId,
          startLine,
          endLine,
          content,
          filePath,
          embedding
        );
      }
      console.log("embeddings processed and pushed to chroma db");

      // update repository status
      const updatedRepo = await RepositoryModel.updateRepositoryStatus(
        repoId,
        RepositoryStatus.COMPLETE
      );

      if (updatedRepo) {
        console.log(`update repo ${repoId} status to "COMPLETE"`);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  },
  { connection, autorun: false }
);
