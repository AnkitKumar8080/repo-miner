import { Request, Response } from "express";
import { MineModel } from "../models/mine.model";
import { ProtectedRequest } from "../types/app-request";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
  extractKeywordsFromQuery,
  getEmbeddings,
} from "../utils/localAiModels";
import { retrieveCodeSnippet } from "../database/chromadb";
import { RepositoryModel } from "../models/repository.model";
import { processCollectionResult } from "../utils/common";
import { geminiModel } from "../utils/llmModels";

// route to create a new mine
export const createMine = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { mineName } = req.body;
    const userId = req.user?.id;

    if (!mineName)
      return res.status(400).json(new ApiResponse(400, "provide a mine name"));

    // check for existing mine in the user account
    const existingMine = await MineModel.getUsersMineByName(
      userId ?? "",
      mineName
    );

    // if existing mine return error
    if (existingMine) {
      return res
        .status(400)
        .json(new ApiResponse(400, "A mine with this name already exists!"));
    }

    // create mine
    const mine = await MineModel.createMine(userId ?? "", mineName);

    if (!mine) {
      return res
        .status(500)
        .json(new ApiResponse(500, "unable to create mine"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, "mine created successfully!", mine));
  }
);

// get all mines
export const getAllMines = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?.id;
    console.log(userId);
    if (!userId) {
      throw new Error("internal error invalid userId");
    }

    // fetch all mines of a particular user
    const mines = await MineModel.getAllMines(userId ?? "");

    console.log(mines);

    // if not mines found
    if (!mines?.length) {
      return res
        .status(404)
        .json(new ApiResponse(404, "no mines found of current user!"));
    }

    // return all the mines to the user
    return res.status(200).json(new ApiResponse(200, "mines found", mines));
  }
);

// delete user mine
export const deleteMine = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { mineId } = req.body;
    const userId = req.user?.id;

    if (!mineId) {
      return res.status(400).json(new ApiResponse(400, "mineId not provided"));
    }

    // check if user owns the mine
    const mine = await MineModel.getMinebyId(mineId);

    if (!mine) {
      return res.status(404).json(new ApiResponse(404, "mine not found! "));
    }

    if (mine.userId !== userId) {
      return res
        .status(401)
        .json(
          new ApiResponse(401, "you are not authorized to delete this mine")
        );
    }

    // delete the mine
    const deletedMine = await MineModel.deleteMineById(mineId);

    if (!deletedMine) {
      return res.status(500).json(new ApiResponse(500, "Internal error"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "mine deleted successfully"));
  }
);

// handle query request
export const handleQueryRequest = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { query, repoId } = req.body;
    const userId = req.user?.id;

    if (!query || !repoId) {
      return res
        .status(400)
        .json(new ApiResponse(400, "query, mineId or repoId not provided!"));
    }

    const repository = await RepositoryModel.getRepositorybyId(repoId);

    if (!repository) {
      return res
        .status(404)
        .json(new ApiResponse(404, "repository not found!"));
    }

    const mine = await MineModel.getMinebyId(repository.mineId);

    if (!mine) {
      return res.status(404).json(new ApiResponse(404, "mine not found!"));
    }

    // check if user owns this repository
    if (mine.userId !== userId) {
      return res
        .status(401)
        .json(
          new ApiResponse(
            401,
            "you are not authorized to query this repository"
          )
        );
    }

    // filter out the keywords from the query
    // const filteredKeywords = await extractKeywordsFromQuery(query);

    // convert the filtered keywords to embeddings
    const { embedding } = await getEmbeddings(query);

    // get the code snippets from the collection
    const result = await retrieveCodeSnippet(repoId, embedding);

    // console.log(result);

    // process the result of the collection from chromadb
    const fileChunksArr = processCollectionResult(result);

    console.log(fileChunksArr);

    // send it the LLM for generating response
    const modelResult = await geminiModel(query, fileChunksArr);

    console.log(modelResult);

    return res
      .status(200)
      .json(new ApiResponse(200, "result fetched ", modelResult));
    // stream the response from LLM to the user
  }
);
