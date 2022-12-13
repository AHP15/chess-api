import express from "express";
import { createGame } from "../controllers/game.controller.js";

const router = express.Router();

router.route("/game/new").post(createGame);

export default router;
