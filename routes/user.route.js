import express from "express";
import { signup, signin, getUserData } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import { sanatizeReqBody } from "../middleware/sanatizeData.js";
import { toggleToken } from "../utils/token.js";

const router = express.Router();

router.route("/auth/signup").post(sanatizeReqBody, signup);
router.route("/auth/signin").post(sanatizeReqBody, signin);
router.route("/user/profile").get(verifyToken, getUserData);
router.route("/auth/callback").get((req, res) => {
  res.status(200).send({
    success: true,
    callback: `const toggleToken = ${toggleToken.toString()}`
  })
});

export default router;