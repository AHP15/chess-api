import express from "express";
import { signup, signin } from "../controllers/user.controller.js";
import { sanatizeReqBody } from "../middleware/sanatizeData.js";

const router = express.Router();

router.route("/auth/signup").post(sanatizeReqBody, signup);
router.route("/auth/signin").post(sanatizeReqBody, signin);

export default router;