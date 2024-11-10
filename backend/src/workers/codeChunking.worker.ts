import { Worker } from "bullmq";
import { connection, embeddingCreationQueue } from "../queues/queues";
import {
  createFilechunks,
  getRepoFilePaths,
  hashString,
} from "../utils/common";
import { RepositoryStatus } from "@prisma/client";
import { RepositoryModel } from "../models/repository.model";

export const codeChunkWorker = new Worker(
  "codeChunkingQueue",
  async (job) => {
    const { userId, mineId, gitUrl, repoDirPath, repoId } = job.data;

    // generate chunks of each file
    const fileChunksArr = [];

    // get all file paths of the repo
    const filePaths = await getRepoFilePaths(repoDirPath);

    if (!filePaths.length) {
      return console.log("No filepaths exist");
    }

    for (const path of filePaths) {
      const chunk = await createFilechunks(path);
      if (chunk) {
        fileChunksArr.push(...chunk);
      }
    }
    console.log(
      "Successfully generated chunk of each file, total chunks: " +
        fileChunksArr.length
    );

    // add the chunks in the embeddingsQueue as a job for generating embeddings
    const psRes = await embeddingCreationQueue.add(
      "createEmbeddings",
      {
        // repoHash: hashString(gitUrl),
        repoId,
        fileChunksArr,
      },
      { jobId: repoId }
    );

    console.log(
      `Added ${fileChunksArr.length} chunks to the embeddingsCreationQueue jobId: ${psRes.id}`
    );

    // update repository status
    const updatedRepo = await RepositoryModel.updateRepositoryStatus(
      repoId,
      RepositoryStatus.EMBEDDING
    );

    if (updatedRepo) {
      console.log(`updated repo: ${repoId} status to "EMBEDDING"`);
    }
  },

  {
    connection,
    autorun: false,
  }
);
