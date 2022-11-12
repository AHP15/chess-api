import { handleError } from "../utils/errorHandler.js";
import DB from "../models/index.js";

const User = DB.user;
export const signup = async (req, res) => {
    try{
        const user = await User.create(req.sanatizedData);
        res.status(201).send({
            seccuss: true,
            user,
        })
    } catch(err) {
        handleError(err, 500, res);
    }
};