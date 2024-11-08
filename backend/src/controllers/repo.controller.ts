import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ProtectedRequest } from "../types/app-request";
import { cloneRepositoryQueue } from "../queues/queues";
import { ApiResponse } from "../utils/ApiResponse";
import { hashString } from "../utils/common";
import { RepositoryModel } from "../models/repository.model";

export const handleGitRepoUploads = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { url, mineId } = req.body;
    const { id } = req.user as { id: string };

    if (!url || !mineId) {
      return res
        .status(400)
        .json(new ApiResponse(400, "url or mineId not provided!"));
    }

    // push the repository into the db
    await RepositoryModel.addRepository(mineId, url);

    // push the repo clone job to queue
    await cloneRepositoryQueue.add(
      "cloneRepo",
      {
        userId: id,
        mineId: mineId,
        gitUrl: url,
      }
      // { jobId: hashString(url) }
    );

    return res.status(200).json(new ApiResponse(200, "uploaded repo url"));
  }
);
