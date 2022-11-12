import express from "express";
import { signup } from "../controllers/user.controller.js";
import { sanatizeReqBody } from "../middleware/sanatizeData.js";

const router = express.Router();

router.route("/auth/signup").post(sanatizeReqBody, signup);

export default router;