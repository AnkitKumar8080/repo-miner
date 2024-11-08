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
    const repository = await RepositoryModel.addRepository(mineId, url);

    if (!repository) {
      throw new Error("error creating repository");
    }

    // push the repo clone job to queue
    await cloneRepositoryQueue.add(
      "cloneRepo",
      {
        userId: id,
        mineId: mineId,
        gitUrl: url,
        repoId: repository?.id,
      },
      { jobId: repository.id }
    );

    return res.status(200).json(new ApiResponse(200, "uploaded repo url"));
  }
);

export const getAllMineRepositories = asyncHandler(
  async (req: Request, res: Response) => {
    const { mineId } = req.body;

    if (!mineId) {
      return res.status(400).json(new ApiResponse(400, "mineId not provided!"));
    }

    const mineRepositories = await RepositoryModel.getMineRepositories(mineId);

    if (!mineRepositories.length) {
      return res
        .status(404)
        .json(new ApiResponse(404, "no repositories found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "repositories found", mineRepositories));
  }
);
