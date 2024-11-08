import { Request, Response } from "express";
import { MineModel } from "../models/mine.model";
import { ProtectedRequest } from "../types/app-request";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

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
