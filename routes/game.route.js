import express from "express";
import { createGame } from "../controllers/game.controller.js";
import { sanatizeReqBody } from "../middleware/sanatizeData.js";

const router = express.Router();

router.route("/game/new").post(sanatizeReqBody, createGame);

export default router;
