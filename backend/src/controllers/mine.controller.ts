import { Response } from "express";
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
