import { Job, Worker } from "bullmq";
import {
  cloneRepositoryQueue,
  codeChunkingQueue,
  connection,
} from "../queues/queues";
import SimpleGit from "simple-git";
import { createDir, hashString } from "../utils/common";
import path from "path";
import { createChromaDbCollection } from "../database/chromadb";

const git = SimpleGit();

export const repoCloneWorker = new Worker(
  "cloneRepositoryQueue",
  async (job: Job) => {
    const { userId, mineId, gitUrl } = job.data;

    // clone the repository
    try {
      // create a id for folder name from repon
      const folderId = hashString(gitUrl);
      const dirPath = path.join(__dirname, "../../gitrepos", folderId);
      await createDir(dirPath);

      // clone git repo
      console.log(`cloning git repo: ${gitUrl}`);
      try {
        await git.clone(gitUrl, dirPath);
        console.log("successfully cloned git repo\n ");
      } catch (error) {
        console.log("error while creating the directory" + error);
        return;
      }

      // create a chroma db collection
      const collection = await createChromaDbCollection(folderId);
      console.log(`collection created ${collection?.id}`);

      // add a new job to codeChunkingQueue
      const addRes = await codeChunkingQueue.add(
        "createCodeChunk",
        {
          userId,
          mineId,
          gitUrl,
          repoDirPath: dirPath,
        }
        // { jobId: hashString(gitUrl) }
      );
      console.log(
        `added code chunk job to codeChunkingQueue Id: ${addRes?.id}`
      );
    } catch (error) {
      throw new Error(
        "error creating dir for git url: " + gitUrl + "\n Error: " + error
      );
    }
  },
  {
    connection,
    autorun: false,
  }
);
